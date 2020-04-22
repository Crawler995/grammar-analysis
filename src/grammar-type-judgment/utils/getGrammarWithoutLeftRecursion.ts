import { Grammar, PRIME, EMPTY } from '../types/grammar';
import deepCopy from '../../utils/deepCopy';

/**
 * get the production without direct left recursion.
 * e.g.
 * in: I->I0|Ia|Ib|a|b
 * out: I->aI'|bI', I'->0I'|aI'|bI'|EMPTY
 *
 * @param production a single production (not set)
 */
export const getProductionWithoutDirectLeftRecursion = (
  production: Grammar['productions'][any]
) => {
  let leftRecursionNum = 0;

  for (let i = 0; i < production.right.length; i++) {
    if (production.left[0] === production.right[i][0]) {
      leftRecursionNum++;
    } else {
      break;
    }
  }

  if (leftRecursionNum !== 0) {
    const newGSymbol = production.left[0] + PRIME;
    const convertedProduction: Grammar['productions'] = [
      {
        left: [production.left[0]],
        right: production.right.slice(leftRecursionNum).map(item => [...item, newGSymbol])
      },
      {
        left: [newGSymbol],
        right: [
          ...production.right
            .slice(0, leftRecursionNum)
            .map(item => item.filter(temp => temp !== production.left[0]))
            .map(item => [...item, newGSymbol]),
          [EMPTY]
        ]
      }
    ];

    return convertedProduction;
  }

  return [production];
};

const getGrammarWithoutLeftRecursion = (grammar: Grammar) => {
  const newProductions = deepCopy(grammar.productions);

  // remove direct left recursion of productions[0]
  newProductions.shift();
  newProductions.unshift(...getProductionWithoutDirectLeftRecursion(newProductions[0]));

  for (let i = 0; i < newProductions.length; i++) {
    for (let j = 0; j < i - 1; j++) {
      // Ai -> Ajγ => Ai -> δ1γ│δ2γ│……│δkγ
      // Aj -> δ1│δ2│……│δk

      const ai = newProductions[i].left;
      const aj = newProductions[i].right[0];
    }
  }
};

export default getGrammarWithoutLeftRecursion;
