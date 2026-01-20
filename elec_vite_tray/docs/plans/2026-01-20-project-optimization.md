# Project Configuration & Engineering Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 全面优化 Electron + React + TypeScript 项目的配置一致性、工程结构、开发体验和构建流程

**Architecture:** 保持现有模块化主进程架构，修复配置问题，增强开发工具链，统一构建脚本，优化打包配置

**Tech Stack:** Bun, Electron 39, React 19, TypeScript 5.9, Vitest 4, Biome 2, electron-vite 5

---

## P0 任务 - 立即执行（核心配置修复）

### Task 1: 修复 electron.vite.config.ts 配置

**Files:**
- Modify: `electron.vite.config.ts`

**Step 1: 启用 renderer 配置**

当前 renderer 配置被完全注释，导致 React 代码无法正常构建。需要恢复配置。

```typescript
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
```

**Step 2: 验证配置**

运行: `bun run dev`
Expected: 开发服务器正常启动，React 应用可以加载

**Step 3: 提交**

```bash
git add electron.vite.config.ts
git commit -m "fix: restore renderer config in electron.vite.config.ts"
```

---

### Task 2: 统一构建脚本

**Files:**
- Modify: `package.json`

**Step 1: 修复 build:mac 脚本**

当前 build:mac 使用 `electron-vite build` 而其他平台使用 `npm run build`，导致不一致。

```json
{
  "scripts": {
    "build": "npm run typecheck && electron-vite build",
    "build:unpack": "npm run build && electron-builder --dir",
    "build:win": "npm run build && electron-builder --win",
    "build:mac": "npm run build && electron-builder --mac",
    "build:linux": "npm run build && electron-builder --linux"
  }
}
```

**Step 2: 验证构建**

运行: `bun run build`
Expected: 类型检查通过，构建成功生成 out 目录

**Step 3: 提交**

```bash
git add package.json
git commit -m "fix: unify build scripts across all platforms"
```

---

### Task 3: 删除冗余的 pnpm-workspace.yaml

**Files:**
- Delete: `pnpm-workspace.yaml`

**Step 1: 删除文件**

项目是单包结构，不需要 pnpm workspace 配置。

运行: `rm pnpm-workspace.yaml`

**Step 2: 验证**

运行: `bun install`
Expected: 无错误，依赖正常安装

**Step 3: 提交**

```bash
git add pnpm-workspace.yaml
git commit -m "chore: remove redundant pnpm-workspace.yaml"
```

---

### Task 4: 添加 Vitest UI 和覆盖率依赖

**Files:**
- Modify: `package.json`
- Create: `vitest.workspace.ts`

**Step 1: 安装依赖**

```bash
bun add -D @vitest/ui @vitest/coverage-v8
```

**Step 2: 更新 vitest.config.ts**

添加 UI 和覆盖率配置：

```typescript
import path from 'node:path'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    bail: 1,
    globals: true,
    environment: 'node',
    hookTimeout: 30 * 1000,
    testTimeout: 100 * 1000,
    setupFiles: [path.join(__dirname, './test/setup.vitest.ts')],
    root: './',
    include: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx', '**/*.spec.ts'],
    exclude: ['**/node_modules', '**/dist', '**/out', '**/electron'],
    ui: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/out/**', '**/__tests__/**'],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer/src'),
      '@main': resolve(__dirname, 'src/main'),
      '@preload': resolve(__dirname, 'src/preload')
    }
  }
})
```

