import { uglify } from "rollup-plugin-uglify";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import path from 'path';
import packageJSON from './package.json';



const name = 'customJson2excel';

const extensions = [
  '.js',
  '.ts',
  '.tsx'
];

const getPath = _path => path.resolve(__dirname, _path);


export default {
  input: "src/index.ts",
  output: [
    {
      name,
      file: packageJSON.main, // commonjs模块 => Node.js上运行
      format: 'cjs',
      exports: 'auto'
    },
    {
      name,
      file: packageJSON.browser, // 通用模块 => 同时兼容 CJS 和 AMD，并且支持直接在前端用 <script src="lib.umd.js"></script> 
      format: 'umd',
      exports: "default",
    },
    {
      name,
      file: packageJSON.module, // es模块 => import / export支持动态加载，且支持浏览器直接通过 <script type="module"> 即可使用该写法
      format: "es",
    },
  ],
  plugins: [
    resolve(extensions),
    commonjs(),
    uglify(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: getPath('./tsconfig.json'),
      extensions
    })
  ]
};