
// default key transform
//  removes anything non alphanumeric, or "_", replaces with "_"
function removeSpecialCharactersAndLowerCase(key="") {
  return key.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
}

/**
 * Convenience util,
 *  making context not require dot-notation lookup
 *
 * @param {Object} context keys with values, values can also be objects
 * @param {Number} levels how many levels to flatten
 * @param {String} separator "__"
 * @param {Function} keyTransform removeSpecialCharactersAndLowerCase
 *
 * @example flattenContext({ a: { b: { c: 24 } } })  // { "a__b__c": 24 }
 *
 * @returns {Object}
 */
 export function flattenContext(
  context,
  levels=3,
  separator="__",
  keyTransform=removeSpecialCharactersAndLowerCase,
) {
  const flattened = {};

  for (const [_key, value] of Object.entries(context)) {
    const key = typeof keyTransform === "function" ? keyTransform(_key): _key;

    if (levels > 1 && value instanceof Object && value.constructor === Object) {  // only flatten if vanilla object

      // recursive call to `flattenContext`
      //  loop through flattened keys in response and add to current flattened object
      for (const [k, v] of Object.entries(flattenContext(value, levels-1, separator, keyTransform))) {
        const flattenedKey = `${key}${separator}${k}`;
        flattened[flattenedKey] = v;
      }

    } else {

      flattened[key] = value;
    }
  }

  return flattened;
}
