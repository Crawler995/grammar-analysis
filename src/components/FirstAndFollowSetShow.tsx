import React from 'react';
import { Card, Table } from 'antd';
import { IFirstAndFollowSet } from '../utils/compute/getFirstSetAndFollowSet';

interface IProps {
  data: IFirstAndFollowSet[];
}

export default function FirstAndFollowSetCompute(props: IProps) {
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
        dataSource={props.data}
        pagination={false}
      />
    </Card>
  );
}
