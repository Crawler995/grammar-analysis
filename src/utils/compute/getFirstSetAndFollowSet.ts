import { Grammar } from '../../grammar-analysis/types/grammar';
import getFirstSet from '../../grammar-analysis/getFirstSet';
import getFollowSet from '../../grammar-analysis/getFollowSet';

export interface IFirstAndFollowSet {
  key: string;
  symbols: string;
  firstSet: string;
  followSet: string;
}

const getFirstSetAndFollowSet = (grammar: Grammar) => {
  const { nonTerminals, productions } = grammar;
  const data: IFirstAndFollowSet[] = [];
  data.push(
    ...nonTerminals.map(nonTerminal => {
      const firstSet = getFirstSet(grammar, [nonTerminal]);
      const followSet = getFollowSet(grammar, nonTerminal);

      return {
        key: nonTerminal,
        symbols: nonTerminal,
        firstSet: `{ ${firstSet.join(', ')} }`,
        followSet: `{ ${followSet.join(', ')} }`
      };
    })
  );
  productions.forEach(production => {
    const temp: IFirstAndFollowSet[] = [];
    production.right.forEach(c => {
      const firstSet = getFirstSet(grammar, c);

      temp.push({
        key: c.join(''),
        symbols: c.join(''),
        firstSet: `{ ${firstSet.join(', ')} }`,
        followSet: ''
      });
    });
    data.push(...temp);
  });

  return data.reduce((res, cur) => {
    if (res.findIndex(v => v.symbols === cur.symbols) === -1) {
      return res.concat(cur);
    }
    return res;
  }, [] as IFirstAndFollowSet[]);
};

export default getFirstSetAndFollowSet;
