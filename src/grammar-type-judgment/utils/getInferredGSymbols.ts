import { Grammar, GSymbol, NonTerminal, EMPTY } from '../types/grammar';
import getCandidates from './getCandidates';

/**
 * Assert that the given grammar is a two grammar.
 *
 * e.g.
 * A -> BC
 * B -> a|EMPTY
 * C -> aD|b|EMPTY
 * D -> cb
 *
 * argument: ['A']
 * output: ['a', 'acb', 'b', EMPTY]
 */
const getInferredGSymbols = (
  grammar: Grammar,
  args: GSymbol[],
  cache: NonTerminal[] = []
): GSymbol[] => {
  const res: GSymbol[] = [];

  for (let i = 0; i < args.length; i++) {
    const curArgs = args[i];
    if (grammar.terminals.includes(curArgs) || curArgs === EMPTY) {
      res.push(curArgs);
      continue;
    }

    if (cache.includes(curArgs)) {
      continue;
    }

    if (grammar.nonTerminals.includes(curArgs)) {
      cache.push(curArgs);
    }

    // [['B', 'C']]
    const candidates = getCandidates(grammar, [curArgs]);

    candidates.forEach(candidate => {
      const inferredGSymbols = getInferredGSymbols(grammar, candidate, cache);
      res.push(...inferredGSymbols);
    });

    if (grammar.nonTerminals.includes(curArgs)) {
      cache.pop();
    }
  }

  return [...new Set(res)].sort();
};

export default getInferredGSymbols;
