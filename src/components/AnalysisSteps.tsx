import React from 'react';
import { Affix, Steps } from 'antd';

interface IProps {
  statues: boolean[];
}

export default function AnalysisSteps(props: IProps) {
  const titles = ['Input Grammar', 'FIRST() & FOLLOW()', 'LL(1)', 'LR(0)', 'SLR(1)', 'Summary'];

  return (
    <Affix offsetTop={250}>
      <Steps direction="vertical" size="small">
        {titles.map((title, i) => (
          <Steps.Step
            key={title}
            title={title}
            status={
              props.statues[i] === undefined ? undefined : props.statues[i] ? 'finish' : 'error'
            }
          />
        ))}
      </Steps>
    </Affix>
  );
}
