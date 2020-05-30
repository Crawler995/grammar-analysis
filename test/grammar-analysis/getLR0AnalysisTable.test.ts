import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Grammar, END } from '../../src/grammar-analysis/types/grammar';
import getLR0AnalysisTable from '../../src/grammar-analysis/getLR0AnalysisTable';
import { LR0AnalysisTable, S, ACC, R } from '../../src/grammar-analysis/types/analysisTable';

describe('getLR0AnalysisTable.ts (getLR0AnalysisTable())', () => {
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

    it('LR(0) analysis table should be ...', () => {
      const expectTable: LR0AnalysisTable = {
        states: [0, 1, 2, 3, 4],
        actionColumns: ['a', 'b', END],
        gotoColumns: ['A'],
        actionTable: [
          [S(2), S(3), null],
          [null, null, ACC],
          [S(2), S(3), null],
          [R(2), R(2), R(2)],
          [R(1), R(1), R(1)]
        ],
        gotoTable: [[1], [null], [4], [null], [null]]
      };

      expect(getLR0AnalysisTable(grammar)).to.deep.equal(expectTable);
    });
  });

  describe(`S'->A, A->aA|a`, () => {
    const grammar: Grammar = {
      nonTerminals: ["S'", 'A'],
      terminals: ['a'],
      productions: [
        {
          left: ["S'"],
          right: [['A']]
        },
        {
          left: ['A'],
          right: [['a', 'A'], ['a']]
        }
      ],
      startSymbol: "S'"
    };

    it('it is not a LR(0) grammar (shift-reduce conflict)', () => {
      expect(getLR0AnalysisTable(grammar)).to.be.equal(null);
    });
  });
});
