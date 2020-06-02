import React from 'react';
import { Card, Typography } from 'antd';
import { Grammar } from '../grammar-analysis/types/grammar';
import getLL1AnalysisTable from '../grammar-analysis/getLL1AnalysisTable';

interface IProps {
  grammar: Grammar;
}

export default function LL1AnalysisTableCompute(props: IProps) {
  const generateLL1AnalysisTable = (grammar: Grammar) => {
    if (grammar.nonTerminals.length === 0 && grammar.terminals.length === 0) {
      return <Typography.Paragraph>Wait...</Typography.Paragraph>;
    }
    const table = getLL1AnalysisTable(grammar);
    console.log(table);

    if (table === null) {
      return <Typography.Paragraph>This grammar is not a LL(1) grammar!</Typography.Paragraph>;
    }

    const firstRow = (
      <tr>
        <td className="custom-table-header"></td>
        {table.columns.map((column, i) => (
          <td className="custom-table-header" key={i}>
            <b>{column}</b>
          </td>
        ))}
      </tr>
    );

    const restRows = table.relationships.map((row, index) => {
      return (
        <tr key={index}>
          <td className="custom-table-header">
            <b>{table.rows[index]}</b>
          </td>
          {row.map((c, ci) => (
            <td key={ci}>
              {c === null ? '' : `${c.left} -> ${c.right.map(c => c.join('')).join('|')}`}
            </td>
          ))}
        </tr>
      );
    });

    return (
      <table className="custom-table" cellPadding={20}>
        <tbody>
          {firstRow}
          {restRows}
        </tbody>
      </table>
    );
  };

  return (
    <Card
      title="LL(1) Analysis Table"
      style={{
        marginTop: '20px'
      }}
    >
      {generateLL1AnalysisTable(props.grammar)}
    </Card>
  );
}
