import React from 'react';
import { Card, Typography } from 'antd';
import { LL1AnalysisTable } from '../grammar-analysis/types/analysisTable';

interface IProps {
  table: LL1AnalysisTable | null | undefined;
}

export default function LL1AnalysisTableCompute(props: IProps) {
  const generateLL1AnalysisTable = () => {
    const { table } = props;

    if (table === undefined) {
      return <Typography.Paragraph>Wait...</Typography.Paragraph>;
    }

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
      {generateLL1AnalysisTable()}
    </Card>
  );
}
