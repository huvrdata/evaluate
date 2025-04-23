/** rollup configuration file
 * This file is used to bundle the JavaScript files using Rollup
 * We are using plugin-node-resolve and plugin-commonjs to resolve and bundle the dependencies
 * Into a single distributable file (evaluate.js) in the dist folder
 */
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js", // Entry point of the application
  output: {
    file: "dist/evaluate.js", // Output file
    format: "umd", // Universal Module Definition format
    name: "evaluate", // Name of the global variable
  },
  plugins: [commonjs(), nodeResolve()], // Plugins to resolve and bundle dependencies
};
