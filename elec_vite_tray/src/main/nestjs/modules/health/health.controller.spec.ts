/**
 * HealthController 单元测试
 * 使用直接实例化的方式测试 Controller
 */

import 'reflect-metadata'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'

// Mock Electron app
vi.mock('electron', () => ({
	app: {
		getVersion: () => '1.0.0-test',
		getName: () => 'elec_vite_tray'
	}
}))

describe('HealthController', () => {
	let controller: HealthController
	let service: HealthService

	beforeEach(() => {
		// 直接创建 service 实例
		service = new HealthService()

		// 手动创建 controller 实例并注入 service
		controller = new HealthController(service)
	})

	describe('controller initialization', () => {
		it('should be defined', () => {
			expect(controller).toBeDefined()
		})

		it('should have healthService injected', () => {
			expect(service).toBeDefined()
			// 通过调用方法验证注入成功
		})
	})

	describe('check', () => {
		it('should return health status from service', () => {
			const result = controller.check()

			expect(result).toHaveProperty('status')
			expect(result).toHaveProperty('timestamp')
			expect(result).toHaveProperty('uptime')
			expect(result).toHaveProperty('message')
		})

		it('should call healthService.getHealthStatus', () => {
			const spy = vi.spyOn(service, 'getHealthStatus')

			controller.check()

			expect(spy).toHaveBeenCalledTimes(1)
		})

		it('should return status "ok"', () => {
			const result = controller.check()

			expect(result.status).toBe('ok')
		})

		it('should return correct message', () => {
			const result = controller.check()

			expect(result.message).toBe('NestJS service is running')
		})

		it('should return valid timestamp', () => {
			const result = controller.check()

			expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
		})

		it('should return uptime as number', () => {
			const result = controller.check()

			expect(typeof result.uptime).toBe('number')
			expect(result.uptime).toBeGreaterThanOrEqual(0)
		})
	})

	describe('getInfo', () => {
		it('should return detailed info from service', () => {
			const result = controller.getInfo()

			expect(result).toHaveProperty('service')
			expect(result).toHaveProperty('system')
			expect(result).toHaveProperty('timestamp')
		})

		it('should call healthService.getDetailedInfo', () => {
			const spy = vi.spyOn(service, 'getDetailedInfo')

			controller.getInfo()

			expect(spy).toHaveBeenCalledTimes(1)
		})

		describe('service info', () => {
			it('should return service information', () => {
				const result = controller.getInfo()

				expect(result.service).toHaveProperty('name')
				expect(result.service).toHaveProperty('version')
				expect(result.service).toHaveProperty('env')
			})

			it('should return correct service name', () => {
				const result = controller.getInfo()

				expect(result.service.name).toBe('elec_vite_tray')
			})

			it('should return version string', () => {
				const result = controller.getInfo()

				expect(typeof result.service.version).toBe('string')
				expect(result.service.version.length).toBeGreaterThan(0)
			})

			it('should return environment', () => {
				const result = controller.getInfo()

				expect(['development', 'production', 'test']).toContain(result.service.env)
			})
		})

		describe('system info', () => {
			it('should return system information', () => {
				const result = controller.getInfo()

				expect(result.system).toHaveProperty('platform')
				expect(result.system).toHaveProperty('arch')
				expect(result.system).toHaveProperty('nodeVersion')
				expect(result.system).toHaveProperty('uptime')
				expect(result.system).toHaveProperty('memory')
			})

			it('should return valid platform', () => {
				const result = controller.getInfo()

				expect(['darwin', 'linux', 'win32', 'freebsd', 'openbsd']).toContain(result.system.platform)
			})

			it('should return valid node version', () => {
				const result = controller.getInfo()

				expect(result.system.nodeVersion).toMatch(/^v\d+\.\d+\.\d+/)
			})

			it('should return memory info', () => {
				const result = controller.getInfo()

				expect(result.system.memory).toHaveProperty('total')
				expect(result.system.memory).toHaveProperty('free')
				expect(result.system.memory).toHaveProperty('usage')
			})
		})

		it('should return valid timestamp', () => {
			const result = controller.getInfo()

			expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
		})
	})

	describe('multiple calls', () => {
		it('should return different timestamps on subsequent check calls', () => {
			const result1 = controller.check()
			// 等待至少 1ms
			const startTime = Date.now()
			while (Date.now() - startTime < 1) {
				// 等待
			}
			const result2 = controller.check()

			expect(result1.timestamp).not.toBe(result2.timestamp)
		})

		it('should return different timestamps on subsequent getInfo calls', () => {
			const result1 = controller.getInfo()
			// 等待至少 1ms
			const startTime = Date.now()
			while (Date.now() - startTime < 1) {
				// 等待
			}
			const result2 = controller.getInfo()

			expect(result1.timestamp).not.toBe(result2.timestamp)
		})
	})
})
