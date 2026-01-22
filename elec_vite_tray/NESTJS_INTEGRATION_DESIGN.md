# Electron + NestJS 集成方案设计文档

> 本文档描述了如何将 NestJS 服务集成到现有的 Electron 托盘应用中

## 目录

- [方案选择指南](#方案选择指南)
- [方案一：内嵌 NestJS（推荐）](#方案一内嵌-nestjs推荐)
- [方案二：独立 NestJS 服务](#方案二独立-nestjs-服务)
- [方案三：混合架构](#方案三混合架构)
- [方案对比](#方案对比)
- [实施建议](#实施建议)

---

## 方案选择指南

```
┌─────────────────────────────────────────────────────────────┐
│  你的应用类型                                                │
├──────────────┬──────────────┬──────────────────────────────┤
│ 纯桌面应用    │ 桌面+本地服务  │ 桌面客户端+云端服务           │
│ (离线优先)   │ (需要后台处理) │ (需要在线同步)               │
├──────────────┼──────────────┼──────────────────────────────┤
│ 方案 1       │ 方案 2        │ 方案 3                       │
│ 简单封装     │ 内嵌服务      │ 独立部署                      │
└──────────────┴──────────────┴──────────────────────────────┘
```

### 根据需求选择

| 需求场景 | 推荐方案 | 理由 |
|---------|---------|------|
| 个人/小团队工具 | 方案 1 | 简单易维护，单进程架构 |
| 需要大量后台任务 | 方案 2 | 进程隔离，独立资源管理 |
| 需要多设备同步 | 方案 3 | 云端服务，天然支持同步 |
| CPU 密集型操作 | 方案 2 | 不阻塞 UI，独立进程 |
| 离线优先应用 | 方案 1 或 2 | 本地服务，无需网络 |
| 团队协作工具 | 方案 3 | 实时同步，云端存储 |

---

## 方案一：内嵌 NestJS（推荐）

### 架构概览

```
┌──────────────────────────────────────────────────────────┐
│                    Electron 主进程                        │
│  ┌─────────────────────────────────────────────────┐    │
│  │  NestJS Server (运行在主进程)                    │    │
│  │  ├─ REST API (http://localhost:3000)            │    │
│  │  ├─ WebSocket Gateway                          │    │
│  │  ├─ Modules                                    │    │
│  │  │  ├─ ConfigModule (复用现有 ConfigManager)   │    │
│  │  │  ├─ StateModule (复用现有 StateManager)     │    │
│  │  │  ├─ NotificationModule                      │    │
│  │  │  ├─ SystemModule (复用 SystemInfo)          │    │
│  │  │  └─ BusinessModules (业务逻辑)              │    │
│  │  └─ Services                                  │    │
│  │     ├─ TaskService (任务调度)                  │    │
│  │     ├─ DataService (数据处理)                  │    │
│  │     └─ SyncService (数据同步)                  │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Electron 原有模块                              │    │
│  │  ├─ EventBus (事件总线)                         │    │
│  │  ├─ TrayManager (托盘)                          │    │
│  │  ├─ WindowManager (窗口)                        │    │
│  │  └─ IPCHandlers (IPC 通信)                      │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
         │                              │
         │ IPC                          │ HTTP/WebSocket
         ▼                              ▼
┌─────────────────┐          ┌─────────────────────┐
│  渲染进程        │          │  NestJS Controller   │
│  (React UI)     │◄────────►│  (业务 API)          │
└─────────────────┘          └─────────────────────┘
```

### 优势

- ✅ **单进程架构**：无需管理多个进程，降低复杂度
- ✅ **共享内存**：Electron 模块可直接访问 NestJS 服务
- ✅ **类型安全**：全是 TypeScript，共享类型定义
- ✅ **易于调试**：统一的运行环境，方便断点调试
- ✅ **离线可用**：无需网络连接，完全本地化
- ✅ **快速启动**：无需额外的进程启动时间

### 劣势

- ❌ 主进程负载较重
- ❌ NestJS 依赖需要在 `dependencies` 中（增加包体积）
- ❌ 不支持多核 CPU 利用（单线程运行）

### 技术栈

```yaml
核心框架:
  - @nestjs/core: ^10.x
  - @nestjs/common: ^10.x
  - @nestjs/platform-express: ^10.x
  - @nestjs/platform-socket.io: ^10.x
  - reflect-metadata: ^0.1.x

功能模块:
  - @nestjs/config: 配置管理
  - @nestjs/schedule: 任务调度（适合定时检查）
  - @nestjs/event: 事件系统（可复用 EventBus）
  - socket.io: WebSocket 通信

数据库（可选）:
  - @nestjs/typeorm: ORM 集成
  - typeorm: 数据库操作
  - better-sqlite3: 本地 SQLite 数据库

任务队列（可选）:
  - @nestjs/bull: 任务队列
  - bull: Redis 基础队列
  - ioredis: Redis 客户端

现有模块复用:
  - ConfigManager → NestJS ConfigService
  - StateManager → NestJS StateService
  - SystemInfo → NestJS SystemService
  - NotificationManager → NestJS NotificationService
```

### 目录结构设计

```
src/
├── main/
│   ├── index.ts                      # Electron 入口
│   ├── nestjs/                       # NestJS 相关
│   │   ├── main.ts                   # NestJS 应用入口
│   │   ├── app.module.ts             # 根模块
│   │   ├── config/                   # NestJS 配置
│   │   │   ├── nest.config.ts        # NestJS 配置
│   │   │   ├── server.config.ts      # 服务器配置
│   │   │   └── database.config.ts    # 数据库配置
│   │   ├── modules/                  # 功能模块
│   │   │   ├── config/               # 配置模块
│   │   │   │   ├── config.module.ts
│   │   │   │   ├── config.controller.ts
│   │   │   │   ├── config.service.ts
│   │   │   │   └── dto/              # 数据传输对象
│   │   │   ├── state/                # 状态模块
│   │   │   │   ├── state.module.ts
│   │   │   │   ├── state.controller.ts
│   │   │   │   ├── state.service.ts
│   │   │   │   ├── state.gateway.ts  # WebSocket Gateway
│   │   │   │   └── dto/
│   │   │   ├── notification/         # 通知模块
│   │   │   │   ├── notification.module.ts
│   │   │   │   ├── notification.controller.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   └── dto/
│   │   │   ├── system/               # 系统信息模块
│   │   │   │   ├── system.module.ts
│   │   │   │   ├── system.controller.ts
│   │   │   │   ├── system.service.ts
│   │   │   │   └── dto/
│   │   │   ├── task/                 # 任务管理模块
│   │   │   │   ├── task.module.ts
│   │   │   │   ├── task.controller.ts
│   │   │   │   ├── task.service.ts
│   │   │   │   ├── task.entity.ts
│   │   │   │   └── dto/
│   │   │   ├── data/                 # 数据处理模块
│   │   │   │   ├── data.module.ts
│   │   │   │   ├── data.controller.ts
│   │   │   │   ├── data.service.ts
│   │   │   │   └── dto/
│   │   │   └── database/             # 数据库模块（可选）
│   │   │       ├── database.module.ts
│   │   │       ├── migrations/       # 数据库迁移
│   │   │       └── entities/         # 实体定义
│   │   ├── common/                   # 公共模块
│   │   │   ├── filters/              # 异常过滤器
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── interceptors/         # 拦截器
│   │   │   │   ├── logging.interceptor.ts
│   │   │   │   └── transform.interceptor.ts
│   │   │   ├── guards/               # 守卫
│   │   │   │   └── auth.guard.ts
│   │   │   ├── decorators/           # 装饰器
│   │   │   │   └── user.decorator.ts
│   │   │   ├── pipes/                # 管道
│   │   │   │   └── validation.pipe.ts
│   │   │   └── interfaces/           # 接口定义
│   │   │       └── app-config.interface.ts
│   │   └── shared/                   # 共享模块
│   │       ├── event-bus/            # 事件总线封装
│   │       │   ├── event-bus.module.ts
│   │       │   └── event-bus.service.ts
│   │       └── logger/               # 日志服务
│   │           ├── logger.module.ts
│   │           └── logger.service.ts
│   └── modules/                      # 原有 Electron 模块
│       ├── EventBus.ts
│       ├── ConfigManager.ts          # 可被 NestJS Service 复用
│       ├── StateManager.ts
│       ├── NotificationManager.ts
│       ├── TrayManager.ts
│       ├── IPCHandlers.ts
│       └── SystemInfo.ts
├── preload/                          # 预加载脚本
│   └── index.ts
├── renderer/                         # 渲染进程
│   └── src/
│       ├── api/                      # API 客户端
│       │   ├── nestjs.ts             # NestJS HTTP/WebSocket 客户端
│       │   │   ├── http.ts           # HTTP 客户端封装
│       │   │   ├── websocket.ts      # WebSocket 客户端封装
│       │   │   └── types.ts          # API 类型定义
│       │   └── electron.ts           # Electron IPC 客户端
│       ├── hooks/                    # React Hooks
│       │   ├── useConfig.ts          # 配置 Hook
│       │   ├── useState.ts           # 状态 Hook
│       │   ├── useTask.ts            # 任务 Hook
│       │   └── useNotification.ts    # 通知 Hook
│       ├── services/                 # 服务层
│       │   └── api.service.ts
│       └── ...
├── shared/                           # 共享代码
│   ├── types/                        # 类型定义
│   │   ├── config.types.ts
│   │   ├── state.types.ts
│   │   ├── task.types.ts
│   │   └── api.types.ts
│   ├── constants/                    # 常量定义
│   │   └── events.ts
│   └── utils/                        # 工具函数
│       └── helpers.ts
└── typings/                          # 全局类型声明
    └── imports.d.ts
```

### 通信流程设计

#### 1. 渲染进程 → NestJS

**方式 A: 通过 IPC（推荐用于简单操作）**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  渲染进程     │ ──► │  Preload     │ ──► │  IPCHandlers │ ──► │ NestJS       │
│  (React UI)  │ IPC │  Script      │ IPC │              │     │ Service      │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**适用场景：**
- 简单的 CRUD 操作
- 配置读写
- 状态查询
- 不需要复杂数据处理的操作

**示例：**
```typescript
// 渲染进程
const config = await window.api.config.getAll()

// IPC Handler
async handleConfigGetAll() {
  return this.nestJSApp.get(ConfigService).getAll()
}
```

**方式 B: 直接 HTTP/WebSocket（推荐用于复杂查询）**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  渲染进程     │ ──► │  HTTP/WebSocket│ ─► │ NestJS       │
│  (React UI)  │      │  Client       │     │ Controller   │
└──────────────┘     └──────────────┘     └──────────────┘
```

**适用场景：**
- 复杂的查询操作
- 文件上传/下载
- 实时数据推送（WebSocket）
- 批量数据处理

**示例：**
```typescript
// 渲染进程
const response = await fetch('http://localhost:3000/api/tasks?page=1&limit=10')
const data = await response.json()

// 或使用 WebSocket
socket.emit('tasks:subscribe', { filter: 'active' })
socket.on('tasks:update', (tasks) => {
  // 处理实时更新
})
```

#### 2. NestJS → 渲染进程

**方式 A: 通过 Electron EventEmitter**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ NestJS       │ ──► │  EventBus    │ ──► │  IPC Main    │ ──► │  渲染进程     │
│  Service     │     │              │     │              │     │  (React UI)  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**方式 B: 通过 WebSocket**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ NestJS       │ ──► │  WebSocket   │ ──► │  渲染进程     │
│  Gateway     │     │  Server      │     │  (React UI)  │
└──────────────┘     └──────────────┘     └──────────────┘
```

### 数据流设计

```
┌───────────────────────────────────────────────────────────┐
│                        用户操作                           │
└───────────────────────────┬───────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│   简单操作           │         │   复杂操作           │
│ (配置、状态查询)     │         │ (任务调度、数据处理) │
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           │ IPC                           │ HTTP/WebSocket
           ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│   IPCHandlers       │         │   NestJS Controller  │
│   ConfigManager     │         │   ├─ 复用现有 Manager │
│   StateManager      │         │   │  ConfigManager   │
└─────────────────────┘         │   │  StateManager    │
                                │   │  SystemInfo      │
                                │   ├─ 数据库操作      │
                                │   │  TypeORM/SQLite  │
                                │   └─ 任务调度        │
                                │      @nestjs/schedule│
                                └─────────────────────┘
```

### API 设计示例

#### REST API 端点

```typescript
// 配置管理
GET    /api/config              # 获取所有配置
GET    /api/config/:key         # 获取单个配置
POST   /api/config/:key         # 设置配置
PUT    /api/config              # 批量设置配置
DELETE /api/config/:key         # 删除配置
POST   /api/config/reset        # 重置为默认配置
GET    /api/config/export       # 导出配置

// 状态管理
GET    /api/state               # 获取完整状态
GET    /api/state/:key          # 获取部分状态
PUT    /api/state/unread-count  # 更新未读数
POST   /api/state/refresh       # 手动刷新状态

// 任务管理
GET    /api/tasks               # 获取任务列表
GET    /api/tasks/:id           # 获取任务详情
POST   /api/tasks               # 创建任务
PUT    /api/tasks/:id           # 更新任务
DELETE /api/tasks/:id           # 删除任务
POST   /api/tasks/:id/start     # 启动任务
POST   /api/tasks/:id/stop      # 停止任务

// 通知管理
GET    /api/notifications       # 获取通知历史
GET    /api/notifications/stats # 获取通知统计
POST   /api/notifications       # 发送通知
POST   /api/notifications/batch # 批量发送通知

// 系统信息
GET    /api/system/info         # 获取系统信息
GET    /api/system/performance  # 获取性能监控数据
```

#### WebSocket 事件

```typescript
// 客户端 → 服务器
socket.emit('state:subscribe')           # 订阅状态变化
socket.emit('tasks:subscribe')           # 订阅任务更新
socket.emit('notifications:subscribe')   # 订阅通知

socket.emit('tasks:create', taskData)    # 创建任务
socket.emit('tasks:update', {id, data})  # 更新任务

// 服务器 → 客户端
socket.emit('state:changed', newState)           # 状态变化
socket.emit('unread-count:changed', count)       # 未读数变化
socket.emit('task:created', task)                # 任务创建
socket.emit('task:updated', task)                # 任务更新
socket.emit('task:deleted', taskId)              # 任务删除
socket.emit('notification:show', notification)   # 显示通知
```

### 启动流程

```typescript
// src/main/index.ts

app.whenReady().then(async () => {
  // 1. 初始化 Electron 模块
  initializeElectronModules()

  // 2. 启动 NestJS 服务
  const nestApp = await bootstrapNestJS()

  // 3. 将 NestApp 实例注入到 IPCHandlers
  ipcHandlers.setNestApp(nestApp)

  // 4. 创建窗口
  createWindow()

  // 5. 创建托盘
  trayManager.create()
})

// src/main/nestjs/main.ts

export async function bootstrapNestJS(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  })

  // 配置 CORS（允许渲染进程访问）
  app.enableCors({
    origin: 'http://localhost:5173', // 开发环境
    credentials: true,
  })

  // 配置全局前缀
  app.setGlobalPrefix('api')

  // 配置 WebSocket
  const wsAdapter = new IoAdapter(app)
  app.useWebSocketAdapter(wsAdapter)

  // 启动服务（使用随机端口或固定端口）
  await app.listen(3000)

  console.log('NestJS is running on http://localhost:3000')

  return app
}
```

---

## 方案二：独立 NestJS 服务

### 架构概览

```
┌──────────────────────┐         ┌──────────────────────┐
│  Electron 主进程     │         │  NestJS 子进程        │
│                      │◄───────►│                      │
│  ├─ TrayManager      │  IPC    │  ├─ HTTP Server      │
│  ├─ WindowManager    │         │  ├─ WebSocket        │
│  ├─ EventBus         │         │  ├─ Business Logic   │
│  ├─ IPCHandlers      │         │  ├─ Database         │
│  └─ ProcessManager   │         │  └─ Task Queue       │
│     (进程管理)       │         │                      │
└──────────────────────┘         └──────────────────────┘
          │                               │
          │ IPC                           │ HTTP/WebSocket
          ▼                               ▼
┌─────────────────┐             ┌─────────────────────┐
│  渲染进程        │             │  外部服务集成        │
│  (React UI)     │             │  (第三方 API)       │
└─────────────────┘             └─────────────────────┘
```

### 优势

- ✅ **进程隔离**：NestJS 崩溃不影响 Electron UI
- ✅ **独立重启**：可单独重启 NestJS 服务，无需重启整个应用
- ✅ **灵活部署**：可选远程部署 NestJS
- ✅ **资源管理**：更好的 CPU/内存控制
- ✅ **多核利用**：可运行多个 worker 进程
- ✅ **端口暴露**：可对外提供服务（局域网访问）

### 劣势

- ❌ **通信开销**：进程间通信需要序列化
- ❌ **复杂度高**：需要管理进程生命周期
- ❌ **调试困难**：跨进程调试相对复杂
- ❌ **启动时间**：需要等待子进程启动
- ❌ **资源消耗**：额外的进程开销

### 技术实现

#### 进程管理

```typescript
// src/main/modules/ProcessManager.ts

export class ProcessManager {
  private nestProcess: ChildProcess | null = null
  private readonly NESTJS_PORT = 3000

  async startNestJS(): Promise<void> {
    // 检查是否已启动
    if (this.nestProcess) {
      console.log('[ProcessManager] NestJS already running')
      return
    }

    // 启动 NestJS 子进程
    this.nestProcess = spawn('node', ['dist/nestjs/main.js'], {
      env: {
        ...process.env,
        PORT: this.NESTJS_PORT.toString(),
        NODE_ENV: app.isPackaged ? 'production' : 'development',
      },
      stdio: 'pipe',
    })

    // 监听输出
    this.nestProcess.stdout?.on('data', (data) => {
      console.log(`[NestJS] ${data}`)
    })

    this.nestProcess.stderr?.on('data', (data) => {
      console.error(`[NestJS Error] ${data}`)
    })

    // 监听退出事件
    this.nestProcess.on('exit', (code) => {
      console.log(`[ProcessManager] NestJS exited with code ${code}`)
      this.nestProcess = null

      // 可选：自动重启
      if (!this.isQuitting) {
        this.restartNestJS()
      }
    })

    // 等待服务就绪
    await this.waitForReady()
  }

  async stopNestJS(): Promise<void> {
    if (!this.nestProcess) return

    console.log('[ProcessManager] Stopping NestJS...')
    this.nestProcess.kill('SIGTERM')

    // 等待进程退出（最多 5 秒）
    await Promise.race([
      new Promise(resolve => this.nestProcess?.once('exit', resolve)),
      new Promise(resolve => setTimeout(resolve, 5000)),
    ])

    // 如果还没退出，强制杀死
    if (this.nestProcess) {
      this.nestProcess.kill('SIGKILL')
    }

    this.nestProcess = null
  }

  async restartNestJS(): Promise<void> {
    await this.stopNestJS()
    await this.startNestJS()
  }

  private async waitForReady(timeout = 30000): Promise<void> {
    const start = Date.now()

    while (Date.now() - start < timeout) {
      try {
        await fetch(`http://localhost:${this.NESTJS_PORT}/health`)
        console.log('[ProcessManager] NestJS is ready')
        return
      } catch {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    throw new Error('NestJS startup timeout')
  }

  destroy(): void {
    this.isQuitting = true
    this.stopNestJS()
  }
}
```

#### IPC 桥接

```typescript
// src/main/modules/NestBridge.ts

export class NestBridge {
  private baseUrl: string
  private socket: Socket

  constructor(private port: number) {
    this.baseUrl = `http://localhost:${port}`
    this.socket = io(`ws://localhost:${port}`)
  }

  // HTTP 代理
  async httpGet(path: string, params?: any): Promise<any> {
    const url = new URL(path, this.baseUrl)
    if (params) {
      Object.entries(params).forEach(([k, v]) =>
        url.searchParams.append(k, String(v))
      )
    }
    const res = await fetch(url.toString())
    return res.json()
  }

  async httpPost(path: string, data: any): Promise<any> {
    const res = await fetch(new URL(path, this.baseUrl).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  // WebSocket 代理
  on(event: string, callback: (...args: any[]) => void): void {
    this.socket.on(event, callback)
  }

  emit(event: string, data: any): void {
    this.socket.emit(event, data)
  }

  destroy(): void {
    this.socket.close()
  }
}
```

---

## 方案三：混合架构

### 架构概览

```
┌──────────────────────┐
│  Electron 桌面应用    │
│                      │
│  ├─ 本地数据缓存      │ ◄──────┐
│  │  └─ SQLite/IndexedDB      │
│  ├─ 离线功能支持      │        │
│  │  └─ 队列 + 同步机制        │
│  └─ UI 渲染          │        │
└──────────────────────┘        │
          │                     │
          │ HTTP/WebSocket      │ 同步
          ▼                     │
┌──────────────────────┐        │
│  云端 NestJS API     │ ───────┘
│                      │
│  ├─ REST API         │
│  ├─ WebSocket        │
│  ├─ 数据库           │
│  │  └─ PostgreSQL/  │
│  │      MongoDB     │
│  ├─ 认证授权         │
│  │  └─ JWT/OAuth   │
│  └─ 业务逻辑         │
└──────────────────────┘
```

### 适用场景

- 需要多设备数据同步
- 需要服务器端处理（AI、大数据分析）
- 团队协作功能
- 需要集中式数据管理
- 需要远程访问功能

### 核心功能设计

#### 1. 数据同步机制

```typescript
// 同步策略
interface SyncStrategy {
  // 实时同步（WebSocket）
  realtime: {
    events: ['config:changed', 'state:changed', 'task:created']
    priority: 'high'
  }

  // 定期同步（HTTP 轮询）
  periodic: {
    interval: 60000 // 每分钟
    endpoints: ['/api/sync/pull', '/api/sync/push']
  }

  // 手动同步
  manual: {
    trigger: 'user_action'
    fullSync: true
  }
}

// 冲突解决策略
enum ConflictResolution {
  ServerWins = 'server_wins',
  ClientWins = 'client_wins',
  LastWriteWins = 'last_write_wins',
  Manual = 'manual',
}
```

#### 2. 离线队列

```typescript
// 离线操作队列
interface OfflineQueue {
  // 待同步操作
  pending: Array<{
    id: string
    action: 'create' | 'update' | 'delete'
    entity: string
    data: any
    timestamp: number
    retries: number
  }>

  // 同步状态
  status: 'idle' | 'syncing' | 'conflict' | 'error'

  // 添加到队列
  enqueue(operation: Operation): void

  // 处理队列
  process(): Promise<SyncResult>

  // 处理冲突
  resolveConflict(id: string, resolution: ConflictResolution): void
}
```

#### 3. 认证授权

```typescript
// JWT Token 管理
interface AuthManager {
  // 登录
  login(credentials: LoginDTO): Promise<{ token: string; user: User }>

  // 刷新 Token
  refreshToken(): Promise<string>

  // 登出
  logout(): Promise<void>

  // 获取当前用户
  getCurrentUser(): Promise<User>

  // Token 存储
  storage: {
    getToken(): string | null
    setToken(token: string): void
    removeToken(): void
  }
}
```

---

## 方案对比

| 特性 | 方案 1: 内嵌 | 方案 2: 多进程 | 方案 3: 云端 |
|------|------------|--------------|------------|
| **开发复杂度** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **运维复杂度** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **性能** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **UI 响应** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **离线支持** | ✅ 完全离线 | ✅ 完全离线 | ❌ 需要网络 |
| **数据同步** | ❌ 无 | ❌ 无 | ✅ 多设备同步 |
| **跨设备** | ❌ | ❌ | ✅ |
| **资源占用** | ⭐⭐⭐ 较低 | ⭐⭐ 较高 | ⭐ 最低 |
| **调试难度** | ⭐ 简单 | ⭐⭐⭐ 中等 | ⭐⭐⭐⭐ 复杂 |
| **部署成本** | ⭐ 无需部署 | ⭐⭐ 本地部署 | ⭐⭐⭐⭐⭐ 云端部署 |
| **扩展性** | ⭐⭐ 有限 | ⭐⭐⭐ 较好 | ⭐⭐⭐⭐⭐ 极强 |
| **安全性** | ⭐⭐⭐ 本地安全 | ⭐⭐⭐ 本地安全 | ⭐⭐⭐⭐⭐ 需要认证 |
| **适合团队** | 1-5人 | 5-20人 | 10+人 |
| **启动速度** | ⭐⭐⭐⭐ 快 | ⭐⭐⭐ 中等 | ⭐⭐⭐⭐ 快 |
| **更新成本** | ⭐ 低 | ⭐⭐ 中 | ⭐⭐⭐⭐ 高 |

### 快速决策树

```
开始
  │
  ├─ 需要多设备同步？
  │   ├─ 是 → 方案 3（云端）
  │   └─ 否 ↓
  │
  ├─ 需要 CPU 密集型操作？
  │   ├─ 是 → 方案 2（多进程）
  │   └─ 否 ↓
  │
  ├─ 团队规模 > 5 人？
  │   ├─ 是 → 方案 2（多进程）
  │   └─ 否 ↓
  │
  └─ → 方案 1（内嵌）✨ 推荐
```

---

## 实施建议

### Phase 1: 基础架构搭建（Week 1-2）

#### 目标
建立 NestJS 基础设施，确保可以运行

#### 任务清单

- [ ] 安装依赖
  ```bash
  bun add @nestjs/core @nestjs/common @nestjs/platform-express
  bun add @nestjs/platform-socket.io socket.io-client
  bun add reflect-metadata
  bun add -D @nestjs/cli
  ```

- [ ] 创建目录结构
  ```bash
  mkdir -p src/main/nestjs/{config,modules,common}
  mkdir -p src/main/nestjs/modules/{config,state,notification}
  mkdir -p src/renderer/src/api
  ```

- [ ] 创建基础模块
  - [ ] `nestjs/main.ts` - NestJS 入口
  - [ ] `nestjs/app.module.ts` - 根模块
  - [ ] `nestjs/config/server.config.ts` - 服务器配置

- [ ] 集成到 Electron 主进程
  - [ ] 在 `app.whenReady()` 中启动 NestJS
  - [ ] 实现优雅关闭
  - [ ] 添加健康检查端点

- [ ] 测试验证
  ```bash
  # 启动应用
  bun run dev

  # 测试 API
  curl http://localhost:3000/api/health
  ```

#### 交付物
- ✅ NestJS 服务可以在主进程中启动
- ✅ 健康检查端点可访问
- ✅ 日志输出正常

---

### Phase 2: 核心功能迁移（Week 3-4）

#### 目标
将现有模块逐步迁移到 NestJS

#### 任务清单

**Week 3: Config & State 模块**

- [ ] ConfigModule
  - [ ] 创建 `config.module.ts`
  - [ ] 创建 `config.controller.ts`
  - [ ] 创建 `config.service.ts`（复用现有 ConfigManager）
  - [ ] 定义 DTO（Data Transfer Objects）
  - [ ] 实现 API 端点
    - `GET /api/config` - 获取所有配置
    - `GET /api/config/:key` - 获取单个配置
    - `POST /api/config/:key` - 设置配置
    - `PUT /api/config` - 批量设置

- [ ] StateModule
  - [ ] 创建 `state.module.ts`
  - [ ] 创建 `state.controller.ts`
  - [ ] 创建 `state.service.ts`（复用现有 StateManager）
  - [ ] 创建 `state.gateway.ts`（WebSocket）
  - [ ] 定义 DTO
  - [ ] 实现 API 端点
    - `GET /api/state` - 获取状态
    - `PUT /api/state/:key` - 更新状态
  - [ ] 实现 WebSocket 事件
    - `state:changed` - 状态变化推送

**Week 4: Notification & System 模块**

- [ ] NotificationModule
  - [ ] 创建 `notification.module.ts`
  - [ ] 创建 `notification.controller.ts`
  - [ ] 创建 `notification.service.ts`
  - [ ] 实现 API 端点
    - `POST /api/notifications` - 发送通知
    - `GET /api/notifications/history` - 获取历史

- [ ] SystemModule
  - [ ] 创建 `system.module.ts`
  - [ ] 创建 `system.controller.ts`
  - [ ] 创建 `system.service.ts`（复用 SystemInfo）
  - [ ] 实现 API 端点
    - `GET /api/system/info` - 系统信息

- [ ] 更新渲染进程
  - [ ] 创建 `api/nestjs.ts` 客户端
  - [ ] 创建 `api/electron.ts` 客户端
  - [ ] 创建统一 API 服务层
  - [ ] 更新 React Hooks

#### 交付物
- ✅ Config/State/Notification/System 模块可用
- ✅ REST API 可访问
- ✅ WebSocket 可连接
- ✅ 渲染进程可以调用 API

---

### Phase 3: 高级功能开发（Week 5-6）

#### 目标
添加任务调度、数据库等高级功能

#### 任务清单

**Week 5: 任务管理**

- [ ] TaskModule
  - [ ] 创建 `task.module.ts`
  - [ ] 创建 `task.entity.ts`（任务实体）
  - [ ] 创建 `task.controller.ts`
  - [ ] 创建 `task.service.ts`
  - [ ] 集成 `@nestjs/schedule`
    - Cron 任务调度
    - Timeout 任务
    - Interval 任务
  - [ ] 实现 API 端点
    - `GET /api/tasks` - 任务列表
    - `POST /api/tasks` - 创建任务
    - `PUT /api/tasks/:id` - 更新任务
    - `DELETE /api/tasks/:id` - 删除任务
    - `POST /api/tasks/:id/start` - 启动任务
    - `POST /api/tasks/:id/stop` - 停止任务

- [ ] 前端集成
  - [ ] 创建任务管理 UI
  - [ ] 实时任务状态更新
  - [ ] 任务日志查看

**Week 6: 数据持久化**

- [ ] DatabaseModule
  - [ ] 选择数据库（推荐 SQLite）
  - [ ] 安装 TypeORM
    ```bash
    bun add @nestjs/typeorm typeorm better-sqlite3
    ```
  - [ ] 创建 `database.module.ts`
  - [ ] 创建实体（Entities）
    - `Task.entity.ts`
    - `Config.entity.ts`
    - `Log.entity.ts`
  - [ ] 创建 Repository
  - [ ] 创建迁移（Migrations）
  - [ ] 实现数据导入导出

- [ ] 性能优化
  - [ ] 添加缓存层（可选）
  - [ ] 实现数据分页
  - [ ] 添加查询优化

#### 交付物
- ✅ 任务管理功能完整
- ✅ 数据库持久化可用
- ✅ 任务调度正常运行

---

### Phase 4: 优化和测试（Week 7-8）

#### 目标
优化性能，完善测试，准备发布

#### 任务清单

**Week 7: 性能优化**

- [ ] 性能分析
  - [ ] 使用 Chrome DevTools 分析
  - [ ] 识别性能瓶颈
  - [ ] 优化查询语句

- [ ] 内存管理
  - [ ] 检测内存泄漏
  - [ ] 优化事件监听器
  - [ ] 清理无用资源

- [ ] 启动优化
  - [ ] 延迟加载模块
  - [ ] 优化依赖注入
  - [ ] 减少启动时间

**Week 8: 测试和文档**

- [ ] 单元测试
  ```bash
  bun add -D @nestjs/testing vitest
  ```
  - [ ] Service 层测试
  - [ ] Controller 层测试
  - [ ] 覆盖率 > 80%

- [ ] 集成测试
  - [ ] API 端到端测试
  - [ ] WebSocket 测试
  - [ ] IPC 通信测试

- [ ] 文档
  - [ ] API 文档（Swagger）
  - [ ] 架构文档
  - [ ] 部署文档

- [ ] 打包测试
  - [ ] macOS 打包测试
  - [ ] Windows 打包测试
  - [ ] 安装运行测试

#### 交付物
- ✅ 性能优化完成
- ✅ 测试覆盖率达标
- ✅ 文档完善
- ✅ 可发布版本

---

## 关键技术决策

### 1. 数据库选择

| 数据库 | 优势 | 劣势 | 推荐场景 |
|--------|------|------|---------|
| **SQLite** | 无需部署、轻量、本地化 | 并发性能一般 | 方案 1、2 |
| **PostgreSQL** | 功能强大、性能好 | 需要独立部署 | 方案 3 |
| **MongoDB** | 灵活的文档结构 | 占用较大 | 方案 3 |
| **IndexedDB** | 浏览器原生、离线可用 | 功能受限 | 渲染进程缓存 |

**推荐：** 方案 1/2 使用 SQLite，方案 3 使用 PostgreSQL

### 2. 任务队列

| 方案 | 优势 | 劣势 | 推荐场景 |
|------|------|------|---------|
| **@nestjs/schedule** | 简单、无需额外依赖 | 功能有限 | 定时任务、简单调度 |
| **Bull** | 功能强大、支持重试 | 需要 Redis | 复杂任务队列、分布式 |
| **自研队列** | 完全控制 | 开发成本高 | 特殊需求 |

**推荐：** 先用 `@nestjs/schedule`，需要时再升级到 Bull

### 3. 认证方式

| 方案 | 优势 | 劣势 | 推荐场景 |
|------|------|------|---------|
| **无需认证** | 简单 | 无安全控制 | 本地应用（方案 1、2）|
| **JWT** | 无状态、跨平台 | Token 管理 | 云端服务（方案 3）|
| **API Key** | 简单 | 安全性较低 | 简单场景 |
| **OAuth** | 标准化、安全 | 复杂 | 第三方登录 |

**推荐：** 方案 1/2 无需认证，方案 3 使用 JWT

### 4. WebSocket 库

| 库 | 优势 | 劣势 |
|----|------|------|
| **socket.io** | 功能丰富、自动降级 | 较重 |
| **ws** | 轻量、快速 | 功能较少 |
| **SSE** | 简单、单向 | 不支持双向 |

**推荐：** 使用 `@nestjs/platform-socket.io`（基于 socket.io）

---

## 依赖管理

### 生产依赖

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/platform-socket.io": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/schedule": "^4.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/event": "^2.0.0",
    "typeorm": "^0.3.17",
    "better-sqlite3": "^9.0.0",
    "socket.io": "^4.6.0",
    "socket.io-client": "^4.6.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.0"
  }
}
```

### 开发依赖

```json
{
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0"
  }
}
```

---

## 配置示例

### NestJS 配置文件

```typescript
// src/main/nestjs/config/server.config.ts

export interface ServerConfig {
  port: number
  host: string
  cors: {
    origin: string | boolean
    credentials: boolean
  }
  swagger: {
    enabled: boolean
    path: string
  }
}

export const serverConfig = (): ServerConfig => ({
  port: parseInt(process.env.NESTJS_PORT || '3000', 10),
  host: process.env.NESTJS_HOST || '127.0.0.1',
  cors: {
    origin: app.isPackaged
      ? false // 生产环境禁用 CORS
      : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  },
  swagger: {
    enabled: !app.isPackaged, // 仅开发环境启用
    path: 'api/docs',
  },
})
```

### 数据库配置

```typescript
// src/main/nestjs/config/database.config.ts

export const databaseConfig = () => ({
  type: 'sqlite',
  database: app.isPackaged
    ? join(app.getPath('userData'), 'data', 'app.db')
    : join(__dirname, '../../data/dev.db'),
  entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
  synchronize: !app.isPackaged, // 生产环境使用 migrations
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  logging: !app.isPackaged,
})
```

---

## 总结

### 推荐路线

**对于你的项目（托盘应用），推荐：方案 1（内嵌 NestJS）**

**原因：**
1. ✅ 项目规模适合单进程架构
2. ✅ 现有模块可以直接复用
3. ✅ 开发和维护成本最低
4. ✅ 性能完全满足需求
5. ✅ 打包体积增加可控（~5-10MB）

### 关键里程碑

```
Week 2  → 基础架构完成 ✅
Week 4  → 核心功能迁移完成 ✅
Week 6  → 高级功能完成 ✅
Week 8  → 优化测试完成，可发布 🎉
```

### 下一步行动

1. **立即开始 Phase 1**
   ```bash
   bun add @nestjs/core @nestjs/common @nestjs/platform-express
   ```

2. **创建基础文件**
   - `src/main/nestjs/main.ts`
   - `src/main/nestjs/app.module.ts`

3. **测试集成**
   - 在主进程中启动 NestJS
   - 测试健康检查端点

4. **渐进式迁移**
   - 从 ConfigModule 开始
   - 逐步迁移其他模块

---

## 附录

### A. 参考资料

- [NestJS 官方文档](https://docs.nestjs.com/)
- [Electron 官方文档](https://www.electronjs.org/docs)
- [Electron + NestJS 示例项目](https://github.com/nestjs/nest/tree/master/sample/15-electron)

### B. 常见问题

**Q: NestJS 会不会让 Electron 应用变慢？**
A: 影响很小。NestJS 主要在主进程中运行，不阻塞渲染进程。

**Q: 可以部分使用 NestJS 吗？**
A: 可以！建议从 Config/State 模块开始，逐步迁移。

**Q: 如何调试 NestJS 代码？**
A: 使用 VS Code 调试器，可以直接在主进程中断点调试。

**Q: 打包后体积会增加多少？**
A: NestJS 核心依赖约 5-10MB，对整体影响有限。

---

**文档版本：** v1.0
**最后更新：** 2025-01-21
**维护者：** Claude Code
