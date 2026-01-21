/**
 * StateManager 单元测试
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EventBus } from '../modules/EventBus'
import { StateManager } from '../modules/StateManager'
import { AppEvents } from '../types'

// Mock ConfigManager
const mockConfigManager = {
	get: vi.fn((key: string) => {
		const defaults: any = {
			checkInterval: 60000,
			enableNotification: true
		}
		return defaults[key]
	}),
	set: vi.fn(),
	getAll: vi.fn(() => ({
		checkInterval: 60000,
		enableNotification: true
	}))
}

describe('StateManager', () => {
	let stateManager: StateManager
	let eventBus: EventBus
	let configManager: any

	beforeEach(() => {
		eventBus = new EventBus()
		configManager = mockConfigManager as any
		stateManager = new StateManager(eventBus, configManager)
	})

	afterEach(() => {
		stateManager.destroy()
		eventBus.destroy()
	})

	describe('基本状态操作', () => {
		it('应该返回初始默认状态', () => {
			const state = stateManager.getState()
			expect(state).toHaveProperty('unreadCount', 0)
			expect(state).toHaveProperty('tasks', [])
			expect(state).toHaveProperty('isMonitoring', false)
		})

		it('应该能够获取状态', () => {
			expect(stateManager.get('unreadCount')).toBe(0)
			expect(stateManager.get('tasks')).toEqual([])
		})

		it('应该能够设置状态', () => {
			stateManager.setState({ unreadCount: 5 })
			expect(stateManager.get('unreadCount')).toBe(5)
		})

		it('应该能够设置部分状态', () => {
			stateManager.setState({
				unreadCount: 10,
				isMonitoring: true
			})

			expect(stateManager.get('unreadCount')).toBe(10)
			expect(stateManager.get('isMonitoring')).toBe(true)
		})

		it('应该在状态变更时发出事件', () => {
			const mock = vi.fn()
			eventBus.on(AppEvents.STATE_CHANGED, mock)

			stateManager.setState({ unreadCount: 5 })

			expect(mock).toHaveBeenCalled()
			const { old: oldState, new: newState } = mock.mock.calls[0][0]
			expect(oldState.unreadCount).toBe(0)
			expect(newState.unreadCount).toBe(5)
		})
	})

	describe('未读消息管理', () => {
		it('应该能够设置未读数', () => {
			stateManager.setUnreadCount(7)
			expect(stateManager.get('unreadCount')).toBe(7)
		})

		it('应该能够增加未读数', () => {
			stateManager.setUnreadCount(5)
			stateManager.incrementUnreadCount()
			expect(stateManager.get('unreadCount')).toBe(6)

			stateManager.incrementUnreadCount(3)
			expect(stateManager.get('unreadCount')).toBe(9)
		})

		it('应该能够清空未读数', () => {
			stateManager.setUnreadCount(10)
			stateManager.clearUnreadCount()
			expect(stateManager.get('unreadCount')).toBe(0)
		})

		it('应该在未读数变化时发出特定事件', () => {
			const mock = vi.fn()
			eventBus.on(AppEvents.UNREAD_COUNT_CHANGED, mock)

			stateManager.setUnreadCount(5)

			expect(mock).toHaveBeenCalled()
			const { old, new: newCount } = mock.mock.calls[0][0]
			expect(old).toBe(0)
			expect(newCount).toBe(5)
		})
	})

	describe('任务管理', () => {
		it('应该能够添加任务', () => {
			const task = {
				id: '1',
				name: 'Test Task',
				status: 'running' as const
			}

			stateManager.addTask(task)

			const tasks = stateManager.get('tasks')
			expect(tasks).toHaveLength(1)
			expect(tasks[0]).toEqual(task)
		})

		it('添加任务时应该发出状态变化事件', () => {
			const stateChangeMock = vi.fn()
			const taskStatusMock = vi.fn()

			eventBus.on(AppEvents.STATE_CHANGED, stateChangeMock)
			eventBus.on(AppEvents.TASK_STATUS_CHANGED, taskStatusMock)

			const task = {
				id: '1',
				name: 'Test Task',
				status: 'running' as const
			}

			stateManager.addTask(task)

			expect(stateChangeMock).toHaveBeenCalled()
			expect(taskStatusMock).toHaveBeenCalledWith({
				taskId: '1',
				status: 'running'
			})
		})

		it('应该能够更新任务', () => {
			const task = {
				id: '1',
				name: 'Test Task',
				status: 'running' as const
			}

			stateManager.addTask(task)
			stateManager.updateTask('1', { status: 'completed' })

			const tasks = stateManager.get('tasks')
			expect(tasks[0].status).toBe('completed')
		})

		it('更新任务状态时应该发出事件', () => {
			const mock = vi.fn()
			eventBus.on(AppEvents.TASK_STATUS_CHANGED, mock)

			const task = {
				id: '1',
				name: 'Test Task',
				status: 'running' as const
			}

			stateManager.addTask(task)
			stateManager.updateTask('1', { status: 'completed' })

			expect(mock).toHaveBeenCalledTimes(2) // 添加和更新各一次
		})

		it('应该能够移除任务', () => {
			const task = {
				id: '1',
				name: 'Test Task',
				status: 'running' as const
			}

			stateManager.addTask(task)
			stateManager.removeTask('1')

			const tasks = stateManager.get('tasks')
			expect(tasks).toHaveLength(0)
		})

		it('应该能够清空所有任务', () => {
			stateManager.addTask({ id: '1', name: 'Task 1', status: 'running' })
			stateManager.addTask({ id: '2', name: 'Task 2', status: 'completed' })

			stateManager.clearTasks()

			const tasks = stateManager.get('tasks')
			expect(tasks).toHaveLength(0)
		})

		it('应该能够按状态筛选任务', () => {
			stateManager.addTask({ id: '1', name: 'Task 1', status: 'running' })
			stateManager.addTask({ id: '2', name: 'Task 2', status: 'completed' })
			stateManager.addTask({ id: '3', name: 'Task 3', status: 'running' })

			const runningTasks = stateManager.getTasksByStatus('running')
			const completedTasks = stateManager.getTasksByStatus('completed')

			expect(runningTasks).toHaveLength(2)
			expect(completedTasks).toHaveLength(1)
		})
	})

	describe('定时检查', () => {
		beforeEach(() => {
			vi.useFakeTimers()
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('应该能够启动定时检查', () => {
			stateManager.startChecking(1000)
			expect(stateManager.isChecking()).toBe(true)
		})

		it('启动后应该更新监控状态', () => {
			stateManager.startChecking(1000)
			expect(stateManager.get('isMonitoring')).toBe(true)
		})

		it('应该能够停止定时检查', () => {
			stateManager.startChecking(1000)
			stateManager.stopChecking()

			expect(stateManager.isChecking()).toBe(false)
			expect(stateManager.get('isMonitoring')).toBe(false)
		})

		it('停止检查应该清除定时器', () => {
			const startSpy = vi.spyOn(stateManager, 'startChecking')
			const stopSpy = vi.spyOn(stateManager, 'stopChecking')

			stateManager.startChecking(1000)
			stateManager.stopChecking()

			expect(startSpy).toHaveBeenCalled()
			expect(stopSpy).toHaveBeenCalled()
		})

		it('应该能够手动触发状态检查', async () => {
			const checkSpy = vi.spyOn(stateManager as any, 'checkState')

			await stateManager.checkState()

			expect(checkSpy).toHaveBeenCalled()
		})

		it('检查时应该更新最后检查时间', async () => {
			await stateManager.checkState()

			const lastCheckTime = stateManager.get('lastCheckTime')
			expect(lastCheckTime).toBeDefined()
			expect(lastCheckTime).toBeGreaterThan(0)
		})

		it('定时器应该按配置的间隔执行', async () => {
			const checkSpy = vi.spyOn(stateManager, 'checkState').mockResolvedValue(undefined)

			stateManager.startChecking(1000)

			// 快进 1 秒
			await vi.advanceTimersByTimeAsync(1000)
			expect(checkSpy).toHaveBeenCalledTimes(1)

			// 再快进 1 秒
			await vi.advanceTimersByTimeAsync(1000)
			expect(checkSpy).toHaveBeenCalledTimes(2)

			stateManager.stopChecking()
		})

		it('检查失败时应该发送错误通知', async () => {
			configManager.get = vi.fn((key: string) => {
				if (key === 'enableNotification') return true
				return 60000
			})

			const notificationSpy = vi.fn()
			eventBus.on(AppEvents.NOTIFICATION_SHOW, notificationSpy)

			vi.spyOn(stateManager, 'checkState').mockRejectedValue(new Error('Check failed'))

			stateManager.startChecking(100)
			await vi.advanceTimersByTimeAsync(100)

			// 注意：错误被 catch 并发出通知
			expect(notificationSpy).toHaveBeenCalled()
			expect(notificationSpy.mock.calls[0][0]).toMatchObject({
				title: '状态检查失败',
				type: 'error'
			})

			stateManager.stopChecking()
		})
	})

	describe('状态重置', () => {
		it('应该能够重置状态为默认值', () => {
			stateManager.setUnreadCount(10)
			stateManager.addTask({ id: '1', name: 'Task', status: 'running' })

			stateManager.reset()

			expect(stateManager.get('unreadCount')).toBe(0)
			expect(stateManager.get('tasks')).toEqual([])
		})
	})

	describe('状态导出', () => {
		it('应该能够导出状态为 JSON', () => {
			stateManager.setUnreadCount(5)
			stateManager.addTask({ id: '1', name: 'Task', status: 'running' })

			const json = stateManager.export()

			expect(json).toContain('"unreadCount":5')
			expect(json).toContain('"tasks"')

			const parsed = JSON.parse(json)
			expect(parsed.unreadCount).toBe(5)
			expect(parsed.tasks).toHaveLength(1)
		})
	})

	describe('生命周期管理', () => {
		it('应该能够销毁状态管理器', () => {
			stateManager.destroy()
			expect(stateManager.isDestroyed()).toBe(true)
		})

		it('销毁时应该停止定时检查', () => {
			stateManager.startChecking(1000)
			stateManager.destroy()

			expect(stateManager.isChecking()).toBe(false)
		})

		it('销毁时应该重置状态', () => {
			stateManager.setUnreadCount(10)
			stateManager.destroy()

			expect(stateManager.get('unreadCount')).toBe(0)
		})

		it('销毁后应该允许重复调用 destroy', () => {
			expect(() => {
				stateManager.destroy()
				stateManager.destroy()
				stateManager.destroy()
			}).not.toThrow()
		})

		it('销毁后启动检查应该抛出错误', () => {
			stateManager.destroy()

			expect(() => {
				stateManager.startChecking(1000)
			}).toThrow('destroyed StateManager')
		})
	})
})
