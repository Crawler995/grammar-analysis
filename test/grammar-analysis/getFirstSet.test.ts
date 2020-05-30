import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { Grammar, EMPTY } from '../../src/grammar-analysis/types/grammar';
import getFirstSet from '../../src/grammar-analysis/getFirstSet';

describe('getFirstSet.ts (getFirstSet())', () => {
  let consoleStub;
  before(() => {
    consoleStub = sinon.stub(console, 'log');
  });
  after(() => {
    consoleStub.restore();
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

    it('FIRST(A) = {a, d, EMPTY}', () => {
      expect(getFirstSet(grammar, ['A'])).to.deep.equal(['a', 'd', EMPTY]);
    });
    it('FIRST(S) = {a, EMPTY}', () => {
      expect(getFirstSet(grammar, ['S'])).to.deep.equal(['a', EMPTY]);
    });
    it('FIRST(B) = {a, d, e, h, EMPTY}', () => {
      expect(getFirstSet(grammar, ['B'])).to.deep.equal(['a', 'd', 'e', 'h', EMPTY]);
    });
  });

  describe('S->Aa|EMPTY, A->Sb|EMPTY (indirect left recursion)', () => {
    const grammar: Grammar = {
      nonTerminals: ['S', 'A'],
      terminals: ['a', 'b'],
      productions: [
        {
          left: ['S'],
          right: [['A', 'a'], [EMPTY]]
        },
        {
          left: ['A'],
          right: [['S', 'b'], [EMPTY]]
        }
      ],
      startSymbol: 'S'
    };

    it('FIRST(S) = {a, b, EMPTY}', () => {
      expect(getFirstSet(grammar, ['S'])).to.deep.equal(['a', 'b', EMPTY]);
    });
    it('FIRST(A) = {a, b, EMPTY}', () => {
      expect(getFirstSet(grammar, ['A'])).to.deep.equal(['a', 'b', EMPTY]);
    });
  });

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
    it('FIRST(Ba) = {a, b, d}', () => {
      expect(getFirstSet(grammar, ['B', 'a'])).to.deep.equal(['a', 'b', 'd']);
    });
    it('FIRST(DC) = {b, d, EMPTY}', () => {
      expect(getFirstSet(grammar, ['D', 'C'])).to.deep.equal(['b', 'd', EMPTY]);
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

    it(`FIRST(TE') = {(, i}`, () => {
      expect(getFirstSet(grammar, ['T', "E'"])).to.deep.equal(['(', 'i']);
    });
  });
});
