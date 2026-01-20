/**
 * IPC Handlers - 主进程 IPC 处理器
 * 处理来自渲染进程的所有 IPC 调用
 */

import { ipcMain, BrowserWindow, app } from 'electron'
import { ConfigManager } from './ConfigManager'
import { StateManager } from './StateManager'
import { NotificationManager } from './NotificationManager'
import { AppEvents } from '../types'

export class IPCHandlers {
	private configManager: ConfigManager
	private stateManager: StateManager
	private notificationManager: NotificationManager
	private mainWindow: BrowserWindow | null
	private isDestroyed = false

	constructor(
		configManager: ConfigManager,
		stateManager: StateManager,
		notificationManager: NotificationManager,
		mainWindow: BrowserWindow | null
	) {
		this.configManager = configManager
		this.stateManager = stateManager
		this.notificationManager = notificationManager
		this.mainWindow = mainWindow

		this.registerHandlers()
		this.setupEventForwarding()

		console.log('[IPCHandlers] Initialized')
	}

	/**
	 * 注册所有 IPC handlers
	 */
	private registerHandlers(): void {
		// ========== 配置相关 ==========
		ipcMain.handle('config:get', this.handleConfigGet.bind(this))
		ipcMain.handle('config:set', this.handleConfigSet.bind(this))
		ipcMain.handle('config:get-all', this.handleConfigGetAll.bind(this))
		ipcMain.handle('config:set-many', this.handleConfigSetMany.bind(this))
		ipcMain.handle('config:reset', this.handleConfigReset.bind(this))
		ipcMain.handle('config:set-auto-start', this.handleConfigSetAutoStart.bind(this))
		ipcMain.handle('config:export', this.handleConfigExport.bind(this))
		ipcMain.handle('config:import', this.handleConfigImport.bind(this))

		// ========== 状态相关 ==========
		ipcMain.handle('state:get', this.handleStateGet.bind(this))
		ipcMain.handle('state:set-unread-count', this.handleStateSetUnreadCount.bind(this))
		ipcMain.handle(
			'state:increment-unread-count',
			this.handleStateIncrementUnreadCount.bind(this)
		)
		ipcMain.handle('state:clear-unread-count', this.handleStateClearUnreadCount.bind(this))
		ipcMain.handle('state:add-task', this.handleStateAddTask.bind(this))
		ipcMain.handle('state:update-task', this.handleStateUpdateTask.bind(this))
		ipcMain.handle('state:remove-task', this.handleStateRemoveTask.bind(this))
		ipcMain.handle('state:clear-tasks', this.handleStateClearTasks.bind(this))
		ipcMain.handle('state:refresh', this.handleStateRefresh.bind(this))
		ipcMain.handle('state:export', this.handleStateExport.bind(this))

		// ========== 监控控制 ==========
		ipcMain.handle('monitoring:start', this.handleMonitoringStart.bind(this))
		ipcMain.handle('monitoring:stop', this.handleMonitoringStop.bind(this))
		ipcMain.handle('monitoring:is-running', this.handleMonitoringIsRunning.bind(this))

		// ========== 通知相关 ==========
		ipcMain.handle('notification:show', this.handleNotificationShow.bind(this))
		ipcMain.handle('notification:get-history', this.handleNotificationGetHistory.bind(this))
		ipcMain.handle('notification:get-recent', this.handleNotificationGetRecent.bind(this))
		ipcMain.handle('notification:get-by-type', this.handleNotificationGetByType.bind(this))
		ipcMain.handle('notification:clear-history', this.handleNotificationClearHistory.bind(this))
		ipcMain.handle('notification:get-stats', this.handleNotificationGetStats.bind(this))
		ipcMain.handle(
			'notification:set-min-interval',
			this.handleNotificationSetMinInterval.bind(this)
		)
		ipcMain.handle('notification:show-batch', this.handleNotificationShowBatch.bind(this))

		// ========== 窗口控制 ==========
		ipcMain.handle('window:show', this.handleWindowShow.bind(this))
		ipcMain.handle('window:hide', this.handleWindowHide.bind(this))
		ipcMain.handle('window:minimize', this.handleWindowMinimize.bind(this))
		ipcMain.handle('window:maximize', this.handleWindowMaximize.bind(this))
		ipcMain.handle('window:close', this.handleWindowClose.bind(this))

		// ========== 应用信息 ==========
		ipcMain.handle('app:get-version', this.handleAppGetVersion.bind(this))
		ipcMain.handle('app:get-name', this.handleAppGetName.bind(this))
		ipcMain.handle('app:show-about-panel', this.handleAppShowAboutPanel.bind(this))
		ipcMain.handle('app:quit', this.handleAppQuit.bind(this))
	}

