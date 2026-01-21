/**
 * NestJS 应用入口
 * 在 Electron 主进程中启动 NestJS 服务
 */

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { getServerConfig } from './config/server.config'

let nestApp: Awaited<ReturnType<typeof createNestApp>> | null = null

/**
 * 创建并启动 NestJS 应用
 */
export async function createNestApp() {
	const logger = new Logger('NestJSBootstrap')
	const config = getServerConfig()

	logger.log(`🚀 Starting NestJS in ${config.environment} mode...`)

	try {
		// 创建 NestJS 应用
		const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
			logger: config.logLevel as any,
			// 禁用自动 CORS，我们手动配置
			cors: false
		})

		// 手动配置 CORS
		if (config.cors.origin) {
			app.enableCors({
				origin: config.cors.origin,
				credentials: config.cors.credentials
			})
			logger.log(`✅ CORS enabled for origins: ${config.cors.origin}`)
		}

		// 设置全局前缀
		app.setGlobalPrefix('api')
		logger.log('📍 Global prefix: /api')

		// 启动服务器
		await app.listen(config.port, config.host)

		const url = `http://${config.host}:${config.port}`

		// 配置 Swagger 文档
		if (config.environment === 'development') {
			const configSwagger = new DocumentBuilder()
				.setTitle('Elec Vite Tray API')
				.setDescription('Electron 托盘应用的 REST API 文档')
				.setVersion('1.0')
				.addTag('health', '健康检查接口')
				.addTag('config', '配置管理接口')
				.addTag('state', '状态管理接口')
				.addTag('tasks', '任务管理接口')
				.build()

			const document = SwaggerModule.createDocument(app, configSwagger)
			SwaggerModule.setup('api/docs', app, document)

			logger.log(`📚 Swagger Documentation: ${url}/api/docs`)
		}

		logger.log(`✅ NestJS is running on ${url}`)
		logger.log(`📚 API Base URL: ${url}/api`)

		return app
	} catch (error) {
		logger.error('❌ Failed to start NestJS', error)
		throw error
	}
}

/**
 * 启动 NestJS 应用
 */
export async function bootstrapNestJS() {
	if (nestApp) {
		console.warn('[NestJS] Already running, skipping startup')
		return nestApp
	}

	nestApp = await createNestApp()
	return nestApp
}

/**
 * 关闭 NestJS 应用
 */
export async function shutdownNestJS() {
	if (!nestApp) {
		console.warn('[NestJS] Not running, nothing to shutdown')
		return
	}

	const logger = new Logger('NestJSBootstrap')
	logger.log('🛑 Shutting down NestJS...')

	try {
		await nestApp.close()
		nestApp = null
		logger.log('✅ NestJS shut down successfully')
	} catch (error) {
		logger.error('❌ Error shutting down NestJS', error)
		throw error
	}
}

/**
 * 检查 NestJS 是否正在运行
 */
export function isNestJSRunning(): boolean {
	return nestApp !== null
}
