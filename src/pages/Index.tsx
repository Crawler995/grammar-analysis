import React from 'react';
import Header from '../components/Header';
import AnalysisSteps from '../components/AnalysisSteps';
import GrammarInput from '../components/GrammarInput';
import { Divider } from 'antd';
import { Grammar } from '../grammar-analysis/types/grammar';
import FirstAndFollowSetCompute from '../components/FirstAndFollowSetCompute';
import LL1AnalysisTableCompute from '../components/LL1AnalysisTableCompute';

interface IState {
  grammar: Grammar;
  currentStepIndex: number;
}

/**
 * PageHeader
 *
 * Steps (FIRST() -> FOLLOW() -> LL(1) -> LR(0) -> SLR(1))
 */
export default class Index extends React.Component<{}, IState> {
  state: IState = {
    grammar: {
      nonTerminals: [],
      terminals: [],
      productions: [],
      startSymbol: ''
    },
    currentStepIndex: 0
  };

  startComputeHandler = (grammar: Grammar) => {
    console.log(grammar);
    this.setState({ grammar, currentStepIndex: 2 });
  };

  render() {
    return (
      <div>
        <Header />
        <Divider />

        <main
          style={{
            padding: '0px 100px'
          }}
        >
          <AnalysisSteps currentIndex={this.state.currentStepIndex} />

          <GrammarInput onStartCompute={this.startComputeHandler} />

          <FirstAndFollowSetCompute grammar={this.state.grammar} />

          <LL1AnalysisTableCompute grammar={this.state.grammar} />
        </main>
      </div>
    );
  }
}
