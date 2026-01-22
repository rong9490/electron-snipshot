/**
 * 日志模块
 * 提供统一的日志服务
 */

import { Module, Global } from '@nestjs/common'
import { LoggerService } from './logger.service'

@Global()
@Module({
	providers: [LoggerService],
	exports: [LoggerService]
})
export class LoggerModule {}
