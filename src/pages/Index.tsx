import React from 'react';
import Header from '../components/Header';
import GrammarInput from '../components/GrammarInput';
import { Divider } from 'antd';
import { Grammar } from '../grammar-analysis/types/grammar';
import FirstAndFollowSetCompute from '../components/FirstAndFollowSetCompute';
import LL1AnalysisTableCompute from '../components/LL1AnalysisTableCompute';
import LR0AnalysisTableCompute from '../components/LR0AnalysisTableCompute';
import SLR1AnalysisTableCompute from '../components/SLR1AnalysisTableCompute';

interface IState {
  grammar: Grammar;
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
    }
  };

  startComputeHandler = (grammar: Grammar) => {
    console.log(grammar);
    this.setState({ grammar });
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
          <GrammarInput onStartCompute={this.startComputeHandler} />

          <FirstAndFollowSetCompute
            grammar={this.state.grammar}
          />

          <LL1AnalysisTableCompute 
            grammar={this.state.grammar}
          />

          <LR0AnalysisTableCompute
            grammar={this.state.grammar}
          />

          <SLR1AnalysisTableCompute
            grammar={this.state.grammar}
          />
        </main>
      </div>
    );
  }
}
