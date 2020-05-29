import { describe, it } from 'mocha';
import { expect } from 'chai';

import getSortedCandidates from '../../../src/grammar-type-judgment/utils/getSortedCandidates';

describe('getSortedCandidates.ts (getSortedCandidates())', () => {
  it(`[['I','a'], ['I','b'], ['a'], ['I','0']], ['b'] should be [['I','0'], ['I','a'], ['I','b'], ['a'], ['b']]`, () => {
    expect(getSortedCandidates([['I', 'a'], ['I', 'b'], ['a'], ['I', '0'], ['b']])).to.deep.equal([
      ['I', '0'],
      ['I', 'a'],
      ['I', 'b'],
      ['a'],
      ['b']
    ]);
  });
});
