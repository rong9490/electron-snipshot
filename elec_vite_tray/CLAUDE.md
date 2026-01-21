# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 提供在此代码库中工作的指导。

## 项目概述

这是一个基于 Electron + React + TypeScript 构建的应用程序，使用 electron-vite 作为构建工具。项目配置使用 Bun 作为包管理器（通过 preinstall 钩子强制执行），设计为托盘模式运行，前端代码分离独立维护。

## 常用命令

### 开发
- `bun run dev` - 启动开发服务器（支持热重载）
- `bun run start` - 预览已构建的应用程序

### 构建
- `bun run build` - 生产环境构建（先执行类型检查，然后执行 electron-vite build）
- `bun run build:win` - 构建 Windows 可执行文件
- `bun run build:mac` - 构建 macOS 应用程序
- `bun run build:linux` - 构建 Linux 包（AppImage、snap、deb）
- `bun run build:unpack` - 仅构建不打包（用于测试）

### 代码质量
- `bun run typecheck` - 类型检查所有 TypeScript 文件（包括主进程和渲染进程）
- `bun run typecheck:node` - 类型检查主进程和预加载脚本
- `bun run typecheck:web` - 类型检查渲染进程
- `bun run lint` - 运行 Biome 检查
- `bun run format` - 使用 Biome 格式化代码
- `bun run check` - 运行 Biome 检查并自动修复问题

### 测试
- `bun run test` - 运行所有测试
- `bun run test:watch` - 监视模式运行测试
- `bun run test:ui` - 使用 Vitest UI 运行测试
- `bun run test:coverage` - 运行测试并生成覆盖率报告

### 包管理器
**重要：** 此项目专门使用 Bun。preinstall 钩子通过 `npx only-allow bun` 强制执行此要求。始终使用 `bun` 而不是 `npm` 或 `yarn`。

## 架构

### 进程结构
应用遵循 Electron 的多进程架构：

1. **主进程** (`src/main/index.ts`)
   - 控制应用生命周期并创建 BrowserWindow 实例
   - 入口点在 package.json 中定义为 `./out/main/index.js`
   - 使用 @electron-toolkit/utils 处理应用用户模型 ID 和窗口快捷键优化
   - **集成 NestJS 服务**：在主进程中启动 NestJS HTTP 服务器（默认端口 3000）
   - **模块化架构**：使用事件总线（EventBus）协调各个功能模块

2. **预加载脚本** (`src/preload/index.ts`)
   - 主进程和渲染进程之间的桥梁
   - 使用 contextBridge 通过 `window.electron` 和 `window.api` 暴露 API
   - 当前暴露了来自 @electron-toolkit/preload 的标准 electronAPI

3. **渲染进程** (`src/renderer/`)
   - React + TypeScript 应用
   - 使用 Vite 打包，开发环境支持热模块替换（HMR）
   - 路径别名：`@renderer/*` 映射到 `src/renderer/src/*`

### 主进程模块架构

主进程采用模块化设计,通过 EventBus 实现松耦合通信：

**核心模块** (按初始化顺序)：
1. **EventBus** (`modules/EventBus.ts`) - 事件总线,所有模块间通信的核心
2. **ConfigManager** (`modules/ConfigManager.ts`) - 配置管理,使用 electron-store 持久化
3. **StateManager** (`modules/StateManager.ts`) - 状态管理,处理应用运行时状态
4. **NotificationManager** (`modules/NotificationManager.ts`) - 系统通知管理
5. **TrayManager** (`modules/TrayManager.ts`) - 系统托盘管理,支持动态图标和菜单
6. **IPCHandlers** (`modules/IPCHandlers.ts`) - IPC 通信处理器,暴露 API 给渲染进程

**NestJS 集成**：
- 位置：`src/main/nestjs/`
- 在应用启动时通过 `bootstrapNestJS()` 启动
- 在应用退出时通过 `shutdownNestJS()` 优雅关闭
- 默认监听 `http://localhost:3000`
- 开发环境提供 Swagger 文档：`http://localhost:3000/api/docs`
- 全局 API 前缀：`/api`
- 支持模块化扩展,可添加新的 NestJS 模块

**模块生命周期**：
```
启动顺序：EventBus → ConfigManager → StateManager → NotificationManager → TrayManager → IPCHandlers
关闭顺序：IPC → Tray → Notification → State → Config → EventBus (反向销毁)
```

### IPC 通信架构

**双向通信模式**：
- **渲染进程 → 主进程**：使用 `ipcRenderer.invoke()` 发送请求并等待响应
- **主进程 → 渲染进程**：使用 `webContents.send()` 发送事件通知
- **事件订阅**：渲染进程可通过 `window.api.on.*` 订阅状态变化事件

