/**
 * NestJS 根模块
 */

import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { HealthModule } from './modules/health/health.module'
import { LoggerModule } from './modules/logger/logger.module'
import { LoggingInterceptor, AllExceptionsFilter } from './common'

/**
 * 应用根模块
 * 所有功能模块都在这里注册
 */
@Module({
	imports: [
		// 日志模块（全局）
		LoggerModule,

		// 静态文件服务 - 提供 Next.js 构建的 panel 页面
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '../../../dist_panel'),
			serveRoot: '/panel',
			exclude: ['/api*']
		}),
		HealthModule
	],
	controllers: [],
	providers: [
		// 全局请求日志拦截器
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor
		},
		// 全局异常过滤器
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter
		}
	],
	exports: []
})
export class AppModule {}
