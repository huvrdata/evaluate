import * as formulajs from "@formulajs/formulajs";
import { EvaluationError, wrapFormulaJSFunctionsWithErrorContext } from "./errors.js";
import { limitedParser, addContextToParser } from "./parser.js";
import * as customFunctions from "./functions.js";
import { flattenContext } from "./utils.js";


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
 * @param {Object=} options { debug: false }
 *
 * @throws {EvaluationError} if expression could not be evaluated
 *
 * @return {*} number/string/etc
 *
 */
function evaluate(expression, context={}, options={}) {
  const { debug } = options || {};

  // https://mathjs.org/docs/expressions/parsing.html#parser
  const parser = limitedParser();

  for (const [name, func] of Object.entries(formulajs)) {
    parser.set(name, wrapFormulaJSFunctionsWithErrorContext(name, func));
  }
  addContextToParser(parser, customFunctions);
  addContextToParser(parser, context);

  try {
    return parser.evaluate(expression.trim());
  } catch (e) {
    if (debug) {
      console.debug(e);
    }
    throw new EvaluationError(e);
  }
}

export {
  evaluate,
  flattenContext,  // convenience util function
  EvaluationError,
};
