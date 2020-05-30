import getSortedNFAStatuses, { compareNFAStatus } from './getSortedNFAStatuses';
import { DFAStatus } from '../../types/fa';

const getSortedDFAStatuses = (s: DFAStatus[]) => {
  s = s.map(a => getSortedNFAStatuses(a));

  return s.slice(0).sort((a, b) => compareDFAStatus(a, b));
};

export const compareDFAStatus = (a: DFAStatus, b: DFAStatus) => {
  if (a.length !== b.length) {
    return a.length - b.length;
  }

  for (let i = 0; i < a.length; i++) {
    const r = compareNFAStatus(a[i], b[i]);
    if (r !== 0) {
      return r;
    }
  }

  return 0;
};

export default getSortedDFAStatuses;
