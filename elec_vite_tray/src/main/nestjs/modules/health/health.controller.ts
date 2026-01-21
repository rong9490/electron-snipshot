/**
 * 健康检查控制器
 * 提供服务状态检查 API
 */

import { Controller, Get } from '@nestjs/common'
import { AppService } from './health.service'

@Controller('health')
export class HealthController {
	constructor(private readonly appService: AppService) {}

	/**
	 * 健康检查端点
	 * GET /api/health
	 */
	@Get()
	check() {
		return this.appService.getHealthStatus()
	}

	/**
	 * 详细信息端点
	 * GET /api/health/info
	 */
	@Get('info')
	getInfo() {
		return this.appService.getDetailedInfo()
	}
}
