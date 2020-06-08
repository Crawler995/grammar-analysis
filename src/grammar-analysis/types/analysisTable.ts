import { NonTerminal, Terminal, END, Production } from './grammar';
import { DFA } from './fa';

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

export type State = number;
export const S = (n: State) => `S${n}`;
export const R = (n: State) => `r${n}`;
export const ACC = `acc`;

export interface LR0AnalysisTable {
  states: State[];
  actionColumns: (Terminal | typeof END)[];
  gotoColumns: NonTerminal[];
  actionTable: (ReturnType<typeof S> | ReturnType<typeof R> | typeof ACC | null)[][];
  gotoTable: (State | null)[][];
  depDFA: DFA;
}

export type SLR1AnalysisTable = LR0AnalysisTable;
