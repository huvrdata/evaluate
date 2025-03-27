import { describe, it } from "node:test";
import assert from "node:assert";

import { evaluate, flattenContext } from "../src/index.js";

// let evaluate;
if (process.env.USE_DIST) {
  evaluate = (await import("../dist/evaluate.js")).evaluate;
  flattenContext = (await import("../dist/evaluate.js")).flattenContext;
}


describe("evaluate", async () => {

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

  it("should trim whitespace and not treat newline as array", () => {
    const expression = `1
    `;

    assert.equal(evaluate(expression), 1);
  });

  it("can use string concatenation along with functions", () => {
    const expression = `CONCATENATE("In 1 year are ", DAYS($values.dates_a.date_b.value, $values.dates_a.date_a.value) - 1, " days")`

    assert.equal(evaluate(expression, BASE_CONTEXT()), "In 1 year are 365 days");
  });

  it("should throw meaningful error message if values are not correct", () => {
    const expression = `CONCATENATE("In 1 year are ", DAYS($values.dates_a.date_b.value, $values.dates_a.date_a.value) - 1, " days")`

    const context = BASE_CONTEXT();
    context.$values.dates_a.date_a.value = "not a date"

    assert.throws(() =>  evaluate(expression, context), { name: "EvaluationError", message: /VALUE.*DAYS/i });
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

  it("should have access to custom functions - COALESCE", () => {

    const expression = "COALESCE($values.a, '')";
    const context = { $values: {} };

    assert.equal(evaluate(expression, context), '');
  });
});


describe("flattenContext", () => {
  it("should flatten up to 3 levels", () => {
    const context = {
      a0: {
        b0: {
          c0: 24,
          c1: 25,
        },
        b1: {
          c2: {
            d: 24, // will not flatten
          },
          c3: 25,
        },
      },
      a1: {
        b2: {
          c4: 24,
          c5: 25,
        },
        b3: {
          c6: 24,
          c7: 25,
        },
      }
    }

    assert.deepEqual(
      flattenContext(context),
      {
        a0__b0__c0: 24,
        a0__b0__c1: 25,
        a0__b1__c2: { d: 24 },
        a0__b1__c3: 25,
        a1__b2__c4: 24,
        a1__b2__c5: 25,
        a1__b3__c6: 24,
        a1__b3__c7: 25,
      },
    )
  });
  it("should transform keys", () => {
    const context = {
      "a-0": {
        "b-0": {
          "c-0": 24,
          "c-1": 25,
        },
        "b-1": {
          "c-2": 24,
          "c-3": 25,
        },
      },
    }

    assert.deepEqual(
      flattenContext(context),
      {
        a_0__b_0__c_0: 24,
        a_0__b_0__c_1: 25,
        a_0__b_1__c_2: 24,
        a_0__b_1__c_3: 25,
      },
    )
  });
});

describe("badge", () => {
  it("should return the length of an array or string", () => {
    const expression = `BADGE($var)`;
    const context = {$var: [100]};
    assert.equal(evaluate(expression, context), "1");
    const context2 = {$var: [1,2,3]};
    assert.equal(evaluate(expression, context2), "3");
    const context3 = {$var: 'hello'};
    assert.equal(evaluate(expression, context3), "5");
    const context4 = {$var: {"a": "1", "b": "2"}};
    assert.equal(evaluate(expression, context4), "");
  });
  it("should return 0 if the value is not an array or is empty or undefined", () => {
    const expression = `BADGE($var)`;
    const context = {$var: []};
    assert.equal(evaluate(expression, context), "");
    const context2 = {$var: undefined};
    assert.equal(evaluate(expression, context2), "");
    const context3 = {$var: 1};
    assert.equal(evaluate(expression, context3), "");
  });
  it("should return the length of an array, which is populated with objects", () => {
    const expression = `BADGE($local.add_media__media)`;
    const context = {
      $local: {
        add_media__media: [
          { id: 1, name: "a" },
          { id: 2, name: { abc: 1 }},
        ]
      }
    };
    assert.equal(evaluate(expression, context), "2");
  });
  it("should include the given prefix/postfix when provided", () => {
    const expression = `BADGE($var,'count:[',']')`;
    const context = {$var: [100]};
    assert.equal(evaluate(expression, context), "count:[1]");
  });
});
