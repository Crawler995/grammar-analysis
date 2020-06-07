import React from 'react';
import Header from '../components/Header';
import GrammarInput from '../components/GrammarInput';
import { Divider, Row, Col, message, BackTop } from 'antd';
import { Grammar } from '../grammar-analysis/types/grammar';
import FirstAndFollowSetCompute from '../components/FirstAndFollowSetShow';
import LL1AnalysisTableCompute from '../components/LL1AnalysisTableCompute';
import LR0AnalysisTableCompute from '../components/LR0AnalysisTableCompute';
import SLR1AnalysisTableCompute from '../components/SLR1AnalysisTableCompute';
import AnalysisSteps from '../components/AnalysisSteps';
import {
  LL1AnalysisTable,
  LR0AnalysisTable,
  SLR1AnalysisTable
} from '../grammar-analysis/types/analysisTable';
import getFirstSetAndFollowSet, {
  IFirstAndFollowSet
} from '../utils/compute/getFirstSetAndFollowSet';
import getLL1AnalysisTable from '../grammar-analysis/getLL1AnalysisTable';
import getLR0AnalysisTable from '../grammar-analysis/getLR0AnalysisTable';
import getSLR1AnalysisTable from '../grammar-analysis/getSLR1AnalysisTable';

interface IState {
  stepsStatus: boolean[];
  computeRes: {
    firstAndFollowSet: IFirstAndFollowSet[];
    ll1AnalysisTable: LL1AnalysisTable | null | undefined;
    lr0AnalysisTable: LR0AnalysisTable | null | undefined;
    slr1AnalysisTable: SLR1AnalysisTable | null | undefined;
  };
}

export default class Index extends React.Component<{}, IState> {
  state = {
    stepsStatus: new Array(6).fill(undefined),
    computeRes: {
      firstAndFollowSet: [],
      ll1AnalysisTable: undefined,
      lr0AnalysisTable: undefined,
      slr1AnalysisTable: undefined
    }
  };

  startComputeHandler = (grammar: Grammar) => {
    const firstAndFollowSet = getFirstSetAndFollowSet(grammar);
    const ll1AnalysisTable = getLL1AnalysisTable(grammar);
    const lr0AnalysisTable = getLR0AnalysisTable(grammar);
    const slr1AnalysisTable = getSLR1AnalysisTable(grammar);

    this.setState({
      computeRes: {
        firstAndFollowSet,
        ll1AnalysisTable,
        lr0AnalysisTable,
        slr1AnalysisTable
      },
      stepsStatus: [
        true,
        true,
        ll1AnalysisTable !== null,
        lr0AnalysisTable !== null,
        slr1AnalysisTable !== null,
        true
      ]
    });

    message.info("All computations have finished!")
  };

  confirmHandler = () => {
    message.success("You've confirm the grammar, now you can start to compute!")
    this.setState({
      stepsStatus: [true].concat(new Array(5).fill(undefined))
    })
  }

  inputHandler = () => {
    this.setState({
      stepsStatus: new Array(6).fill(undefined)
    })
  }

  render() {
    return (
      <div>
        <Header />
        <Divider />

        <Row>
          <Col span={20}>
            <main
              style={{
                padding: '0px 50px 50px 50px'
              }}
            >
              <GrammarInput
                onStartCompute={this.startComputeHandler}
                onInput={this.inputHandler}
                onConfirm={this.confirmHandler}
              />

              <FirstAndFollowSetCompute data={this.state.computeRes.firstAndFollowSet} />

              <LL1AnalysisTableCompute table={this.state.computeRes.ll1AnalysisTable} />

              <LR0AnalysisTableCompute table={this.state.computeRes.lr0AnalysisTable} />

              <SLR1AnalysisTableCompute table={this.state.computeRes.slr1AnalysisTable} />
            </main>
          </Col>

          <Col span={4}>
            <AnalysisSteps statues={this.state.stepsStatus} />
          </Col>
        </Row>

        <BackTop />
      </div>
    );
  }
}
