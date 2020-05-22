import { describe, it } from 'mocha';
import { expect } from 'chai';

import getIsCanInferEmpty from '../../../src/grammar-type-judgment/utils/getIsCanInferEmpty';
import { EMPTY, Grammar } from '../../../src/grammar-type-judgment/types/grammar';

describe('getInferredGSymbols.ts (getInferredGSymbols())', () => {
  describe('S->aABbcd|EMPTY, A->ASd|EMPTY, B->eC|SAh|EMPTY, C->Sf|Cg|EMPTY (direct left recursion)', () => {
    const grammar: Grammar = {
      nonTerminals: ['S', 'A', 'B', 'C'],
      terminals: ['a', 'b', 'c', 'd', 'e', 'g', 'f', 'h', EMPTY],
      productions: [
        {
          left: ['S'],
          right: [['a', 'A', 'B', 'b', 'c', 'd'], [EMPTY]]
        },
        {
          left: ['A'],
          right: [['A', 'S', 'd'], [EMPTY]]
        },
        {
          left: ['B'],
          right: [['e', 'C'], ['S', 'A', 'h'], [EMPTY]]
        },
        {
          left: ['C'],
          right: [['S', 'f'], ['C', 'g'], [EMPTY]]
        }
      ],
      startSymbol: 'S'
    };

    it('A can infer EMPTY', () => {
      expect(getIsCanInferEmpty(grammar, 'A')).to.be.equal(true);
    });

    it('S can infer EMPTY', () => {
      expect(getIsCanInferEmpty(grammar, 'S')).to.be.equal(true);
    });
  });

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

    it(`F can't infer EMPTY`, () => {
      expect(getIsCanInferEmpty(grammar, 'F')).to.be.equal(false);
    });

    it(`T can't infer EMPTY`, () => {
      expect(getIsCanInferEmpty(grammar, 'T')).to.be.equal(false);
    });
  });
});
