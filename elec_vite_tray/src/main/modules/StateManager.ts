/**
 * StateManager - 状态管理器
 * 负责应用状态存储、定时检查、状态变化通知
 */

import type { AppState, Task } from '../types'
import { EventBus } from './EventBus'
import { ConfigManager } from './ConfigManager'
import { AppEvents } from '../types'

const DEFAULT_STATE: AppState = {
	unreadCount: 0,
	tasks: [],
	isMonitoring: false
}

export class StateManager {
	private state: AppState
	private eventBus: EventBus
	private configManager: ConfigManager
	private checkTimer?: NodeJS.Timeout
	private isDestroyed = false

	constructor(eventBus: EventBus, configManager: ConfigManager) {
		this.eventBus = eventBus
		this.configManager = configManager
		this.state = { ...DEFAULT_STATE }

		// 监听配置变更，重启监控（如果监控间隔改变）
		this.eventBus.on(AppEvents.CONFIG_CHANGED, ({ new: newConfig }) => {
			if (this.state.isMonitoring && 'checkInterval' in newConfig) {
				// 重启监控以应用新的间隔
				this.startChecking(newConfig.checkInterval)
			}
		})
	}

	/**
	 * 获取完整状态
	 */
	getState(): AppState {
		return { ...this.state }
	}

	/**
	 * 获取状态的一部分
	 * @param key 状态键
	 */
	get<K extends keyof AppState>(key: K): AppState[K] {
		return this.state[key]
	}

	/**
	 * 设置状态
	 * @param state 新状态或部分状态
	 */
	setState(state: Partial<AppState>): void {
		const oldState = { ...this.state }
		this.state = { ...this.state, ...state }

		// 发出状态变化事件
		this.eventBus.emit(AppEvents.STATE_CHANGED, {
			old: oldState,
			new: this.state
		})

		// 如果未读数变化，发出特定事件
		if ('unreadCount' in state && state.unreadCount !== oldState.unreadCount) {
			this.eventBus.emit(AppEvents.UNREAD_COUNT_CHANGED, {
				old: oldState.unreadCount,
				new: this.state.unreadCount
			})
		}
	}

	/**
	 * 更新未读消息数
	 * @param count 未读数量
	 */
	setUnreadCount(count: number): void {
		this.setState({ unreadCount: count })
	}

	/**
	 * 增加未读消息数
	 * @param delta 增量（默认1）
	 */
	incrementUnreadCount(delta = 1): void {
		this.setState({ unreadCount: this.state.unreadCount + delta })
	}

	/**
	 * 清空未读消息数
	 */
	clearUnreadCount(): void {
		this.setState({ unreadCount: 0 })
	}

	/**
	 * 添加任务
	 * @param task 任务信息
	 */
	addTask(task: Task): void {
		const tasks = [...this.state.tasks, task]
		this.setState({ tasks })

		// 发出任务状态变化事件
		this.eventBus.emit(AppEvents.TASK_STATUS_CHANGED, {
			taskId: task.id,
			status: task.status
		})
	}

	/**
	 * 更新任务
	 * @param taskId 任务ID
	 * @param updates 更新内容
	 */
	updateTask(taskId: string, updates: Partial<Task>): void {
		const tasks = this.state.tasks.map((task) =>
			task.id === taskId ? { ...task, ...updates } : task
		)
		this.setState({ tasks })

		// 如果状态改变，发出事件
		if (updates.status) {
			this.eventBus.emit(AppEvents.TASK_STATUS_CHANGED, {
				taskId,
				status: updates.status
			})
		}
	}

	/**
	 * 移除任务
	 * @param taskId 任务ID
	 */
	removeTask(taskId: string): void {
		const tasks = this.state.tasks.filter((task) => task.id !== taskId)
		this.setState({ tasks })
	}

	/**
	 * 清空所有任务
	 */
	clearTasks(): void {
		this.setState({ tasks: [] })
	}

	/**
	 * 获取指定状态的任务
	 * @param status 任务状态
	 */
	getTasksByStatus(status: Task['status']): Task[] {
		return this.state.tasks.filter((task) => task.status === status)
	}

	/**
	 * 启动定时检查
	 * @param interval 检查间隔（毫秒），默认从配置读取
	 */
	startChecking(interval?: number): void {
		if (this.isDestroyed) {
			throw new Error('[StateManager] Cannot start checking on destroyed StateManager')
		}

		// 先停止现有的定时器
		this.stopChecking()

		const checkInterval = interval ?? this.configManager.get('checkInterval')

		this.checkTimer = setInterval(async () => {
			try {
				await this.checkState()
			} catch (error) {
				console.error('[StateManager] Check failed:', error)

				// 发送错误通知
				if (this.configManager.get('enableNotification')) {
					this.eventBus.emit(AppEvents.NOTIFICATION_SHOW, {
						title: '状态检查失败',
						body: (error as Error).message,
						type: 'error'
					})
				}
			}
		}, checkInterval)

		// 更新监控状态
		this.setState({ isMonitoring: true })

		console.log(`[StateManager] Started checking with interval ${checkInterval}ms`)
	}

	/**
	 * 停止定时检查
	 */
	stopChecking(): void {
		if (this.checkTimer) {
			clearInterval(this.checkTimer)
			this.checkTimer = undefined
		}

		// 更新监控状态
		this.setState({ isMonitoring: false })

		console.log('[StateManager] Stopped checking')
	}

	/**
	 * 检查是否正在监控
	 */
	isChecking(): boolean {
		return this.checkTimer !== undefined
	}

	/**
	 * 手动触发一次状态检查
	 */
	async checkState(): Promise<void> {
		if (this.isDestroyed) {
			return
		}

		console.log('[StateManager] Checking state...')

		// 这里可以实现实际的状态检查逻辑：
		// 1. 发起 HTTP 请求检查远程状态
		// 2. 读取本地文件/数据库
		// 3. 通过 IPC 从渲染进程获取状态

		// 示例：模拟状态变化（实际项目中替换为真实逻辑）
		// const newUnreadCount = await this.fetchRemoteUnreadCount()
		// this.setUnreadCount(newUnreadCount)

		// 更新最后检查时间
		this.setState({ lastCheckTime: Date.now() })

		console.log('[StateManager] State check completed')
	}

	/**
	 * 重置状态为默认值
	 */
	reset(): void {
		this.state = { ...DEFAULT_STATE }
		this.eventBus.emit(AppEvents.STATE_CHANGED, {
			old: this.state,
			new: this.state
		})
	}

	/**
	 * 导出状态为 JSON 字符串
	 */
	export(): string {
		return JSON.stringify(this.state, null, 2)
	}

	/**
	 * 销毁状态管理器
	 */
	destroy(): void {
		if (this.isDestroyed) {
			return
		}

		this.isDestroyed = true
		this.stopChecking()
		this.state = { ...DEFAULT_STATE }
	}

	/**
	 * 检查是否已销毁
	 */
	isDestroyed(): boolean {
		return this.isDestroyed
	}
}
