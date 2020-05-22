/**
 * @author Qinglong Zhang BIT 1120172135
 * @description The type definition of Grammar.
 */

/**
 * A complete grammar G contains four components:
 * 1. A set of non-terminals: VN
 * 2. A set of terminal symbols: VT
 * 3. A start symbol: S
 * 4. A set of productions: P
 */

/**
 * The length of a NonTerminal or Terminal is OFTEN 1 (a single character).
 * Specially, the length of "A'" is 2.
 * So use string to define it.
 */
export type NonTerminal = string;
export type Terminal = string;

/**
 * EMPTY means 'ε'.
 */
export const EMPTY = 'ε';

/**
 * be used in the new symbol in the handler of left recursion.
 * e.g.
 *
 * I->I0|Ia|Ib|a|b
 * remove the left recursion:
 * I->aI'|bI', I'->0I'|aI'|bI'|EMPTY
 */
export const PRIME = "'";

/**
 * Symbol is a type in JavaScript(ES6), so use GSymbol which means VT∪VN.
 */
export type GSymbol = NonTerminal | Terminal;

/**
 * e.g.
 * A production is 'AB -> ab|BC|ε'.
 *
 * left: ['A', 'B']
 * right: [['a', 'b'], ['B', 'C'], [EMPTY]]
 */
export interface Production {
  left: GSymbol[];
  right: GSymbol[][];
}

/**
 * We expected a Grammar like this:
 * 
  const grammar: Grammar = {
    nonTerminals: ['S', 'A', 'B'],
    terminals: ['a', 'b', 'c', 'd', 'p', 'q'],
    productions: [{
      left: ['S'],
      right: [['A', 'p'], ['B', 'q']]
    }, {
      left: ['A'],
      right: [['a'], ['c', 'A']]
    }, {
      left: ['B'],
      right: [['b'], ['d', 'B']]
    }],
    startSymbol: 'S'
  };

  which means a grammar like this:
  S->Ap|Bq
  A->a|cA
  B->b|dB
 */
export interface Grammar {
  nonTerminals: NonTerminal[];
  terminals: Terminal[];
  productions: Production[];
  startSymbol: NonTerminal;
}
