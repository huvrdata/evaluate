const formulajs = require("formulajs");
const { EvaluationError } = require("./errors");
const { limitedParser } = require("./parser");


/**
 * Safely evaluate string math-y/JS-y expression,
 *
 * See expression syntax:
 *  https://mathjs.org/docs/expressions/syntax.html
 * List of additional functions make available:
 *  https://formulajs.info/functions/
 *
 * @param {String} expression
 * @param {Object} context
 * @param {Object?} options { debug: false }
 *
 * @return {*} number/string/etc
 *
 */
function evaluate(expression, context={}, options={}) {
  const { debug } = options || {};

  // https://mathjs.org/docs/expressions/parsing.html#parser
  const parser = limitedParser();

  // add `context` to parser
  for (const [key, value] of Object.entries(context || {})) {
    parser.set(key, value)
  }

  // add all `formulajs` functions to parser
  for (const [name, func] of Object.entries(formulajs)) {
    parser.set(name, func)
  }

  try {
    return parser.evaluate(expression)
  } catch (e) {
    if (debug) {
      console.debug(e);
    }
    throw new EvaluationError(e);
  }
}

module.exports = {
  evaluate,
};