**Step 3: 更新 package.json 脚本**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui --port 51204",
    "test:coverage": "vitest run --coverage",
    "test:all": "npm run typecheck && npm run test"
  }
}
```

**Step 4: 验证测试**

运行: `bun run test:ui`
Expected: 浏览器打开 Vitest UI 界面

运行: `bun run test:coverage`
Expected: 生成覆盖率报告

**Step 5: 提交**

```bash
git add package.json vitest.config.ts
git commit -m "feat: add vitest ui and coverage support"
```

---

## P1 任务 - 本周完成（体验提升）

### Task 5: 增强 TypeScript 配置

**Files:**
- Modify: `tsconfig.node.json`
- Modify: `tsconfig.web.json`
- Create: `tsconfig.json` (update)

**Step 1: 增强 tsconfig.node.json**

添加严格类型检查和路径别名：

```json
{
  "extends": "@electron-toolkit/tsconfig/tsconfig.node.json",
  "include": ["electron.vite.config.*", "src/main/**/*", "src/preload/**/*", "typings"],
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": ".tsbuildinfo/node.tsbuildinfo",
    "types": ["electron-vite/node"],
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@main/*": ["./src/main/*"],
      "@preload/*": ["./src/preload/*"]
    }
  }
}
```

**Step 2: 增强 tsconfig.web.json**

添加严格类型检查和 React 路径别名：

```json
{
  "extends": "@electron-toolkit/tsconfig/tsconfig.web.json",
  "include": ["src/renderer/src/**/*"],
  "compilerOptions": {
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "jsx": "react-jsx",
    "paths": {
      "@renderer/*": ["./src/renderer/src/*"]
    }
  }
}
```

**Step 3: 验证类型检查**

运行: `bun run typecheck`
Expected: 无类型错误

**Step 4: 提交**

```bash
git add tsconfig.*.json
git commit -m "feat: enhance TypeScript config with strict checks and path aliases"
```

---

### Task 6: 环境变量管理

**Files:**
- Create: `.env.development`
- Create: `.env.production`
- Create: `.env.example`
- Modify: `electron.vite.config.ts`
- Modify: `src/main/index.ts`

**Step 1: 创建环境变量文件**

创建 `.env.development`:

```env
# 应用模式: remote | local | hybrid
VITE_APP_MODE=hybrid

# 远程 URL
VITE_REMOTE_URL=https://adssx-tcloud.tsintergy.com/usercenter/#/login

# 开发工具
VITE_DEV_TOOLS=true
```

创建 `.env.production`:

```env
# 应用模式: remote | local | hybrid
VITE_APP_MODE=remote

# 远程 URL
VITE_REMOTE_URL=https://adssx-tcloud.tsintergy.com/usercenter/#/login

# 开发工具
VITE_DEV_TOOLS=false
```

创建 `.env.example`:

```env
# 应用模式: remote | local | hybrid
VITE_APP_MODE=hybrid

# 远程 URL
VITE_REMOTE_URL=https://example.com

# 开发工具
VITE_DEV_TOOLS=true
```

**Step 2: 更新 electron.vite.config.ts**

添加环境变量支持：

```typescript
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'

export default defineConfig(({ mode }) => {
  return {
    main: {},
    preload: {},
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve(__dirname, 'src/renderer/src')
        }
      },
      plugins: [react()],
      define: {
        __APP_MODE__: JSON.stringify(process.env.VITE_APP_MODE || 'hybrid'),
        __REMOTE_URL__: JSON.stringify(process.env.VITE_REMOTE_URL || ''),
        __DEV_TOOLS__: JSON.stringify(process.env.VITE_DEV_TOOLS === 'true')
      }
    }
  }
})
```

**Step 3: 更新主进程加载逻辑**

修改 `src/main/index.ts` 的 `createWindow` 函数：

```typescript
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
      eventBus?.emit(AppEvents.WINDOW_HIDE)
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 根据模式加载内容
  const appMode = process.env.VITE_APP_MODE || 'hybrid'
  const remoteURL = process.env.VITE_REMOTE_URL || 'https://adssx-tcloud.tsintergy.com/usercenter/#/login'

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    // 开发环境
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else if (appMode === 'local') {
    // 本地模式
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  } else if (appMode === 'remote') {
    // 远程模式
    mainWindow.loadURL(remoteURL)
  } else {
    // 混合模式：默认远程，失败则本地
    mainWindow
      .loadURL(remoteURL)
      .catch(() => {
        console.warn('[Main] Failed to load remote URL, falling back to local')
        mainWindow?.loadFile(join(__dirname, '../renderer/index.html'))
      })
  }

  mainWindow.once('ready-to-show', () => {
    eventBus?.emit(AppEvents.WINDOW_SHOW)
  })

  if (ipcHandlers) {
    ipcHandlers.setMainWindow(mainWindow)
  }

  // 开发工具
  if (is.dev || process.env.VITE_DEV_TOOLS === 'true') {
    mainWindow.webContents.openDevTools()
  }
}
```

**Step 4: 添加环境变量类型定义**

创建 `src/env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MODE: 'remote' | 'local' | 'hybrid'
  readonly VITE_REMOTE_URL: string
  readonly VITE_DEV_TOOLS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

**Step 5: 更新 .gitignore**

```
# Environment
.env
.env.local
.env.*.local
```

**Step 6: 验证**

运行: `bun run dev`
Expected: 根据环境变量正确加载模式

**Step 7: 提交**

```bash
git add .env* electron.vite.config.ts src/main/index.ts src/env.d.ts .gitignore
git commit -m "feat: add environment variable management"
```

---

### Task 7: 优化 electron-builder 配置

**Files:**
- Modify: `electron-builder.yml`

