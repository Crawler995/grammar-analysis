import { describe, it } from 'mocha';
import { expect } from 'chai';

import deepCopy from '../../src/utils/deepCopy';

describe('deepCopy.ts (deepCopy())', () => {
  it("deepCopy('123') should be '123'", () => {
    expect(deepCopy('123')).to.be.equal('123');
  });

  it("deepCopy(['1', ['2']]) should be ['1', ['2']]", () => {
    const pre = ['1', ['2']];
    const now = deepCopy(pre);
    expect(now).to.deep.equal(pre);
    (now[1] as string[])[0] = '3';
    expect(now).to.deep.equal(['1', ['3']]);
    expect(pre).to.deep.equal(['1', ['2']]);
  });

  it("deepCopy({'a': {'b': 1}}) should be {'a': {'b': 1}}", () => {
    const pre = { a: { b: 1 } };
    const now = deepCopy(pre);
    expect(now).to.deep.equal(pre);
    now['a']['b'] = 2;
    expect(now).to.deep.equal({ a: { b: 2 } });
    expect(pre).to.deep.equal({ a: { b: 1 } });
  });
});
