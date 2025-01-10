import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
    tsconfigPath: './tsconfig.json',
  },
  output: {
    cleanDistPath: true,
    target:'web',
    distPath: {
      root: 'lib'
    },
    minify: true,
    sourceMap: false,
  },
  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.tsx'
    ]
  },
  lib: [
    // CommonJS 是一种在 JavaScript 中使用的模块系统，特别是在像 Node.js 这样的服务器端环境中。它的诞生是为了通过提供一种管理模块和依赖项的方法，允许 JavaScript 在浏览器之外使用
    {
      format: 'cjs',
      autoExtension: false,
      output: {
        filename: {
          js: '[name].cjs.js',
        },
      },
    },
    // ESM 是一种在 ES2015 中引入的现代模块系统，允许将 JavaScript 代码组织成可重用的、自包含的模块。ESM 现在是 浏览器 和 Node.js 环境的标准，取代了旧的模块系统，如 CommonJS (CJS) 和 AMD。
    {
      format: 'esm',
      autoExtension: false,
      dts: true,
      output: {
        filename: {
          js: '[name].esm.js',
        },
      },
    },
    // UMD 代表 通用模块定义，这是一种编写 JavaScript 模块的模式，可以在不同的环境中通用，例如浏览器和 Node.js。其主要目标是确保与最流行的模块系统兼容，包括 AMD（异步模块定义）、CommonJS（CJS）和浏览器全局变量
    {
      format: 'umd',
      umdName: 'CustomJson2excel',
      autoExtension: false,
      output: {
        filename: {
          js: '[name].umd.js',
        },
      },
    },
  ],
});