/**
 * NestJS 测试工具函数
 * 提供创建测试模块的辅助方法
 */

import { Test, TestingModule } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'

/**
 * 创建测试应用
 * 用于集成测试和 e2e 测试
 */
export async function createTestingModule(
	imports: any[] = [],
	providers: any[] = [],
	controllers: any[] = []
): Promise<TestingModule> {
	return Test.createTestingModule({
		imports,
		providers,
		controllers
	}).compile()
}

/**
 * 创建并初始化 Nest 应用
 * 用于 e2e 测试
 */
export async function createNestApp(module: TestingModule): Promise<INestApplication> {
	const app = module.createNestApplication()

	// 应用全局配置
	app.setGlobalPrefix('api')

	await app.init()

	return app
}

/**
 * 关闭测试应用
 */
export async function closeNestApp(app: INestApplication): Promise<void> {
	await app.close()
}

/**
 * Mock Electron app 对象
 */
export const mockElectronApp = {
	getVersion: () => '1.0.0-test',
	getName: () => 'elec_vite_tray'
}

/**
 * 设置测试环境变量
 */
export function setupTestEnv() {
	process.env.NODE_ENV = 'test'
	process.env.PX_NODE_ENV = 'testing'
}
