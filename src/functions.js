/**
 * returns first defined arg
 *  ex:
 *    var x;
 *    COALESCE(x, 0)  // `0`
 */
export function COALESCE(...args) {
  for (const arg of args) {
    if (typeof arg !== "undefined") {
      return arg;
    }
  }
}

/**
 * Return the size on an array as text, with an optional given prefix/postfix
 */
export function BADGE(array, prefix = "", postfix = "") {
  const length = array?.length || "";
  if (length) return `${prefix}${length}${postfix}`;
  return "";
}

/**
 * Returns property of an object in a given array
 * params:
 *   data: array of objects
 *   value: value to match
 *   matchKey: property name to match
 *   returnKey: property name to return
 *   notFound: value to return if not found
 *
 * ex:
 *   var x = [{value: 1, label: "One", roman: "I"}, {value: 2, label: "Two", roman: "II"}];
 *   HLOOKUP(x, 1)  // "One"
 *   HLOOKUP(x, "II", "roman", "value")  // 2
 *   HLOOKUP(x, 3, "value", "label", "Not Found")  // "Not Found"
 */
export function HLOOKUP(
  data,
  value,
  matchKey = "value",
  returnKey = "label",
  notFound = "Value Not Found"
) {
  const item = data?.find((item) => item[matchKey] === value);
  return item ? item[returnKey] : notFound;
}
