/**
 * 自定义日志服务
 * 扩展 NestJS Logger，提供结构化日志和更多功能
 */

import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common'
import { app } from 'electron'

export enum LogLevel {
	LOG = 'log',
	ERROR = 'error',
	WARN = 'warn',
	DEBUG = 'debug',
	VERBOSE = 'verbose'
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
	private context?: string
	private isDev = !app.isPackaged

	setContext(context: string): void {
		this.context = context
	}

	/**
	 * 普通日志
	 */
	log(message: any, context?: string): void {
		this.printMessage(message, LogLevel.LOG, context)
	}

	/**
	 * 错误日志
	 */
	error(message: any, trace?: string, context?: string): void {
		this.printMessage(message, LogLevel.ERROR, context)
		if (trace && this.isDev) {
			console.error(trace)
		}
	}

	/**
	 * 警告日志
	 */
	warn(message: any, context?: string): void {
		this.printMessage(message, LogLevel.WARN, context)
	}

	/**
	 * 调试日志
	 */
	debug(message: any, context?: string): void {
		if (this.isDev) {
			this.printMessage(message, LogLevel.DEBUG, context)
		}
	}

	/**
	 * 详细日志
	 */
	verbose(message: any, context?: string): void {
		if (this.isDev) {
			this.printMessage(message, LogLevel.VERBOSE, context)
		}
	}

	/**
	 * 打印消息到控制台
	 */
	private printMessage(message: any, level: LogLevel, context?: string): void {
		const timestamp = new Date().toISOString()
		const ctx = context || this.context || 'Application'

		// 根据日志级别设置颜色
		const colorMap = {
			[LogLevel.LOG]: '\x1b[32m', // 绿色
			[LogLevel.ERROR]: '\x1b[31m', // 红色
			[LogLevel.WARN]: '\x1b[33m', // 黄色
			[LogLevel.DEBUG]: '\x1b[35m', // 紫色
			[LogLevel.VERBOSE]: '\x1b[36m' // 青色
		}
		const reset = '\x1b[0m'
		const color = colorMap[level]

		// 格式化输出
		const levelStr = level.toUpperCase().padEnd(7)
		const prefix = `${color}[${timestamp}] [${levelStr}] [${ctx}]${reset}`

		// 打印主消息
		const messageStr = typeof message === 'string' ? message : JSON.stringify(message, null, 2)
		process.stdout.write(`${prefix} ${messageStr}\n`)
	}

	/**
	 * 记录请求日志
	 */
	logRequest(method: string, url: string, statusCode?: number, responseTime?: number): void {
		const statusColor = statusCode && statusCode >= 500 ? '\x1b[31m' : statusCode && statusCode >= 400 ? '\x1b[33m' : '\x1b[32m'
		const reset = '\x1b[0m'

		const msg = `${method} ${url}${statusCode !== undefined ? ` - ${statusColor}${statusCode}${reset}` : ''}${responseTime !== undefined ? ` (${responseTime}ms)` : ''}`

		if (statusCode && statusCode >= 400) {
			this.warn(msg, 'HTTP')
		} else {
			this.log(msg, 'HTTP')
		}
	}

	/**
	 * 记录异常日志
	 */
	logException(exception: any, context?: string): void {
		const msg = exception.message || 'Unknown error'
		const trace = exception.stack || ''

		this.error(msg, trace, context || 'Exception')
	}
}
