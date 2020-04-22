import { Grammar, GSymbol, EMPTY } from './types/grammar';
import getInferredGSymbols from './utils/getInferredGSymbols';
import getIsArgumentInGrammar from './utils/getIsArgumentInGrammar';

/**
 * Get FIRST(*).
 * @param grammar A Grammar.
 * @param argument X or X1X2...Xk, such as ['A'] or ['A', 'b', 'C'], which means FIRST('A') or FIRST('AbC')
 */
const getFirstSet = (grammar: Grammar, argument: GSymbol[]): GSymbol[] => {
  if (!getIsArgumentInGrammar(grammar, argument)) {
    throw new Error(
      'The argument must be included by the non-terminal set or terminal set of the given grammar.'
    );
  }

  console.log(argument);

  // the argument is ['A'] or ['a']
  if (argument.length === 1) {
    const symbol = argument[0];

    // the symbol is a terminal, e.g. ['a']
    if (grammar.terminals.includes(symbol) || symbol === EMPTY) {
      return [symbol];
    }
    // the symbol is a non-terminal, e.g. ['A']
    else {
      // if there's a production: A -> aBc | d
      // the inferredGSymbols will be [['a', 'B', 'c'], ['d']]
      const inferredGSymbols = getInferredGSymbols(grammar, argument);

      console.log(inferredGSymbols);

      if (inferredGSymbols === null) {
        throw new Error("The argument is a non-terminal, but no symbols can't be inferred.");
      }

      // res = FIRST('aBc')∪FIRST('d')
      const res: GSymbol[] = [];
      inferredGSymbols.forEach(inferredGSymbol => {
        res.push(...getFirstSet(grammar, inferredGSymbol));
      });

      console.log(res);

      return res;
    }
  }

  // the argument is like ['a', 'A', 'c'], which means FIRST('aAc')
  else {
    let isAllPreFirstSetContainsEmpty = true;
    let isAllFirstSetContainsEmpty = true;
    const res: GSymbol[] = [];

    for (let i = 0; i < argument.length; i++) {
      if (isAllPreFirstSetContainsEmpty) {
        const curFirstSet = getFirstSet(grammar, [argument[i]]);
        const curFirstSetWithoutEmpty = curFirstSet.filter(symbol => symbol !== EMPTY);

        console.log(curFirstSet);

        res.push(...curFirstSetWithoutEmpty);
        isAllPreFirstSetContainsEmpty = curFirstSet.length !== curFirstSetWithoutEmpty.length;
      } else {
        isAllFirstSetContainsEmpty = false;
        break;
      }
    }

    if (isAllFirstSetContainsEmpty) {
      res.push(EMPTY);
    }

    return res;
  }
};

export default getFirstSet;
