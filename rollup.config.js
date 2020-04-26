import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";
import typescript from 'rollup-plugin-typescript2';

export default {
  input: "src/index.ts",
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
    uglify(),
    typescript(/*{ plugin options }*/)
  ]
};