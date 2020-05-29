/**
 * This is a common tool in JavaScript/TypeScript,
 * So there's no need to make by myself ^^
 *
 * copy from https://www.haorooms.com/post/js_deepcompare
 */
const deepEqual = (obj1: any, obj: any) => {
  var p;
  if (obj1 === obj) {
    return true;
  }
  // some checks for native types first
  // function and sring
  if (typeof obj1 === 'function' || typeof obj1 === 'string' || obj1 instanceof String) {
    return obj1.toString() === obj.toString();
  }
  // number
  if (obj1 instanceof Number || typeof obj1 === 'number') {
    if (obj instanceof Number || typeof obj === 'number') {
      return obj1.valueOf() === obj.valueOf();
    }
    return false;
  }
  // equalsObject(null,null) and equalsObject(undefined,undefined) do not inherit from the
  // Object.prototype so we can return false when they are passed as obj
  if (typeof obj1 !== typeof obj || obj === null || typeof obj === 'undefined') {
    return false;
  }
  function sort(o: any) {
    var result: any = {};

    if (typeof o !== 'object') {
      return o;
    }

    Object.keys(o)
      .sort()
      .forEach(function (key) {
        result[key] = sort(o[key]);
      });

    return result;
  }
  if (typeof obj1 === 'object') {
    if (Array.isArray(obj1)) {
      // check on arrays
      return JSON.stringify(obj1) === JSON.stringify(obj);
    } else {
      // anyway objects
      for (p in obj1) {
        if (typeof obj1[p] !== typeof obj[p]) {
          return false;
        }
        if ((obj1[p] === null) !== (obj[p] === null)) {
          return false;
        }
        switch (typeof obj1[p]) {
          case 'undefined':
            if (typeof obj[p] !== 'undefined') {
              return false;
            }
            break;
          case 'object':
            if (
              obj1[p] !== null &&
              obj[p] !== null &&
              (obj1[p].constructor.toString() !== obj[p].constructor.toString() ||
                !deepEqual(obj1[p], obj[p]))
            ) {
              return false;
            }
            break;
          case 'function':
            if (obj1[p].toString() !== obj[p].toString()) {
              return false;
            }
            break;
          default:
            if (obj1[p] !== obj[p]) {
              return false;
            }
        }
      }
    }
  }
  // at least check them with JSON
  return JSON.stringify(sort(obj1)) === JSON.stringify(sort(obj));
};

export default deepEqual;
