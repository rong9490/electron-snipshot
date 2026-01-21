import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

/// <reference types="./index.d.ts" />

// 获取环境变量
const environment = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	ELECTRON_RENDERER_URL: process.env.ELECTRON_RENDERER_URL || '',
	isDev: process.env.NODE_ENV === 'development',
	isProd: process.env.NODE_ENV === 'production',
	platform: process.platform,
	appVersion: process.env.npm_package_version || '1.0.0'
}

// Custom APIs for renderer
const api = {
	// 配置相关
	config: {
		get: (key: string) => ipcRenderer.invoke('config:get', key),
		set: (key: string, value: unknown) => ipcRenderer.invoke('config:set', key, value),
		getAll: () => ipcRenderer.invoke('config:get-all'),
		setMany: (config: Record<string, unknown>) => ipcRenderer.invoke('config:set-many', config),
		reset: () => ipcRenderer.invoke('config:reset'),
		setAutoStart: (enable: boolean) => ipcRenderer.invoke('config:set-auto-start', enable),
		export: () => ipcRenderer.invoke('config:export'),
		import: (jsonString: string) => ipcRenderer.invoke('config:import', jsonString)
	},

	// 状态相关
	state: {
		get: (key?: string) => ipcRenderer.invoke('state:get', key),
		setUnreadCount: (count: number) => ipcRenderer.invoke('state:set-unread-count', count),
		incrementUnreadCount: (delta?: number) =>
			ipcRenderer.invoke('state:increment-unread-count', delta),
		clearUnreadCount: () => ipcRenderer.invoke('state:clear-unread-count'),
		addTask: (task: unknown) => ipcRenderer.invoke('state:add-task', task),
		updateTask: (taskId: string, updates: unknown) =>
			ipcRenderer.invoke('state:update-task', taskId, updates),
		removeTask: (taskId: string) => ipcRenderer.invoke('state:remove-task', taskId),
		clearTasks: () => ipcRenderer.invoke('state:clear-tasks'),
		refresh: () => ipcRenderer.invoke('state:refresh'),
		export: () => ipcRenderer.invoke('state:export')
	},

	// 监控控制
	monitoring: {
		start: () => ipcRenderer.invoke('monitoring:start'),
		stop: () => ipcRenderer.invoke('monitoring:stop'),
		isRunning: () => ipcRenderer.invoke('monitoring:is-running')
	},

	// 通知相关
	notification: {
		show: (options: unknown) => ipcRenderer.invoke('notification:show', options),
		getHistory: (limit?: number) => ipcRenderer.invoke('notification:get-history', limit),
		getRecent: (limit?: number) => ipcRenderer.invoke('notification:get-recent', limit),
		getByType: (type: string) => ipcRenderer.invoke('notification:get-by-type', type),
		clearHistory: () => ipcRenderer.invoke('notification:clear-history'),
		getStats: () => ipcRenderer.invoke('notification:get-stats'),
		setMinInterval: (interval: number) =>
			ipcRenderer.invoke('notification:set-min-interval', interval),
		showBatch: (notifications: unknown[], delay?: number) =>
			ipcRenderer.invoke('notification:show-batch', notifications, delay)
	},

	// 窗口控制
	window: {
		show: () => ipcRenderer.invoke('window:show'),
		hide: () => ipcRenderer.invoke('window:hide'),
		minimize: () => ipcRenderer.invoke('window:minimize'),
		maximize: () => ipcRenderer.invoke('window:maximize'),
		close: () => ipcRenderer.invoke('window:close')
	},

	// 应用信息
	app: {
		getVersion: () => ipcRenderer.invoke('app:get-version'),
		getName: () => ipcRenderer.invoke('app:get-name'),
		showAboutPanel: () => ipcRenderer.invoke('app:show-about-panel'),
		quit: () => ipcRenderer.invoke('app:quit')
	},

	// 事件监听
	on: {
		stateChanged: (callback: (state: unknown) => void) => {
			const listener = (_event: unknown, state: unknown) => callback(state)
			ipcRenderer.on('state:changed', listener)
			return () => ipcRenderer.removeListener('state:changed', listener)
		},

		unreadCountChanged: (callback: (count: number) => void) => {
			const listener = (_event: unknown, count: number) => callback(count)
			ipcRenderer.on('unread-count:changed', listener)
			return () => ipcRenderer.removeListener('unread-count:changed', listener)
		},

		taskStatusChanged: (callback: (data: unknown) => void) => {
			const listener = (_event: unknown, data: unknown) => callback(data)
			ipcRenderer.on('task-status:changed', listener)
			return () => ipcRenderer.removeListener('task-status:changed', listener)
		},

		configChanged: (callback: (config: unknown) => void) => {
			const listener = (_event: unknown, config: unknown) => callback(config)
			ipcRenderer.on('config:changed', listener)
			return () => ipcRenderer.removeListener('config:changed', listener)
		},

		notificationClick: (callback: (options: unknown) => void) => {
			const listener = (_event: unknown, options: unknown) => callback(options)
			ipcRenderer.on('notification:click', listener)
			return () => ipcRenderer.removeListener('notification:click', listener)
		}
	}
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('electron', electronAPI)
		contextBridge.exposeInMainWorld('api', api)
		// 注入环境变量到渲染进程
		contextBridge.exposeInMainWorld('ENV', environment)
	} catch (error) {
		console.error(error)
	}
} else {
	// contextIsolated 为 false 时的降级处理（实际上在现代 Electron 中不会执行）
	// @ts-expect-error - 在非隔离模式下直接挂载到 window
	window.electron = electronAPI
	// @ts-expect-error
	window.api = api
	// @ts-expect-error
	window.ENV = environment
}
