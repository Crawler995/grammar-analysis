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
const getInferredGSymbols = (grammar: Grammar, left: GSymbol[]) => {
  const { productions } = grammar;

  for (let i = 0; i < productions.length; i++) {
    const production = productions[i];

    if (getIsGSymbolSetEqual(production.left, left)) {
      return production.right;
    }
  }

  return null;
};

export default getInferredGSymbols;
