/**
 * ConfigManager - 配置管理器
 * 负责配置持久化、开机自启动、配置读写
 */

import { app } from 'electron'
import Store from 'electron-store'
import type { AppConfig } from '../types'
import { EventBus } from './EventBus'
import { AppEvents } from '../types'

const DEFAULT_CONFIG: AppConfig = {
	// 监控配置
	checkInterval: 60000, // 默认60秒
	enableNotification: true,

	// 托盘配置
	enableBadge: true,
	trayIconColor: 'default',

	// 启动配置
	autoStart: false,
	startMinimized: false
}

export class ConfigManager {
	private store: Store<AppConfig>
	private eventBus: EventBus
	private _isDestroyed = false

	constructor(eventBus: EventBus, storeName = 'app-config') {
		this.eventBus = eventBus

		// 初始化 electron-store
		this.store = new Store<AppConfig>({
			name: storeName,
			defaults: DEFAULT_CONFIG
		})

		// 监听配置变更并发出事件
		this.store.onDidAnyChange((newVal, oldVal) => {
			if (!this._isDestroyed) {
				this.eventBus.emit(AppEvents.CONFIG_CHANGED, {
					old: oldVal,
					new: newVal
				})
			}
		})
	}

	/**
	 * 获取配置值
	 * @param key 配置键
	 */
	get<K extends keyof AppConfig>(key: K): AppConfig[K] {
		return this.store.get(key)
	}

	/**
	 * 设置配置值
	 * @param key 配置键
	 * @param value 配置值
	 */
	set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
		this.store.set(key, value)
	}

	/**
	 * 获取所有配置
	 */
	getAll(): AppConfig {
		return this.store.store
	}

	/**
	 * 设置多个配置值
	 * @param config 配置对象
	 */
	setMany(config: Partial<AppConfig>): void {
		Object.entries(config).forEach(([key, value]) => {
			this.store.set(key as keyof AppConfig, value as AppConfig[keyof AppConfig])
		})
	}

	/**
	 * 重置配置为默认值
	 */
	reset(): void {
		this.store.clear()
		// 清除后会自动使用 defaults
	}

	/**
	 * 重置单个配置项为默认值
	 * @param key 配置键
	 */
	resetKey<K extends keyof AppConfig>(key: K): void {
		this.set(key, DEFAULT_CONFIG[key])
	}

	/**
	 * 检查配置键是否存在
	 * @param key 配置键
	 */
	has<K extends keyof AppConfig>(key: K): boolean {
		return this.store.has(key)
	}

	/**
	 * 删除配置键（恢复为默认值）
	 * @param key 配置键
	 */
	delete<K extends keyof AppConfig>(key: K): void {
		this.store.delete(key)
	}

	/**
	 * 设置开机自启动
	 * @param enable 是否启用
	 */
	setAutoStart(enable: boolean): void {
		try {
			app.setLoginItemSettings({
				openAtLogin: enable,
				openAsHidden: this.get('startMinimized'),
				name: app.getName()
			})

			// 更新配置
			this.set('autoStart', enable)
		} catch (error) {
			console.error('[ConfigManager] Failed to set auto start:', error)
			throw new Error(`设置开机自启动失败: ${(error as Error).message}`)
		}
	}

	/**
	 * 获取开机自启动状态
	 */
	isAutoStartEnabled(): boolean {
		try {
			// macOS 和 Windows 的检查方式不同
			const loginItemSettings = app.getLoginItemSettings()
			return loginItemSettings.openAtLogin
		} catch (error) {
			console.error('[ConfigManager] Failed to get auto start status:', error)
			return this.get('autoStart')
		}
	}

	/**
	 * 获取配置文件路径
	 */
	getPath(): string {
		return this.store.path
	}

	/**
	 * 获取配置文件大小（字节）
	 */
	getSize(): number {
		return this.store.size
	}

	/**
	 * 导出配置为 JSON 字符串
	 */
	export(): string {
		return JSON.stringify(this.store.store, null, 2)
	}

	/**
	 * 从 JSON 字符串导入配置
	 * @param jsonString JSON 字符串
	 */
	import(jsonString: string): void {
		try {
			const config = JSON.parse(jsonString) as Partial<AppConfig>
			this.setMany(config)
		} catch (error) {
			console.error('[ConfigManager] Failed to import config:', error)
			throw new Error(`导入配置失败: ${(error as Error).message}`)
		}
	}

	/**
	 * 清空所有配置
	 */
	clear(): void {
		this.store.clear()
	}

	/**
	 * 销毁配置管理器
	 */
	destroy(): void {
		if (this._isDestroyed) {
			return
		}

		this._isDestroyed = true
		// electron-store 不需要手动清理
	}

	/**
	 * 检查是否已销毁
	 */
	isDestroyed(): boolean {
		return this._isDestroyed
	}
}
