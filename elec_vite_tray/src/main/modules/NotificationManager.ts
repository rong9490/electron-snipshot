/**
 * NotificationManager - 通知管理器
 * 负责系统通知、通知规则、通知历史
 */

import { Notification, app } from 'electron'
import { EventBus } from './EventBus'
import { ConfigManager } from './ConfigManager'
import { AppEvents, type NotificationOptions } from '../types'

/**
 * 通知历史记录
 */
interface NotificationHistory {
	id: string
	title: string
	body: string
	type: 'info' | 'warning' | 'error' | 'success'
	timestamp: number
	clicked: boolean
}

export class NotificationManager {
	private eventBus: EventBus
	private configManager: ConfigManager
	private notificationHistory: NotificationHistory[] = []
	private lastNotificationTime = 0
	private minInterval = 2000 // 最小间隔2秒（可配置）
	private maxHistorySize = 100 // 最大历史记录数
	private isDestroyed = false

	constructor(eventBus: EventBus, configManager: ConfigManager) {
		this.eventBus = eventBus
		this.configManager = configManager

		// 监听通知事件
		this.eventBus.on(AppEvents.NOTIFICATION_SHOW, (options) => {
			this.show(options)
		})

		console.log('[NotificationManager] Initialized')
	}

	/**
	 * 显示通知
	 * @param options 通知选项
	 * @returns 是否成功显示
	 */
	show(options: NotificationOptions): boolean {
		if (this.isDestroyed) {
			console.warn('[NotificationManager] Cannot show notification on destroyed manager')
			return false
		}

		// 检查是否启用通知
		if (!this.configManager.get('enableNotification')) {
			console.log('[NotificationManager] Notification is disabled')
			return false
		}

		// 频率限制检查
		if (!this.checkRateLimit()) {
			console.warn('[NotificationManager] Rate limited')
			return false
		}

		try {
			// 创建通知
			const notification = this.createNotification(options)

			// 显示通知
			notification.show()

			// 记录到历史
			this.addToHistory(options)

			// 更新时间戳
			this.lastNotificationTime = Date.now()

			// 监听点击事件
			if (options.onClick || options.type) {
				notification.on('click', () => {
					this.onNotificationClick(options)
				})
			}

			console.log(`[NotificationManager] Notification shown: ${options.title}`)
			return true
		} catch (error) {
			console.error('[NotificationManager] Failed to show notification:', error)
			return false
		}
	}

	/**
	 * 创建通知对象
	 */
	private createNotification(options: NotificationOptions): Notification {
		const notificationOptions: Electron.NotificationConstructorOptions = {
			title: options.title,
			body: options.body
		}

		// 设置图标
		if (options.icon) {
			notificationOptions.icon = options.icon
		}

		// 根据类型设置不同的样式
		switch (options.type) {
			case 'error':
				notificationOptions urgency = 'critical'
				break
			case 'warning':
				notificationOptions.urgency = 'normal'
				break
			case 'success':
				notificationOptions.urgency = 'low'
				break
			default:
				notificationOptions.urgency = 'normal'
		}

		// 应用名称
		notificationOptions.appName = app.getName()

		return new Notification(notificationOptions)
	}

	/**
	 * 检查频率限制
	 */
	private checkRateLimit(): boolean {
		const now = Date.now()
		const elapsed = now - this.lastNotificationTime

		if (elapsed < this.minInterval) {
			return false
		}

		return true
	}

	/**
	 * 通知点击处理
	 */
	private onNotificationClick(options: NotificationOptions): void {
		console.log(`[NotificationManager] Notification clicked: ${options.title}`)

		// 更新历史记录
		const lastNotification = this.notificationHistory[this.notificationHistory.length - 1]
		if (lastNotification) {
			lastNotification.clicked = true
		}

		// 发出点击事件
		this.eventBus.emit(AppEvents.NOTIFICATION_CLICK, options)

		// 执行自定义回调
		if (options.onClick) {
			options.onClick()
		}
	}

	/**
	 * 添加到历史记录
	 */
	private addToHistory(options: NotificationOptions): void {
		const historyItem: NotificationHistory = {
			id: this.generateId(),
			title: options.title,
			body: options.body,
			type: options.type || 'info',
			timestamp: Date.now(),
			clicked: false
		}

		this.notificationHistory.push(historyItem)

		// 限制历史记录大小
		if (this.notificationHistory.length > this.maxHistorySize) {
			this.notificationHistory.shift()
		}
	}

	/**
	 * 获取通知历史
	 */
	getHistory(limit?: number): NotificationHistory[] {
		if (limit) {
			return this.notificationHistory.slice(-limit)
		}
		return [...this.notificationHistory]
	}

	/**
	 * 清空通知历史
	 */
	clearHistory(): void {
		this.notificationHistory = []
		console.log('[NotificationManager] Notification history cleared')
	}

	/**
	 * 获取通知统计
	 */
	getStats(): {
		total: number
		clicked: number
		byType: Record<string, number>
	} {
		const stats = {
			total: this.notificationHistory.length,
			clicked: 0,
			byType: {} as Record<string, number>
		}

		for (const notification of this.notificationHistory) {
			if (notification.clicked) {
				stats.clicked++
			}

			stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1
		}

		return stats
	}

	/**
	 * 获取最近的通知
	 */
	getRecent(limit = 10): NotificationHistory[] {
		return this.notificationHistory.slice(-limit).reverse()
	}

	/**
	 * 按类型筛选通知
	 */
	getByType(type: NotificationHistory['type']): NotificationHistory[] {
		return this.notificationHistory.filter((n) => n.type === type)
	}

	/**
	 * 删除指定时间之前的历史
	 */
	deleteHistoryBefore(timestamp: number): void {
		this.notificationHistory = this.notificationHistory.filter(
			(n) => n.timestamp >= timestamp
		)
	}

	/**
	 * 设置最小通知间隔
	 */
	setMinInterval(interval: number): void {
		this.minInterval = interval
	}

	/**
	 * 获取最小通知间隔
	 */
	getMinInterval(): number {
		return this.minInterval
	}

	/**
	 * 批量发送通知（带延迟）
	 */
	async showBatch(notifications: NotificationOptions[], delay = 1000): Promise<number> {
		let successCount = 0

		for (const options of notifications) {
			const success = this.show(options)
			if (success) {
				successCount++
			}

			// 延迟
			await new Promise((resolve) => setTimeout(resolve, delay))
		}

		return successCount
	}

	/**
	 * 生成唯一ID
	 */
	private generateId(): string {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
	}

	/**
	 * 检查通知权限
	 */
	static async checkPermission(): Promise<boolean> {
		// Electron 的 Notification 在不同平台表现不同
		// macOS 需要权限，Windows/Linux 通常不需要
		if (process.platform === 'darwin') {
			return Notification.isSupported()
		}
		return true
	}

	/**
	 * 请求通知权限（macOS）
	 */
	static async requestPermission(): Promise<boolean> {
		// Electron 不直接支持请求权限
		// 在 macOS 上，权限在首次显示通知时自动请求
		return NotificationManager.checkPermission()
	}

	/**
	 * 销毁通知管理器
	 */
	destroy(): void {
		if (this.isDestroyed) {
			return
		}

		this.isDestroyed = true
		this.clearHistory()

		console.log('[NotificationManager] Destroyed')
	}

	/**
	 * 检查是否已销毁
	 */
	isDestroyed(): boolean {
		return this.isDestroyed
	}
}
