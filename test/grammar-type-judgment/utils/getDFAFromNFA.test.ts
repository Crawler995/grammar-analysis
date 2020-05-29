import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Grammar } from '../../../src/grammar-type-judgment/types/grammar';
import getNFAFromGrammar from '../../../src/grammar-type-judgment/utils/fa/getNFAFromGrammar';
import getDFAFromNFA from '../../../src/grammar-type-judgment/utils/fa/getDFAFromNFA';
import { DFA, NFAStatus, DFAStatus } from '../../../src/grammar-type-judgment/types/fa';
import getSortedNFAStatuses from '../../../src/grammar-type-judgment/utils/sort/getSortedNFAStatuses';
import getSortedDFAStatuses from '../../../src/grammar-type-judgment/utils/sort/getSortedDFAStatuses';
import getSortedDFATransformFunctions from '../../../src/grammar-type-judgment/utils/sort/getSortedDFATransformFunctions';

describe('getDFAFromNFA.ts (getDFAFromNFA())', () => {
  describe(`S'->A, A->aA|b`, () => {
    const grammar: Grammar = {
      nonTerminals: ["S'", 'A'],
      terminals: ['a', 'b'],
      productions: [
        {
          left: ["S'"],
          right: [['A']]
        },
        {
          left: ['A'],
          right: [['a', 'A'], ['b']]
        }
      ],
      startSymbol: "S'"
    };

    it('DFA inferred from exported NFA should be ...', () => {
      const NFAstatuses: NFAStatus[] = [
        {
          left: "S'",
          right: ['A'],
          pointPos: 0
        },
        {
          left: "S'",
          right: ['A'],
          pointPos: 1
        },
        {
          left: 'A',
          right: ['a', 'A'],
          pointPos: 0
        },
        {
          left: 'A',
          right: ['a', 'A'],
          pointPos: 1
        },
        {
          left: 'A',
          right: ['a', 'A'],
          pointPos: 2
        },
        {
          left: 'A',
          right: ['b'],
          pointPos: 0
        },
        {
          left: 'A',
          right: ['b'],
          pointPos: 1
        }
      ];

      const statuses: DFAStatus[] = [
        [NFAstatuses[0], NFAstatuses[2], NFAstatuses[5]],
        [NFAstatuses[3], NFAstatuses[2], NFAstatuses[5]],
        [NFAstatuses[6]],
        [NFAstatuses[1]],
        [NFAstatuses[4]]
      ];

      const exportedNFA = getNFAFromGrammar(grammar);
      const expectedDFA: DFA = {
        inputs: [...grammar.terminals, ...grammar.nonTerminals],
        statuses: statuses,
        startStatus: statuses[0],
        acceptedStatuses: [statuses[2], statuses[3], statuses[4]],
        transformFunctions: [
          {
            from: statuses[0],
            to: statuses[1],
            input: 'a'
          },
          {
            from: statuses[0],
            to: statuses[2],
            input: 'b'
          },
          {
            from: statuses[0],
            to: statuses[3],
            input: 'A'
          },
          {
            from: statuses[1],
            to: statuses[1],
            input: 'a'
          },
          {
            from: statuses[1],
            to: statuses[4],
            input: 'A'
          },
          {
            from: statuses[1],
            to: statuses[2],
            input: 'b'
          }
        ]
      };

      const actualDFA = getDFAFromNFA(exportedNFA);

      expect(actualDFA.inputs.sort()).to.deep.equal(expectedDFA.inputs.sort());
      expect(getSortedDFAStatuses(actualDFA.statuses)).to.deep.equal(
        getSortedDFAStatuses(expectedDFA.statuses)
      );
      expect(getSortedNFAStatuses(actualDFA.startStatus)).to.deep.equal(
        getSortedNFAStatuses(expectedDFA.startStatus)
      );
      expect(getSortedDFAStatuses(actualDFA.acceptedStatuses)).to.deep.equal(
        getSortedDFAStatuses(expectedDFA.acceptedStatuses)
      );
      expect(getSortedDFATransformFunctions(actualDFA.transformFunctions)).to.deep.equal(
        getSortedDFATransformFunctions(expectedDFA.transformFunctions)
      );
    });
  });
});
