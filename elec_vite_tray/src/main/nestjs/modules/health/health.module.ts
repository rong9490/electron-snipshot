/**
 * 健康检查模块
 * 提供服务状态检查端点
 */

import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'

@Module({
	controllers: [HealthController],
	providers: [],
	exports: [],
})
export class HealthModule {}
