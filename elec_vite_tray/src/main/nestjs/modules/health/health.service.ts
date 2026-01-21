/**
 * 健康检查服务
 */

import * as os from 'node:os'
import { Injectable } from '@nestjs/common'
import { app } from 'electron'

@Injectable()
export class HealthService {
	/**
	 * 获取健康状态
	 */
	getHealthStatus() {
		return {
			status: 'ok',
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			message: 'NestJS service is running'
		}
	}

	/**
	 * 获取详细信息
	 */
	getDetailedInfo() {
		return {
			service: {
				name: 'elec_vite_tray',
				version: app.getVersion(),
				env: process.env.NODE_ENV || 'development'
			},
			system: {
				platform: os.platform(),
				arch: os.arch(),
				nodeVersion: process.version,
				uptime: process.uptime(),
				memory: {
					total: os.totalmem(),
					free: os.freemem(),
					usage: process.memoryUsage()
				}
			},
			timestamp: new Date().toISOString()
		}
	}
}
