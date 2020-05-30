import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Grammar, END } from '../../src/grammar-analysis/types/grammar';
import getSLR1AnalysisTable from '../../src/grammar-analysis/getSLR1AnalysisTable';
import { SLR1AnalysisTable, S, ACC, R } from '../../src/grammar-analysis/types/analysisTable';

describe('getSLR1AnalysisTable.ts (getSLR1AnalysisTable())', () => {
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

    it('SLR(1) analysis table should be ...', () => {
      const expectTable: SLR1AnalysisTable = {
        states: [0, 1, 2, 3],
        actionColumns: ['a', END],
        gotoColumns: ['A'],
        actionTable: [
          [S(2), null],
          [null, ACC],
          [S(2), R(2)],
          [null, R(1)]
        ],
        gotoTable: [[1], [null], [3], [null]]
      };

      expect(getSLR1AnalysisTable(grammar)).to.deep.equal(expectTable);
    });
  });

  describe(`S'->S, S->L=R|R, L->*R|i, R->L`, () => {
    const grammar: Grammar = {
      nonTerminals: ["S'", 'S', 'L', 'R'],
      terminals: ['=', '*', 'i'],
      productions: [
        {
          left: ["S'"],
          right: [['S']]
        },
        {
          left: ['S'],
          right: [['L', '=', 'R'], ['R']]
        },
        {
          left: ['L'],
          right: [['*', 'R'], ['i']]
        },
        {
          left: ['R'],
          right: [['L']]
        }
      ],
      startSymbol: "S'"
    };

    it('it is not a SLR(1) grammar (shift-reduce conflict)', () => {
      expect(getSLR1AnalysisTable(grammar)).to.be.equal(null);
    });
  });
});
