import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Grammar, EMPTY, Production } from '../../src/grammar-type-judgment/types/grammar';
import getLL1AnalysisTable from '../../src/grammar-type-judgment/getLL1AnalysisTable';

describe('getLL1AnalysisTable.ts (getLL1AnalysisTable())', () => {
  describe(`E->TE', E'->+TE'|EMPTY, T->FT', T'->*FT'|EMPTY, F->(E)|i`, () => {
    const grammar: Grammar = {
      nonTerminals: ['E', "E'", 'T', "T'", 'F'],
      terminals: ['+', '*', '(', ')', 'i'],
      productions: [
        {
          left: ['E'],
          right: [['T', "E'"]]
        },
        {
          left: ["E'"],
          right: [['+', 'T', "E'"], [EMPTY]]
        },
        {
          left: ['T'],
          right: [['F', "T'"]]
        },
        {
          left: ["T'"],
          right: [['*', 'F', "T'"], [EMPTY]]
        },
        {
          left: ['F'],
          right: [['(', 'E', ')'], ['i']]
        }
      ],
      startSymbol: 'E'
    };

    it('LL(1) analysis table should be ...', () => {
      const production1: Production = {
        left: ['E'],
        right: [['T', "E'"]]
      };
      const production2: Production = {
        left: ["E'"],
        right: [['+', 'T', "E'"]]
      };
      const production3: Production = {
        left: ["E'"],
        right: [[EMPTY]]
      };
      const production4: Production = {
        left: ['T'],
        right: [['F', "T'"]]
      };
      const production5: Production = {
        left: ["T'"],
        right: [[EMPTY]]
      };
      const production6: Production = {
        left: ["T'"],
        right: [['*', 'F', "T'"]]
      };
      const production7: Production = {
        left: ['F'],
        right: [['(', 'E', ')']]
      };
      const production8: Production = {
        left: ['F'],
        right: [['i']]
      };
      expect(getLL1AnalysisTable(grammar)).to.deep.equal({
        rows: ['E', "E'", 'T', "T'", 'F'],
        columns: ['+', '*', '(', ')', 'i', '#'],
        relationships: [
          [null, null, production1, null, production1, null],
          [production2, null, null, production3, null, production3],
          [null, null, production4, null, production4, null],
          [production5, production6, null, production5, null, production5],
          [null, null, production7, null, production8, null]
        ]
      });
    });
  });
});
