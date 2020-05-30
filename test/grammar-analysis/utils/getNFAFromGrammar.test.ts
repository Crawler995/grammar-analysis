import { describe } from 'mocha';
import { expect } from 'chai';

import { Grammar, EMPTY } from '../../../src/grammar-analysis/types/grammar';
import getNFAFromGrammar from '../../../src/grammar-analysis/utils/fa/getNFAFromGrammar';
import { NFA, NFAStatus } from '../../../src/grammar-analysis/types/fa';

describe('getNFAFromGrammar.ts (getNFAFromGrammar())', () => {
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

    it('NFA inferred from the grammar should be ...', () => {
      const statuses: NFAStatus[] = [
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

      const expectedNFA: NFA = {
        inputs: [...grammar.terminals, ...grammar.nonTerminals],
        statuses,
        acceptedStatuses: [statuses[1], statuses[4], statuses[6]],
        startStatus: statuses[0],
        transformFunctions: [
          {
            from: statuses[0],
            to: statuses[1],
            input: 'A'
          },
          {
            from: statuses[2],
            to: statuses[3],
            input: 'a'
          },
          {
            from: statuses[3],
            to: statuses[4],
            input: 'A'
          },
          {
            from: statuses[5],
            to: statuses[6],
            input: 'b'
          },
          {
            from: statuses[0],
            to: statuses[2],
            input: EMPTY
          },
          {
            from: statuses[0],
            to: statuses[5],
            input: EMPTY
          },
          {
            from: statuses[3],
            to: statuses[2],
            input: EMPTY
          },
          {
            from: statuses[3],
            to: statuses[5],
            input: EMPTY
          }
        ]
      };
      expect(getNFAFromGrammar(grammar)).to.deep.equal(expectedNFA);
    });
  });
});
