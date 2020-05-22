import { GSymbol } from '../types/grammar';

const getCrossSet = (set1: GSymbol[], set2: GSymbol[]) => {
  const res: GSymbol[] = [];

  set1.forEach(item1 => {
    set2.forEach(item2 => {
      if (item1 === item2) {
        res.push(item1);
      }
    });
  });

  return res;
};

export default getCrossSet;