**Step 1: 优化打包配置**

```yaml
appId: com.electron.app
productName: elec_vite_tray
directories:
  buildResources: build
  output: release

# 文件包含/排除
files:
  - '!**/.vscode/*'
  - '!src/*'
  - '!electron.vite.config.{js,ts,mjs,cjs}'
  - '!{.eslintcache,eslint.config.mjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}'
  - '!{.env,.env.*,.npmrc,pnpm-lock.yaml}'
  - '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}'
  - '!**/*.map'
  - '!**/*.test.{ts,tsx}'
  - '!**/__tests__/**'
  - '!test/**'
  - '!docs/**'

# asar 打包优化
asar:
  smartUnpack: true
asarUnpack:
  - resources/**

# 压缩
compression: maximum

# Windows 配置
win:
  executableName: elec_vite_tray
  artifactName: ${productName}-${version}-win-${arch}.${ext}
nsis:
  artifactName: ${productName}-${version}-setup.${ext}
  shortcutName: ${productName}
  uninstallDisplayName: ${productName}
  createDesktopShortcut: always
  oneClick: false
  allowToChangeInstallationDirectory: true

# macOS 配置
mac:
  artifactName: ${productName}-${version}-mac-${arch}.${ext}
  entitlementsInherit: build/entitlements.mac.plist
  extendInfo:
    - NSCameraUsageDescription: Application requests access to the device's camera.
    - NSMicrophoneUsageDescription: Application requests access to the device's microphone.
    - NSDocumentsFolderUsageDescription: Application requests access to the user's Documents folder.
    - NSDownloadsFolderUsageDescription: Application requests access to the user's Downloads folder.
  notarize: false
  target:
    - target: dmg
      arch:
        - x64
        - arm64
    - target: zip
      arch:
        - x64
        - arm64

dmg:
  artifactName: ${productName}-${version}.${ext}

# Linux 配置
linux:
  target:
    - target: AppImage
      arch:
        - x64
        - arm64
    - target: snap
      arch:
        - x64
    - target: deb
      arch:
        - x64
  maintainer: electronjs.org
  category: Utility
  artifactName: ${productName}-${version}-linux-${arch}.${ext}

appImage:
  artifactName: ${productName}-${version}-linux-${arch}.${ext}

# 发布配置
npmRebuild: true
publish:
  provider: generic
  url: https://example.com/auto-updates

# 下载镜像
electronDownload:
  mirror: https://npmmirror.com/mirrors/electron/
```

**Step 2: 添加构建验证脚本**

在 `package.json` 添加:

```json
{
  "scripts": {
    "build:check": "electron-builder --help",
    "build:report": "npm run build && electron-builder --dir"
  }
}
```

**Step 3: 验证构建**

运行: `bun run build:unpack`
Expected: 成功构建到 release 目录

**Step 4: 提交**

```bash
git add electron-builder.yml package.json
git commit -m "feat: optimize electron-builder configuration"
```

---

### Task 8: 集成 Git 钩子

**Files:**
- Modify: `package.json`
- Create: `.simple-git-hooks.json`

**Step 1: 安装依赖**

```bash
bun add -D simple-git-hooks
```

**Step 2: 创建 Git 钩子配置**

创建 `.simple-git-hooks.json`:

```json
{
  "pre-commit": "npm run check && npm run typecheck",
  "pre-push": "npm run test:all"
}
```

**Step 3: 更新 package.json**

```json
{
  "scripts": {
    "prepare": "simple-git-hooks"
  }
}
```

**Step 4: 安装钩子**

```bash
bun run prepare
```

**Step 5: 验证钩子**

```bash
git add .
git commit -m "test: verify git hooks"
Expected: 运行 check + typecheck，如果有错误则阻止提交
```

**Step 6: 提交**

```bash
git add package.json .simple-git-hooks.json
git commit -m "feat: integrate git hooks for code quality"
```

---

### Task 9: 添加 VSCode 工作区配置

**Files:**
- Create: `.vscode/settings.json`
- Create: `.vscode/extensions.json`
- Create: `.vscode/tasks.json`
- Create: `.vscode/launch.json`

**Step 1: 创建工作区设置**

创建 `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/out": true,
    "**/dist": true,
    "**/release": true
  },
  "files.associations": {
    "*.tsx": "typescriptreact"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/out": true,
    "**/dist": true,
    "**/release": true,
    "**/*.tsbuildinfo": true
  }
}
```

**Step 2: 创建推荐扩展**

创建 `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "biomejs.biome",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "humao.rest-client",
    "usernamehw.errorlens",
    "eamodio.gitlens"
  ]
}
```

