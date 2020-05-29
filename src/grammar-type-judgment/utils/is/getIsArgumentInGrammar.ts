import { Grammar, GSymbol, EMPTY } from '../../types/grammar';

/**
 * Get whether the given symbols are in non-terminals or terminals in the given grammar.
 * e.g.
 * A -> ab
 * B -> ac
 *
 * argument: ['a', 'A']
 * output: true
 *
 * argument: ['e', 'f']
 * output: false
 */
const getIsArgumentInGrammar = (grammar: Grammar, argument: GSymbol[]) => {
  if (argument.length === 1 && argument[0] === EMPTY) {
    return true;
  }

  const { nonTerminals, terminals } = grammar;

  return argument.reduce(
    (res, cur) => res && (nonTerminals.includes(cur) || terminals.includes(cur)),
    true
  );
};

export default getIsArgumentInGrammar;
