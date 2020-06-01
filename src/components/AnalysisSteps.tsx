import React from 'react';
import { Steps } from 'antd';

export default function AnalysisSteps() {
  return (
    <Steps size="small">
      <Steps.Step title="Input grammar" />
      <Steps.Step title="FIRST()" />
      <Steps.Step title="FOLLOW()" />
      <Steps.Step title="LL(1)" />
      <Steps.Step title="LR(0)" />
      <Steps.Step title="SLR(1)" />
    </Steps>
  );
}