**Step 3: 创建任务配置**

创建 `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "shell",
      "command": "bun run dev",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "build",
      "type": "shell",
      "command": "bun run build",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "test",
      "type": "shell",
      "command": "bun run test:watch",
      "group": "test",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "typecheck",
      "type": "shell",
      "command": "bun run typecheck",
      "group": "test",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "check",
      "type": "shell",
      "command": "bun run check",
      "group": "test",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

**Step 4: 创建调试配置**

创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": ["."],
      "outputCapture": "std"
    },
    {
      "name": "Debug Renderer Process",
      "type": "chrome",
      "request": "attach",
      "port": 9223,
      "webRoot": "${workspaceFolder}/out/renderer",
      "timeout": 30000
    }
  ]
}
```

**Step 5: 验证**

打开 VSCode，检查扩展推荐是否显示
按 Cmd+Shift+P (Mac) 或 Ctrl+Shift+P (Win/Linux)，运行 "Tasks: Run Test Task"

**Step 6: 提交**

```bash
git add .vscode/
git commit -m "feat: add VSCode workspace configuration"
```

---

## P2 任务 - 后续迭代（功能增强）

### Task 10: 添加日志系统

**Files:**
- Modify: `package.json`
- Create: `src/main/utils/logger.ts`
- Modify: `src/main/index.ts`

**Step 1: 安装依赖**

```bash
bun add electron-log
bun add -D @types/electron-log
```

**Step 2: 创建日志工具**

创建 `src/main/utils/logger.ts`:

```typescript
import log from 'electron-log'

export const logger = log

// 开发环境配置
if (process.env.NODE_ENV === 'development') {
  log.transports.file.level = 'debug'
  log.transports.console.level = 'debug'
} else {
  log.transports.file.level = 'info'
  log.transports.console.level = 'error'
}

// 日志文件路径
log.transports.file.resolvePathFn = () => {
  return require('path').join(require('electron').app.getPath('userData'), 'logs', 'main.log')
}

export default logger
```

**Step 3: 在主进程使用日志**

修改 `src/main/index.ts`，替换所有 `console.log` 为 `logger.info`:

```typescript
import { logger } from './utils/logger'

// 替换:
// console.log('[Main] Initializing modules...')
// 为:
logger.info('[Main] Initializing modules...')
```

**Step 4: 提交**

```bash
git add package.json src/main/utils/logger.ts src/main/index.ts
git commit -m "feat: add logging system with electron-log"
```

---

### Task 11: 添加持久化存储

**Files:**
- Modify: `package.json`
- Create: `src/main/utils/store.ts`

**Step 1: 安装依赖**

```bash
bun add electron-store
```

**Step 2: 创建存储工具**

创建 `src/main/utils/store.ts`:

```typescript
import Store from 'electron-store'

export interface AppConfig {
  autoStart: boolean
  startMinimized: boolean
  checkInterval: number
  remoteURL: string
  windowBounds: {
    width: number
    height: number
    x: number
    y: number
  }
}

const defaults: AppConfig = {
  autoStart: false,
  startMinimized: false,
  checkInterval: 60000,
  remoteURL: 'https://adssx-tcloud.tsintergy.com/usercenter/#/login',
  windowBounds: {
    width: 900,
    height: 670,
    x: 0,
    y: 0
  }
}

export const store = new Store<AppConfig>({ defaults })

export default store
```

**Step 3: 提交**

```bash
git add package.json src/main/utils/store.ts
git commit -m "feat: add persistent storage with electron-store"
```

---

### Task 12: 添加构建分析工具

**Files:**
- Modify: `package.json`
- Modify: `electron.vite.config.ts`

**Step 1: 安装依赖**

```bash
bun add -D rollup-plugin-visualizer
```

**Step 2: 更新 Vite 配置**

修改 `electron.vite.config.ts`:

```typescript
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src')
      }
    },
    plugins: [
      react(),
      visualizer({
        filename: './dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ]
  }
})
```

**Step 3: 添加分析脚本**

在 `package.json` 添加:

```json
{
  "scripts": {
    "build:analyze": "npm run build && open dist/stats.html"
  }
}
```

**Step 4: 提交**

```bash
git add package.json electron.vite.config.ts
git commit -m "feat: add build analyzer with rollup-plugin-visualizer"
```

---

### Task 13: 实现混合模式增强

**Files:**
- Modify: `src/main/index.ts`
- Create: `src/main/utils/app-loader.ts`

**Step 1: 创建应用加载器**

创建 `src/main/utils/app-loader.ts`:

