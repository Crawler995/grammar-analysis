import { Grammar, GSymbol } from '../types/grammar';
import getIsGSymbolSetEqual from './getIsGSymbolSetEqual';

/**
 * Get the inferred symbols (the right) by the given left symbol.
 * e.g.
 * A -> ab | c
 *
 * left: A
 * output: [['a', 'b'], ['c']]
 */
const getCandidates = (grammar: Grammar, left: GSymbol[]) => {
  const { productions } = grammar;
  const res = [];

  for (let i = 0; i < productions.length; i++) {
    const production = productions[i];

    if (getIsGSymbolSetEqual(production.left, left)) {
      res.push(...production.right);
    }
  }

  return res;
};

export default getCandidates;
