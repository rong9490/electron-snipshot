/**
 * NotificationManager 单元测试
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EventBus } from '../modules/EventBus'
import { NotificationManager } from '../modules/NotificationManager'
import { AppEvents } from '../types'

// Mock Electron Notification
const mockNotification = {
	show: vi.fn(),
	on: vi.fn(),
	close: vi.fn()
}

vi.mock('electron', () => ({
	Notification: vi.fn().mockImplementation(() => mockNotification),
	app: {
		getName: vi.fn(() => 'TestApp')
	}
}))

describe('NotificationManager', () => {
	let notificationManager: NotificationManager
	let eventBus: EventBus
	let configManager: any

	beforeEach(() => {
		eventBus = new EventBus()

		// Mock ConfigManager
		configManager = {
			get: vi.fn((key: string) => {
				if (key === 'enableNotification') return true
				return undefined
			})
		}

		notificationManager = new NotificationManager(eventBus, configManager)
	})

	afterEach(() => {
		notificationManager.destroy()
		eventBus.destroy()
	})

	describe('基本通知功能', () => {
		it('应该能够显示通知', () => {
			const { Notification } = require('electron')

			const result = notificationManager.show({
				title: '测试通知',
				body: '这是一条测试通知'
			})

			expect(result).toBe(true)
			expect(Notification).toHaveBeenCalled()
			expect(mockNotification.show).toHaveBeenCalled()
		})

		it('应该调用 show 方法', () => {
			notificationManager.show({
				title: '测试',
				body: '内容'
			})

			expect(mockNotification.show).toHaveBeenCalledTimes(1)
		})

		it('应该支持不同的通知类型', () => {
			const { Notification } = require('electron')
			const types = ['info', 'warning', 'error', 'success'] as const

			types.forEach((type) => {
				Notification.mockClear()
				mockNotification.show.mockClear()

				notificationManager.show({
					title: `${type} 通知`,
					body: `这是一条 ${type} 通知`,
					type
				})

				expect(Notification).toHaveBeenCalled()
			})
		})

		it('通知被禁用时不应该显示', () => {
			configManager.get = vi.fn((key: string) => {
				if (key === 'enableNotification') return false
				return undefined
			})

			const result = notificationManager.show({
				title: '测试',
				body: '内容'
			})

			expect(result).toBe(false)
			expect(mockNotification.show).not.toHaveBeenCalled()
		})
	})

	describe('频率限制', () => {
		it('应该限制频繁的通知', () => {
			const result1 = notificationManager.show({
				title: '通知1',
				body: '内容1'
			})

			const result2 = notificationManager.show({
				title: '通知2',
				body: '内容2'
			})

			expect(result1).toBe(true)
			expect(result2).toBe(false) // 被限流
		})

		it('应该能够设置最小通知间隔', () => {
			notificationManager.setMinInterval(100)

			expect(notificationManager.getMinInterval()).toBe(100)
		})

		it('应该记录最后通知时间', () => {
			notificationManager.show({
				title: '测试',
				body: '内容'
			})

			const now = Date.now()
			// 时间应该在合理范围内
			expect(notificationManager['lastNotificationTime']).toBeLessThanOrEqual(now)
			expect(notificationManager['lastNotificationTime']).toBeGreaterThan(now - 1000)
		})
	})

	describe('通知历史', () => {
		it('应该记录通知到历史', () => {
			notificationManager.show({
				title: '测试通知',
				body: '测试内容'
			})

			const history = notificationManager.getHistory()

			expect(history).toHaveLength(1)
			expect(history[0].title).toBe('测试通知')
			expect(history[0].body).toBe('测试内容')
		})

		it('应该记录通知类型', () => {
			notificationManager.show({
				title: '错误通知',
				body: '错误内容',
				type: 'error'
			})

			const history = notificationManager.getHistory()
			expect(history[0].type).toBe('error')
		})

		it('应该记录通知时间戳', () => {
			const beforeShow = Date.now()

			notificationManager.show({
				title: '测试',
				body: '内容'
			})

			const afterShow = Date.now()
			const history = notificationManager.getHistory()

			expect(history[0].timestamp).toBeGreaterThanOrEqual(beforeShow)
			expect(history[0].timestamp).toBeLessThanOrEqual(afterShow)
		})

		it('应该限制历史记录大小', () => {
			const manager = new NotificationManager(eventBus, configManager)

			// 设置较小的历史大小
			manager['maxHistorySize'] = 5

			// 发送10条通知
			for (let i = 0; i < 10; i++) {
				manager.show({
					title: `通知${i}`,
					body: `内容${i}`
				})
			}

			const history = manager.getHistory()
			expect(history.length).toBeLessThanOrEqual(5)

			manager.destroy()
		})

		it('应该能够清空历史', () => {
			notificationManager.show({
				title: '测试',
				body: '内容'
			})

			notificationManager.clearHistory()
			const history = notificationManager.getHistory()

			expect(history).toHaveLength(0)
		})

		it('应该能够获取最近的通知', () => {
			// 发送3条通知
			for (let i = 0; i < 3; i++) {
				notificationManager.show({
					title: `通知${i}`,
					body: `内容${i}`
				})
			}

			const recent = notificationManager.getRecent(2)

			expect(recent).toHaveLength(2)
			expect(recent[0].title).toBe('通知2') // 最新的
			expect(recent[1].title).toBe('通知1')
		})

		it('应该能够按类型筛选通知', () => {
			notificationManager.show({ title: '错误', body: '内容', type: 'error' })
			notificationManager.show({ title: '信息', body: '内容', type: 'info' })
			notificationManager.show({ title: '警告', body: '内容', type: 'warning' })

			const errors = notificationManager.getByType('error')
			const infos = notificationManager.getByType('info')

			expect(errors).toHaveLength(1)
			expect(infos).toHaveLength(1)
		})

		it('应该能够删除指定时间之前的历史', () => {
			const now = Date.now()

			notificationManager.show({ title: '旧通知', body: '内容' })

			// 修改历史记录的时间戳
			const history = notificationManager['notificationHistory']
			history[0].timestamp = now - 10000

			notificationManager.show({ title: '新通知', body: '内容' })

			notificationManager.deleteHistoryBefore(now - 5000)

			const currentHistory = notificationManager.getHistory()
			expect(currentHistory).toHaveLength(1)
			expect(currentHistory[0].title).toBe('新通知')
		})
	})

	describe('通知统计', () => {
		beforeEach(() => {
			notificationManager.show({ title: '通知1', body: '内容1', type: 'info' })
			notificationManager.show({ title: '通知2', body: '内容2', type: 'error' })
			notificationManager.show({ title: '通知3', body: '内容3', type: 'info' })
		})

		it('应该能够获取统计信息', () => {
			const stats = notificationManager.getStats()

			expect(stats.total).toBe(3)
			expect(stats.clicked).toBe(0)
			expect(stats.byType.info).toBe(2)
			expect(stats.byType.error).toBe(1)
		})
	})

	describe('通知点击', () => {
		it('应该处理通知点击事件', () => {
			const clickMock = vi.fn()

			notificationManager.show({
				title: '测试',
				body: '内容',
				onClick: clickMock
			})

			// 模拟点击事件
			const clickCall = mockNotification.on.mock.calls.find((call) => call[0] === 'click')
			const clickCallback = clickCall?.[1]

			if (clickCallback) {
				clickCallback()
			}

			expect(clickMock).toHaveBeenCalled()
		})

		it('点击后应该更新历史记录', () => {
			notificationManager.show({
				title: '测试',
				body: '内容'
			})

			// 模拟点击
			const clickCall = mockNotification.on.mock.calls.find((call) => call[0] === 'click')
			const clickCallback = clickCall?.[1]

			if (clickCallback) {
				clickCallback()
			}

			const history = notificationManager.getHistory()
			expect(history[0].clicked).toBe(true)
		})

		it('点击时应该发出事件', () => {
			const eventMock = vi.fn()
			eventBus.on(AppEvents.NOTIFICATION_CLICK, eventMock)

			notificationManager.show({
				title: '测试',
				body: '内容'
			})

			// 模拟点击
			const clickCall = mockNotification.on.mock.calls.find((call) => call[0] === 'click')
			const clickCallback = clickCall?.[1]

			if (clickCallback) {
				clickCallback()
			}

			expect(eventMock).toHaveBeenCalled()
		})
	})

	describe('批量通知', () => {
		it('应该支持批量发送通知', async () => {
			const notifications = [
				{ title: '通知1', body: '内容1' },
				{ title: '通知2', body: '内容2' },
				{ title: '通知3', body: '内容3' }
			]

			// 设置较短的间隔
			notificationManager.setMinInterval(100)

			const successCount = await notificationManager.showBatch(notifications, 50)

			expect(successCount).toBe(3)
		})

		it('批量发送应该支持延迟', async () => {
			const startTime = Date.now()

			await notificationManager.showBatch(
				[
					{ title: '通知1', body: '内容1' },
					{ title: '通知2', body: '内容2' }
				],
				100
			)

			const elapsed = Date.now() - startTime

			// 应该至少有100ms的延迟
			expect(elapsed).toBeGreaterThanOrEqual(100)
		})
	})

	describe('事件监听', () => {
		it('应该监听通知显示事件', () => {
			const { Notification } = require('electron')

			eventBus.emit(AppEvents.NOTIFICATION_SHOW, {
				title: '事件通知',
				body: '通过事件触发'
			})

			expect(Notification).toHaveBeenCalled()
		})
	})

	describe('静态方法', () => {
		it('应该能够检查通知权限', async () => {
			const hasPermission = await NotificationManager.checkPermission()
			expect(typeof hasPermission).toBe('boolean')
		})

		it('应该能够请求通知权限', async () => {
			const granted = await NotificationManager.requestPermission()
			expect(typeof granted).toBe('boolean')
		})
	})

	describe('生命周期管理', () => {
		it('应该能够销毁通知管理器', () => {
			notificationManager.destroy()
			expect(notificationManager.isDestroyed()).toBe(true)
		})

		it('销毁后应该清空历史', () => {
			notificationManager.show({ title: '测试', body: '内容' })
			notificationManager.destroy()

			expect(notificationManager.getHistory()).toHaveLength(0)
		})

		it('销毁后不应该显示通知', () => {
			notificationManager.destroy()

			const result = notificationManager.show({
				title: '测试',
				body: '内容'
			})

			expect(result).toBe(false)
		})

		it('销毁后应该允许重复调用 destroy', () => {
			expect(() => {
				notificationManager.destroy()
				notificationManager.destroy()
				notificationManager.destroy()
			}).not.toThrow()
		})
	})

	describe('错误处理', () => {
		it('应该处理通知创建失败', () => {
			const { Notification } = require('electron')
			Notification.mockImplementationOnce(() => {
				throw new Error('Notification failed')
			})

			const result = notificationManager.show({
				title: '测试',
				body: '内容'
			})

			expect(result).toBe(false)
		})
	})
})
