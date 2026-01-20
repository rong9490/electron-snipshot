import { ElectronAPI } from '@electron-toolkit/preload'

/**
 * 应用配置类型
 */
interface AppConfig {
	checkInterval: number
	enableNotification: boolean
	enableBadge: boolean
	trayIconColor: 'default' | 'blue' | 'green' | 'red'
	autoStart: boolean
	startMinimized: boolean
}

/**
 * 任务状态
 */
type TaskStatus = 'running' | 'completed' | 'failed'

/**
 * 任务信息
 */
interface Task {
	id: string
	name: string
	status: TaskStatus
	progress?: number
	error?: string
}

/**
 * 应用状态
 */
interface AppState {
	unreadCount: number
	lastMessageTime?: number
	tasks: Task[]
	isMonitoring: boolean
	lastCheckTime?: number
}

/**
 * 通知选项
 */
interface NotificationOptions {
	title: string
	body: string
	icon?: string
	type?: 'info' | 'warning' | 'error' | 'success'
}

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

/**
 * 通知统计
 */
interface NotificationStats {
	total: number
	clicked: number
	byType: Record<string, number>
}

/**
 * 环境变量接口
 */
interface Environment {
	NODE_ENV: string
	ELECTRON_RENDERER_URL: string
	isDev: boolean
	isProd: boolean
	platform: NodeJS.Platform
	appVersion: string
}

/**
 * 应用 API 接口
 */
interface AppAPI {
	// 配置相关
	config: {
		/**
		 * 获取配置值
		 */
		get<K extends keyof AppConfig>(key: K): Promise<AppConfig[K]>

		/**
		 * 设置配置值
		 */
		set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): Promise<void>

		/**
		 * 获取所有配置
		 */
		getAll(): Promise<AppConfig>

		/**
		 * 设置多个配置
		 */
		setMany(config: Partial<AppConfig>): Promise<void>

		/**
		 * 重置为默认配置
		 */
		reset(): Promise<void>

		/**
		 * 设置开机自启动
		 */
		setAutoStart(enable: boolean): Promise<void>

		/**
		 * 导出配置
		 */
		export(): Promise<string>

		/**
		 * 导入配置
		 */
		import(jsonString: string): Promise<void>
	}

	// 状态相关
	state: {
		/**
		 * 获取完整状态
		 */
		get(): Promise<AppState>

		/**
		 * 获取状态的一部分
		 */
		get<K extends keyof AppState>(key: K): Promise<AppState[K]>

		/**
		 * 设置未读数
		 */
		setUnreadCount(count: number): Promise<void>

		/**
		 * 增加未读数
		 */
		incrementUnreadCount(delta?: number): Promise<void>

		/**
		 * 清空未读数
		 */
		clearUnreadCount(): Promise<void>

		/**
		 * 添加任务
		 */
		addTask(task: Task): Promise<void>

		/**
		 * 更新任务
		 */
		updateTask(taskId: string, updates: Partial<Task>): Promise<void>

		/**
		 * 移除任务
		 */
		removeTask(taskId: string): Promise<void>

		/**
		 * 清空任务
		 */
		clearTasks(): Promise<void>

		/**
		 * 手动触发状态检查
		 */
		refresh(): Promise<void>

		/**
		 * 导出状态
		 */
		export(): Promise<string>
	}

	// 监控控制
	monitoring: {
		/**
		 * 启动监控
		 */
		start(): Promise<void>

		/**
		 * 停止监控
		 */
		stop(): Promise<void>

		/**
		 * 检查是否正在监控
		 */
		isRunning(): Promise<boolean>
	}

	// 通知相关
	notification: {
		/**
		 * 显示通知
		 */
		show(options: NotificationOptions): Promise<boolean>

		/**
		 * 获取通知历史
		 */
		getHistory(limit?: number): Promise<NotificationHistory[]>

		/**
		 * 获取最近的通知
		 */
		getRecent(limit?: number): Promise<NotificationHistory[]>

		/**
		 * 按类型获取通知
		 */
		getByType(type: NotificationHistory['type']): Promise<NotificationHistory[]>

		/**
		 * 清空通知历史
		 */
		clearHistory(): Promise<void>

		/**
		 * 获取通知统计
		 */
		getStats(): Promise<NotificationStats>

		/**
		 * 设置最小通知间隔
		 */
		setMinInterval(interval: number): Promise<void>

		/**
		 * 批量发送通知
		 */
		showBatch(notifications: NotificationOptions[], delay?: number): Promise<number>
	}

	// 窗口控制
	window: {
		/**
		 * 显示窗口
		 */
		show(): Promise<void>

		/**
		 * 隐藏窗口
		 */
		hide(): Promise<void>

		/**
		 * 最小化窗口
		 */
		minimize(): Promise<void>

		/**
		 * 最大化窗口
		 */
		maximize(): Promise<void>

		/**
		 * 关闭窗口
		 */
		close(): Promise<void>
	}

	// 应用信息
	app: {
		/**
		 * 获取应用版本
		 */
		getVersion(): Promise<string>

		/**
		 * 获取应用名称
		 */
		getName(): Promise<string>

		/**
		 * 显示关于面板
		 */
		showAboutPanel(): Promise<void>

		/**
		 * 退出应用
		 */
		quit(): Promise<void>
	}

	// 事件监听
	on: {
		/**
		 * 监听状态变化
		 */
		stateChanged(callback: (state: AppState) => void): () => void

		/**
		 * 监听未读数变化
		 */
		unreadCountChanged(callback: (count: number) => void): () => void

		/**
		 * 监听任务状态变化
		 */
		taskStatusChanged(callback: (data: { taskId: string; status: TaskStatus }) => void): () => void

		/**
		 * 监听配置变化
		 */
		configChanged(callback: (config: AppConfig) => void): () => void

		/**
		 * 监听通知点击
		 */
		notificationClick(callback: (options: NotificationOptions) => void): () => void
	}
}

declare global {
	interface Window {
		electron: ElectronAPI
		api: AppAPI
		ENV: Environment
	}
}
