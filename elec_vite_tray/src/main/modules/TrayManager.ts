/**
 * TrayManager - 托盘管理器
 * 负责托盘图标、菜单、交互事件管理
 */

import { Tray, Menu, nativeImage, BrowserWindow, app, type NativeImage } from 'electron'
import { EventBus } from './EventBus'
import { ConfigManager } from './ConfigManager'
import { StateManager } from './StateManager'
import { AppEvents, type TrayMenuItem } from '../types'

export class TrayManager {
	private tray: Tray | null = null
	private eventBus: EventBus
	private configManager: ConfigManager
	private stateManager: StateManager
	private iconPath: string
	private _isDestroyed = false

	// 托盘图标缓存
	private iconCache: Map<string, NativeImage> = new Map()

	constructor(
		eventBus: EventBus,
		configManager: ConfigManager,
		stateManager: StateManager,
		iconPath: string
	) {
		this.eventBus = eventBus
		this.configManager = configManager
		this.stateManager = stateManager
		this.iconPath = iconPath

		// 监听状态变化，更新托盘
		this.eventBus.on(AppEvents.UNREAD_COUNT_CHANGED, () => {
			this.updateTrayIcon()
		})

		this.eventBus.on(AppEvents.TASK_STATUS_CHANGED, () => {
			this.updateMenu()
		})

		this.eventBus.on(AppEvents.WINDOW_SHOW, () => {
			this.onWindowShow()
		})

		this.eventBus.on(AppEvents.WINDOW_HIDE, () => {
			this.onWindowHide()
		})

		// 监听退出事件
		this.eventBus.on(AppEvents.APP_QUIT, () => {
			this.destroy()
		})
	}

	/**
	 * 创建托盘
	 */
	create(mainWindow?: BrowserWindow): void {
		if (this._isDestroyed) {
			throw new Error('[TrayManager] Cannot create tray on destroyed TrayManager')
		}

		if (this.tray) {
			console.warn('[TrayManager] Tray already exists')
			return
		}

		// 创建托盘图标
		const trayIcon = this.createTrayIcon()
		this.tray = new Tray(trayIcon)

		// 设置提示文本
		const tooltip = this.createTooltip()
		this.tray.setToolTip(tooltip)

		// 构建并设置菜单
		const menu = this.buildMenu(mainWindow)
		this.tray.setContextMenu(menu)

		// 绑定托盘事件
		this.bindEvents(mainWindow)

		console.log('[TrayManager] Tray created')
	}

	/**
	 * 创建托盘图标
	 */
	private createTrayIcon(): NativeImage {
		const state = this.stateManager.getState()
		const config = this.configManager.getAll()

		// 如果启用角标且有未读数，返回带角标的图标
		if (config.enableBadge && state.unreadCount > 0) {
			return this.createIconWithBadge(state.unreadCount)
		}

		// 根据配置的图标颜色返回对应图标
		return this.getIconByColor(config.trayIconColor)
	}

	/**
	 * 获取指定颜色的托盘图标
	 */
	private getIconByColor(color: string): NativeImage {
		const cacheKey = `icon-${color}`

		// 检查缓存
		if (this.iconCache.has(cacheKey)) {
			return this.iconCache.get(cacheKey)!
		}

		// 这里可以根据 color 返回不同的图标
		// 简化版本：使用同一个图标
		const icon = nativeImage.createFromPath(this.iconPath).resize({
			width: 16,
			height: 16
		})

		this.iconCache.set(cacheKey, icon)
		return icon
	}

	/**
	 * 创建带角标的托盘图标
	 * @param count 未读数量
	 */
	private createIconWithBadge(count: number): NativeImage {
		const cacheKey = `badge-${count}`

		// 检查缓存
		if (this.iconCache.has(cacheKey)) {
			return this.iconCache.get(cacheKey)!
		}

		// 加载基础图标
		const baseIcon = nativeImage.createFromPath(this.iconPath).resize({
			width: 16,
			height: 16
		})

		// 注意：真实的角标绘制需要使用 canvas 库
		// 这里作为简化版本，我们使用 Electron 的模板图标功能
		// 或者返回原始图标（实际项目中应该引入 canvas 进行绘制）

		// 简化实现：返回带标记的图标
		// 在实际项目中，这里应该使用 canvas 绘制角标
		const icon = baseIcon

		this.iconCache.set(cacheKey, icon)
		return icon
	}

	/**
	 * 创建工具提示文本
	 */
	private createTooltip(): string {
		const state = this.stateManager.getState()
		const appName = app.getName()

		if (state.unreadCount > 0) {
			return `${appName} - ${state.unreadCount} 条未读消息`
		}

		if (state.isMonitoring) {
			return `${appName} - 监控中`
		}

		return appName
	}

