
const { describe, it } = require('node:test');
const assert = require('node:assert').strict;

const { evaluate } = require("../src/index");


describe("evaluate", () => {

  function BASE_CONTEXT() {
    return {
      $values: {
        nums_1: {
          num_a: { value: 1 },
        },
        nums_b: {
          num_a: { value: 2 },
          num_b: { value: 3 },
        },
        dates_a: {
          date_a: { value: "1/1/2012" },
          date_b: { value: "1/1/2013" },
        }
      }
    };
  };

  it("should return sum of numbers as a number", () => {
    const expression = `SUM(
      $values.nums_1.num_a.value,
      $values.nums_b.num_a.value,
      $values.nums_b.num_b.value
    )`;

    assert.equal(evaluate(expression, BASE_CONTEXT()), 6);
  });

  it("should return string expressions", () => {
    const expression = `IF(
      $values.nums_1.num_a.value < $values.nums_b.num_a.value,
      "A IS LESS THAN B",
      "A IS GREATER THAN B"
    )`;

    assert.equal(evaluate(expression, BASE_CONTEXT()), "A IS LESS THAN B");
  });

  it("can use string concatenation along with functions", () => {
    const expression = `CONCATENATE("In 1 year are ", DAYS($values.dates_a.date_b.value, $values.dates_a.date_a.value) - 1, " days")`

    assert.equal(evaluate(expression, BASE_CONTEXT()), "In 1 year are 365 days");
  });

  it("should throw meaningful error message if values are not correct", () => {
    const expression = `CONCATENATE("In 1 year are ", DAYS($values.dates_a.date_b.value, $values.dates_a.date_a.value) - 1, " days")`

    const context = BASE_CONTEXT();
    context.$values.dates_a.date_a.value = "not a date"

    assert.throws(() => evaluate(expression, context), { name: "EvaluationError", message: /unexpected type of argument/i });
  });

  it("should throw meaningful error if invalid context lookup", () => {
    const expression = `SUM(
      $values.nums_1.num_a.value,
      $values.nums_b.num_a.value,
      $values.nums_b.num_b.value
    )`;

    const context = BASE_CONTEXT();
    context.$values.nums_1 = {};

    assert.throws(() => evaluate(expression, context), { name: "EvaluationError", message: /cannot read properties of undefined/i });
  });

  it("should throw meaningful error for syntax errors", () => {
    // (doesn't like trailing commas...)
    const expression = `SUM(
      $values.nums_1.num_a.value,
      $values.nums_b.num_a.value,
    )`;

    assert.throws(() => evaluate(expression, BASE_CONTEXT), { name: "EvaluationError", message: /value expected/i });
  });

  it("should not allow access to system functions", () => {
    const expression = `console.log(this)`;

    assert.throws(() => evaluate(expression, BASE_CONTEXT), { name: "EvaluationError", message: /undefined symbol console/i });
  });

  it("should not allow access to dangerous mathjs evaluation", () => {
    // see list of dangerous functions https://mathjs.org/examples/advanced/more_secure_eval.js.html
    const expression = `evaluate("24")`;

    assert.throws(() => evaluate(expression, BASE_CONTEXT), { name: "EvaluationError", message: /undefined symbol evaluate/i });
  });

});
