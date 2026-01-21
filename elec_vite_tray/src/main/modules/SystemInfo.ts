/**
 * SystemInfo - 系统信息收集模块
 * 负责收集系统状态、服务状态、端口信息等
 */

import os from 'node:os'
import process from 'node:process'

/**
 * 系统状态信息
 */
export interface SystemStatus {
	// CPU 信息
	cpu: {
		usage: number // CPU 使用率 (0-100)
		model: string // CPU 型号
	 cores: number // CPU 核心数
	}

	// 内存信息
	memory: {
		total: number // 总内存 (MB)
		used: number // 已用内存 (MB)
		free: number // 空闲内存 (MB)
		usage: number // 内存使用率 (0-100)
	}

	// 系统信息
	system: {
		platform: string // 操作系统
		release: string // 版本
		arch: string // 架构
		hostname: string // 主机名
		uptime: number // 运行时间 (秒)
	}

	// Electron 进程信息
	process: {
		pid: number // 进程 ID
		version: string // Electron 版本
		nodeVersion: string // Node 版本
		chromeVersion: string // Chrome 版本
		uptime: number // 进程运行时间 (秒)
		memoryUsage: number // 进程内存使用 (MB)
	}
}

/**
 * 服务状态信息
 */
export interface ServiceStatus {
	// 应用状态
	app: {
		name: string // 应用名称
		version: string // 应用版本
		isMonitoring: boolean // 是否正在监控
		autoStart: boolean // 是否开机自启
		lastCheckTime?: number // 最后检查时间
		checkInterval?: number // 检查间隔
	}

	// 监控状态
	monitoring: {
		isRunning: boolean // 是否运行中
		tasks: {
			total: number // 总任务数
			running: number // 运行中
			completed: number // 已完成
			failed: number // 失败
		}
	}

	// 配置状态
	config: {
		enableNotification: boolean // 是否启用通知
		enableBadge: boolean // 是否启用角标
		trayIconColor: string // 托盘图标颜色
	}
}

/**
 * 端口信息
 */
export interface PortInfo {
	port: number // 端口号
	type: 'main' | 'renderer' | 'preload' | 'api' | 'websocket' // 端口类型
	status: 'listening' | 'closed' | 'error' // 状态
	url?: string // 完整 URL
	description: string // 描述
}

/**
 * 完整的系统信息
 */
export interface SystemInfoData {
	system: SystemStatus
	services: ServiceStatus
	ports: PortInfo[]
	timestamp: number // 收集时间
}

export class SystemInfo {
	/**
	 * 获取 CPU 使用率
	 */
	private static getCpuUsage(): number {
		const cpus = os.cpus()
		let totalIdle = 0
		let totalTick = 0

		cpus.forEach((cpu) => {
			for (const type in cpu.times) {
				totalTick += cpu.times[type as keyof typeof cpu.times]
			}
			totalIdle += cpu.times.idle
		})

		const idle = totalIdle / cpus.length
		const total = totalTick / cpus.length
		const usage = 100 - (100 * idle) / total

		return Math.round(usage * 100) / 100
	}

	/**
	 * 格式化字节为 MB
	 */
	private static bytesToMB(bytes: number): number {
		return Math.round((bytes / 1024 / 1024) * 100) / 100
	}

	/**
	 * 获取系统状态
	 */
	static getSystemStatus(): SystemStatus {
		// 获取内存信息
		const totalMem = os.totalmem()
		const freeMem = os.freemem()
		const usedMem = totalMem - freeMem

		// 获取进程信息
		const processMemory = process.memoryUsage()
		const processUptime = process.uptime()

		return {
			cpu: {
				usage: this.getCpuUsage(),
				model: os.cpus()[0]?.model || 'Unknown',
				cores: os.cpus().length
			},
			memory: {
				total: this.bytesToMB(totalMem),
				used: this.bytesToMB(usedMem),
				free: this.bytesToMB(freeMem),
				usage: Math.round((usedMem / totalMem) * 10000) / 100
			},
			system: {
				platform: os.platform(),
				release: os.release(),
				arch: os.arch(),
				hostname: os.hostname(),
				uptime: Math.round(os.uptime())
			},
			process: {
				pid: process.pid,
				version: process.versions.electron || 'Unknown',
				nodeVersion: process.versions.node,
				chromeVersion: process.versions.chrome,
				uptime: Math.round(processUptime),
				memoryUsage: this.bytesToMB(processMemory.heapUsed)
			}
		}
	}

	/**
	 * 获取服务状态
	 * @param configManager 配置管理器实例
	 * @param stateManager 状态管理器实例
	 */
	static getServiceStatus(
		configManager: { getAll: () => any; get: (key: string) => any },
		stateManager: { getState: () => any }
	): ServiceStatus {
		const config = configManager.getAll()
		const state = stateManager.getState()

		const tasks = state.tasks || []
		const runningTasks = tasks.filter((t: any) => t.status === 'running')
		const completedTasks = tasks.filter((t: any) => t.status === 'completed')
		const failedTasks = tasks.filter((t: any) => t.status === 'failed')

		return {
			app: {
				name: 'ElecViteTray', // 从 package.json 读取
				version: process.env.npm_package_version || '1.0.0',
				isMonitoring: state.isMonitoring,
				autoStart: config.autoStart,
				lastCheckTime: state.lastCheckTime,
				checkInterval: config.checkInterval
			},
			monitoring: {
				isRunning: state.isMonitoring,
				tasks: {
					total: tasks.length,
					running: runningTasks.length,
					completed: completedTasks.length,
					failed: failedTasks.length
				}
			},
			config: {
				enableNotification: config.enableNotification,
				enableBadge: config.enableBadge,
				trayIconColor: config.trayIconColor
			}
		}
	}

