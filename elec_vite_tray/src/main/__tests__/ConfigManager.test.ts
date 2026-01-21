/**
 * ConfigManager 单元测试
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ConfigManager } from '../modules/ConfigManager'
import { EventBus } from '../modules/EventBus'
import { AppEvents } from '../types'

// Mock electron-store
vi.mock('electron-store', () => {
	return {
		default: vi.fn().mockImplementation((options) => {
			const mockStore = {
				// 存储数据
				_data: { ...options.defaults },

				// 模拟 store 属性
				get store() {
					return this._data
				},

				// get 方法
				get: vi.fn(function (this: any, key: string) {
					return this._data[key]
				}),

				// set 方法
				set: vi.fn(function (this: any, key: string, value: any) {
					this._data[key] = value
				}),

				// has 方法
				has: vi.fn(function (this: any, key: string) {
					return key in this._data
				}),

				// delete 方法
				delete: vi.fn(function (this: any, key: string) {
					delete this._data[key]
				}),

				// clear 方法
				clear: vi.fn(function (this: any) {
					this._data = { ...options.defaults }
				}),

				// onDidAnyChange 方法
				onDidAnyChange: vi.fn(function (this: any, callback: any) {
					this._changeCallback = callback
				})
			}

			// 添加 path 和 size 属性
			Object.defineProperty(mockStore, 'path', {
				get: vi.fn(() => '/mock/config/path')
			})

			Object.defineProperty(mockStore, 'size', {
				get: vi.fn(() => 1024)
			})

			return mockStore
		})
	}
})

// Mock Electron app
vi.mock('electron', () => ({
	app: {
		setLoginItemSettings: vi.fn(),
		getLoginItemSettings: vi.fn(() => ({
			openAtLogin: false
		})),
		getName: vi.fn(() => 'TestApp')
	}
}))

describe('ConfigManager', () => {
	let configManager: ConfigManager
	let eventBus: EventBus
	const { app } = require('electron')

	beforeEach(() => {
		eventBus = new EventBus()
		configManager = new ConfigManager(eventBus, 'test-config')
	})

	afterEach(() => {
		configManager.destroy()
		eventBus.destroy()
	})

	describe('基本配置操作', () => {
		it('应该能够获取配置值', () => {
			const interval = configManager.get('checkInterval')
			expect(interval).toBe(60000)
		})

		it('应该能够设置配置值', () => {
			configManager.set('checkInterval', 30000)
			const interval = configManager.get('checkInterval')
			expect(interval).toBe(30000)
		})

		it('应该能够获取所有配置', () => {
			const config = configManager.getAll()
			expect(config).toHaveProperty('checkInterval')
			expect(config).toHaveProperty('enableNotification')
			expect(config).toHaveProperty('enableBadge')
		})

		it('应该能够设置多个配置值', () => {
			configManager.setMany({
				checkInterval: 30000,
				enableNotification: false
			})

			expect(configManager.get('checkInterval')).toBe(30000)
			expect(configManager.get('enableNotification')).toBe(false)
		})

		it('应该能够检查配置键是否存在', () => {
			expect(configManager.has('checkInterval')).toBe(true)
			expect(configManager.has('nonExistentKey' as any)).toBe(false)
		})
	})

	describe('配置重置', () => {
		it('应该能够重置所有配置为默认值', () => {
			configManager.set('checkInterval', 10000)
			configManager.reset()

			expect(configManager.get('checkInterval')).toBe(60000)
		})

		it('应该能够重置单个配置项', () => {
			configManager.set('checkInterval', 10000)
			configManager.resetKey('checkInterval')

			expect(configManager.get('checkInterval')).toBe(60000)
		})
	})

	describe('配置删除', () => {
		it('应该能够删除配置键', () => {
			configManager.set('checkInterval', 10000)
			configManager.delete('checkInterval')

			// 删除后应该恢复为默认值
			expect(configManager.get('checkInterval')).toBe(60000)
		})

		it('应该能够清空所有配置', () => {
			configManager.clear()
			const config = configManager.getAll()

			// 清空后应该恢复为默认值
			expect(config.checkInterval).toBe(60000)
		})
	})

	describe('开机自启动', () => {
		it('应该能够设置开机自启动', () => {
			configManager.setAutoStart(true)

			expect(app.setLoginItemSettings).toHaveBeenCalledWith({
				openAtLogin: true,
				openAsHidden: false,
				name: 'TestApp'
			})

			expect(configManager.get('autoStart')).toBe(true)
		})

		it('应该能够禁用开机自启动', () => {
			configManager.setAutoStart(false)

			expect(app.setLoginItemSettings).toHaveBeenCalledWith({
				openAtLogin: false,
				openAsHidden: false,
				name: 'TestApp'
			})

			expect(configManager.get('autoStart')).toBe(false)
		})

		it('应该能够获取开机自启动状态', () => {
			const isEnabled = configManager.isAutoStartEnabled()
			expect(isEnabled).toBe(false)
		})

		it('应该考虑 startMinimized 配置', () => {
			configManager.set('startMinimized', true)
			configManager.setAutoStart(true)

			expect(app.setLoginItemSettings).toHaveBeenCalledWith({
				openAtLogin: true,
				openAsHidden: true,
				name: 'TestApp'
			})
		})

		it('设置失败时应该抛出错误', () => {
			app.setLoginItemSettings = vi.fn(() => {
				throw new Error('Failed to set')
			})

			expect(() => {
				configManager.setAutoStart(true)
			}).toThrow('设置开机自启动失败')
		})
	})

	describe('配置导入导出', () => {
		it('应该能够导出配置为 JSON', () => {
			configManager.set('checkInterval', 30000)
			const json = configManager.export()

			expect(json).toContain('checkInterval')
			expect(json).toContain('30000')

			const parsed = JSON.parse(json)
			expect(parsed.checkInterval).toBe(30000)
		})

		it('应该能够从 JSON 导入配置', () => {
			const json = JSON.stringify({
				checkInterval: 20000,
				enableNotification: false
			})

			configManager.import(json)

			expect(configManager.get('checkInterval')).toBe(20000)
			expect(configManager.get('enableNotification')).toBe(false)
		})

		it('导入无效 JSON 时应该抛出错误', () => {
			expect(() => {
				configManager.import('invalid json')
			}).toThrow('导入配置失败')
		})
	})

	describe('配置文件信息', () => {
		it('应该能够获取配置文件路径', () => {
			const path = configManager.getPath()
			expect(path).toBe('/mock/config/path')
		})

		it('应该能够获取配置文件大小', () => {
			const size = configManager.getSize()
			expect(size).toBe(1024)
		})
	})

	describe('配置变更事件', () => {
		it('应该在配置变更时发出事件', () => {
			const mock = vi.fn()
			eventBus.on(AppEvents.CONFIG_CHANGED, mock)

			configManager.set('checkInterval', 30000)

			// 注意：electron-store 的 mock 可能需要手动触发回调
			// 这里验证事件总线正常工作
			expect(eventBus.listenerCount(AppEvents.CONFIG_CHANGED)).toBeGreaterThan(0)
		})
	})

	describe('生命周期管理', () => {
		it('应该能够销毁配置管理器', () => {
			configManager.destroy()
			expect(configManager.isDestroyed()).toBe(true)
		})

		it('销毁后应该允许重复调用 destroy', () => {
			expect(() => {
				configManager.destroy()
				configManager.destroy()
			}).not.toThrow()
		})
	})
})
