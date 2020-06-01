import React from 'react';
import { PageHeader, Descriptions, Typography } from 'antd';

const { Paragraph } = Typography;

export default function Header() {
  return (
    <PageHeader title="Grammar Analysis">
      <Descriptions column={3}>
        <Descriptions.Item label="Name">Qinglong Zhang</Descriptions.Item>
        <Descriptions.Item label="ID">1120172135</Descriptions.Item>
        <Descriptions.Item label="Class">08111702</Descriptions.Item>
      </Descriptions>

      <Paragraph>
        This is the final assignment of class <b>Compilation principle</b> taught by Peng Li, BIT.
      </Paragraph>
      <Paragraph>
        This can compute <b>FIRST(), FOLLOW(), LL(1) / LR(0) / SLR(1) Analysis Table</b> according
        to the given grammar.
      </Paragraph>
      <Paragraph>I try my best to finish this assignment. About more, you can read this.</Paragraph>
    </PageHeader>
  );
}
