function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const isArray = Array.isArray(obj);
  const res: any = isArray ? [] : {};

  Object.keys(obj).forEach(key => (res[key] = deepCopy((obj as any)[key])));
  return res;
}

export default deepCopy;
