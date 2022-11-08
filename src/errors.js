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

module.exports = { EvaluationError };