```typescript
import { BrowserWindow } from 'electron'
import { join } from 'node:path'
import { logger } from './logger'

export type AppMode = 'remote' | 'local' | 'hybrid'

export interface LoadOptions {
  mode: AppMode
  remoteURL: string
  localPath: string
}

export async function loadApp(
  mainWindow: BrowserWindow,
  options: LoadOptions
): Promise<boolean> {
  const { mode, remoteURL, localPath } = options

  logger.info(`[AppLoader] Loading app in ${mode} mode`)

  try {
    if (mode === 'local') {
      await mainWindow.loadFile(localPath)
      logger.info('[AppLoader] Loaded local app')
      return true
    }

    if (mode === 'remote') {
      await mainWindow.loadURL(remoteURL)
      logger.info('[AppLoader] Loaded remote app')
      return true
    }

    // Hybrid mode
    try {
      await mainWindow.loadURL(remoteURL)
      logger.info('[AppLoader] Hybrid mode: loaded remote app')
      return true
    } catch (error) {
      logger.warn('[AppLoader] Remote load failed, falling back to local', error)
      await mainWindow.loadFile(localPath)
      logger.info('[AppLoader] Hybrid mode: loaded local app')
      return true
    }
  } catch (error) {
    logger.error('[AppLoader] All load attempts failed', error)
    return false
  }
}

export default loadApp
```

**Step 2: 更新主进程**

修改 `src/main/index.ts` 中的 `createWindow` 函数使用加载器。

**Step 3: 提交**

```bash
git add src/main/utils/app-loader.ts src/main/index.ts
git commit -m "feat: implement enhanced hybrid mode loader"
```

---

## 验证和测试

### Task 14: 全面验证

**Step 1: 运行所有检查**

```bash
# 类型检查
bun run typecheck

# 代码检查
bun run check

# 测试
bun run test:all

# 构建验证
bun run build
```

**Step 2: 开发环境测试**

```bash
bun run dev
# 验证: 应用正常启动，开发工具可用，热更新正常
```

**Step 3: 生产构建测试**

```bash
bun run build:unpack
# 验证: 构建成功，应用可运行
```

**Step 4: 测试环境变量**

```bash
# 测试不同模式
VITE_APP_MODE=local bun run dev
VITE_APP_MODE=remote bun run dev
VITE_APP_MODE=hybrid bun run dev
```

**Step 5: 测试 Git 钩子**

```bash
# 故意制造错误
echo "const x: number = 'string'" > test.ts
git add test.ts
git commit -m "test hooks"
# 验证: 钩子阻止提交
```

**Step 6: 清理测试文件**

```bash
rm test.ts
```

---

## 文档更新

### Task 15: 更新项目文档

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`

**Step 1: 更新 CLAUDE.md**

添加新的命令、环境变量说明、架构变更。

**Step 2: 更新 README.md**

添加项目介绍、功能特性、开发指南。

**Step 3: 提交**

```bash
git add CLAUDE.md README.md
git commit -m "docs: update project documentation"
```

---

## 完成检查清单

- [ ] P0: 修复 electron.vite.config.ts
- [ ] P0: 统一构建脚本
- [ ] P0: 删除 pnpm-workspace.yaml
- [ ] P0: 添加 Vitest UI 和覆盖率
- [ ] P1: 增强 TypeScript 配置
- [ ] P1: 环境变量管理
- [ ] P1: 优化 electron-builder
- [ ] P1: Git 钩子集成
- [ ] P1: VSCode 工作区配置
- [ ] P2: 添加日志系统
- [ ] P2: 添加持久化存储
- [ ] P2: 构建分析工具
- [ ] P2: 混合模式增强
- [ ] 验证和测试
- [ ] 文档更新

---

## 注意事项

1. **依赖版本**: 所有依赖使用最新稳定版本
2. **Git 提交**: 每个任务完成后立即提交，保持原子性
3. **TDD 原则**: 先写测试，再写实现（P2 任务适用）
4. **YAGNI 原则**: 只实现需要的功能，不过度设计
5. **DRY 原则**: 避免重复代码，提取公共逻辑
6. **向后兼容**: 确保现有功能不受影响

---

## 预期成果

1. ✅ 配置一致性：所有配置文件统一且无冲突
2. ✅ 工程结构：清晰的目录组织和模块划分
3. ✅ 开发体验：完善的类型提示、热更新、调试工具
4. ✅ 构建优化：快速构建、小体积产物、跨平台支持
5. ✅ 代码质量：自动化检查、测试覆盖、Git 钩子
6. ✅ 可维护性：详细文档、清晰架构、易于扩展
