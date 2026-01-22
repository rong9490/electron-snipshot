/**
 * NestJS 服务器配置
 */

import { app } from 'electron'

export interface ServerConfig {
	port: number
	host: string
	environment: 'development' | 'production'
	cors: {
		origin: boolean | string[]
		credentials: boolean
	}
	logLevel: string[]
}

export function getServerConfig(): ServerConfig {
	const isDev = !app.isPackaged

	return {
		port: 3000,
		host: '127.0.0.1',
		environment: isDev ? 'development' : 'production',
		cors: {
			origin: isDev
				? ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173']
				: false,
			credentials: true
		},
		logLevel: isDev ? ['log', 'error', 'warn', 'debug'] : ['error', 'warn']
	}
}
