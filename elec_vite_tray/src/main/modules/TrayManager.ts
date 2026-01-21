/**
 * TrayManager - 托盘管理器
 * 负责托盘图标、菜单、交互事件管理
 */

import { Tray, Menu, nativeImage, BrowserWindow, app, type NativeImage, dialog } from 'electron'
import { EventBus } from './EventBus'
import { ConfigManager } from './ConfigManager'
import { StateManager } from './StateManager'
import { AppEvents, type TrayMenuItem } from '../types'
import { SystemInfo, type SystemInfoData } from './SystemInfo'

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

		// 系统信息子菜单
		const systemInfoSubmenu: TrayMenuItem[] = [
			{
				label: '查看系统状态',
				click: () => {
					this.showSystemInfo('system')
				}
			},
			{
				label: '查看服务状态',
				click: () => {
					this.showSystemInfo('services')
				}
			},
			{
				label: '查看端口信息',
				click: () => {
					this.showSystemInfo('ports')
				}
			},
			{ type: 'separator' },
			{
				label: '查看全部信息',
				click: () => {
					this.showSystemInfo('all')
				}
			}
		]

		menuItems.push({
			label: '系统信息',
			submenu: systemInfoSubmenu
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
		if (!this.tray || this._isDestroyed) return

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
		if (!this.tray || this._isDestroyed) return

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
		if (!this.tray || this._isDestroyed) return

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

	/**
	 * 显示系统信息对话框
	 * @param section 要显示的部分 (system | services | ports | all)
	 */
	private showSystemInfo(section: 'system' | 'services' | 'ports' | 'all'): void {
		try {
			// 适配 ConfigManager 接口
			const configManagerAdapter = {
				getAll: () => this.configManager.getAll(),
				get: (key: string) => {
					// ConfigManager 的 get 方法有类型约束，这里使用类型断言
					return (this.configManager as any).get(key)
				}
			}

			const systemInfo = SystemInfo.getAll(configManagerAdapter, this.stateManager)
			let content = ''

			switch (section) {
				case 'system':
					content = this.formatSystemStatus(systemInfo)
					break
				case 'services':
					content = this.formatServiceStatus(systemInfo)
					break
				case 'ports':
					content = this.formatPortInfo(systemInfo)
					break
				case 'all':
				default:
					content = SystemInfo.formatToText(systemInfo)
					break
			}

			dialog.showMessageBox({
				type: 'info',
				title: '系统信息',
				message: this.getDialogTitle(section),
				detail: content,
				buttons: ['刷新', '复制到剪贴板', '关闭'],
				defaultId: 0,
				cancelId: 2
			}).then((result) => {
				if (result.response === 0) {
					// 刷新 - 重新显示对话框
					this.showSystemInfo(section)
				} else if (result.response === 1) {
					// 复制到剪贴板
					const { clipboard } = require('electron')
					clipboard.writeText(content)
					console.log('[TrayManager] System info copied to clipboard')
				}
			})
		} catch (error) {
			console.error('[TrayManager] Failed to show system info:', error)
			dialog.showErrorBox('错误', `无法获取系统信息: ${(error as Error).message}`)
		}
	}

	/**
	 * 获取对话框标题
	 */
	private getDialogTitle(section: string): string {
		const titles = {
			system: '系统状态',
			services: '服务状态',
			ports: '端口信息',
			all: '完整系统信息'
		}
		return titles[section] || '系统信息'
	}

	/**
	 * 格式化系统状态
	 */
	private formatSystemStatus(data: SystemInfoData): string {
		const sys = data.system
		return `操作系统: ${sys.system.platform} ${sys.system.release}
架构: ${sys.system.arch}
主机名: ${sys.system.hostname}
运行时间: ${Math.floor(sys.system.uptime / 3600)} 小时

CPU:
  型号: ${sys.cpu.model}
  核心: ${sys.cpu.cores}
  使用率: ${sys.cpu.usage}%

内存:
  总计: ${sys.memory.total} MB
  已用: ${sys.memory.used} MB
  空闲: ${sys.memory.free} MB
  使用率: ${sys.memory.usage}%

进程:
  PID: ${sys.process.pid}
  Electron: ${sys.process.version}
  Node: ${sys.process.nodeVersion}
  内存占用: ${sys.process.memoryUsage} MB`
	}

	/**
	 * 格式化服务状态
	 */
	private formatServiceStatus(data: SystemInfoData): string {
		const svc = data.services
		return `应用名称: ${svc.app.name}
应用版本: ${svc.app.version}
监控状态: ${svc.app.isMonitoring ? '运行中' : '已停止'}
开机自启: ${svc.app.autoStart ? '是' : '否'}${svc.app.checkInterval ? `\n检查间隔: ${Math.round(svc.app.checkInterval / 1000)} 秒` : ''}

任务统计:
  总计: ${svc.monitoring.tasks.total}
  运行中: ${svc.monitoring.tasks.running}
  已完成: ${svc.monitoring.tasks.completed}
  失败: ${svc.monitoring.tasks.failed}

配置:
  启用通知: ${svc.config.enableNotification ? '是' : '否'}
  启用角标: ${svc.config.enableBadge ? '是' : '否'}
  托盘图标颜色: ${svc.config.trayIconColor}`
	}

	/**
	 * 格式化端口信息
	 */
	private formatPortInfo(data: SystemInfoData): string {
		if (data.ports.length === 0) {
			return '无活动端口'
		}

		return data.ports
			.map(
				(port) =>
					`端口 ${port.port} (${port.type}):\n  状态: ${port.status}\n  描述: ${port.description}${
						port.url ? `\n  URL: ${port.url}` : ''
					}`
			)
			.join('\n\n')
	}
}
