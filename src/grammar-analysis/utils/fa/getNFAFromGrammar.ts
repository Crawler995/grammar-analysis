import { Grammar, EMPTY } from '../../types/grammar';
import { NFAStatus, NFA } from '../../types/fa';
import getCandidates from '../getCandidates';

const getNFAFromGrammar = (grammar: Grammar) => {
  const resNFA: NFA = {
    inputs: [...grammar.terminals, ...grammar.nonTerminals],
    statuses: [],
    startStatus: {
      left: grammar.startSymbol,
      right: getCandidates(grammar, [grammar.startSymbol])[0],
      pointPos: 0
    },
    acceptedStatuses: [],
    transformFunctions: []
  };

  grammar.productions.forEach(production => {
    const { left, right } = production;

    right.forEach(candidate => {
      for (let i = 0; i < candidate.length; i++) {
        // A->EMPTY => A->·
        if(candidate.length === 1 && candidate[0] === EMPTY) {
          const emptyStatus: NFAStatus = {
            left: left[0],
            right: [],
            pointPos: 0
          };
          resNFA.statuses.push(emptyStatus);
          resNFA.acceptedStatuses.push(emptyStatus);
          
          break;
        }

        const from: NFAStatus = {
          left: left[0],
          right: candidate,
          pointPos: i
        };

        const to: NFAStatus = {
          left: left[0],
          right: candidate,
          pointPos: i + 1
        };

        resNFA.statuses.push(from);
        if (i === candidate.length - 1) {
          resNFA.statuses.push(to);
          resNFA.acceptedStatuses.push(to);
        }

        // X -> A·b to X -> Ab·
        resNFA.transformFunctions.push({
          from,
          to,
          input: candidate[i]
        });
      }
    });
  });

  resNFA.transformFunctions.forEach(fn => {
    const symbolAfterPos = fn.from.right[fn.from.pointPos];
    // X -> α·A...
    if (grammar.nonTerminals.includes(symbolAfterPos)) {
      resNFA.statuses.forEach(status => {
        // A -> ·α
        if (status.left === symbolAfterPos && status.pointPos === 0) {
          resNFA.transformFunctions.push({
            from: fn.from,
            to: status,
            input: EMPTY
          });
        }
      });
    }
  });

  return resNFA;
};

export default getNFAFromGrammar;
