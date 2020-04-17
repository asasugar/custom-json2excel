import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "customJson2excel",
    minify: true
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    uglify()
  ]
};