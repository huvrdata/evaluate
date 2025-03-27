
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

/**
 * Return the size on an array as text, with an optional given prefix
 */
export function BADGE(array, prefix = '') {
  const length = array?.length || 0;
  return `${prefix}${length}`;
}
