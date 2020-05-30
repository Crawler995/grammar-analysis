import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Grammar, EMPTY, Production, END } from '../../src/grammar-analysis/types/grammar';
import getLL1AnalysisTable from '../../src/grammar-analysis/getLL1AnalysisTable';

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
        columns: ['+', '*', '(', ')', 'i', END],
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

  describe('S->Ap|Bq, A->a|cA, B->b|dB', () => {
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

    it('LL(1) analysis table should be ...', () => {
      const production1: Production = {
        left: ['S'],
        right: [['A', 'p']]
      };
      const production2: Production = {
        left: ['S'],
        right: [['B', 'q']]
      };
      const production3: Production = {
        left: ['A'],
        right: [['a']]
      };
      const production4: Production = {
        left: ['A'],
        right: [['c', 'A']]
      };
      const production5: Production = {
        left: ['B'],
        right: [['b']]
      };
      const production6: Production = {
        left: ['B'],
        right: [['d', 'B']]
      };

      expect(getLL1AnalysisTable(grammar)).to.deep.equal({
        rows: ['S', 'A', 'B'],
        columns: ['a', 'b', 'c', 'd', 'p', 'q', END],
        relationships: [
          [production1, production2, production1, production2, null, null, null],
          [production3, null, production4, null, null, null, null],
          [null, production5, null, production6, null, null, null]
        ]
      });
    });
  });

  describe('S->(X|E]|F), X->E)|F], E->A, F->A, A->EMPTY', () => {
    const grammar: Grammar = {
      nonTerminals: ['S', 'X', 'E', 'F', 'A'],
      terminals: ['(', ']', ')'],
      productions: [
        {
          left: ['S'],
          right: [
            ['(', 'X'],
            ['E', ']'],
            ['F', ')']
          ]
        },
        {
          left: ['X'],
          right: [
            ['E', ')'],
            ['F', ']']
          ]
        },
        {
          left: ['E'],
          right: [['A']]
        },
        {
          left: ['F'],
          right: [['A']]
        },
        {
          left: ['A'],
          right: [[EMPTY]]
        }
      ],
      startSymbol: 'S'
    };

    it('LL(1) analysis table should be ...', () => {
      const production1: Production = {
        left: ['S'],
        right: [['(', 'X']]
      };
      const production2: Production = {
        left: ['S'],
        right: [['E', ']']]
      };
      const production3: Production = {
        left: ['S'],
        right: [['F', ')']]
      };
      const production4: Production = {
        left: ['X'],
        right: [['F', ']']]
      };
      const production5: Production = {
        left: ['X'],
        right: [['E', ')']]
      };
      const production6: Production = {
        left: ['E'],
        right: [['A']]
      };
      const production7: Production = {
        left: ['F'],
        right: [['A']]
      };
      const production8: Production = {
        left: ['A'],
        right: [[EMPTY]]
      };

      expect(getLL1AnalysisTable(grammar)).to.deep.equal({
        rows: ['S', 'X', 'E', 'F', 'A'],
        columns: ['(', ']', ')', END],
        relationships: [
          [production1, production2, production3, null],
          [null, production4, production5, null],
          [null, production6, production6, null],
          [null, production7, production7, null],
          [null, production8, production8, null]
        ]
      });
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

    it('it is not a LL(1) grammar (multiple definition)', () => {
      expect(getLL1AnalysisTable(grammar)).to.be.equal(null);
    });
  });

  describe('S->AB, A->Ba|EMPTY, B->Db|D, D->d|EMPTY', () => {
    const grammar: Grammar = {
      nonTerminals: ['S', 'A', 'B', 'D'],
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
          right: [['D', 'b'], ['D']]
        },
        {
          left: ['D'],
          right: [['d'], [EMPTY]]
        }
      ],
      startSymbol: 'S'
    };

    it('it is not a LL(1) grammar (public left factor)', () => {
      expect(getLL1AnalysisTable(grammar)).to.be.equal(null);
    });
  });
});