	/**
	 * 获取端口信息
	 */
	static getPortInfo(): PortInfo[] {
		const ports: PortInfo[] = []

		// 主进程开发服务器端口 (如果有)
		if (process.env.ELECTRON_RENDERER_URL) {
			const url = new URL(process.env.ELECTRON_RENDERER_URL)
			ports.push({
				port: parseInt(url.port) || 5173,
				type: 'renderer',
				status: 'listening',
				url: process.env.ELECTRON_RENDERER_URL,
				description: '渲染进程开发服务器'
			})
		}

		// 如果有 API 服务端口
		if (process.env.API_PORT) {
			ports.push({
				port: parseInt(process.env.API_PORT),
				type: 'api',
				status: 'listening',
				description: 'API 服务'
			})
		}

		// 如果有 WebSocket 端口
		if (process.env.WS_PORT) {
			ports.push({
				port: parseInt(process.env.WS_PORT),
				type: 'websocket',
				status: 'listening',
				description: 'WebSocket 服务'
			})
		}

		// 默认添加常用端口说明
		if (ports.length === 0) {
			ports.push({
				port: 5173,
				type: 'renderer',
				status: 'closed',
				description: 'Vite 开发服务器 (未启动)'
			})
		}

		return ports
	}

	/**
	 * 获取完整的系统信息
	 * @param configManager 配置管理器实例
	 * @param stateManager 状态管理器实例
	 */
	static getAll(
		configManager: { getAll: () => any; get?: (key: string) => any },
		stateManager: { getState: () => any }
	): SystemInfoData {
		// 为 getServiceStatus 创建一个带有 get 方法的兼容对象
		const configManagerWithGet = {
			getAll: () => configManager.getAll(),
			get: (key: string) => (configManager.get ? configManager.get(key) : undefined)
		}

		return {
			system: this.getSystemStatus(),
			services: this.getServiceStatus(configManagerWithGet, stateManager),
			ports: this.getPortInfo(),
			timestamp: Date.now()
		}
	}

	/**
	 * 格式化系统信息为可读文本
	 */
	static formatToText(data: SystemInfoData): string {
		const lines: string[] = []

		lines.push('=== 系统状态 ===')
		lines.push(`操作系统: ${data.system.system.platform} ${data.system.system.release}`)
		lines.push(`架构: ${data.system.system.arch}`)
		lines.push(`主机名: ${data.system.system.hostname}`)
		lines.push(`运行时间: ${Math.floor(data.system.system.uptime / 3600)}小时`)
		lines.push('')
		lines.push('CPU:')
		lines.push(`  型号: ${data.system.cpu.model}`)
		lines.push(`  核心: ${data.system.cpu.cores}`)
		lines.push(`  使用率: ${data.system.cpu.usage}%`)
		lines.push('')
		lines.push('内存:')
		lines.push(`  总计: ${data.system.memory.total} MB`)
		lines.push(`  已用: ${data.system.memory.used} MB`)
		lines.push(`  空闲: ${data.system.memory.free} MB`)
		lines.push(`  使用率: ${data.system.memory.usage}%`)
		lines.push('')
		lines.push('进程:')
		lines.push(`  PID: ${data.system.process.pid}`)
		lines.push(`  Electron: ${data.system.process.version}`)
		lines.push(`  Node: ${data.system.process.nodeVersion}`)
		lines.push(`  内存占用: ${data.system.process.memoryUsage} MB`)

		lines.push('')
		lines.push('=== 服务状态 ===')
		lines.push(`应用名称: ${data.services.app.name}`)
		lines.push(`应用版本: ${data.services.app.version}`)
		lines.push(`监控状态: ${data.services.app.isMonitoring ? '运行中' : '已停止'}`)
		lines.push(`开机自启: ${data.services.app.autoStart ? '是' : '否'}`)
		if (data.services.app.checkInterval) {
			lines.push(`检查间隔: ${Math.round(data.services.app.checkInterval / 1000)}秒`)
		}
		lines.push('')
		lines.push('任务统计:')
		lines.push(`  总计: ${data.services.monitoring.tasks.total}`)
		lines.push(`  运行中: ${data.services.monitoring.tasks.running}`)
		lines.push(`  已完成: ${data.services.monitoring.tasks.completed}`)
		lines.push(`  失败: ${data.services.monitoring.tasks.failed}`)

		lines.push('')
		lines.push('=== 端口信息 ===')
		if (data.ports.length === 0) {
			lines.push('无活动端口')
		} else {
			data.ports.forEach((port) => {
				lines.push(
					`${port.port} (${port.type}): ${port.description} - ${port.status}${
						port.url ? ` (${port.url})` : ''
					}`
				)
			})
		}

		lines.push('')
		lines.push(`更新时间: ${new Date(data.timestamp).toLocaleString('zh-CN')}`)

		return lines.join('\n')
	}
}
