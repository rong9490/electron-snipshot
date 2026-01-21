import path, { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		bail: 1,
		globals: true,
		environment: 'node',
		hookTimeout: 30 * 1000,
		testTimeout: 100 * 1000,
		setupFiles: [path.join(__dirname, './test/setup.vitest.ts')], // 预加载
		root: './',
		include: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx', '**/*.spec.ts'],
		exclude: ['**/node_modules', '**/dist', '**/out', '**/electron'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: ['**/node_modules/**', '**/dist/**', '**/out/**', '**/__tests__/**']
		}
	},
	resolve: {
		alias: {
			// 复用 electron.vite.config.ts 中的 alias 配置
			'@renderer': resolve(__dirname, 'src/renderer/src'),
			// 为 main 和 preload 进程添加 alias
			'@main': resolve(__dirname, 'src/main'),
			'@preload': resolve(__dirname, 'src/preload')
		}
	}
})
