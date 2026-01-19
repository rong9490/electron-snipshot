import { join } from 'node:path'

/**
 * 获取资源文件路径
 * @param filename - 文件名
 * @returns 完整的文件路径
 */
export function getResourcePath(filename: string): string {
	// 在开发环境中，资源文件在项目根目录的 resources 文件夹
	// 在生产环境中，资源文件在可执行文件同级的 resources 文件夹
	if (process.env.NODE_ENV === 'development') {
		return join(process.cwd(), 'resources', filename)
	}
	return join(process.resourcesPath, filename)
}

/**
 * 判断是否为 macOS 平台
 * @returns 是否为 macOS
 */
export function isMacOS(): boolean {
	return process.platform === 'darwin'
}

/**
 * 判断是否为 Windows 平台
 * @returns 是否为 Windows
 */
export function isWindows(): boolean {
	return process.platform === 'win32'
}

/**
 * 判断是否为 Linux 平台
 * @returns 是否为 Linux
 */
export function isLinux(): boolean {
	return process.platform === 'linux'
}
