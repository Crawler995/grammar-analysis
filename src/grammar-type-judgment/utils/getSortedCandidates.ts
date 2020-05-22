import { GSymbol } from '../types/grammar';

/**
 * get sorted candidates (ascending ASCII order)
 *
 * @param candidates for example: A->I0|Ia, the candidates will be [['I', '0'], ['I', 'a']]
 */
const getSortedCandidates = (candidates: GSymbol[][]) => {
  return candidates.sort((a, b) => (a.join('') < b.join('') ? -1 : 1));
};

export default getSortedCandidates;