**暴露的 API 类别** (在 `IPCHandlers.ts` 中定义)：
- `config` - 配置管理（获取、设置、导入、导出）
- `state` - 状态管理（未读计数、任务进度等）
- `monitoring` - 监控控制（启动、停止、状态查询）
- `notification` - 通知管理（显示通知、获取历史）
- `window` - 窗口控制（显示、隐藏、最小化、最大化、关闭）
- `app` - 应用信息（版本、名称、关于面板、退出）
- `on` - 事件订阅（状态变化、未读计数变化等）

**添加新 IPC 通信的步骤**：
1. 在 `src/preload/index.ts` 的 `api` 对象中添加类型定义
2. 在 `src/main/modules/IPCHandlers.ts` 中注册处理器
3. 在 `src/main/types.ts` 中定义事件类型（如需事件通信）

### TypeScript 配置
项目使用项目引用进行独立配置：
- `tsconfig.json` - 引用 node 和 web 配置的根配置
- `tsconfig.node.json` - 主进程和预加载脚本（继承 @electron-toolkit/tsconfig/tsconfig.node.json）
- `tsconfig.web.json` - 渲染进程，支持 React JSX（继承 @electron-toolkit/tsconfig/tsconfig.web.json）

### 构建配置
- **electron.vite.config.ts** - 所有进程的 Vite 配置
  - 主进程和预加载使用默认配置
  - 渲染进程使用 React 插件和路径别名

- **electron-builder.yml** - 应用打包配置
  - appId: com.electron.app
  - 产品名称: elec_vite_tray
  - 支持 Windows (NSIS)、macOS (DMG) 和 Linux (AppImage、snap、deb)
  - 配置了通用提供商的自动更新 URL

### 代码风格工具
- **Biome** (`biome.json`) - 主要的代码检查和格式化工具
  - 使用制表符和双引号
  - 启用导入排序
  - 使用推荐的检查规则
  - 优先使用 `bun run check` 替代单独的 lint/format

### 托盘功能

**TrayManager** 提供完整的系统托盘集成：
- **动态图标**：根据未读消息数量和配置自动更换图标（支持角标显示）
- **丰富菜单**：包括窗口控制、监控管理、系统信息、设置、退出等功能
- **跨平台行为**：
  - macOS：双击显示/隐藏窗口
  - Windows/Linux：单击显示窗口
  - Windows：支持气球通知
- **图标路径处理**：
  - 开发环境：`resources/icon.png`
  - 生产环境：`app.asar.unpacked/resources/icon.png`

### 开发注意事项

**环境变量注入**：
- 主进程会向渲染进程注入环境变量
- 测试快捷键：`Ctrl/Cmd + Shift + T` 加载环境变量测试页面

**窗口管理**：
- 所有窗口关闭时,非 macOS 平台会自动退出应用
- macOS 遵循平台惯例：关闭窗口 ≠ 退出应用
- 使用 `app.quit()` 或托盘菜单中的退出选项完全退出应用

**主进程沙箱**：
- 沙箱已禁用（`sandbox: false`）以支持 Node.js 集成
- 上下文隔离已启用,所有渲染进程与主进程的通信都必须使用 contextBridge

**开发工具**：
- 开发环境中按 F12 打开开发者工具
- 默认启用自动隐藏菜单栏（AutoHideMenuBar）

## 扩展 NestJS 功能

添加新的 NestJS 模块和 API：

1. **创建新模块**：
   ```bash
   # 在 src/main/nestjs/modules/ 下创建新模块
   mkdir -p src/main/nestjs/modules/your-module
   ```

2. **定义模块和控制器**：
   ```typescript
   // your.module.ts
   import { Module } from '@nestjs/common'
   import { YourController } from './your.controller'
   import { YourService } from './your.service'

   @Module({
     controllers: [YourController],
     providers: [YourService],
     exports: [YourService]
   })
   export class YourModule {}

   // your.controller.ts
   import { Controller, Get } from '@nestjs/common'
   import { ApiTags, ApiOperation } from '@nestjs/swagger'

   @Controller('your-endpoint')
   @ApiTags('your-module')
   export class YourController {
     @Get()
     @ApiOperation({ summary: '你的 API 描述' })
     getData() {
       return { message: 'Hello from NestJS' }
     }
   }
   ```

3. **注册到 AppModule**：
   ```typescript
   // src/main/nestjs/app.module.ts
   import { Module } from '@nestjs/common'
   import { YourModule } from './modules/your-module/your.module'

   @Module({
     imports: [YourModule],
     // ...
   })
   export class AppModule {}
   ```

4. **访问 API**：
   - 生产环境：`http://localhost:3000/api/your-endpoint`
   - 开发环境查看文档：`http://localhost:3000/api/docs`

**与 Electron IPC 集成**：
- NestJS 模块可以依赖注入 Electron 模块（如 ConfigManager、StateManager）
- 通过 IPC Handlers 将 NestJS API 暴露给渲染进程
- 使用 EventBus 实现 NestJS 和 Electron 模块间的通信
