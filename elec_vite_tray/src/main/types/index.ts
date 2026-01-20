/**
 * 应用状态类型定义
 */

/**
 * 任务状态枚举
 */
export type TaskStatus = 'running' | 'completed' | 'failed'

/**
 * 任务信息
 */
export interface Task {
	id: string
	name: string
	status: TaskStatus
	progress?: number
	error?: string
}

/**
 * 应用状态
 */
export interface AppState {
	// 消息状态
	unreadCount: number
	lastMessageTime?: number

	// 任务状态
	tasks: Task[]

	// 应用状态
	isMonitoring: boolean
	lastCheckTime?: number
}

/**
 * 托盘图标颜色选项
 */
export type TrayIconColor = 'default' | 'blue' | 'green' | 'red'

/**
 * 应用配置
 */
export interface AppConfig {
	// 监控配置
	checkInterval: number // 检查间隔（毫秒）
	enableNotification: boolean

	// 托盘配置
	enableBadge: boolean // 显示角标
	trayIconColor: TrayIconColor

	// 启动配置
	autoStart: boolean
	startMinimized: boolean
}

/**
 * 应用事件类型
 */
export enum AppEvents {
	// 状态变化事件
	STATE_CHANGED = 'state:changed',
	UNREAD_COUNT_CHANGED = 'unread:count:changed',
	TASK_STATUS_CHANGED = 'task:status:changed',

	// 通知相关
	NOTIFICATION_SHOW = 'notification:show',
	NOTIFICATION_CLICK = 'notification:click',

	// 配置相关
	CONFIG_CHANGED = 'config:changed',

	// 窗口相关
	WINDOW_SHOW = 'window:show',
	WINDOW_HIDE = 'window:hide',

	// 应用生命周期
	APP_QUIT = 'app:quit',
	APP_READY = 'app:ready'
}

/**
 * 事件监听器函数类型
 */
export type EventListener<T = any> = (data: T) => void | Promise<void>

/**
 * 通知选项
 */
export interface NotificationOptions {
	title: string
	body: string
	icon?: string
	type?: 'info' | 'warning' | 'error' | 'success'
	onClick?: () => void
}

/**
 * 托盘菜单项
 */
export interface TrayMenuItem {
	label: string
	click?: () => void
	enabled?: boolean
	visible?: boolean
	type?: 'normal' | 'separator' | 'submenu'
	submenu?: TrayMenuItem[]
}

/**
 * 错误类型
 */
export class AppError extends Error {
	constructor(
		public code: string,
		message: string,
		public details?: any
	) {
		super(message)
		this.name = 'AppError'
	}
}
