import { Grammar, GSymbol, EMPTY, NonTerminal } from './types/grammar';
import getCandidates from './utils/getCandidates';
import getIsArgumentInGrammar from './utils/is/getIsArgumentInGrammar';
import getIsCanInferEmpty from './utils/is/getIsCanInferEmpty';

/**
 * Get FIRST(*).
 * @param grammar A Grammar.
 * @param argument X or X1X2...Xk, such as ['A'] or ['A', 'b', 'C'], which means FIRST('A') or FIRST('AbC')
 */
const getFirstSet = (
  grammar: Grammar,
  argument: GSymbol[],
  cache: NonTerminal[] = []
): GSymbol[] => {
  if (!getIsArgumentInGrammar(grammar, argument)) {
    throw new Error(
      'The argument must be included by the non-terminal set or terminal set of the given grammar.'
    );
  }

  // the argument is ['A'] or ['a']
  if (argument.length === 1) {
    const symbol = argument[0];

    // the symbol is a terminal or EMPTY, e.g. ['a']
    if (grammar.terminals.includes(symbol) || symbol === EMPTY) {
      return [symbol];
    }
    // the symbol is a non-terminal, e.g. ['A']
    else {
      // if there's a production: A -> aBc | d
      // the candidates will be [['a', 'B', 'c'], ['d']]
      const candidates = getCandidates(grammar, argument);

      // res = FIRST('aBc')∪FIRST('d')
      const res: GSymbol[] = [];
      cache.push(symbol);
      candidates.forEach(candidate => {
        if (symbol !== candidate[0]) {
          // indirect left recursion
          if (cache.includes(candidate[0])) {
            let candidatesContainsEmpty =
              getCandidates(grammar, [candidate[0]]).find(
                candidate => candidate.length === 1 && candidate[0] === EMPTY
              ) !== undefined;
            if (candidatesContainsEmpty) {
              // ignore the candidate which cause indirect left recursion
              res.push(...getFirstSet(grammar, candidate.slice(1), cache));
            }
          } else {
            res.push(...getFirstSet(grammar, candidate, cache));
          }
        } else {
          // direct left recursion
          // A -> Ad|EMPTY
          // now the candidate is ['A', 'd']
          let candidatesContainsEmpty =
            candidates.find(candidate => candidate.length === 1 && candidate[0] === EMPTY) !==
            undefined;
          if (candidatesContainsEmpty) {
            // ignore the candidate which cause direct left recursion
            res.push(...getFirstSet(grammar, candidate.slice(1), cache));
          }
        }
      });
      cache.pop();

      return [...new Set(res)].sort();
    }
  }

  // the argument is like ['a', 'A', 'c'], which means FIRST('aAc')
  else {
    let isAllPreInferredGSymbolsContainsEmpty = true;
    let isAllFirstSetContainsEmpty = true;
    const res: GSymbol[] = [];

    for (let i = 0; i < argument.length; i++) {
      if (isAllPreInferredGSymbolsContainsEmpty) {
        const curFirstSet = getFirstSet(grammar, [argument[i]], cache);
        const curFirstSetWithoutEmpty = curFirstSet.filter(symbol => symbol !== EMPTY);
        res.push(...curFirstSetWithoutEmpty);

        isAllPreInferredGSymbolsContainsEmpty = getIsCanInferEmpty(grammar, argument[i]);
      } else {
        isAllFirstSetContainsEmpty = false;
        break;
      }
    }

    if (!isAllPreInferredGSymbolsContainsEmpty) {
      isAllFirstSetContainsEmpty = false;
    }

    if (isAllFirstSetContainsEmpty) {
      res.push(EMPTY);
    }

    return [...new Set(res)].sort();
  }
};

export default getFirstSet;
