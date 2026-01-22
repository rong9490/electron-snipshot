/**
 * 请求日志拦截器
 * 记录所有传入的 HTTP 请求和响应
 */

import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Logger
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger('HTTP')

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest()
		const { method, url, ip } = request
		const userAgent = request.get('user-agent') || ''
		const startTime = Date.now()

		// 记录请求开始
		this.logger.log(`→ ${method} ${url} - ${ip} - ${userAgent.substring(0, 50)}`)

		return next.handle().pipe(
			tap({
				next: () => {
					const response = context.switchToHttp().getResponse()
					const { statusCode } = response
					const responseTime = Date.now() - startTime

					const statusColor = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m'
					const reset = '\x1b[0m'

					// 记录响应
					this.logger.log(
						`← ${method} ${url} - ${statusColor}${statusCode}${reset} - ${responseTime}ms`
					)
				},
				error: (error) => {
					const responseTime = Date.now() - startTime

					// 记录错误响应
					this.logger.error(
						`✗ ${method} ${url} - ${error.status || 500} - ${responseTime}ms - ${error.message}`
					)
				}
			})
		)
	}
}
