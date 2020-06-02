import React from 'react';
import { Card, Table } from 'antd';
import { Grammar } from '../grammar-analysis/types/grammar';
import getFirstSet from '../grammar-analysis/getFirstSet';
import getFollowSet from '../grammar-analysis/getFollowSet';

interface IProps {
  grammar: Grammar;
}

interface IRow {
  key: string;
  symbols: string;
  firstSet: string;
  followSet: string;
}

export default function FirstAndFollowSetCompute(props: IProps) {
  const getFirstAndFollowSetsOfSymbols = (grammar: Grammar) => {
    const { nonTerminals, productions } = grammar;
    const data: IRow[] = [];
    data.push(
      ...nonTerminals.map(nonTerminal => {
        const firstSet = getFirstSet(grammar, [nonTerminal]);
        const followSet = getFollowSet(grammar, nonTerminal);

        return {
          key: nonTerminal,
          symbols: nonTerminal,
          firstSet: `{ ${firstSet.join(', ')} }`,
          followSet: `{ ${followSet.join(', ')} }`
        };
      })
    );
    productions.forEach(production => {
      const temp: IRow[] = [];
      production.right.forEach(c => {
        const firstSet = getFirstSet(grammar, c);

        temp.push({
          key: c.join(''),
          symbols: c.join(''),
          firstSet: `{ ${firstSet.join(', ')} }`,
          followSet: ''
        });
      });
      data.push(...temp);
    });

    return data;
  };

  return (
    <Card
      title="FIRST() && FOLLOW()"
      style={{
        marginTop: '20px'
      }}
    >
      <Table
        columns={[
          {
            title: 'X',
            dataIndex: 'symbols',
            key: 'symbols'
          },
          {
            title: 'FIRST(X)',
            dataIndex: 'firstSet',
            key: 'firstSet'
          },
          {
            title: 'FOLLOW(X)',
            dataIndex: 'followSet',
            key: 'followSet'
          }
        ]}
        dataSource={getFirstAndFollowSetsOfSymbols(props.grammar)}
        pagination={false}
      />
    </Card>
  );
}
