import { NFAStatus, NFA } from '../types/fa';
import getEmptyArcClosure from './getEmptyArcClosure';
import deepCopy from '../../utils/deepCopy';
import { GSymbol } from '../types/grammar';
import deepEqual from '../../utils/deepEqual';

const getAlphaArcClosure = (inputNFA: NFA, statuses: NFAStatus[], alpha: GSymbol): NFAStatus[] => {
  const emptyArcClosure = getEmptyArcClosure(inputNFA, statuses);

  const { transformFunctions } = inputNFA;
  const alphaArcClosure: NFAStatus[] = [];

  emptyArcClosure.forEach(s => {
    transformFunctions.forEach(fn => {
      if (deepEqual(fn.from, s) && fn.input === alpha) {
        if (!alphaArcClosure.reduce((res, cur) => res || deepEqual(cur, fn.to), false)) {
          alphaArcClosure.push(deepCopy(fn.to));
        }
      }
    });
  });

  const res: NFAStatus[] = [];
  alphaArcClosure.forEach(s => {
    res.push(...getEmptyArcClosure(inputNFA, [s]));
  });

  return res;
};

export default getAlphaArcClosure;
