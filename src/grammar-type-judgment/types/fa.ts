import { GSymbol, NonTerminal } from "./grammar";

/**
 * NFA in LR(0) / SLR(1) analysis
 */
export interface NFA {
  inputs: GSymbol[];
  statuses: NFAStatus[];
  startStatus: NFAStatus;
  acceptedStatuses: NFAStatus[];
  transformFunctions: {
    from: NFAStatus;
    input: GSymbol;
    to: NFAStatus;
  }
}

/**
 * Status of NFA in LR(0) / SLR(1) analysis
 * 
 * e.g.
 * A -> a·A
 * can be expressed as
 * const status: FAStatus = {
    left: 'A',
    right: ['a', 'A'],
    pointPos: 1
  };
 */
export interface NFAStatus {
  left: NonTerminal;
  right: GSymbol[];
  pointPos: number;
}

export type DFAStatus = NFAStatus[];

/**
 * DFA in LR(0) / SLR(1) analysis
 */
export interface DFA {
  inputs: GSymbol[];
  statuses: NFAStatus[][];
  startStatus: NFAStatus[];
  acceptedStatuses: NFAStatus[][];
  transformFunctions: {
    from: NFAStatus[];
    input: GSymbol;
    to: NFAStatus[];
  }
}