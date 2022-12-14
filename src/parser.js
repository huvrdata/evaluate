import { create, all } from "mathjs";
const mathjs = create(all);

// limit parser capabilities to be more secure
//  https://mathjs.org/examples/advanced/more_secure_eval.js.html
const limitedParser = mathjs.parser;
mathjs.import({
  import: function () { throw new Error("undefined symbol import"); },
  createUnit: function () { throw new Error("undefined symbol createUnit"); },
  evaluate: function () { throw new Error("undefined symbol evaluate"); },
  parse: function () { throw new Error("undefined symbol parse"); },
  simplify: function () { throw new Error("undefined symbol simplify"); },
  derivative: function () { throw new Error("undefined symbol derivative"); }
}, { override: true })

/**
 * convenience func
 *
 * @param {Object} parser mathjs.parser
 * @param {Object} context
 */
function addContextToParser(parser, context) {
  if (!context) {
    return;
  }
  for (const [name, value] of Object.entries(context)) {
    parser.set(name, value);
  }
}

export { limitedParser, addContextToParser };
