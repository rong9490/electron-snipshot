# NestJS 日志系统使用指南

## 概述

本项目为 NestJS 服务实现了一个完整的日志系统，包括：
- 自定义日志服务 (LoggerService)
- 请求日志拦截器 (LoggingInterceptor)
- 全局异常过滤器 (AllExceptionsFilter)

## 功能特性

### 1. 结构化日志
- 彩色输出，不同日志级别使用不同颜色
- 时间戳、日志级别、上下文信息
- 开发/生产环境自动调整日志级别

### 2. 请求日志
- 自动记录所有 HTTP 请求和响应
- 记录请求方法、URL、IP 地址
- 记录响应状态码和响应时间
- 根据状态码使用不同颜色标识

### 3. 异常日志
- 捕获所有未处理的异常
- 根据错误严重程度选择日志级别
- 自动清理敏感信息（Authorization、Cookie 等）
- 记录详细的错误堆栈（仅开发环境）

## 日志级别

| 级别 | 颜色 | 用途 |
|------|------|------|
| LOG   | 绿色 | 常规信息 |
| ERROR | 红色 | 错误信息 |
| WARN  | 黄色 | 警告信息 |
| DEBUG | 紫色 | 调试信息（仅开发） |
| VERBOSE | 青色 | 详细信息（仅开发） |

## 使用方法

### 在控制器中使用

```typescript
import { Controller, Logger } from '@nestjs/common'

@Controller('example')
export class ExampleController {
  private readonly logger = new Logger(ExampleController.name)

  @Get()
  getData() {
    this.logger.log('获取数据请求')  // 常规日志
    this.logger.debug('调试信息')     // 调试日志
    this.logger.warn('警告信息')      // 警告日志
    this.logger.error('错误信息')     // 错误日志

    return { data: 'example' }
  }
}
```

### 在服务中使用

```typescript
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class ExampleService {
  private readonly logger = new Logger(ExampleService.name)

  processData() {
    try {
      this.logger.log('开始处理数据')
      // 业务逻辑
      this.logger.log('数据处理完成')
    } catch (error) {
      this.logger.error('处理失败', error.stack)
      throw error
    }
  }
}
```

### 使用自定义 LoggerService（高级）

```typescript
import { Injectable } from '@nestjs/common'
import { LoggerService } from './logger/logger.service'

@Injectable()
export class AdvancedService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(AdvancedService.name)
  }

  doSomething() {
    this.logger.log('执行任务')
    this.logger.debug('详细调试信息')
    this.logger.warn('发现潜在问题')
    this.logger.error('发生错误', 'stack trace here')

    // 记录请求日志
    this.logger.logRequest('GET', '/api/example', 200, 123)

    // 记录异常
    this.logger.logException(error, 'CustomContext')
  }
}
```

### 抛出可捕获的异常

```typescript
import { HttpException, HttpStatus } from '@nestjs/common'

@Controller('example')
export class ExampleController {
  private readonly logger = new Logger(ExampleController.name)

  @Get('error')
  triggerError() {
    this.logger.warn('即将抛出错误')

    // 这些错误会被全局异常过滤器捕获并记录
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: '这是一个示例错误'
      },
      HttpStatus.BAD_REQUEST
    )
  }

  @Get('server-error')
  triggerServerError() {
    this.logger.error('严重错误即将发生')

    // 500 错误会记录完整堆栈
    throw new Error('Internal server error')
  }
}
```

## 日志输出示例

### 正常请求日志
```
[2024-01-22T10:30:45.123Z] [LOG    ] [HTTP] → GET /api/health - 127.0.0.1 - Mozilla/5.0
[2024-01-22T10:30:45.125Z] [LOG    ] [HealthController] Health check requested
[2024-01-22T10:30:45.126Z] [LOG    ] [HTTP] ← GET /api/health - 200 - 3ms
```

