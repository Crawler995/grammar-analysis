import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { Grammar, EMPTY, END } from '../../src/grammar-analysis/types/grammar';
import getFollowSet from '../../src/grammar-analysis/getFollowSet';

describe('getFollowSet.ts (getFollowSet())', () => {
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

    it('FOLLOW(S) = {#}', () => {
      expect(getFollowSet(grammar, 'S')).to.deep.equal([END]);
    });

    it('FOLLOW(A) = {p}', () => {
      expect(getFollowSet(grammar, 'A')).to.deep.equal(['p']);
    });

    it('FOLLOW(B) = {q}', () => {
      expect(getFollowSet(grammar, 'B')).to.deep.equal(['q']);
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

    it('FOLLOW(S) = {#, a, d, f, h}', () => {
      expect(getFollowSet(grammar, 'S')).to.deep.equal([END, 'a', 'd', 'f', 'h']);
    });

    it('FOLLOW(A) = {a, b, d, e, h}', () => {
      expect(getFollowSet(grammar, 'A')).to.deep.equal(['a', 'b', 'd', 'e', 'h']);
    });

    it('FOLLOW(B) = {b}', () => {
      expect(getFollowSet(grammar, 'B')).to.deep.equal(['b']);
    });

    it('FOLLOW(C) = {b, g}', () => {
      expect(getFollowSet(grammar, 'C')).to.deep.equal(['b', 'g']);
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

    it('FOLLOW(S) = {#, b}', () => {
      expect(getFollowSet(grammar, 'S')).to.deep.equal([END, 'b']);
    });

    it('FOLLOW(A) = {a}', () => {
      expect(getFollowSet(grammar, 'A')).to.deep.equal(['a']);
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

    it('FOLLOW(S) = {#}', () => {
      expect(getFollowSet(grammar, 'S')).to.deep.equal([END]);
    });

    it('FOLLOW(A) = {#, b, d}', () => {
      expect(getFollowSet(grammar, 'A')).to.deep.equal([END, 'b', 'd']);
    });

    it('FOLLOW(B) = {#, a}', () => {
      expect(getFollowSet(grammar, 'B')).to.deep.equal([END, 'a']);
    });

    it('FOLLOW(C) = {#, a}', () => {
      expect(getFollowSet(grammar, 'C')).to.deep.equal([END, 'a']);
    });

    it('FOLLOW(D) = {#, a, b}', () => {
      expect(getFollowSet(grammar, 'D')).to.deep.equal([END, 'a', 'b']);
    });
  });

  describe(`S->iCtSS'|a, S'->eS|EMPTY, C->b`, () => {
    const grammar: Grammar = {
      nonTerminals: ['S', "S'", 'C'],
      terminals: ['i', 't', 'a', 'e', 'b'],
      productions: [
        {
          left: ['S'],
          right: [['i', 'C', 't', 'S', "S'"], ['a']]
        },
        {
          left: ["S'"],
          right: [['e', 'S'], [EMPTY]]
        },
        {
          left: ['C'],
          right: [['b']]
        }
      ],
      startSymbol: 'S'
    };

    it(`FOLLOW(S') = {#, e}`, () => {
      expect(getFollowSet(grammar, "S'")).to.deep.equal([END, 'e']);
    });
  });

  describe(`S'->S, S->AaAb|BbBa, B->EMPTY`, () => {
    const grammar: Grammar = {
      nonTerminals: ["S'", 'S', 'A', 'B'],
      terminals: ['a', 'b'],
      productions: [{
        left: ["S'"],
        right: [['S']]
      }, {
        left: ['S'],
        right: [['A', 'a', 'A', 'b'], ['B', 'b', 'B', 'a']]
      }, {
        left: ['B'],
        right: [[EMPTY]]
      }],
      startSymbol: "S'"
    };

    it('FOLLOW(A) = {a, b}', () => {
      expect(getFollowSet(grammar, 'A')).to.deep.equal(['a', 'b']);
    });

    it('FOLLOW(B) = {a, b}', () => {
      expect(getFollowSet(grammar, 'B')).to.deep.equal(['a', 'b']);
    });
  })
});
