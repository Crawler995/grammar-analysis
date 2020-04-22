import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Grammar, EMPTY } from '../../../src/grammar-type-judgment/types/grammar';
import getProductionWithoutLeftRecursion, {
  getProductionWithoutDirectLeftRecursion
} from '../../../src/grammar-type-judgment/utils/getGrammarWithoutLeftRecursion';

describe('getProductionWithoutLeftRecursion.ts', () => {
  describe('getProductionWithoutDirectLeftRecursion()', () => {
    describe('I->I0|Ia|Ib|a|b', () => {
      const grammar: Grammar = {
        nonTerminals: ['I'],
        terminals: ['0', 'a', 'b'],
        productions: [
          {
            left: ['I'],
            right: [['I', '0'], ['I', 'a'], ['I', 'b'], ['a'], ['b']]
          }
        ],
        startSymbol: 'I'
      };

      it("the production without left recursion should be I->aI'|bI', I'->0I'|aI'|bI'|EMPTY", () => {
        expect(getProductionWithoutDirectLeftRecursion(grammar.productions[0])).to.deep.equal([
          {
            left: ['I'],
            right: [
              ['a', "I'"],
              ['b', "I'"]
            ]
          },
          {
            left: ["I'"],
            right: [['0', "I'"], ['a', "I'"], ['b', "I'"], [EMPTY]]
          }
        ]);
      });
    });

    describe('I->a|b', () => {
      const grammar: Grammar = {
        nonTerminals: ['I'],
        terminals: ['a', 'b'],
        productions: [
          {
            left: ['I'],
            right: [['a'], ['b']]
          }
        ],
        startSymbol: 'I'
      };

      it('the production without left recursion should be I->a|b (the same)', () => {
        expect(getProductionWithoutDirectLeftRecursion(grammar.productions[0])).to.deep.equal([
          {
            left: ['I'],
            right: [['a'], ['b']]
          }
        ]);
      });
    });
  });
});
