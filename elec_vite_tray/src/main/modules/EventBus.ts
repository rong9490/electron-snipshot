/**
 * EventBus - 事件总线
 * 用于模块间解耦通信，支持错误处理和重试机制
 */

import { EventEmitter } from 'node:events'
import type { EventListener } from '../types'

export class EventBus {
	private emitter: EventEmitter
	private errorHandlers: EventListener<Error>[] = []
	private _isDestroyed = false

	constructor() {
		this.emitter = new EventEmitter()

		// 设置最大监听器数量，防止内存泄漏
		this.emitter.setMaxListeners(50)

		// 全局错误处理
		this.emitter.on('error', (error) => {
			this.handleError(error)
		})
	}

	/**
	 * 订阅事件
	 * @param event 事件名称
	 * @param listener 监听器函数
	 */
	on<T = any>(event: string, listener: EventListener<T>): void {
		if (this._isDestroyed) {
			throw new Error('[EventBus] Cannot add listener to destroyed EventBus')
		}

		try {
			this.emitter.on(event, listener)
		} catch (error) {
			this.handleError(error as Error)
		}
	}

	/**
	 * 订阅事件（只执行一次）
	 * @param event 事件名称
	 * @param listener 监听器函数
	 */
	once<T = any>(event: string, listener: EventListener<T>): void {
		if (this._isDestroyed) {
			throw new Error('[EventBus] Cannot add listener to destroyed EventBus')
		}

		try {
			this.emitter.once(event, listener)
		} catch (error) {
			this.handleError(error as Error)
		}
	}

	/**
	 * 取消订阅事件
	 * @param event 事件名称
	 * @param listener 监听器函数
	 */
	off<T = any>(event: string, listener: EventListener<T>): void {
		try {
			this.emitter.off(event, listener)
		} catch (error) {
			this.handleError(error as Error)
		}
	}

	/**
	 * 发布事件
	 * @param event 事件名称
	 * @param data 事件数据
	 */
	emit<T = any>(event: string, data?: T): boolean {
		if (this._isDestroyed) {
			console.warn(`[EventBus] Cannot emit event "${event}" on destroyed EventBus`)
			return false
		}

		try {
			return this.emitter.emit(event, data)
		} catch (error) {
			this.handleError(error as Error)
			return false
		}
	}

	/**
	 * 发布事件（带重试机制）
	 * @param event 事件名称
	 * @param data 事件数据
	 * @param retries 重试次数（默认3次）
	 * @param delay 重试延迟（毫秒）
	 */
	emitWithRetry<T = any>(event: string, data: T, retries = 3, delay = 1000): Promise<boolean> {
		return new Promise((resolve) => {
			const attempt = (attemptCount: number): void => {
				try {
					const success = this.emitter.emit(event, data)
					if (success) {
						resolve(true)
					} else if (attemptCount > 0) {
						setTimeout(() => attempt(attemptCount - 1), delay)
					} else {
						resolve(false)
					}
				} catch (error) {
					if (attemptCount > 0) {
						setTimeout(() => attempt(attemptCount - 1), delay)
					} else {
						this.handleError(error as Error)
						resolve(false)
					}
				}
			}

			attempt(retries)
		})
	}

	/**
	 * 移除所有监听器
	 * @param event 可选的事件名称，如果不提供则移除所有事件的所有监听器
	 */
	removeAllListeners(event?: string): void {
		try {
			if (event) {
				this.emitter.removeAllListeners(event)
			} else {
				this.emitter.removeAllListeners()
			}
		} catch (error) {
			this.handleError(error as Error)
		}
	}

	/**
	 * 添加错误处理器
	 * @param handler 错误处理函数
	 */
	onError(handler: EventListener<Error>): void {
		this.errorHandlers.push(handler)
	}

	/**
	 * 处理错误
	 * @param error 错误对象
	 */
	private handleError(error: Error): void {
		console.error('[EventBus] Error:', error.message, error)

		// 调用所有错误处理器
		for (const handler of this.errorHandlers) {
			try {
				handler(error)
			} catch (handlerError) {
				console.error('[EventBus] Error in error handler:', handlerError)
			}
		}
	}

	/**
	 * 获取事件监听器数量
	 * @param event 事件名称
	 */
	listenerCount(event: string): number {
		return this.emitter.listenerCount(event)
	}

	/**
	 * 获取所有事件名称
	 */
	eventNames(): string[] {
		return this.emitter.eventNames() as string[]
	}

	/**
	 * 销毁事件总线
	 */
	destroy(): void {
		if (this._isDestroyed) {
			return
		}

		this._isDestroyed = true
		this.removeAllListeners()
		this.errorHandlers = []
		this.emitter.removeAllListeners()
	}

	/**
	 * 检查是否已销毁
	 */
	isDestroyed(): boolean {
		return this._isDestroyed
	}
}
