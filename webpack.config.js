import path from "path";
import { fileURLToPath } from "url";

// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
  https://webpack.js.org/guides/getting-started/#using-a-configuration

*/
export default {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "evaluate.js",
    library: {
      // name: "@huvrdata/evaluate",
      type: "umd",
    }
  },
};
