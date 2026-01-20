import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'

export default defineConfig({
	main: {},
	preload: {},
	// 考虑使用外部url界面
	renderer: {
		resolve: {
			alias: {
				'@renderer': resolve(__dirname, 'src/renderer/src')
			}
		},
		plugins: [react()]
	}
})