	/**
	 * 构建托盘菜单
	 */
	private buildMenu(mainWindow?: BrowserWindow): Menu {
		const state = this.stateManager.getState()
		const config = this.configManager.getAll()

		const menuItems: TrayMenuItem[] = []

		// 显示未读数（如果有）
		if (config.enableBadge && state.unreadCount > 0) {
			menuItems.push({
				label: `未读消息: ${state.unreadCount}`,
				enabled: false
			})
			menuItems.push({ type: 'separator' })
		}

		// 窗口控制
		menuItems.push({
			label: '显示窗口',
			click: () => {
				this.eventBus.emit(AppEvents.WINDOW_SHOW)
				if (mainWindow) mainWindow.show()
			}
		})

		menuItems.push({
			label: '隐藏窗口',
			click: () => {
				this.eventBus.emit(AppEvents.WINDOW_HIDE)
				if (mainWindow) mainWindow.hide()
			}
		})

		menuItems.push({ type: 'separator' })

		// 监控控制
		const monitoringSubmenu: TrayMenuItem[] = [
			{
				label: state.isMonitoring ? '停止监控' : '开始监控',
				click: () => {
					if (state.isMonitoring) {
						this.stateManager.stopChecking()
					} else {
						this.stateManager.startChecking()
					}
				}
			},
			{
				label: '立即检查',
				click: () => {
					this.stateManager.checkState()
				}
			}
		]

		// 添加任务列表（如果有运行中的任务）
		const runningTasks = this.stateManager.getTasksByStatus('running')
		if (runningTasks.length > 0) {
			runningTasks.forEach((task) => {
				monitoringSubmenu.push({
					label: `${task.name} (${task.progress || 0}%)`,
					enabled: false
				})
			})
		}

		menuItems.push({
			label: '监控状态',
			submenu: monitoringSubmenu
		})

		menuItems.push({ type: 'separator' })

		// 设置
		menuItems.push({
			label: '设置',
			click: () => {
				this.eventBus.emit(AppEvents.WINDOW_SHOW)
				this.eventBus.emit('settings:navigate')
				if (mainWindow) mainWindow.show()
			}
		})

		// 关于
		menuItems.push({
			label: '关于',
			click: () => {
				app.showAboutPanel()
			}
		})

		menuItems.push({ type: 'separator' })

		// 退出
		menuItems.push({
			label: '退出',
			click: () => {
				this.eventBus.emit(AppEvents.APP_QUIT)
				app.quit()
			}
		})

		return Menu.buildFromTemplate(menuItems as any)
	}

	/**
	 * 绑定托盘事件
	 */
	private bindEvents(mainWindow?: BrowserWindow): void {
		if (!this.tray) return

		// 双击事件
		this.tray.on('double-click', () => {
			if (mainWindow) {
				if (mainWindow.isVisible()) {
					mainWindow.hide()
				} else {
					mainWindow.show()
				}
			}
		})

		// 单击事件（仅 Windows/Linux）
		if (process.platform !== 'darwin') {
			this.tray.on('click', () => {
				if (mainWindow) {
					mainWindow.show()
				}
			})
		}
	}

	/**
	 * 更新托盘图标
	 */
	private updateTrayIcon(): void {
		if (!this.tray || this.isDestroyed) return

		const newIcon = this.createTrayIcon()
		this.tray.setImage(newIcon)

		// 更新提示文本
		const tooltip = this.createTooltip()
		this.tray.setToolTip(tooltip)

		console.log('[TrayManager] Tray icon updated')
	}

	/**
	 * 更新托盘菜单
	 */
	updateMenu(mainWindow?: BrowserWindow): void {
		if (!this.tray || this.isDestroyed) return

		const menu = this.buildMenu(mainWindow)
		this.tray.setContextMenu(menu)

		console.log('[TrayManager] Tray menu updated')
	}

	/**
	 * 窗口显示时的处理
	 */
	private onWindowShow(): void {
		// 可以在这里更新托盘状态
		console.log('[TrayManager] Window shown')
	}

	/**
	 * 窗口隐藏时的处理
	 */
	private onWindowHide(): void {
		// 可以在这里更新托盘状态
		console.log('[TrayManager] Window hidden')
	}

	/**
	 * 显示气球通知（仅 Windows）
	 */
	displayBalloon(options: { title: string; content: string }): void {
		if (!this.tray || this.isDestroyed) return

		if (process.platform === 'win32') {
			this.tray.displayBalloon(options)
		}
	}

	/**
	 * 获取托盘是否已创建
	 */
	isCreated(): boolean {
		return this.tray !== null
	}

	/**
	 * 销毁托盘管理器
	 */
	destroy(): void {
		if (this._isDestroyed) {
			return
		}

		this._isDestroyed = true

		if (this.tray) {
			this.tray.destroy()
			this.tray = null
		}

		// 清理图标缓存
		this.iconCache.clear()

		console.log('[TrayManager] Tray destroyed')
	}

	/**
	 * 检查是否已销毁
	 */
	isDestroyed(): boolean {
		return this._isDestroyed
	}
}
