# `@huvrdata/evaluate`

Evaluate calculations using custom formulas - wrapping [mathjs](https://mathjs.org/docs) and [formulajs](https://formulajs.info)

"Safe" to run in browser, compared to the vanilla `eval` function, as it has no access to browser scope

Further reading: https://mathjs.org/examples/advanced/more_secure_eval.js.html

## Expression Syntax / Usage

`mathjs` Syntax is very similar to standard JavaScript with some caveats: https://mathjs.org/docs/expressions/syntax.html

All `formulajs` functions are available: https://formulajs.info/functions/

A few additional functions are available:

- `COALESCE`, return the first defined value ex: `var x; COALESCE(x, ""); // ""`

## Installation

```sh
npm install --save @huvrdata/evaluate
```

## Usage

```js
import { evaluate } from '@huvrdata/evaluate';

const expression = `IF(
    SUM($values.a, $values.b) > $values.c,
    COALESCE($values.success_message, "success"),
    COALESCE($values.failure_message, "failure"),
)`
const context = {
    $values: {
        a: 2,
        b: 4,
        c: 5,
        failure_message: "A + B < C",
        failure_message: "A + B > C",
    },
}

const message = evaluate(expression, context);  // "A + B > C"
```

### Extra `flattenContext` Convenience Util

to make nested values easier to manage, can flatten context prior to calling evaluate

```js
import { flattenContext, evaluate } from '@huvrdata/evaluate';

const expression = `
    SUM($values.a__b__c, $values.a__b__d)
`;

const context = {
    $values: flattenContext({
        a: {
            b: {
                c: 24,
                d: 24,
            },
        }
    }),
}

const message = evaluate(expression, context);  // `48`
```

## Contributing

requires `docker` to be installed

### Common commands found in `Makefile`

```sh
make build  # builds docker container
make test
make dist  # builds dist `js` files
make release  # must be logged in to npm, will start flow to choose tag, etc
```
