/**
 * 全局异常过滤器
 * 捕获并记录所有未处理的异常
 */

import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	Logger
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger('ExceptionFilter')

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest<Request>()

		// 确定状态码和错误详情
		const status =
			exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

		// 提取错误详情
		let errorDetails: any = {}
		if (exception instanceof HttpException) {
			const exceptionResponse = exception.getResponse()
			if (typeof exceptionResponse === 'string') {
				errorDetails = { message: exceptionResponse }
			} else if (typeof exceptionResponse === 'object') {
				errorDetails = exceptionResponse
			}
		} else if (exception instanceof Error) {
			errorDetails = {
				message: exception.message,
				...(exception.stack && { stack: exception.stack.split('\n') })
			}
		}

		// 记录异常日志
		this.logException(request, status, exception, errorDetails)

		// 发送错误响应
		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			method: request.method,
			...errorDetails
		})
	}

	/**
	 * 记录异常详情
	 */
	private logException(request: Request, status: number, exception: any, errorDetails: any): void {
		const { method, url, ip, headers } = request

		// 格式化错误消息
		const errorMessage =
			exception instanceof Error ? exception.message : 'Unknown error occurred'

		// 根据状态码选择日志级别
		if (status >= 500) {
			this.logger.error(
				`${method} ${url} - ${status} - ${errorMessage}\n` +
					`IP: ${ip}\n` +
					`Headers: ${JSON.stringify(this.sanitizeHeaders(headers))}\n` +
					`Stack: ${exception.stack || 'No stack trace available'}`
			)
		} else if (status >= 400) {
			this.logger.warn(
				`${method} ${url} - ${status} - ${errorMessage}\n` +
					`IP: ${ip}\n` +
					`Details: ${JSON.stringify(errorDetails)}`
			)
		}
	}

	/**
	 * 清理敏感的请求头信息
	 */
	private sanitizeHeaders(headers: any): any {
		const sanitized = { ...headers }
		const sensitiveHeaders = ['authorization', 'cookie', 'set-cookie']

		sensitiveHeaders.forEach((header) => {
			if (sanitized[header]) {
				sanitized[header] = '[REDACTED]'
			}
		})

		return sanitized
	}
}
