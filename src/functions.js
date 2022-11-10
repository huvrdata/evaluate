
/**
 * returns first defined arg
 *  ex:
 *    var x;
 *    COALESCE(x, 0)  // `0`
 */
export function COALESCE(...args) {
  for (const arg of args) {
    if (typeof arg !== 'undefined') {
      return arg;
    }
  }
};
