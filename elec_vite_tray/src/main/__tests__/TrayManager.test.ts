/**
 * TrayManager 单元测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TrayManager } from '../modules/TrayManager'
import { EventBus } from '../modules/EventBus'
import { ConfigManager } from '../modules/ConfigManager'
import { StateManager } from '../modules/StateManager'
import { AppEvents } from '../types'

// Mock Electron APIs
const mockTray = {
	destroy: vi.fn(),
	setImage: vi.fn(),
	setContextMenu: vi.fn(),
	setToolTip: vi.fn(),
	displayBalloon: vi.fn(),
	on: vi.fn()
}

const mockMenu = {
	buildFromTemplate: vi.fn(() => ({ close: vi.fn() }))
}

vi.mock('electron', () => ({
	Tray: vi.fn().mockImplementation(() => mockTray),
	Menu: {
		buildFromTemplate: mockMenu.buildFromTemplate
	},
	nativeImage: {
		createFromPath: vi.fn(() => ({
			resize: vi.fn(() => ({
				toDataURL: vi.fn(() => 'data:image/png;base64,mock')
			}))
		}))
	},
	app: {
		getName: vi.fn(() => 'TestApp'),
		showAboutPanel: vi.fn(),
		quit: vi.fn()
	}
}))

describe('TrayManager', () => {
	let trayManager: TrayManager
	let eventBus: EventBus
	let configManager: any
	let stateManager: any
	let mockIconPath: string

	beforeEach(() => {
		eventBus = new EventBus()

		// Mock ConfigManager
		configManager = {
			get: vi.fn((key: string) => {
				const defaults: any = {
					enableBadge: true,
					trayIconColor: 'default'
				}
				return defaults[key]
			}),
			getAll: vi.fn(() => ({
				enableBadge: true,
				trayIconColor: 'default'
			}))
		}

		// Mock StateManager
		stateManager = {
			getState: vi.fn(() => ({
				unreadCount: 0,
				tasks: [],
				isMonitoring: false
			})),
			get: vi.fn((key: string) => {
				const state: any = {
					unreadCount: 0,
					tasks: [],
					isMonitoring: false
				}
				return state[key]
			}),
			getTasksByStatus: vi.fn(() => []),
			checkState: vi.fn(),
			startChecking: vi.fn(),
			stopChecking: vi.fn()
		}

		mockIconPath = '/mock/path/to/icon.png'
		trayManager = new TrayManager(
			eventBus,
			configManager,
			stateManager,
			mockIconPath
		)
	})

	afterEach(() => {
		trayManager.destroy()
		eventBus.destroy()
	})

	describe('创建托盘', () => {
		it('应该能够创建托盘', () => {
			const { Tray } = require('electron')
			expect(Tray).not.toHaveBeenCalled()

			trayManager.create()

			expect(Tray).toHaveBeenCalled()
			expect(trayManager.isCreated()).toBe(true)
		})

		it('创建托盘时应该设置图标', () => {
			trayManager.create()

			expect(mockTray.setImage).toHaveBeenCalled()
		})

		it('创建托盘时应该设置工具提示', () => {
			const { app } = require('electron')
			trayManager.create()

			expect(mockTray.setToolTip).toHaveBeenCalledWith('TestApp')
		})

		it('创建托盘时应该设置菜单', () => {
			trayManager.create()

			expect(mockMenu.buildFromTemplate).toHaveBeenCalled()
			expect(mockTray.setContextMenu).toHaveBeenCalled()
		})

		it('应该绑定托盘事件', () => {
			trayManager.create()

			expect(mockTray.on).toHaveBeenCalledWith('double-click', expect.any(Function))
		})

		it('不应该重复创建托盘', () => {
			const { Tray } = require('electron')

			trayManager.create()
			trayManager.create()

			expect(Tray).toHaveBeenCalledTimes(1)
		})

		it('销毁后创建应该抛出错误', () => {
			trayManager.destroy()

			expect(() => {
				trayManager.create()
			}).toThrow('destroyed TrayManager')
		})
	})

	describe('托盘图标', () => {
		beforeEach(() => {
			trayManager.create()
		})

		it('未读数变化时应该更新图标', () => {
			stateManager.getState = vi.fn(() => ({
				unreadCount: 5,
				tasks: [],
				isMonitoring: false
			}))

			eventBus.emit(AppEvents.UNREAD_COUNT_CHANGED)

			// 图标应该被更新
			expect(mockTray.setImage).toHaveBeenCalled()
		})

		it('应该根据配置显示未读数', () => {
			configManager.get = vi.fn((key: string) => {
				if (key === 'enableBadge') return true
				return 'default'
			})

			stateManager.getState = vi.fn(() => ({
				unreadCount: 10,
				tasks: [],
				isMonitoring: false
			}))

			eventBus.emit(AppEvents.UNREAD_COUNT_CHANGED)

			expect(mockTray.setImage).toHaveBeenCalled()
		})
	})

	describe('托盘菜单', () => {
		beforeEach(() => {
			trayManager.create()
		})

		it('任务状态变化时应该更新菜单', () => {
			trayManager.updateMenu()

			expect(mockMenu.buildFromTemplate).toHaveBeenCalled()
			expect(mockTray.setContextMenu).toHaveBeenCalled()
		})

		it('应该包含基本的菜单项', () => {
			trayManager.updateMenu()

			const menuTemplate = mockMenu.buildFromTemplate.mock.calls[0][0]
			const labels = menuTemplate.map((item: any) => item.label)

			expect(labels).toContain('显示窗口')
			expect(labels).toContain('隐藏窗口')
			expect(labels).toContain('设置')
			expect(labels).toContain('关于')
			expect(labels).toContain('退出')
		})

		it('未读数大于0时应该在菜单中显示', () => {
			stateManager.getState = vi.fn(() => ({
				unreadCount: 5,
				tasks: [],
				isMonitoring: false
			}))

			trayManager.updateMenu()

			const menuTemplate = mockMenu.buildFromTemplate.mock.calls[0][0]
			const firstItem = menuTemplate[0]

			expect(firstItem.label).toContain('未读消息: 5')
		})

		it('应该包含监控控制菜单', () => {
			stateManager.getState = vi.fn(() => ({
				unreadCount: 0,
				tasks: [],
				isMonitoring: false
			}))

			trayManager.updateMenu()

			const menuTemplate = mockMenu.buildFromTemplate.mock.calls[0][0]
			const monitoringMenu = menuTemplate.find((item: any) => item.label === '监控状态')

			expect(monitoringMenu).toBeDefined()
			expect(monitoringMenu.submenu).toBeDefined()
		})

		it('监控中时应该显示"停止监控"', () => {
			stateManager.getState = vi.fn(() => ({
				unreadCount: 0,
				tasks: [],
				isMonitoring: true
			}))

			trayManager.updateMenu()

			const menuTemplate = mockMenu.buildFromTemplate.mock.calls[0][0]
			const monitoringMenu = menuTemplate.find((item: any) => item.label === '监控状态')
			const startStopItem = monitoringMenu.submenu[0]

			expect(startStopItem.label).toBe('停止监控')
		})

		it('未监控时应该显示"开始监控"', () => {
			stateManager.getState = vi.fn(() => ({
				unreadCount: 0,
				tasks: [],
				isMonitoring: false
			}))

			trayManager.updateMenu()

			const menuTemplate = mockMenu.buildFromTemplate.mock.calls[0][0]
			const monitoringMenu = menuTemplate.find((item: any) => item.label === '监控状态')
			const startStopItem = monitoringMenu.submenu[0]

			expect(startStopItem.label).toBe('开始监控')
		})
	})

	describe('工具提示', () => {
		beforeEach(() => {
			trayManager.create()
		})

		it('默认应该显示应用名称', () => {
			const tooltip = mockTray.setToolTip.mock.calls[0][0]
			expect(tooltip).toBe('TestApp')
		})

		it('有未读数时应该显示未读数量', () => {
			stateManager.getState = vi.fn(() => ({
				unreadCount: 5,
				tasks: [],
				isMonitoring: false
			}))

			eventBus.emit(AppEvents.UNREAD_COUNT_CHANGED)

			const tooltip = mockTray.setToolTip.mock.calls[
				mockTray.setToolTip.mock.calls.length - 1
			][0]
			expect(tooltip).toContain('5')
			expect(tooltip).toContain('未读消息')
		})

		it('监控中时应该显示监控状态', () => {
			stateManager.getState = vi.fn(() => ({
				unreadCount: 0,
				tasks: [],
				isMonitoring: true
			}))

			eventBus.emit(AppEvents.UNREAD_COUNT_CHANGED)

			const tooltip = mockTray.setToolTip.mock.calls[
				mockTray.setToolTip.mock.calls.length - 1
			][0]
			expect(tooltip).toContain('监控中')
		})
	})

	describe('气球通知', () => {
		beforeEach(() => {
			trayManager.create()
		})

		it('应该能够显示气球通知', () => {
			// 只在 Windows 上测试
			const originalPlatform = process.platform
			Object.defineProperty(process, 'platform', {
				value: 'win32'
			})

			trayManager.displayBalloon({
				title: '测试通知',
				content: '测试内容'
			})

			expect(mockTray.displayBalloon).toHaveBeenCalledWith({
				title: '测试通知',
				content: '测试内容'
			})

			// 恢复平台
			Object.defineProperty(process, 'platform', {
				value: originalPlatform
			})
		})

		it('非 Windows 平台应该不显示气球通知', () => {
			const originalPlatform = process.platform
			Object.defineProperty(process, 'platform', {
				value: 'darwin'
			})

			trayManager.displayBalloon({
				title: '测试通知',
				content: '测试内容'
			})

			expect(mockTray.displayBalloon).not.toHaveBeenCalled()

			// 恢复平台
			Object.defineProperty(process, 'platform', {
				value: originalPlatform
			})
		})
	})

	describe('事件处理', () => {
		beforeEach(() => {
			trayManager.create()
		})

		it('应该监听窗口显示事件', () => {
			const mock = vi.fn()
			eventBus.on(AppEvents.WINDOW_SHOW, mock)

			eventBus.emit(AppEvents.WINDOW_SHOW)

			expect(mock).toHaveBeenCalled()
		})

		it('应该监听窗口隐藏事件', () => {
			const mock = vi.fn()
			eventBus.on(AppEvents.WINDOW_HIDE, mock)

			eventBus.emit(AppEvents.WINDOW_HIDE)

			expect(mock).toHaveBeenCalled()
		})

		it('应该监听退出事件', () => {
			const destroySpy = vi.spyOn(trayManager, 'destroy')

			eventBus.emit(AppEvents.APP_QUIT)

			expect(destroySpy).toHaveBeenCalled()
		})
	})

	describe('生命周期管理', () => {
		it('应该能够销毁托盘管理器', () => {
			trayManager.create()
			trayManager.destroy()

			expect(mockTray.destroy).toHaveBeenCalled()
			expect(trayManager.isDestroyed()).toBe(true)
		})

		it('销毁后不应该有托盘实例', () => {
			trayManager.create()
			trayManager.destroy()

			expect(trayManager.isCreated()).toBe(false)
		})

		it('销毁后应该允许重复调用 destroy', () => {
			expect(() => {
				trayManager.destroy()
				trayManager.destroy()
				trayManager.destroy()
			}).not.toThrow()
		})

		it('销毁后不应该更新图标', () => {
			trayManager.create()
			trayManager.destroy()

			const updateSpy = vi.spyOn(trayManager as any, 'updateTrayIcon')

			eventBus.emit(AppEvents.UNREAD_COUNT_CHANGED)

			expect(updateSpy).not.toHaveBeenCalled()
		})
	})

	describe('辅助方法', () => {
		it('应该能够检查托盘是否已创建', () => {
			expect(trayManager.isCreated()).toBe(false)

			trayManager.create()
			expect(trayManager.isCreated()).toBe(true)

			trayManager.destroy()
			expect(trayManager.isCreated()).toBe(false)
		})
	})
})
