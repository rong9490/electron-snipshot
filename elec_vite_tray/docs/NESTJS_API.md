# NestJS API 文档

本项目集成了 NestJS 服务，提供 RESTful API 接口。

## 服务配置

- **默认地址**: `http://localhost:3000`
- **API 前缀**: `/api`
- **Swagger 文档**: `http://localhost:3000/api/docs` (仅开发环境)

## 可用接口

### 健康检查

#### 1. 健康检查
```bash
GET /api/health
```

**响应示例**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-21T10:00:00.000Z",
  "uptime": 123.45,
  "message": "NestJS service is running"
}
```

#### 2. 获取详细信息
```bash
GET /api/health/info
```

**响应示例**:
```json
{
  "service": {
    "name": "elec_vite_tray",
    "version": "1.0.0",
    "env": "development"
  },
  "system": {
    "platform": "darwin",
    "arch": "arm64",
    "nodeVersion": "v18.17.0",
    "uptime": 123.45,
    "memory": {
      "total": 17179869184,
      "free": 8589934592,
      "usage": {
        "rss": 134217728,
        "heapTotal": 62914560,
        "heapUsed": 41943040,
        "external": 2097152
      }
    }
  },
  "timestamp": "2024-01-21T10:00:00.000Z"
}
```

## 使用方式

### 启动应用

```bash
# 开发模式 (自动启动 NestJS)
bun run dev

# 预览构建后的应用
bun run start
```

### 测试 API

```bash
# 运行 API 测试脚本
bun run test:api
```

测试脚本会自动检查：
- ✓ 健康检查接口 (`GET /api/health`)
- ✓ 详细信息接口 (`GET /api/health/info`)
- ✓ Swagger 文档访问 (`GET /api/docs`)

### 使用 Swagger UI

1. 启动应用:
   ```bash
   bun run dev
   ```

2. 在浏览器中访问:
   ```
   http://localhost:3000/api/docs
   ```

3. 在 Swagger UI 中可以：
   - 查看所有可用接口
   - 查看请求/响应 schema
   - 直接测试接口

### 使用 curl 测试

```bash
# 健康检查
curl http://localhost:3000/api/health

# 获取详细信息
curl http://localhost:3000/api/health/info
```

## 添加新的 API 接口

### 1. 创建新模块

```bash
# 在 src/main/nestjs/modules/ 下创建新模块
mkdir -p src/main/nestjs/modules/your-module
```

### 2. 定义 DTO (Data Transfer Object)

```typescript
// your.dto.ts
import { ApiProperty } from '@nestjs/swagger'

export class CreateItemDto {
  @ApiProperty({ description: '项目名称', example: 'My Item' })
  name!: string

  @ApiProperty({ description: '项目描述', required: false })
  description?: string
}

export class ItemResponseDto {
  @ApiProperty({ description: '项目 ID', example: 1 })
  id!: number

  @ApiProperty({ description: '项目名称' })
  name!: string

  @ApiProperty({ description: '创建时间' })
  createdAt!: string
}
```

### 3. 创建 Service

```typescript
// your.service.ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class YourService {
  async createItem(dto: CreateItemDto) {
    // 实现业务逻辑
    return { id: 1, ...dto, createdAt: new Date().toISOString() }
  }

  async getItems() {
    // 实现业务逻辑
    return []
  }
}
```

### 4. 创建 Controller

```typescript
// your.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { YourService } from './your.service'
import { CreateItemDto, ItemResponseDto } from './your.dto'

@ApiTags('你的模块')
@Controller('items')
export class YourController {
  constructor(private readonly yourService: YourService) {}

  @Get()
  @ApiOperation({ summary: '获取所有项目' })
  @ApiResponse({ type: [ItemResponseDto] })
  async getItems(): Promise<ItemResponseDto[]> {
    return this.yourService.getItems()
  }

  @Post()
  @ApiOperation({ summary: '创建新项目' })
  @ApiResponse({ type: ItemResponseDto })
  async createItem(@Body() dto: CreateItemDto): Promise<ItemResponseDto> {
    return this.yourService.createItem(dto)
  }
}
```

### 5. 创建 Module

```typescript
// your.module.ts
import { Module } from '@nestjs/common'
import { YourController } from './your.controller'
import { YourService } from './your.service'

@Module({
  controllers: [YourController],
  providers: [YourService],
  exports: [YourService],
})
export class YourModule {}
```

### 6. 注册到 AppModule

```typescript
// src/main/nestjs/app.module.ts
import { Module } from '@nestjs/common'
import { HealthModule } from './modules/health/health.module'
import { YourModule } from './modules/your-module/your.module'

@Module({
  imports: [HealthModule, YourModule],
})
export class AppModule {}
```

## 与 Electron 集成

NestJS 服务运行在 Electron 主进程中，可以：

1. **访问 Electron API**: 在 Service 中直接使用 `app`, `BrowserWindow` 等
2. **共享状态**: 通过依赖注入访问 `ConfigManager`, `StateManager` 等
3. **IPC 通信**: 通过 IPC Handlers 将 NestJS API 暴露给渲染进程

### 示例：在 NestJS 中使用 Electron 模块

```typescript
// your.service.ts
import { Injectable } from '@nestjs/common'
import { app } from 'electron'
import { ConfigManager } from '../../modules/ConfigManager'

@Injectable()
export class YourService {
  constructor(
    private readonly configManager: ConfigManager
  ) {}

  getAppInfo() {
    return {
      name: app.getName(),
      version: app.getVersion(),
      config: this.configManager.getAll()
    }
  }
}
```

## 开发注意事项

1. **端口冲突**: 确保 3000 端口未被占用
2. **CORS**: 如需跨域访问，在 `src/main/nestjs/main.ts` 中配置 CORS
3. **环境变量**: 通过 `src/main/nestjs/config/server.config.ts` 管理配置
4. **日志**: 使用 NestJS Logger 记录日志，输出在主进程控制台

## 故障排查

### 端口被占用
```bash
# 查找占用 3000 端口的进程
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# 修改端口
# 编辑 src/main/nestjs/config/server.config.ts
```

### Swagger 无法访问
- 确保在开发环境运行 (`NODE_ENV=development`)
- 检查防火墙设置
- 查看主进程控制台日志

### 测试脚本失败
- 确保应用已启动
- 等待 2-3 秒让服务完全启动
- 手动访问 `http://localhost:3000/api/health` 检查服务状态
