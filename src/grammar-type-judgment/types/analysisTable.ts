import { NonTerminal, Terminal, END, Production } from './grammar';

/**
 * e.g.
 * 
  const table: LL1AnalysisTable = {
    nonTerminals: ['S', 'A'],
    terminals: ['+', '*'],
    relationships: [
      [null, { left: ['S'], right: [['*']] }],
      [{ left: ['A'], right: [['+']] }, null]
    ]
  };
 */
export interface LL1AnalysisTable {
  rows: NonTerminal[];
  columns: (Terminal | typeof END)[];
  relationships: (Production | null)[][];
}
