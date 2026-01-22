/**
 * HealthService 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HealthService } from './health.service'

// Mock Electron app
vi.mock('electron', () => ({
	app: {
		getVersion: () => '1.0.0-test',
		getName: () => 'elec_vite_tray'
	}
}))

describe('HealthService', () => {
	let service: HealthService

	beforeEach(() => {
		service = new HealthService()
	})

	describe('getHealthStatus', () => {
		it('should return health status with correct structure', () => {
			const result = service.getHealthStatus()

			expect(result).toHaveProperty('status')
			expect(result).toHaveProperty('timestamp')
			expect(result).toHaveProperty('uptime')
			expect(result).toHaveProperty('message')
		})

		it('should return status "ok"', () => {
			const result = service.getHealthStatus()

			expect(result.status).toBe('ok')
		})

		it('should return a valid ISO timestamp', () => {
			const result = service.getHealthStatus()

			expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
			expect(new Date(result.timestamp)).toBeInstanceOf(Date)
		})

		it('should return uptime as a number', () => {
			const result = service.getHealthStatus()

			expect(typeof result.uptime).toBe('number')
			expect(result.uptime).toBeGreaterThanOrEqual(0)
		})

		it('should return correct message', () => {
			const result = service.getHealthStatus()

			expect(result.message).toBe('NestJS service is running')
		})

		it('should return different timestamps on subsequent calls', () => {
			const result1 = service.getHealthStatus()
			// 等待至少 1ms
			const startTime = Date.now()
			while (Date.now() - startTime < 1) {
				// 等待
			}
			const result2 = service.getHealthStatus()

			expect(result1.timestamp).not.toBe(result2.timestamp)
		})
	})

	describe('getDetailedInfo', () => {
		it('should return detailed info with correct structure', () => {
			const result = service.getDetailedInfo()

			expect(result).toHaveProperty('service')
			expect(result).toHaveProperty('system')
			expect(result).toHaveProperty('timestamp')
		})

		describe('service info', () => {
			it('should return service information', () => {
				const result = service.getDetailedInfo()

				expect(result.service).toHaveProperty('name')
				expect(result.service).toHaveProperty('version')
				expect(result.service).toHaveProperty('env')
			})

			it('should return correct service name', () => {
				const result = service.getDetailedInfo()

				expect(result.service.name).toBe('elec_vite_tray')
			})

			it('should return version string', () => {
				const result = service.getDetailedInfo()

				expect(typeof result.service.version).toBe('string')
				expect(result.service.version.length).toBeGreaterThan(0)
			})

			it('should return environment', () => {
				const result = service.getDetailedInfo()

				expect(['development', 'production', 'test']).toContain(result.service.env)
			})
		})

		describe('system info', () => {
			it('should return system information', () => {
				const result = service.getDetailedInfo()

				expect(result.system).toHaveProperty('platform')
				expect(result.system).toHaveProperty('arch')
				expect(result.system).toHaveProperty('nodeVersion')
				expect(result.system).toHaveProperty('uptime')
				expect(result.system).toHaveProperty('memory')
			})

			it('should return valid platform', () => {
				const result = service.getDetailedInfo()

				expect(['darwin', 'linux', 'win32', 'freebsd', 'openbsd']).toContain(result.system.platform)
			})

			it('should return valid architecture', () => {
				const result = service.getDetailedInfo()

				expect(['x64', 'arm64', 'arm', 'ia32']).toContain(result.system.arch)
			})

			it('should return node version starting with v', () => {
				const result = service.getDetailedInfo()

				expect(result.system.nodeVersion).toMatch(/^v\d+\.\d+\.\d+/)
			})

			it('should return uptime as number', () => {
				const result = service.getDetailedInfo()

				expect(typeof result.system.uptime).toBe('number')
				expect(result.system.uptime).toBeGreaterThanOrEqual(0)
			})

			describe('memory info', () => {
				it('should return memory information', () => {
					const result = service.getDetailedInfo()

					expect(result.system.memory).toHaveProperty('total')
					expect(result.system.memory).toHaveProperty('free')
					expect(result.system.memory).toHaveProperty('usage')
				})

				it('should return total memory as number', () => {
					const result = service.getDetailedInfo()

					expect(typeof result.system.memory.total).toBe('number')
					expect(result.system.memory.total).toBeGreaterThan(0)
				})

				it('should return free memory as number', () => {
					const result = service.getDetailedInfo()

					expect(typeof result.system.memory.free).toBe('number')
					expect(result.system.memory.free).toBeGreaterThanOrEqual(0)
				})

				it('should return memory usage object', () => {
					const result = service.getDetailedInfo()

					expect(typeof result.system.memory.usage).toBe('object')
					expect(result.system.memory.usage).toHaveProperty('rss')
					expect(result.system.memory.usage).toHaveProperty('heapTotal')
				})

				it('should return valid rss and heapTotal values', () => {
					const result = service.getDetailedInfo()

					expect(typeof result.system.memory.usage.rss).toBe('number')
					expect(typeof result.system.memory.usage.heapTotal).toBe('number')
					expect(result.system.memory.usage.rss).toBeGreaterThan(0)
					expect(result.system.memory.usage.heapTotal).toBeGreaterThan(0)
				})
			})
		})

		it('should return valid timestamp', () => {
			const result = service.getDetailedInfo()

			expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
			expect(new Date(result.timestamp)).toBeInstanceOf(Date)
		})
	})
})
