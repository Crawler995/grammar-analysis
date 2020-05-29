import { NFAStatus } from '../types/fa';

const getSortedNFAStatuses = (s: NFAStatus[]) => {
  return s.sort((s1, s2) => compareNFAStatus(s1, s2));
};

export const compareNFAStatus = (s1: NFAStatus, s2: NFAStatus) => {
  const NFAToString = (s: NFAStatus) => s.left + s.pointPos + s.right.join('');
  const ss1 = NFAToString(s1);
  const ss2 = NFAToString(s2);
  return ss1 < ss2 ? -1 : ss1 === ss2 ? 0 : 1;
};

export default getSortedNFAStatuses;
