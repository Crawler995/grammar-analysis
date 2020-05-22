import { describe, it } from 'mocha';
import { expect } from 'chai';

import getInferredGSymbols from '../../../src/grammar-type-judgment/utils/getInferredGSymbols';
import { EMPTY, Grammar } from '../../../src/grammar-type-judgment/types/grammar';

describe('getInferredGSymbols.ts (getInferredGSymbols())', () => {
  describe('S->AB, A->Ba|EMPTY, B->DC, C->b|EMPTY, D->d|EMPTY', () => {
    const grammar: Grammar = {
      nonTerminals: ['S', 'A', 'B', 'C', 'D'],
      terminals: ['a', 'b', 'd'],
      productions: [
        {
          left: ['S'],
          right: [['A', 'B']]
        },
        {
          left: ['A'],
          right: [['B', 'a'], [EMPTY]]
        },
        {
          left: ['B'],
          right: [['D', 'C']]
        },
        {
          left: ['C'],
          right: [['b'], [EMPTY]]
        },
        {
          left: ['D'],
          right: [['d'], [EMPTY]]
        }
      ],
      startSymbol: 'S'
    };

    it(`B can infer ['b', 'd', EMPTY]`, () => {
      expect(getInferredGSymbols(grammar, ['B'])).to.deep.equal(['b', 'd', EMPTY]);
    });

    it(`S can infer ['a', 'b', 'd', EMPTY]`, () => {
      expect(getInferredGSymbols(grammar, ['S'])).to.deep.equal(['a', 'b', 'd', EMPTY]);
    });
  });

  describe('S->Ap|Bq, A->a|cA, B->b|dB (no left recursion)', () => {
    const grammar: Grammar = {
      nonTerminals: ['S', 'A', 'B'],
      terminals: ['a', 'b', 'c', 'd', 'p', 'q'],
      productions: [
        {
          left: ['S'],
          right: [
            ['A', 'p'],
            ['B', 'q']
          ]
        },
        {
          left: ['A'],
          right: [['a'], ['c', 'A']]
        },
        {
          left: ['B'],
          right: [['b'], ['d', 'B']]
        }
      ],
      startSymbol: 'S'
    };

    it(`A can infer ['a', 'c']`, () => {
      expect(getInferredGSymbols(grammar, ['A'])).to.deep.equal(['a', 'c']);
    });
  });
});
