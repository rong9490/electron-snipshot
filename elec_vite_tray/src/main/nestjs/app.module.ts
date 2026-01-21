/**
 * NestJS 根模块
 */

import { Module } from '@nestjs/common'
import { HealthModule } from './modules/health/health.module'

/**
 * 应用根模块
 * 所有功能模块都在这里注册
 */
@Module({
	imports: [HealthModule],
	controllers: [],
	providers: [],
	exports: [],
})
export class AppModule {}
