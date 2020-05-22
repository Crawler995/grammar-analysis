import { Grammar, GSymbol, EMPTY } from '../types/grammar';
import GrammarNChomskyType from '../types/grammarNChomskyType';

const getGrammarNChomskyType = (grammar: Grammar): GrammarNChomskyType => {
  if (getIsThreeGrammar(grammar)) return GrammarNChomskyType.THREE;
  if (getIsTwoGrammar(grammar)) return GrammarNChomskyType.TWO;

  return GrammarNChomskyType.OTHER;
};

export const getIsThreeGrammar = (grammar: Grammar) => {
  const { productions } = grammar;
  let linearType = undefined;

  for (const production of productions) {
    const { left, right } = production;
    // Aa -> B
    if (left.length !== 1) {
      return false;
    }

    // split "A -> a|b" to "A -> a, A -> b"
    for (const rightPart of right) {
      const type = getCandidateLinearType(grammar, rightPart);
      if (type === 'none') {
        return false;
      } else if (type === 'uncertain') {
        continue;
      } else {
        if (linearType === undefined) {
          linearType = type;
        } else {
          if (linearType !== type) {
            return false;
          }
        }
      }
    }

    return true;
  }
};

export type LinearType = 'left' | 'right' | 'none' | 'uncertain';

export const getCandidateLinearType = (grammar: Grammar, candidate: GSymbol[]): LinearType => {
  if (candidate.length > 2) {
    return 'none';
  }

  const { terminals, nonTerminals } = grammar;

  if (candidate.length === 1) {
    return terminals.includes(candidate[0]) || candidate[0] === EMPTY ? 'uncertain' : 'none';
  }
  if (candidate.length === 2) {
    if (
      nonTerminals.includes(candidate[0]) &&
      (terminals.includes(candidate[1]) || candidate[1] === EMPTY)
    ) {
      return 'left';
    }
    if (
      (terminals.includes(candidate[0]) || candidate[0] === EMPTY) &&
      nonTerminals.includes(candidate[1])
    ) {
      return 'right';
    }
  }

  return 'none';
};

export const getIsTwoGrammar = (grammar: Grammar) => {
  const { productions, nonTerminals } = grammar;

  for (const production of productions) {
    const { left } = production;

    // Aa -> ...
    if (left.length !== 1) {
      return false;
    }
    // a -> ...
    if (!nonTerminals.includes(left[0])) {
      return false;
    }
  }

  return true;
};

export default getGrammarNChomskyType;
