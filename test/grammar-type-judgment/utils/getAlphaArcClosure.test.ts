import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Grammar } from '../../../src/grammar-type-judgment/types/grammar';
import getAlphaArcClosure from '../../../src/grammar-type-judgment/utils/closure/getAlphaArcClosure';
import getNFAFromGrammar from '../../../src/grammar-type-judgment/utils/fa/getNFAFromGrammar';

describe('getAlphaArcClosure.ts (getAlphaArcClosure())', () => {
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

    it(`a-Closure(0, 2, 5) = {3, 2, 5}`, () => {
      const inputNFA = getNFAFromGrammar(grammar);
      const { statuses } = inputNFA;

      expect(
        getAlphaArcClosure(inputNFA, [statuses[0], statuses[2], statuses[5]], 'a').sort()
      ).to.deep.equal([statuses[3], statuses[2], statuses[5]].sort());
    });
  });
});
