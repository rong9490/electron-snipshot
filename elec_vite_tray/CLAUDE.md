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
- `bun run lint` - 运行 ESLint（带缓存）
- `bun run format` - 使用 Prettier 格式化代码

### 包管理器
**重要：** 此项目专门使用 Bun。preinstall 钩子通过 `npx only-allow bun` 强制执行此要求。始终使用 `bun` 而不是 `npm` 或 `yarn`。

## 架构

### 进程结构
应用遵循 Electron 的多进程架构：

1. **主进程** (`src/main/index.ts`)
   - 控制应用生命周期并创建 BrowserWindow 实例
   - 入口点在 package.json 中定义为 `./out/main/index.js`
   - 使用 @electron-toolkit/utils 处理应用用户模型 ID 和窗口快捷键优化

2. **预加载脚本** (`src/preload/index.ts`)
   - 主进程和渲染进程之间的桥梁
   - 使用 contextBridge 通过 `window.electron` 和 `window.api` 暴露 API
   - 当前暴露了来自 @electron-toolkit/preload 的标准 electronAPI

3. **渲染进程** (`src/renderer/`)
   - React + TypeScript 应用
   - 使用 Vite 打包，开发环境支持热模块替换（HMR）
   - 路径别名：`@renderer/*` 映射到 `src/renderer/src/*`

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
- **Biome** (`biome.json`) - 代码检查和格式化
  - 格式化启用：使用制表符和双引号
  - 导入排序启用
  - 使用推荐的检查规则

- **ESLint** (`eslint.config.mjs`) - 额外的代码检查
  - TypeScript 支持
  - React 和 React Hooks 插件
  - Prettier 集成以避免冲突

- **Prettier** (`.prettierrc.yaml`) - 代码格式化
  - 单引号、无分号、100 字符行宽、无尾随逗号

## IPC 通信
当前实现包含基本的 ping/pong 示例：
- 渲染进程发送: `window.electron.ipcRenderer.send('ping')`
- 主进程处理: `ipcMain.on('ping', () => console.log('pong'))`

如需自定义 IPC 通信，在 `src/preload/index.ts` 中扩展 `api` 对象，并在 `src/main/index.ts` 中添加相应的处理器。

## 开发注意事项
- 主进程沙箱已禁用（webPreferences 中设置 `sandbox: false`）
- 上下文隔离已启用，所有渲染进程与主进程的通信都必须使用 contextBridge
- 开发环境中按 F12 打开开发者工具
- 默认启用自动隐藏菜单栏（AutoHideMenuBar）
