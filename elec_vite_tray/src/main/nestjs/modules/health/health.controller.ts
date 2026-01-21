/**
 * 健康检查控制器
 * 提供服务状态检查 API
 */

import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { HealthService } from './health.service'

/**
 * 健康状态响应 DTO
 */
class HealthStatusDto {
	@ApiProperty({ description: '服务状态', example: 'ok' })
	status!: string

	@ApiProperty({ description: '时间戳', example: '2024-01-21T10:00:00.000Z' })
	timestamp!: string

	@ApiProperty({ description: '服务运行时间(秒)', example: 123.45 })
	uptime!: number

	@ApiProperty({ description: '状态消息', example: 'NestJS service is running' })
	message!: string
}

/**
 * 系统信息响应 DTO
 */
class SystemInfoDto {
	@ApiProperty({ description: '平台', example: 'darwin' })
	platform!: string

	@ApiProperty({ description: '架构', example: 'arm64' })
	arch!: string

	@ApiProperty({ description: 'Node 版本', example: 'v18.17.0' })
	nodeVersion!: string

	@ApiProperty({ description: '运行时间(秒)', example: 123.45 })
	uptime!: number

	@ApiProperty({
		description: '内存信息',
		example: {
			total: 17179869184,
			free: 8589934592,
			usage: { rss: 134217728, heapTotal: 62914560 }
		}
	})
	memory!: Record<string, any>
}

/**
 * 服务信息响应 DTO
 */
class ServiceInfoDto {
	@ApiProperty({ description: '服务名称', example: 'elec_vite_tray' })
	name!: string

	@ApiProperty({ description: '服务版本', example: '1.0.0' })
	version!: string

	@ApiProperty({ description: '运行环境', example: 'development' })
	env!: string
}

/**
 * 详细信息响应 DTO
 */
class DetailedInfoDto {
	@ApiProperty({ description: '服务信息', type: ServiceInfoDto })
	service!: ServiceInfoDto

	@ApiProperty({ description: '系统信息', type: SystemInfoDto })
	system!: SystemInfoDto

	@ApiProperty({ description: '时间戳', example: '2024-01-21T10:00:00.000Z' })
	timestamp!: string
}

@ApiTags('健康检查')
@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	/**
	 * 健康检查端点
	 * GET /api/health
	 */
	@Get()
	@ApiOperation({ summary: '健康检查', description: '检查 NestJS 服务是否正常运行' })
	@ApiResponse({
		status: 200,
		description: '服务正常',
		type: HealthStatusDto
	})
	check(): HealthStatusDto {
		return this.healthService.getHealthStatus()
	}

	/**
	 * 详细信息端点
	 * GET /api/health/info
	 */
	@Get('info')
	@ApiOperation({ summary: '获取详细信息', description: '获取服务和系统的详细信息' })
	@ApiResponse({
		status: 200,
		description: '详细信息',
		type: DetailedInfoDto
	})
	getInfo(): DetailedInfoDto {
		return this.healthService.getDetailedInfo()
	}
}
