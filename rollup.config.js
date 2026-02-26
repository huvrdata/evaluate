/** rollup configuration file
 * This file is used to bundle the JavaScript files using Rollup
 * We are using plugin-node-resolve and plugin-commonjs to resolve and bundle the dependencies
 * Into distributable files in the dist folder
 */
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js", // Entry point of the application
  output: [
    {
      file: "dist/evaluate.mjs", // ESM output
      format: "es",
    },
    {
      file: "dist/evaluate.cjs", // CommonJS output
      format: "cjs",
    },
    {
      file: "dist/evaluate.umd.js", // UMD output (browsers)
      format: "umd",
      name: "evaluate",
    },
  ],
  plugins: [commonjs(), nodeResolve()], // Plugins to resolve and bundle dependencies
};
