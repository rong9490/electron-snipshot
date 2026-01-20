/**
 * Electron 主进程入口
 * 集成所有模块：EventBus, ConfigManager, StateManager, NotificationManager, TrayManager, IPCHandlers
 */

import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell } from 'electron'
import icon from '../../resources/icon.png?asset'

// 导入所有模块
import { EventBus } from './modules/EventBus'
import { ConfigManager } from './modules/ConfigManager'
import { StateManager } from './modules/StateManager'
import { NotificationManager } from './modules/NotificationManager'
import { TrayManager } from './modules/TrayManager'
import { IPCHandlers } from './modules/IPCHandlers'
import { AppEvents } from './types'

// 全局变量
let mainWindow: BrowserWindow | null = null
let isQuitting = false

// 模块实例
let eventBus: EventBus | null = null
let configManager: ConfigManager | null = null
let stateManager: StateManager | null = null
let notificationManager: NotificationManager | null = null
let trayManager: TrayManager | null = null
let ipcHandlers: IPCHandlers | null = null

/**
 * 创建主窗口
 */
function createWindow(): void {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 900,
		height: 670,
		show: false,
		autoHideMenuBar: true,
		...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false
		}
	})

	mainWindow.on('ready-to-show', () => {
		mainWindow?.show()
	})

	mainWindow.on('close', (event) => {
		// 阻止窗口关闭，改为隐藏到托盘
		if (!isQuitting) {
			event.preventDefault()
			mainWindow?.hide()

			// 发出窗口隐藏事件
			eventBus?.emit(AppEvents.WINDOW_HIDE)
		}
	})

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url)
		return { action: 'deny' }
	})

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env.ELECTRON_RENDERER_URL) {
		// mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
		mainWindow.loadURL('https://adssx-tcloud.tsintergy.com/usercenter/#/login')
	} else {
		// mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
		mainWindow.loadURL('https://adssx-tcloud.tsintergy.com/usercenter/#/login')
	}

	// 窗口显示后发出事件
	mainWindow.once('ready-to-show', () => {
		eventBus?.emit(AppEvents.WINDOW_SHOW)
	})

	// 更新 IPC handlers 的窗口引用
	if (ipcHandlers) {
		ipcHandlers.setMainWindow(mainWindow)
	}
}

/**
 * 初始化所有模块
 */
function initializeModules(): void {
	console.log('[Main] Initializing modules...')

	// 1. 初始化事件总线（最先初始化）
	eventBus = new EventBus()
	console.log('[Main] ✓ EventBus initialized')

	// 2. 初始化配置管理器
	configManager = new ConfigManager(eventBus, 'app-config')
	console.log('[Main] ✓ ConfigManager initialized')

	// 3. 初始化状态管理器
	stateManager = new StateManager(eventBus, configManager)
	console.log('[Main] ✓ StateManager initialized')

	// 4. 初始化通知管理器
	notificationManager = new NotificationManager(eventBus, configManager)
	console.log('[Main] ✓ NotificationManager initialized')

	// 5. 初始化托盘管理器
	trayManager = new TrayManager(eventBus, configManager, stateManager, icon)
	console.log('[Main] ✓ TrayManager initialized')

	// 6. 初始化 IPC handlers
	ipcHandlers = new IPCHandlers(configManager, stateManager, notificationManager, mainWindow)
	console.log('[Main] ✓ IPCHandlers initialized')

	// 7. 设置退出事件监听
	eventBus.on(AppEvents.APP_QUIT, () => {
		console.log('[Main] Quit event received, quitting application...')
		app.quit()
	})

	console.log('[Main] All modules initialized successfully!')
}

/**
 * 启动应用功能
 */
function startApplication(): void {
	if (!trayManager || !stateManager || !configManager) {
		console.error('[Main] Modules not initialized')
		return
	}

	// 创建托盘
	trayManager.create(mainWindow ?? undefined)

	// 读取配置，决定是否启动监控
	const config = configManager.getAll()
	if (config.autoStart || process.argv.includes('--start-minimized')) {
		// 如果配置了启动监控或指定了最小化启动参数
		if (config.autoStart) {
			console.log('[Main] Auto-starting monitoring...')
			stateManager.startChecking(config.checkInterval)
		}

		if (config.startMinimized || process.argv.includes('--start-minimized')) {
			mainWindow?.hide()
		}
	}

	console.log('[Main] Application started!')
}

/**
 * 清理所有模块
 */
function cleanupModules(): void {
	console.log('[Main] Cleaning up modules...')

	// 停止监控
	if (stateManager) {
		stateManager.stopChecking()
	}

	// 按相反顺序销毁模块
	if (ipcHandlers) {
		ipcHandlers.destroy()
		ipcHandlers = null
		console.log('[Main] ✓ IPCHandlers destroyed')
	}

	if (trayManager) {
		trayManager.destroy()
		trayManager = null
		console.log('[Main] ✓ TrayManager destroyed')
	}

	if (notificationManager) {
		notificationManager.destroy()
		notificationManager = null
		console.log('[Main] ✓ NotificationManager destroyed')
	}

	if (stateManager) {
		stateManager.destroy()
		stateManager = null
		console.log('[Main] ✓ StateManager destroyed')
	}

	if (configManager) {
		configManager.destroy()
		configManager = null
		console.log('[Main] ✓ ConfigManager destroyed')
	}

	if (eventBus) {
		eventBus.destroy()
		eventBus = null
		console.log('[Main] ✓ EventBus destroyed')
	}

	console.log('[Main] All modules cleaned up!')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	// Set app user model id for windows
	electronApp.setAppUserModelId('com.electron')

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	// 初始化所有模块
	initializeModules()

	// 创建窗口
	createWindow()

	// 启动应用功能
	startApplication()

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
			if (trayManager) {
				trayManager.updateMenu(mainWindow ?? undefined)
			}
		}
	})
})

// 托盘模式下，不希望在窗口关闭时退出应用
// 只有通过托盘菜单的"退出应用"才会真正退出
app.on('window-all-closed', () => {
	// 在托盘模式下，窗口关闭时不退出应用
	// macOS 除外，保持原有行为
	if (process.platform === 'darwin') {
		// macOS 上，如果没有窗口，也不退出，因为有托盘
		// 如果需要退出，用户需要通过托盘菜单或 Cmd+Q
	}
})

// 应用退出前清理所有资源
app.on('before-quit', () => {
	console.log('[Main] Application quitting...')
	isQuitting = true

	// 发出退出事件
	if (eventBus) {
		eventBus.emit(AppEvents.APP_QUIT)
	}

	// 清理所有模块
	cleanupModules()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
