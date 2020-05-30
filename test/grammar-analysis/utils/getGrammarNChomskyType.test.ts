import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Grammar, EMPTY } from '../../../src/grammar-analysis/types/grammar';
import getGrammarNChomskyType, {
  getCandidateLinearType,
  getIsThreeGrammar,
  getIsTwoGrammar
} from '../../../src/grammar-analysis/utils/getGrammarNChomskyType';
import GrammarNChomskyType from '../../../src/grammar-analysis/types/grammarNChomskyType';

describe('getGrammarNChomskyType.ts', () => {
  describe('getCandidateLinearType()', () => {
    describe('S->Bc|Sc, B->Ab|Bb, A->Aa|a', () => {
      const grammar: Grammar = {
        terminals: ['a', 'b', 'c'],
        nonTerminals: ['S', 'A', 'B'],
        productions: [
          {
            left: ['S'],
            right: [
              ['B', 'c'],
              ['S', 'c']
            ]
          },
          {
            left: ['B'],
            right: [
              ['A', 'b'],
              ['B', 'b']
            ]
          },
          {
            left: ['A'],
            right: [['A', 'a'], ['a']]
          }
        ],
        startSymbol: 'S'
      };

      it('the linear type of Bc should be left', () => {
        expect(getCandidateLinearType(grammar, ['B', 'c'])).to.be.equal('left');
      });

      it('the linear type of bB should be right', () => {
        expect(getCandidateLinearType(grammar, ['b', 'B'])).to.be.equal('right');
      });

      it('the linear type of a should be uncertain', () => {
        expect(getCandidateLinearType(grammar, ['a'])).to.be.equal('uncertain');
      });

      it('the linear type of aBc should be none', () => {
        expect(getCandidateLinearType(grammar, ['a', 'B', 'c'])).to.be.equal('none');
      });

      it('the linear type of B(EMPTY) should be left', () => {
        expect(getCandidateLinearType(grammar, ['B', EMPTY])).to.be.equal('left');
      });
    });
  });

  describe('getIsThreeGrammar()', () => {
    describe('S->Bc|Sc, B->Ab|Bb, A->Aa|a', () => {
      const grammar: Grammar = {
        terminals: ['a', 'b', 'c'],
        nonTerminals: ['S', 'A', 'B'],
        productions: [
          {
            left: ['S'],
            right: [
              ['B', 'c'],
              ['S', 'c']
            ]
          },
          {
            left: ['B'],
            right: [
              ['A', 'b'],
              ['B', 'b']
            ]
          },
          {
            left: ['A'],
            right: [['A', 'a'], ['a']]
          }
        ],
        startSymbol: 'S'
      };

      it('this should be a three grammar', () => {
        expect(getIsThreeGrammar(grammar)).to.be.equal(true);
      });
    });

    describe('S->B|Sc, B->A|Bb, A->Aa|a|EMPTY', () => {
      const grammar: Grammar = {
        terminals: ['a', 'b', 'c'],
        nonTerminals: ['S', 'A', 'B'],
        productions: [
          {
            left: ['S'],
            right: [['B'], ['S', 'c']]
          },
          {
            left: ['B'],
            right: [['A'], ['B', 'b']]
          },
          {
            left: ['A'],
            right: [['A', 'a'], ['a'], [EMPTY]]
          }
        ],
        startSymbol: 'S'
      };

      it('this should not be a three grammar', () => {
        expect(getIsThreeGrammar(grammar)).to.be.equal(false);
      });
    });

    describe('S->aBc|Sc, B->Ab|Bb, A->Aa|a', () => {
      const grammar: Grammar = {
        terminals: ['a', 'b', 'c'],
        nonTerminals: ['S', 'A', 'B'],
        productions: [
          {
            left: ['S'],
            right: [
              ['a', 'B', 'c'],
              ['S', 'c']
            ]
          },
          {
            left: ['B'],
            right: [
              ['A', 'b'],
              ['B', 'b']
            ]
          },
          {
            left: ['A'],
            right: [['A', 'a'], ['a']]
          }
        ],
        startSymbol: 'S'
      };

      it('this should not be a three grammar', () => {
        expect(getIsThreeGrammar(grammar)).to.be.equal(false);
      });
    });
  });

  describe('getIsTwoGrammar()', () => {
    describe('S->Ac|Sc, A->ab|aAb|EMPTY', () => {
      const grammar: Grammar = {
        nonTerminals: ['S', 'A'],
        terminals: ['a', 'b', 'c'],
        productions: [
          {
            left: ['S'],
            right: [
              ['A', 'c'],
              ['S', 'c']
            ]
          },
          {
            left: ['A'],
            right: [['a', 'b'], ['a', 'A', 'b'], [EMPTY]]
          }
        ],
        startSymbol: 'S'
      };

      it('this should be a two grammar', () => {
        expect(getIsTwoGrammar(grammar)).to.be.equal(true);
      });
    });

    describe('aS->Ac|Sc, A->ab|aAb', () => {
      const grammar: Grammar = {
        nonTerminals: ['S', 'A'],
        terminals: ['a', 'b', 'c'],
        productions: [
          {
            left: ['a', 'S'],
            right: [
              ['A', 'c'],
              ['S', 'c']
            ]
          },
          {
            left: ['A'],
            right: [
              ['a', 'b'],
              ['a', 'A', 'b']
            ]
          }
        ],
        startSymbol: 'S'
      };

      it('this should not be a two grammar', () => {
        expect(getIsTwoGrammar(grammar)).to.be.equal(false);
      });
    });
  });

  describe('getGrammarNChomskyType()', () => {
    describe('aS->Ac|Sc, bA->ab|aAb|EMPTY', () => {
      const grammar: Grammar = {
        nonTerminals: ['S', 'A'],
        terminals: ['a', 'b', 'c'],
        productions: [
          {
            left: ['a', 'S'],
            right: [
              ['A', 'c'],
              ['S', 'c']
            ]
          },
          {
            left: ['b', 'A'],
            right: [['a', 'b'], ['a', 'A', 'b'], [EMPTY]]
          }
        ],
        startSymbol: 'S'
      };

      it('this should be an other grammar (one grammar or zero grammar)', () => {
        expect(getGrammarNChomskyType(grammar)).to.be.equal(GrammarNChomskyType.OTHER);
      });
    });
  });
});
