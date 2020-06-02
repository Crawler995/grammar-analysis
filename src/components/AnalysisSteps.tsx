import React from 'react';
import { Steps } from 'antd';

interface IProps {
  currentIndex: number;
}

export default function AnalysisSteps(props: IProps) {
  return (
    <Steps
      size="small"
      current={props.currentIndex}
      style={{
        marginBottom: '30px'
      }}
    >
      <Steps.Step title="Input grammar" />
      <Steps.Step title="FIRST() & FOLLOW()" />
      <Steps.Step title="LL(1)" />
      <Steps.Step title="LR(0)" />
      <Steps.Step title="SLR(1)" />
      <Steps.Step title="Summary" />
    </Steps>
  );
}
