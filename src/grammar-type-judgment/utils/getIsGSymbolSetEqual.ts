import { GSymbol } from '../types/grammar';

/**
 * Get whether two symbols are deeply equal.
 * e.g.
 *
 * a: ['a', 'b']
 * b: ['a', 'b']
 * output: true
 *
 * a: ['a', 'c']
 * b: ['a', 'b']
 * output: false
 */
const getIsGSymbolSetEqual = (a: GSymbol[], b: GSymbol[], sorted: boolean = true) => {
  if (a.length !== b.length) {
    return false;
  }

  if (sorted) {
    a = a.sort();
    b = b.sort();
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};

export default getIsGSymbolSetEqual;
