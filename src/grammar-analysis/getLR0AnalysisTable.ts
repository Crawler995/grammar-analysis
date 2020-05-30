import { Grammar, END } from './types/grammar';
import { LR0AnalysisTable, S, ACC, R } from './types/analysisTable';
import getNFAFromGrammar from './utils/fa/getNFAFromGrammar';
import getDFAFromNFA from './utils/fa/getDFAFromNFA';
import getSortedNFAStatuses from './utils/sort/getSortedNFAStatuses';
import deepEqual from '../utils/deepEqual';

const getLR0AnalysisTable = (grammar: Grammar): LR0AnalysisTable | null => {
  const depNFA = getNFAFromGrammar(grammar);
  const depDFA = getDFAFromNFA(depNFA);

  const resTable: LR0AnalysisTable = {
    states: new Array(depDFA.statuses.length).fill(0).map((_, i) => i),
    actionColumns: [...grammar.terminals, END],
    gotoColumns: [...grammar.nonTerminals.filter(t => t !== grammar.startSymbol)],
    actionTable: [],
    gotoTable: []
  };

  resTable.actionTable = new Array(resTable.states.length);
  for (let i = 0; i < resTable.states.length; i++) {
    resTable.actionTable[i] = new Array(grammar.terminals.length + 1).fill(null);
  }
  resTable.gotoTable = new Array(resTable.states.length);
  for (let i = 0; i < resTable.states.length; i++) {
    // ignore the start symbol
    resTable.gotoTable[i] = new Array(grammar.nonTerminals.length - 1).fill(null);
  }

  const { transformFunctions, statuses } = depDFA;

  // get all Sn in action table and N in goto table
  for (let i = 0; i < transformFunctions.length; i++) {
    const transformFunction = transformFunctions[i];
    const { from, to, input } = transformFunction;

    const fromIndex = statuses.findIndex(s =>
      deepEqual(getSortedNFAStatuses(s), getSortedNFAStatuses(from))
    );
    const toIndex = statuses.findIndex(s =>
      deepEqual(getSortedNFAStatuses(s), getSortedNFAStatuses(to))
    );

    // Sn in action table
    if (grammar.terminals.includes(input)) {
      const inputPos = resTable.actionColumns.indexOf(input);
      resTable.actionTable[fromIndex][inputPos] = S(toIndex);
    }

    // N in goto table
    else {
      const inputPos = resTable.gotoColumns.indexOf(input);
      resTable.gotoTable[fromIndex][inputPos] = toIndex;
    }
  }

  // and we need finish acc, rn
  // find 'reduce project' in DFA accepted statuses to get rn and acc
  const { acceptedStatuses } = depDFA;
  for (let i = 0; i < acceptedStatuses.length; i++) {
    const acceptedStatus = acceptedStatuses[i];
    const statusIndex = statuses.findIndex(s =>
      deepEqual(getSortedNFAStatuses(s), getSortedNFAStatuses(acceptedStatus))
    );

    // find the reduce project in it
    const reduceProject = acceptedStatus.filter(s => s.pointPos === s.right.length);
    // reduce conflict
    // not LR(0) grammar
    if (reduceProject.length > 1) {
      return null;
    }

    if (reduceProject.length === 1) {
      // accepted project
      if (reduceProject[0].left === grammar.startSymbol) {
        resTable.actionTable[statusIndex][resTable.actionColumns.length - 1] = ACC;
      }

      // reduce project
      else {
        // should confirm the index of candidate 'j'
        // so that we can get 'rj'

        let visitedNum = 0;
        for (let i = 0; i < grammar.productions.length; i++) {
          const production = grammar.productions[i];

          if (production.left[0] === reduceProject[0].left) {
            for (let j = 0; j < production.right.length; j++) {
              const candidate = production.right[j];

              if (
                candidate.join('') ===
                reduceProject[0].right.join('')
              ) {
                // fill the row with rj
                for (let k = 0; k < resTable.actionColumns.length; k++) {
                  // conflict
                  // not LR(0) grammar
                  if (resTable.actionTable[statusIndex][k] !== null) {
                    return null;
                  }

                  resTable.actionTable[statusIndex][k] = R(visitedNum + j);
                }
              }
            }
          }

          visitedNum += production.right.length;
        }
      }
    }
  }

  return resTable;
};

export default getLR0AnalysisTable;
