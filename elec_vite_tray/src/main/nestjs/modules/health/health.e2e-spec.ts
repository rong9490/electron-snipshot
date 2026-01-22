/**
 * HealthModule E2E 测试
 * 测试整个模块的集成和 HTTP 请求/响应
 */

import 'reflect-metadata'
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { HealthModule } from './health.module'

// Mock Electron app
vi.mock('electron', () => ({
	app: {
		getVersion: () => '1.0.0-test',
		getName: () => 'elec_vite_tray'
	}
}))

describe('HealthModule (e2e)', () => {
	let app: INestApplication
	let moduleRef: TestingModule

	beforeAll(async () => {
		// 创建测试模块
		moduleRef = await Test.createTestingModule({
			imports: [HealthModule]
		}).compile()

		// 创建应用
		app = moduleRef.createNestApplication()

		// 设置全局前缀
		app.setGlobalPrefix('api')

		// 初始化应用
		await app.init()
	})

	afterAll(async () => {
		// 关闭应用
		await app.close()
	})

	describe('/api/health (GET)', () => {
		it('should return health status', async () => {
			const response = await request(app.getHttpServer()).get('/api/health')

			expect(response.status).toBe(200)
			expect(response.body).toHaveProperty('status')
			expect(response.body).toHaveProperty('timestamp')
			expect(response.body).toHaveProperty('uptime')
			expect(response.body).toHaveProperty('message')
		})

		it('should return status "ok"', async () => {
			const response = await request(app.getHttpServer()).get('/api/health')

			expect(response.status).toBe(200)
			expect(response.body.status).toBe('ok')
		})

		it('should return correct message', async () => {
			const response = await request(app.getHttpServer()).get('/api/health')

			expect(response.status).toBe(200)
			expect(response.body.message).toBe('NestJS service is running')
		})

		it('should return valid timestamp', async () => {
			const response = await request(app.getHttpServer()).get('/api/health')

			expect(response.status).toBe(200)
			expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
		})

		it('should return uptime as number', async () => {
			const response = await request(app.getHttpServer()).get('/api/health')

			expect(response.status).toBe(200)
			expect(typeof response.body.uptime).toBe('number')
			expect(response.body.uptime).toBeGreaterThanOrEqual(0)
		})

		it('should return JSON content type', async () => {
			const response = await request(app.getHttpServer()).get('/api/health')

			expect(response.status).toBe(200)
			expect(response.headers['content-type']).toMatch(/json/)
		})
	})

	describe('/api/health/info (GET)', () => {
		it('should return detailed info', async () => {
			const response = await request(app.getHttpServer()).get('/api/health/info')

			expect(response.status).toBe(200)
			expect(response.body).toHaveProperty('service')
			expect(response.body).toHaveProperty('system')
			expect(response.body).toHaveProperty('timestamp')
		})

		describe('service info', () => {
			it('should return service information', async () => {
				const response = await request(app.getHttpServer()).get('/api/health/info')

				expect(response.status).toBe(200)
				expect(response.body.service).toHaveProperty('name')
				expect(response.body.service).toHaveProperty('version')
				expect(response.body.service).toHaveProperty('env')
			})

			it('should return correct service name', async () => {
				const response = await request(app.getHttpServer()).get('/api/health/info')

				expect(response.status).toBe(200)
				expect(response.body.service.name).toBe('elec_vite_tray')
			})

			it('should return version string', async () => {
				const response = await request(app.getHttpServer()).get('/api/health/info')

				expect(response.status).toBe(200)
				expect(typeof response.body.service.version).toBe('string')
				expect(response.body.service.version.length).toBeGreaterThan(0)
			})

			it('should return environment', async () => {
				const response = await request(app.getHttpServer()).get('/api/health/info')

				expect(response.status).toBe(200)
				expect(['development', 'production', 'test']).toContain(response.body.service.env)
			})
		})

		describe('system info', () => {
			it('should return system information', async () => {
				const response = await request(app.getHttpServer()).get('/api/health/info')

				expect(response.status).toBe(200)
				expect(response.body.system).toHaveProperty('platform')
				expect(response.body.system).toHaveProperty('arch')
				expect(response.body.system).toHaveProperty('nodeVersion')
				expect(response.body.system).toHaveProperty('uptime')
				expect(response.body.system).toHaveProperty('memory')
			})

			it('should return valid platform', async () => {
				const response = await request(app.getHttpServer()).get('/api/health/info')

				expect(response.status).toBe(200)
				expect(['darwin', 'linux', 'win32', 'freebsd', 'openbsd']).toContain(
					response.body.system.platform
				)
			})

			it('should return valid node version', async () => {
				const response = await request(app.getHttpServer()).get('/api/health/info')

				expect(response.status).toBe(200)
				expect(response.body.system.nodeVersion).toMatch(/^v\d+\.\d+\.\d+/)
			})

			it('should return memory information', async () => {
				const response = await request(app.getHttpServer()).get('/api/health/info')

				expect(response.status).toBe(200)
				expect(response.body.system.memory).toHaveProperty('total')
				expect(response.body.system.memory).toHaveProperty('free')
				expect(response.body.system.memory).toHaveProperty('usage')
			})

			it('should return positive total memory', async () => {
				const response = await request(app.getHttpServer()).get('/api/health/info')

				expect(response.status).toBe(200)
				expect(response.body.system.memory.total).toBeGreaterThan(0)
			})
		})

		it('should return valid timestamp', async () => {
			const response = await request(app.getHttpServer()).get('/api/health/info')

			expect(response.status).toBe(200)
			expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
		})

		it('should return JSON content type', async () => {
			const response = await request(app.getHttpServer()).get('/api/health/info')

			expect(response.status).toBe(200)
			expect(response.headers['content-type']).toMatch(/json/)
		})
	})

	describe('error handling', () => {
		it('should return 404 for non-existent routes', async () => {
			const response = await request(app.getHttpServer()).get('/api/health/non-existent')

			expect(response.status).toBe(404)
		})

		it('should return 404 for invalid endpoints', async () => {
			const response = await request(app.getHttpServer()).post('/api/health')

			expect(response.status).toBe(404)
		})
	})

	describe('response structure', () => {
		it('should have consistent response structure across multiple calls', async () => {
			const response1 = await request(app.getHttpServer()).get('/api/health')
			const response2 = await request(app.getHttpServer()).get('/api/health')

			expect(response1.status).toBe(200)
			expect(response2.status).toBe(200)
			expect(Object.keys(response1.body)).toEqual(Object.keys(response2.body))
			expect(response1.body.status).toEqual(response2.body.status)
			expect(response1.body.message).toEqual(response2.body.message)
		})

		it('should have different timestamps across multiple calls', async () => {
			const response1 = await request(app.getHttpServer()).get('/api/health')

			// 等待至少 1ms
			await new Promise((resolve) => setTimeout(resolve, 2))

			const response2 = await request(app.getHttpServer()).get('/api/health')

			expect(response1.status).toBe(200)
			expect(response2.status).toBe(200)
			expect(response1.body.timestamp).not.toBe(response2.body.timestamp)
		})
	})
})
