import React, { useEffect, useRef } from 'react';
import { Card, Typography, Col, Row } from 'antd';
import { Grammar } from '../grammar-analysis/types/grammar';
import getSLR1AnalysisTable from '../grammar-analysis/getSLR1AnalysisTable';
import deepEqual from '../utils/deepEqual';
import * as vis from 'vis-network';
import getSortedNFAStatuses from '../grammar-analysis/utils/sort/getSortedNFAStatuses';

interface IProps {
  grammar: Grammar;
}

export default function LR0AnalysisTableCompute(props: IProps) {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.grammar.nonTerminals.length === 0 && props.grammar.terminals.length === 0) {
      return;
    }

    const table = getSLR1AnalysisTable(props.grammar);
    if (table === null) {
      return;
    }

    const nodes: vis.Node[] = table.states.map((state, index) => {
      return {
        id: state,
        label:
          '' +
          index +
          '\n' +
          table.depDFA.statuses[index]
            .map(s => {
              const right = s.right.slice(0);
              right.splice(s.pointPos, 0, '·');

              return `${s.left} -> ${right.join('')}`;
            })
            .join('\n'),
        shape: 'box'
      };
    });

    const edges: vis.Edge[] = table.depDFA.transformFunctions.map((fn, index) => {
      const { from, input, to } = fn;

      const fromId = table.depDFA.statuses.findIndex(s =>
        deepEqual(getSortedNFAStatuses(s), getSortedNFAStatuses(from))
      );
      const toId = table.depDFA.statuses.findIndex(s =>
        deepEqual(getSortedNFAStatuses(s), getSortedNFAStatuses(to))
      );

      return {
        from: fromId,
        to: toId,
        label: input,
        arrows: {
          to: true
        }
      };
    });

    new vis.Network(
      graphRef.current!,
      { nodes, edges },
      {
        height: `${Math.max(table.depDFA.statuses.length * 62, 400)}px`
      }
    );
  }, [props, props.grammar]);

  const generateSLR0AnalysisTable = (grammar: Grammar) => {
    if (grammar.nonTerminals.length === 0 && grammar.terminals.length === 0) {
      return <Typography.Paragraph>Wait...</Typography.Paragraph>;
    }
    const table = getSLR1AnalysisTable(grammar);
    console.log(table);

    if (table === null) {
      return <Typography.Paragraph>This grammar is not a SLR(1) grammar!</Typography.Paragraph>;
    }

    const firstRow = (
      <tr>
        <td className="custom-table-header"></td>
        <td className="custom-table-header" colSpan={table.actionColumns.length}>
          <b>ACTION</b>
        </td>
        <td className="custom-table-header" colSpan={table.gotoColumns.length}>
          <b>GOTO</b>
        </td>
      </tr>
    );

    const secondRow = (
      <tr>
        <td className="custom-table-header"></td>
        {table.actionColumns.map((c, i) => (
          <td key={i} className="custom-table-header">
            <b>{c}</b>
          </td>
        ))}
        {table.gotoColumns.map((c, i) => (
          <td key={i} className="custom-table-header">
            <b>{c}</b>
          </td>
        ))}
      </tr>
    );

    const restRows = (
      <>
        {table.states.map((state, index) => (
          <tr key={index}>
            <td className="custom-table-header">
              <b>{state}</b>
            </td>
            {table.actionTable[index].map((c, i) => (
              <td key={i}>{c ?? ''}</td>
            ))}
            {table.gotoTable[index].map((c, i) => (
              <td key={i}>{c ?? ''}</td>
            ))}
          </tr>
        ))}
      </>
    );

    return (
      <table className="custom-table" cellPadding={20}>
        <tbody>
          {firstRow}
          {secondRow}
          {restRows}
        </tbody>
      </table>
    );
  };

  return (
    <Card
      title="SLR(1) Analysis Table"
      style={{
        marginTop: '20px'
      }}
    >
      <Row gutter={24}>
        <Col span={9}>{generateSLR0AnalysisTable(props.grammar)}</Col>
        <Col span={15}>
          <Card type="inner" title="DFA Graph">
            <div ref={graphRef}></div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
