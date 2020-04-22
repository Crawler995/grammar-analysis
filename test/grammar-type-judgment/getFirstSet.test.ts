import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { Grammar } from '../../src/grammar-type-judgment/types/grammar';
import getFirstSet from '../../src/grammar-type-judgment/getFirstSet';

// const grammar: Grammar = {
//   nonTerminals: ['S', 'A', 'B', 'C'],
//   terminals: ['a', 'b', 'c', 'd', 'e', 'g', 'f', EMPTY],
//   productions: [{
//     left: ['S'],
//     right: [['a', 'A', 'B', 'b', 'c', 'd'], [EMPTY]]
//   }, {
//     left: ['A'],
//     right: [['A', 'S', 'd'], [EMPTY]]
//   }, {
//     left: ['B'],
//     right: [['e', 'C'], ['S', 'A', 'h'], [EMPTY]]
//   }, {
//     left: ['C'],
//     right: [['S', 'f'], ['C', 'g'], [EMPTY]]
//   }],
//   startSymbol: 'S'
// };

describe('getFirstSet.ts (getFirstSet())', () => {
  let consoleStub;
  before(() => {
    consoleStub = sinon.stub(console, 'log');
  });
  after(() => {
    consoleStub.restore();
  });

  describe('G: S->Ap|Bq, A->a|cA, B->b|dB (no left recursion)', () => {
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

    it('FIRST(Ap) = {a, c}', () => {
      expect(getFirstSet(grammar, ['A', 'p'])).to.deep.equal(['a', 'c']);
    });

    it('FIRST(Bq) = {b, d}', () => {
      expect(getFirstSet(grammar, ['B', 'q'])).to.deep.equal(['b', 'd']);
    });

    it('FIRST(a) = {a}', () => {
      expect(getFirstSet(grammar, ['a'])).to.deep.equal(['a']);
    });

    it('FIRST(cA) = {c}', () => {
      expect(getFirstSet(grammar, ['c', 'A'])).to.deep.equal(['c']);
    });

    it('FIRST(b) = {b}', () => {
      expect(getFirstSet(grammar, ['b'])).to.deep.equal(['b']);
    });

    it('FIRST(dB) = {d}', () => {
      expect(getFirstSet(grammar, ['d', 'B'])).to.deep.equal(['d']);
    });
  });
});
