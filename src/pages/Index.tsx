import React from 'react';
import Header from '../components/Header';
import AnalysisSteps from '../components/AnalysisSteps';
import GrammarInput from '../components/GrammarInput';
import { Divider } from 'antd';

/**
 * PageHeader
 *
 * Steps (FIRST() -> FOLLOW() -> LL(1) -> LR(0) -> SLR(1))
 */
export default function Index() {
  return (
    <div>
      <Header />
      <main
        style={{
          padding: '0px 50px'
        }}
      >
        <AnalysisSteps />

        <Divider />

        <GrammarInput onFinish={(values) => { console.log(values)}} />
      </main>
    </div>
  );
}
