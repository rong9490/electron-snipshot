/**
 * NestJS 根模块
 */

import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { HealthModule } from './modules/health/health.module'

/**
 * 应用根模块
 * 所有功能模块都在这里注册
 */
@Module({
	imports: [
		// 静态文件服务 - 提供 Next.js 构建的 panel 页面
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '../../../dist_panel'),
			serveRoot: '/panel',
			exclude: ['/api*']
		}),
		HealthModule
	],
	controllers: [],
	providers: [],
	exports: []
})
export class AppModule {}