	/**
	 * 设置事件转发（从主进程到渲染进程）
	 */
	private setupEventForwarding(): void {
		// 状态变化
		this.stateManager['eventBus'].on(AppEvents.STATE_CHANGED, (data) => {
			this.sendToAllWindows('state:changed', data.new)
		})

		// 未读数变化
		this.stateManager['eventBus'].on(AppEvents.UNREAD_COUNT_CHANGED, (data) => {
			this.sendToAllWindows('unread-count:changed', data.new)
		})

		// 任务状态变化
		this.stateManager['eventBus'].on(AppEvents.TASK_STATUS_CHANGED, (data) => {
			this.sendToAllWindows('task-status:changed', data)
		})

		// 配置变化
		this.configManager['eventBus'].on(AppEvents.CONFIG_CHANGED, (data) => {
			this.sendToAllWindows('config:changed', data.new)
		})

		// 通知点击
		this.notificationManager['eventBus'].on(AppEvents.NOTIFICATION_CLICK, (data) => {
			this.sendToAllWindows('notification:click', data)
		})
	}

	/**
	 * 发送消息到所有窗口
	 */
	private sendToAllWindows(channel: string, data?: unknown): void {
		if (this.mainWindow && !this.mainWindow.isDestroyed()) {
			this.mainWindow.webContents.send(channel, data)
		}
	}

	// ========== 配置相关 Handlers ==========

	private async handleConfigGet(_event: Electron.IpcMainInvokeEvent, key: string) {
		return this.configManager.get(key)
	}

	private async handleConfigSet(
		_event: Electron.IpcMainInvokeEvent,
		key: string,
		value: unknown
	) {
		this.configManager.set(key, value as never)
	}

	private async handleConfigGetAll() {
		return this.configManager.getAll()
	}

	private async handleConfigSetMany(_event: Electron.IpcMainInvokeEvent, config: unknown) {
		this.configManager.setMany(config as never)
	}

	private async handleConfigReset() {
		this.configManager.reset()
	}

	private async handleConfigSetAutoStart(
		_event: Electron.IpcMainInvokeEvent,
		enable: boolean
	) {
		this.configManager.setAutoStart(enable)
	}

	private async handleConfigExport() {
		return this.configManager.export()
	}

	private async handleConfigImport(_event: Electron.IpcMainInvokeEvent, jsonString: string) {
		this.configManager.import(jsonString)
	}

	// ========== 状态相关 Handlers ==========

	private async handleStateGet(_event: Electron.IpcMainInvokeEvent, key?: string) {
		if (key) {
			return this.stateManager.get(key as never)
		}
		return this.stateManager.getState()
	}

	private async handleStateSetUnreadCount(
		_event: Electron.IpcMainInvokeEvent,
		count: number
	) {
		this.stateManager.setUnreadCount(count)
	}

	private async handleStateIncrementUnreadCount(
		_event: Electron.IpcMainInvokeEvent,
		delta?: number
	) {
		this.stateManager.incrementUnreadCount(delta)
	}

	private async handleStateClearUnreadCount() {
		this.stateManager.clearUnreadCount()
	}

	private async handleStateAddTask(_event: Electron.IpcMainInvokeEvent, task: unknown) {
		this.stateManager.addTask(task as never)
	}

	private async handleStateUpdateTask(
		_event: Electron.IpcMainInvokeEvent,
		taskId: string,
		updates: unknown
	) {
		this.stateManager.updateTask(taskId, updates as never)
	}

	private async handleStateRemoveTask(_event: Electron.IpcMainInvokeEvent, taskId: string) {
		this.stateManager.removeTask(taskId)
	}

	private async handleStateClearTasks() {
		this.stateManager.clearTasks()
	}

	private async handleStateRefresh() {
		await this.stateManager.checkState()
	}

	private async handleStateExport() {
		return this.stateManager.export()
	}

	// ========== 监控控制 Handlers ==========

	private async handleMonitoringStart() {
		this.stateManager.startChecking()
	}

	private async handleMonitoringStop() {
		this.stateManager.stopChecking()
	}

	private async handleMonitoringIsRunning() {
		return this.stateManager.isChecking()
	}

	// ========== 通知相关 Handlers ==========

	private async handleNotificationShow(_event: Electron.IpcMainInvokeEvent, options: unknown) {
		return this.notificationManager.show(options as never)
	}

	private async handleNotificationGetHistory(
		_event: Electron.IpcMainInvokeEvent,
		limit?: number
	) {
		return this.notificationManager.getHistory(limit)
	}

	private async handleNotificationGetRecent(
		_event: Electron.IpcMainInvokeEvent,
		limit?: number
	) {
		return this.notificationManager.getRecent(limit)
	}

