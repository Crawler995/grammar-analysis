import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Grammar } from '../../../src/grammar-analysis/types/grammar';
import getEmptyArcClosure from '../../../src/grammar-analysis/utils/closure/getEmptyArcClosure';
import getNFAFromGrammar from '../../../src/grammar-analysis/utils/fa/getNFAFromGrammar';

describe('getEmptyArcClosure.ts (getEmptyArcClosure())', () => {
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

    it(`EMPTY-Closure(S'->·A) = {S'->·A, A->·aA, A->·b}`, () => {
      const inputNFA = getNFAFromGrammar(grammar);
      const { statuses } = inputNFA;

      expect(getEmptyArcClosure(inputNFA, [statuses[0]])).to.deep.equal([
        statuses[0],
        statuses[2],
        statuses[5]
      ]);
    });
  });
});
