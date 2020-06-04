import { Grammar, GSymbol, NonTerminal, EMPTY } from '../../types/grammar';
import getCandidates from '../getCandidates';
import getCrossSet from '../getCrossSet';

/**
 * Assert that the given grammar is a two grammar.
 */
const getIsCanInferEmpty = (
  grammar: Grammar,
  args: GSymbol,
  cache: NonTerminal[] = []
): boolean => {
  if(cache.includes(args)) {
    return false;
  }

  if (args === EMPTY) {
    return true;
  } else if (grammar.nonTerminals.includes(args)) {
    const candidates = getCandidates(grammar, [args]);

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];

      if (candidate.length === 1 && candidate[0] === EMPTY) {
        return true;
      }

      if (getCrossSet(candidate, grammar.terminals).length === 0) {
        const res = candidate.reduce((res, cur) => res && getIsCanInferEmpty(grammar, cur, [...cache, args]), true);
        if (res) return true;
      }
    }

    return false;
  } else if (grammar.terminals.includes(args)) {
    return false;
  } else {
    return false;
  }
};

export default getIsCanInferEmpty;
