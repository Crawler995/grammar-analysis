import { Grammar, Terminal, END, EMPTY } from './types/grammar';
import getFirstSet from './getFirstSet';
import getCrossSet from './utils/getCrossSet';
import { LL1AnalysisTable } from './types/analysisTable';
import getFollowSet from './getFollowSet';
import getGrammarNChomskyType from './utils/getGrammarNChomskyType';
import GrammarNChomskyType from './types/grammarNChomskyType';

const getLL1AnalysisTable = (grammar: Grammar): LL1AnalysisTable | null => {
  if (getGrammarNChomskyType(grammar) === GrammarNChomskyType.OTHER) {
    throw new Error('you should give a two grammar at least.');
  }

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

      // there's cross set between first sets
      // not LL(1) grammar
      if (getIsHasCrossSet(firstSets)) {
        return null;
      }

      let isHasEmpty = curFirstSet.includes(EMPTY);

      for (let i = 0; i < curFirstSet.length; i++) {
        const item = curFirstSet[i];

        if (item !== EMPTY) {
          const tableColIndex = res.columns.indexOf(item);

          // multiple definition
          // not LL(1) grammar
          if (res.relationships[tableRowIndex][tableColIndex] !== null) {
            return null;
          }

          res.relationships[tableRowIndex][tableColIndex] = {
            left,
            right: [candidate]
          };
        }
      }

      if (isHasEmpty) {
        const followSet = getFollowSet(grammar, left[0]);

        for (let i = 0; i < followSet.length; i++) {
          const item = followSet[i];

          const tableColIndex = res.columns.indexOf(item);

          // multiple definition
          // not LL(1) grammar
          if (res.relationships[tableRowIndex][tableColIndex] !== null) {
            return null;
          }

          res.relationships[tableRowIndex][tableColIndex] = {
            left: left,
            right: [candidate]
          };
        }
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