### 错误请求日志
```
[2024-01-22T10:31:00.456Z] [LOG    ] [HTTP] → GET /api/health/error - 127.0.0.1
[2024-01-22T10:31:00.457Z] [WARN   ] [HealthController] 即将抛出错误
[2024-01-22T10:31:00.458Z] [ERROR  ] [HTTP] ✗ GET /api/health/error - 400 - 2ms - 这是一个示例错误
[2024-01-22T10:31:00.459Z] [WARN   ] [ExceptionFilter] GET /api/health/error - 400 - 这是一个示例错误
IP: 127.0.0.1
Details: {"status":400,"error":"这是一个示例错误"}
```

### 严重错误日志
```
[2024-01-22T10:32:00.789Z] [ERROR  ] [ExceptionFilter] POST /api/data - 500 - Internal server error
IP: 127.0.0.1
Headers: {"user-agent":"Mozilla/5.0","authorization":"[REDACTED]","cookie":"[REDACTED]"}
Stack: Error: Internal server error
    at ExampleController.triggerServerError (/app/dist/controllers/example.controller.js:25:15)
    ...
```

## 配置

### 日志级别配置

在 `src/main/nestjs/config/server.config.ts` 中配置：

```typescript
export function getServerConfig(): ServerConfig {
  const isDev = !app.isPackaged

  return {
    // ...
    logLevel: isDev
      ? ['log', 'error', 'warn', 'debug']  // 开发环境：包含 debug
      : ['error', 'warn']                   // 生产环境：只记录错误和警告
  }
}
```

### 禁用特定日志

如果需要禁用请求日志，可以在 `app.module.ts` 中注释掉拦截器：

```typescript
// providers: [
//   {
//     provide: APP_INTERCEPTOR,
//     useClass: LoggingInterceptor
//   },
// ]
```

## 最佳实践

1. **使用有意义的日志消息**
   ```typescript
   // 好的做法
   this.logger.log('用户登录成功', userId)
   this.logger.error(`数据库连接失败: ${dbConfig.host}`)

   // 避免这样做
   this.logger.log('做某事')
   ```

2. **合理使用日志级别**
   - `log`: 正常业务流程
   - `debug`: 开发调试信息
   - `warn`: 潜在问题但不影响运行
   - `error`: 需要立即关注的错误

3. **保护敏感信息**
   ```typescript
   // 不要记录敏感信息
   this.logger.log(`用户密码: ${password}`) // ❌ 错误

   // 应该这样做
   this.logger.log(`用户登录: ${username}`) // ✅ 正确
   ```

4. **使用上下文信息**
   ```typescript
   // 使用构造函数设置上下文
   constructor() {
     this.logger.setContext(UserService.name)
   }

   // 或在日志时指定上下文
   this.logger.log('操作成功', 'DatabaseService')
   ```

## 测试日志功能

启动应用后，可以通过以下方式测试日志：

```bash
# 健康检查（正常请求）
curl http://localhost:3000/api/health

# 获取详细信息
curl http://localhost:3000/api/health/info

# 触发 404 错误
curl http://localhost:3000/api/not-found

# 查看完整 API 文档
open http://localhost:3000/api/docs
```

## 扩展

### 添加文件日志

如果需要将日志写入文件，可以修改 `LoggerService`：

```typescript
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class LoggerService {
  private logFilePath = path.join(app.getPath('logs'), 'app.log')

  private printMessage(message: string, level: LogLevel, ...): void {
    // ... 控制台输出

    // 同时写入文件
    fs.appendFileSync(this.logFilePath, formattedMessage + '\n')
  }
}
```

### 集成第三方日志库

可以集成 winston、pino 等专业日志库来替代当前的实现。

## 故障排除

### 日志没有显示
- 检查 `server.config.ts` 中的 `logLevel` 配置
- 确认 NestJS 应用正常启动
- 查看控制台是否有其他错误

### 颜色显示异常
- 确保终端支持 ANSI 颜色码
- Windows 用户可能需要使用 Windows Terminal 或 PowerShell

### 日志过多
- 在生产环境调整 `logLevel` 为 `['error', 'warn']`
- 使用 `this.logger.debug()` 仅在开发环境输出
