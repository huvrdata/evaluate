
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
 * Return the size on an array as text, with an optional given prefix/postfix
 */
export function BADGE(array, prefix = '', postfix = '') {
  const length = array?.length || '';
  if (length) return `${prefix}${length}${postfix}`;
  return '';
}