	private async handleNotificationGetByType(
		_event: Electron.IpcMainInvokeEvent,
		type: string
	) {
		return this.notificationManager.getByType(type as never)
	}

	private async handleNotificationClearHistory() {
		this.notificationManager.clearHistory()
	}

	private async handleNotificationGetStats() {
		return this.notificationManager.getStats()
	}

	private async handleNotificationSetMinInterval(
		_event: Electron.IpcMainInvokeEvent,
		interval: number
	) {
		this.notificationManager.setMinInterval(interval)
	}

	private async handleNotificationShowBatch(
		_event: Electron.IpcMainInvokeEvent,
		notifications: unknown[],
		delay?: number
	) {
		return this.notificationManager.showBatch(notifications as never, delay)
	}

	// ========== 窗口控制 Handlers ==========

	private async handleWindowShow() {
		if (this.mainWindow) {
			this.mainWindow.show()
		}
	}

	private async handleWindowHide() {
		if (this.mainWindow) {
			this.mainWindow.hide()
		}
	}

	private async handleWindowMinimize() {
		if (this.mainWindow) {
			this.mainWindow.minimize()
		}
	}

	private async handleWindowMaximize() {
		if (this.mainWindow) {
			if (this.mainWindow.isMaximized()) {
				this.mainWindow.unmaximize()
			} else {
				this.mainWindow.maximize()
			}
		}
	}

	private async handleWindowClose() {
		if (this.mainWindow) {
			this.mainWindow.close()
		}
	}

	// ========== 应用信息 Handlers ==========

	private async handleAppGetVersion() {
		return app.getVersion()
	}

	private async handleAppGetName() {
		return app.getName()
	}

	private async handleAppShowAboutPanel() {
		app.showAboutPanel()
	}

	private async handleAppQuit() {
		app.quit()
	}

	/**
	 * 设置主窗口引用
	 */
	setMainWindow(window: BrowserWindow | null): void {
		this.mainWindow = window
	}

	/**
	 * 移除所有 IPC handlers
	 */
	removeAllHandlers(): void {
		// 移除所有配置相关 handlers
		ipcMain.removeHandler('config:get')
		ipcMain.removeHandler('config:set')
		ipcMain.removeHandler('config:get-all')
		ipcMain.removeHandler('config:set-many')
		ipcMain.removeHandler('config:reset')
		ipcMain.removeHandler('config:set-auto-start')
		ipcMain.removeHandler('config:export')
		ipcMain.removeHandler('config:import')

		// 移除所有状态相关 handlers
		ipcMain.removeHandler('state:get')
		ipcMain.removeHandler('state:set-unread-count')
		ipcMain.removeHandler('state:increment-unread-count')
		ipcMain.removeHandler('state:clear-unread-count')
		ipcMain.removeHandler('state:add-task')
		ipcMain.removeHandler('state:update-task')
		ipcMain.removeHandler('state:remove-task')
		ipcMain.removeHandler('state:clear-tasks')
		ipcMain.removeHandler('state:refresh')
		ipcMain.removeHandler('state:export')

		// 移除所有监控控制 handlers
		ipcMain.removeHandler('monitoring:start')
		ipcMain.removeHandler('monitoring:stop')
		ipcMain.removeHandler('monitoring:is-running')

		// 移除所有通知相关 handlers
		ipcMain.removeHandler('notification:show')
		ipcMain.removeHandler('notification:get-history')
		ipcMain.removeHandler('notification:get-recent')
		ipcMain.removeHandler('notification:get-by-type')
		ipcMain.removeHandler('notification:clear-history')
		ipcMain.removeHandler('notification:get-stats')
		ipcMain.removeHandler('notification:set-min-interval')
		ipcMain.removeHandler('notification:show-batch')

		// 移除所有窗口控制 handlers
		ipcMain.removeHandler('window:show')
		ipcMain.removeHandler('window:hide')
		ipcMain.removeHandler('window:minimize')
		ipcMain.removeHandler('window:maximize')
		ipcMain.removeHandler('window:close')

		// 移除所有应用信息 handlers
		ipcMain.removeHandler('app:get-version')
		ipcMain.removeHandler('app:get-name')
		ipcMain.removeHandler('app:show-about-panel')
		ipcMain.removeHandler('app:quit')

		console.log('[IPCHandlers] All handlers removed')
	}

	/**
	 * 销毁 IPC handlers
	 */
	destroy(): void {
		if (this.isDestroyed) {
			return
		}

		this.isDestroyed = true
		this.removeAllHandlers()

		console.log('[IPCHandlers] Destroyed')
	}

	/**
	 * 检查是否已销毁
	 */
	isDestroyed(): boolean {
		return this.isDestroyed
	}
}
