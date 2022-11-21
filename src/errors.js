/**
 * @param {*} baseError original error
 *
 * can switch on `type` ("SyntaxError", "TypeError", "ReferenceError", etc)
 *
 */
function EvaluationError(baseError) {
  this.name = "EvaluationError";
  this.message = `Unable to evaluate expression: ${baseError.message}`;
  this.type = baseError.name;
  this._baseError = baseError;
}

// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript/5251506#5251506
EvaluationError.prototype = new Error;

/**
 * @param {Function} formulaJSFunctionName function from formulajs lib (not using `formulaJSFunction.name` as it will likely be minified)
 * @param {Function} formulaJSFunction function from formulajs lib
 *
 * @return {Function} function which will throw error, rather than return string
 */
function wrapFormulaJSFunctionsWithErrorContext(formulaJSFunctionName, formulaJSFunction) {
  return function _wrappedFunction (...args) {

    const result = formulaJSFunction(...args);

    if (result instanceof Error) {
      // see list of errors:
      //  https://github.com/formulajs/formulajs/blob/master/src/utils/error.js
      const error = new Error();
      error.name = result.message;
      error.message = `${result.message} ${formulaJSFunctionName} ${JSON.stringify(args)}`;
      throw error;
    }
    return result;
  }
}

export { EvaluationError , wrapFormulaJSFunctionsWithErrorContext };
