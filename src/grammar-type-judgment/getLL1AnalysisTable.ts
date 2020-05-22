import { Grammar, Terminal, END, EMPTY } from './types/grammar';
import getFirstSet from './getFirstSet';
import getCrossSet from './utils/getCrossSet';
import { LL1AnalysisTable } from './types/analysisTable';
import getFollowSet from './getFollowSet';

const getLL1AnalysisTable = (grammar: Grammar): LL1AnalysisTable | null => {
  const res: LL1AnalysisTable = {
    rows: [...grammar.nonTerminals],
    columns: [...grammar.terminals, END],
    relationships: []
  };

  res.relationships = new Array(grammar.nonTerminals.length);
  for (let i = 0; i < res.relationships.length; i++) {
    res.relationships[i] = new Array(grammar.terminals.length + 1).fill(null);
  }

  for (let i = 0; i < grammar.productions.length; i++) {
    const production = grammar.productions[i];

    const { left, right } = production;
    const firstSets: Terminal[][] = [];

    const tableRowIndex = res.rows.indexOf(left[0]);

    for (let j = 0; j < right.length; j++) {
      const candidate = right[j];

      const curFirstSet = getFirstSet(grammar, candidate);
      firstSets.push(curFirstSet);

      if (getIsHasCrossSet(firstSets)) {
        return null;
      }

      let isHasEmpty = curFirstSet.includes(EMPTY);

      curFirstSet.forEach(item => {
        if (item !== EMPTY) {
          const tableColIndex = res.columns.indexOf(item);

          res.relationships[tableRowIndex][tableColIndex] = {
            left,
            right: [candidate]
          };
        }
      });

      if (isHasEmpty) {
        const followSet = getFollowSet(grammar, left[0]);
        followSet.forEach(item => {
          const tableColIndex = res.columns.indexOf(item);

          res.relationships[tableRowIndex][tableColIndex] = {
            left: left,
            right: [candidate]
          };
        });
      }
    }
  }

  return res;
};

const getIsHasCrossSet = (sets: Terminal[][]) => {
  for (let i = 0; i < sets.length - 1; i++) {
    const set1 = sets[i];
    for (let j = i + 1; j < sets.length; j++) {
      const set2 = sets[j];

      if (getCrossSet(set1, set2).length !== 0) {
        return true;
      }
    }
  }

  return false;
};

export default getLL1AnalysisTable;
