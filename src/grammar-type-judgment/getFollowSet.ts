import { GSymbol, Grammar, NonTerminal, EMPTY, END, Terminal } from './types/grammar';
import getIsArgumentInGrammar from './utils/is/getIsArgumentInGrammar';
import getFirstSet from './getFirstSet';

const getFollowSet = (
  grammar: Grammar,
  argument: NonTerminal,
  cache: NonTerminal[] = []
): Terminal[] => {
  if (!getIsArgumentInGrammar(grammar, [argument])) {
    throw new Error(
      'The argument must be included by the non-terminal set or terminal set of the given grammar.'
    );
  }

  const res: GSymbol[] = [];

  // A -> a | cA
  // endless recursion
  if (cache.includes(argument)) {
    return res;
  }

  if (argument === grammar.startSymbol) {
    res.push(END);
  }

  grammar.productions.forEach((production, index) => {
    const { left, right } = production;

    right.forEach((item, index) => {
      const pos = item.indexOf(argument);
      if (pos > -1) {
        const followSetOfLeft = getFollowSet(grammar, left[0], [...cache, argument]);

        // res includes FIRST(left)
        if (pos === item.length - 1) {
          res.push(...followSetOfLeft);
        }

        const firstSetOfRightRest = getFirstSet(grammar, item.slice(pos + 1));
        res.push(...firstSetOfRightRest.filter(item => item !== EMPTY));

        if (firstSetOfRightRest.includes(EMPTY)) {
          res.push(...followSetOfLeft);
        }
      }
    });
  });

  return [...new Set(res)].sort();
};

export default getFollowSet;
