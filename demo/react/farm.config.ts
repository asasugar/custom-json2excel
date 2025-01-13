import path from 'node:path';
import type { UserConfig } from '@farmfe/core';
import postcss from '@farmfe/js-plugin-postcss';
function defineConfig(config: UserConfig): UserConfig {
	return config;
}

export default defineConfig({
	compilation: {
		lazyCompilation: true, // 懒编译
		input: {
			index: './src/index.html'
		},
		output: {
			path: 'dist',
			publicPath: '/',
			targetEnv: 'browser'
		},
		resolve: {
			symlinks: true,
			alias: {
				'@': path.resolve('src')
			}
		},
		css: {
			prefixer: {
				targets: ['ie >= 10']
			}
		},
		script: {
			parser: {
				tsConfig: {
					decorators: true // 启用装饰器
				}
			}
		},
		persistentCache: false, // 增量构建
		minify: true // 压缩产物
	},
	server: {
		hmr: true,
		cors: true,
		proxy: {
			// ...
		},
		open: true
	},
	plugins: ['@farmfe/plugin-react', '@farmfe/plugin-sass', postcss()]
});
