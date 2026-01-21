/**
 * Electron 主进程入口
 * 集成所有模块：EventBus, ConfigManager, StateManager, NotificationManager, TrayManager, IPCHandlers
 * 集成 NestJS 服务
 */

import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell } from 'electron'

// 导入 NestJS
import 'reflect-metadata'
import { ConfigManager } from './modules/ConfigManager'

// 导入所有模块
import { EventBus } from './modules/EventBus'
import { IPCHandlers } from './modules/IPCHandlers'
import { NotificationManager } from './modules/NotificationManager'
import { StateManager } from './modules/StateManager'
import { TrayManager } from './modules/TrayManager'
import { bootstrapNestJS, shutdownNestJS } from './nestjs/main'
import { AppEvents } from './types'

// 全局变量
let mainWindow: BrowserWindow | null = null
let isQuitting = false
let windowCount = 0 // 窗口计数器

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
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false
		}
	})

	mainWindow.on('ready-to-show', () => {
		mainWindow?.show()
	})

	// 窗口关闭事件 - 允许窗口正常关闭
	mainWindow.on('close', () => {
		// 如果正在退出，直接允许关闭
		if (isQuitting) {
			return
		}
		// 否则允许窗口正常关闭（不再阻止关闭并隐藏）
	})

	// 窗口已关闭事件 - 减少窗口计数
	mainWindow.on('closed', () => {
		windowCount--
		console.log(`[Main] Window closed. Remaining windows: ${windowCount}`)

		// 清除引用
		mainWindow = null

		// 如果没有窗口了，在非 macOS 平台退出应用
		if (windowCount === 0 && process.platform !== 'darwin') {
			console.log('[Main] All windows closed, quitting application...')
			app.quit()
		}
	})

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url)
		return { action: 'deny' }
	})

	// 添加快捷键：Ctrl/Cmd + Shift + T 加载测试页面
	mainWindow.webContents.on('before-input-event', (event, input) => {
		if ((input.control || input.meta) && input.shift && input.key.toLowerCase() === 't') {
			event.preventDefault()
			const testPagePath = join(__dirname, '../../test-env-injection.html')
			mainWindow?.loadFile(testPagePath)
			console.log('[Main] Loaded environment test page')
		}
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
		console.log('[Main] Window shown')
	})

	// 更新 IPC handlers 的窗口引用
	if (ipcHandlers) {
		ipcHandlers.setMainWindow(mainWindow)
	}

	// 增加窗口计数
	windowCount++
	console.log(`[Main] Window created. Total windows: ${windowCount}`)
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

	// 5. 初始化托盘管理器 - 计算正确的图标路径
	// 在开发环境：resources 目录在项目根目录
	// 在打包后：resources 目录在 app.asar.unpacked/resources/
	let trayIconPath: string
	if (app.isPackaged) {
		// 生产环境：使用 app.getAppPath() 获取应用根目录
		// app.asar.unpacked 目录与 app.asar 在同一级别
		const appPath = app.getAppPath()
		trayIconPath = join(appPath, 'app.asar.unpacked', 'resources', 'icon.png')
	} else {
		// 开发环境：直接使用相对路径
		trayIconPath = join(__dirname, '../../resources/icon.png')
	}
	trayManager = new TrayManager(eventBus, configManager, stateManager, trayIconPath)
	console.log('[Main] ✓ TrayManager initialized')

	// 6. 初始化 IPC handlers
	ipcHandlers = new IPCHandlers(configManager, stateManager, notificationManager, mainWindow)
	console.log('[Main] ✓ IPCHandlers initialized')

	// 6. 设置退出事件监听（注意：不要在这里调用 app.quit()，避免循环）
	eventBus.on(AppEvents.APP_QUIT, () => {
		console.log('[Main] Quit event received...')
		if (!isQuitting) {
			isQuitting = true
			app.quit()
		}
	})

	console.log('[Main] All modules initialized successfully!')
}

/**
 * 启动应用功能
 */
function startApplication(): void {
	if (!stateManager || !configManager) {
		console.error('[Main] Modules not initialized')
		return
	}

	// 读取配置，决定是否启动监控
	const config = configManager.getAll()
	if (config.autoStart) {
		// 如果配置了启动监控
		console.log('[Main] Auto-starting monitoring...')
		stateManager.startChecking(config.checkInterval)
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
app.whenReady().then(async () => {
	// Set app user model id for windows
	electronApp.setAppUserModelId('com.electron')

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	// 🚀 启动 NestJS 服务
	try {
		await bootstrapNestJS()
		console.log('[Main] ✓ NestJS service started')
	} catch (error) {
		console.error('[Main] ✗ Failed to start NestJS:', error)
		// NestJS 启动失败不应阻止 Electron 启动
	}

	// 初始化所有模块
	initializeModules()

	// 创建窗口
	createWindow()

	// 创建托盘
	if (trayManager) {
		trayManager.create(mainWindow ?? undefined)
		console.log('[Main] ✓ Tray created')
	}

	// 启动应用功能
	startApplication()

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

// 所有窗口关闭时的处理
// 注意：对于非 macOS 平台，窗口的 closed 事件中已经处理了退出逻辑
// macOS 用户通常期望即使所有窗口关闭，应用仍在运行（直到 Cmd+Q）
app.on('window-all-closed', () => {
	// 在 macOS 上，通常不在此处退出应用
	// macOS 用户习惯：关闭窗口 ≠ 退出应用，需要使用 Cmd+Q 才完全退出
	if (process.platform !== 'darwin') {
		// 非 macOS 平台，所有窗口关闭时退出应用
		// 注意：由于窗口的 closed 事件已经处理了退出，这里主要是防御性代码
		console.log('[Main] All windows closed event')
	}
})

// 应用退出前清理所有资源
app.on('before-quit', async () => {
	console.log('[Main] Application quitting...')
	isQuitting = true

	// 发出退出事件
	if (eventBus) {
		eventBus.emit(AppEvents.APP_QUIT)
	}

	// 🛑 关闭 NestJS 服务
	try {
		await shutdownNestJS()
		console.log('[Main] ✓ NestJS service shut down')
	} catch (error) {
		console.error('[Main] ✗ Error shutting down NestJS:', error)
	}

	// 清理所有模块
	cleanupModules()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
