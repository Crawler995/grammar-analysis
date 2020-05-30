import { DFA } from '../../types/fa';
import { compareDFAStatus } from './getSortedDFAStatuses';

const getSortedDFATransformFunctions = (fns: DFA['transformFunctions']) => {
  return fns.slice(0).sort((a, b) => {
    const fromR = compareDFAStatus(a.from, b.from);
    if (fromR !== 0) {
      return fromR;
    }

    if (a.input !== b.input) {
      return a.input < b.input ? -1 : 1;
    }

    const toR = compareDFAStatus(a.to, b.to);
    return toR;
  });
};

export default getSortedDFATransformFunctions;
