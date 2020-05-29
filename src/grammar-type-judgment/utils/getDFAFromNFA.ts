import { NFA, NFAStatus, DFA, DFAStatus } from '../types/fa';
import getEmptyArcClosure from './getEmptyArcClosure';
import { GSymbol, EMPTY } from '../types/grammar';
import getAlphaArcClosure from './getAlphaArcClosure';
import deepEqual from '../../utils/deepEqual';
import getSortedNFAStatuses from './getSortedNFAStatuses';

interface DeterminingTable {
  rows: NFAStatus[][];
  columns: GSymbol[];
  relationships: (NFAStatus[] | null)[][];
}

const getDFAFromNFA = (inputNFA: NFA) => {
  const startEmptyArcClosure = getEmptyArcClosure(inputNFA, [inputNFA.startStatus]);

  const determiningTable: DeterminingTable = {
    rows: [startEmptyArcClosure],
    columns: [...new Set(inputNFA.transformFunctions.map(fn => fn.input).filter(c => c !== EMPTY))],
    relationships: []
  };

  let acceptedStatuses: DFAStatus[] = [];
  let rowIndex = 0;
  while (true) {
    const s = determiningTable.rows[rowIndex];
    const row: (NFAStatus[] | null)[] = [];

    // I-α
    determiningTable.columns.forEach(column => {
      const alphaArcClosure = getAlphaArcClosure(inputNFA, s, column);
      row.push(alphaArcClosure.length === 0 ? null : alphaArcClosure);

      // if not exists in row before
      // add it into row
      if (
        alphaArcClosure.length !== 0 &&
        !determiningTable.rows.reduce(
          (res, cur) =>
            res || deepEqual(getSortedNFAStatuses(cur), getSortedNFAStatuses(alphaArcClosure)),
          false
        )
      ) {
        determiningTable.rows.push(alphaArcClosure);

        // includes accepted status in NFA
        if (
          inputNFA.acceptedStatuses.reduce(
            (res, cur) => res || alphaArcClosure.find(s => deepEqual(s, cur)) !== undefined,
            false
          )
        ) {
          acceptedStatuses.push(alphaArcClosure);
        }
      }
    });

    determiningTable.relationships.push(row);

    rowIndex++;
    if (rowIndex === determiningTable.rows.length) {
      break;
    }
  }

  const resDFA: DFA = {
    inputs: inputNFA.inputs,
    statuses: determiningTable.rows,
    startStatus: determiningTable.rows[0],
    acceptedStatuses,
    transformFunctions: []
  };

  const { relationships } = determiningTable;
  determiningTable.rows.forEach((row, ri) => {
    determiningTable.columns.forEach((column, ci) => {
      if (relationships[ri][ci] !== null) {
        resDFA.transformFunctions.push({
          from: row,
          to: relationships[ri][ci]!,
          input: column
        });
      }
    });
  });

  return resDFA;
};

export default getDFAFromNFA;
