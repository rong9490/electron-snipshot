import { getResourcePath, isLinux, isMacOS, isWindows } from '../utils'

describe('Main Process Utils', () => {
	describe('getResourcePath', () => {
		const originalNodeEnv = process.env.NODE_ENV

		afterEach(() => {
			// 恢复原始环境变量
			process.env.NODE_ENV = originalNodeEnv
		})

		it('应该返回开发环境下的资源路径', () => {
			process.env.NODE_ENV = 'development'
			const result = getResourcePath('icon.png')
			expect(result).toMatch(/resources\/icon\.png$/)
			expect(result).toContain('resources')
		})

		it('应该包含正确的文件名', () => {
			process.env.NODE_ENV = 'development'
			const testFileName = 'test-file.json'
			const result = getResourcePath(testFileName)
			expect(result).toContain(testFileName)
			expect(result).toMatch(new RegExp(`${testFileName}$`))
		})

		it('应该处理不同类型的文件名', () => {
			process.env.NODE_ENV = 'development'
			const paths = ['icon.png', 'config.json', 'styles.css', 'script.js']

			paths.forEach((fileName) => {
				const result = getResourcePath(fileName)
				expect(result).toBeTruthy()
				expect(typeof result).toBe('string')
				expect(result).toContain(fileName)
			})
		})
	})

	describe('平台检测函数', () => {
		it('isMacOS 应该正确检测 macOS 平台', () => {
			const result = isMacOS()
			const expected = process.platform === 'darwin'
			expect(result).toBe(expected)
		})

		it('isWindows 应该正确检测 Windows 平台', () => {
			const result = isWindows()
			const expected = process.platform === 'win32'
			expect(result).toBe(expected)
		})

		it('isLinux 应该正确检测 Linux 平台', () => {
			const result = isLinux()
			const expected = process.platform === 'linux'
			expect(result).toBe(expected)
		})

		it('应该只有一个平台检测函数返回 true', () => {
			const results = [isMacOS(), isWindows(), isLinux()]
			const trueCount = results.filter((r) => r).length
			expect(trueCount).toBe(1)
		})

		it('平台检测函数应该返回布尔值', () => {
			expect(typeof isMacOS()).toBe('boolean')
			expect(typeof isWindows()).toBe('boolean')
			expect(typeof isLinux()).toBe('boolean')
		})
	})
})
