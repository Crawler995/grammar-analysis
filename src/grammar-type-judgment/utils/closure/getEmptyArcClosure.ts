import { NFA, NFAStatus } from '../../types/fa';
import deepEqual from '../../../utils/deepEqual';
import { EMPTY } from '../../types/grammar';
import deepCopy from '../../../utils/deepCopy';

const getEmptyArcClosure = (inputNFA: NFA, statuses: NFAStatus[]): NFAStatus[] => {
  const { transformFunctions } = inputNFA;
  const res: NFAStatus[] = [...statuses];

  let lastLength = res.length;

  while (true) {
    res.forEach(s => {
      transformFunctions.forEach(fn => {
        if (deepEqual(fn.from, s) && fn.input === EMPTY) {
          if (!res.reduce((res, cur) => res || deepEqual(cur, fn.to), false)) {
            res.push(deepCopy(fn.to));
          }
        }
      });
    });

    if (res.length === lastLength) break;
    else lastLength = res.length;
  }

  return res;
};

export default getEmptyArcClosure;
