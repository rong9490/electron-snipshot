# Electron 环境变量注入指南

本文档演示如何在 Electron 应用中向加载的页面（包括外部 URL）注入全局变量，如 `NODE_ENV` 等环境变量。

## 📋 目录

- [原理说明](#原理说明)
- [实现步骤](#实现步骤)
- [使用示例](#使用示例)
- [测试验证](#测试验证)
- [安全注意事项](#安全注意事项)

## 🔍 原理说明

Electron 通过 **preload 脚本**在页面加载之前注入代码，使用 `contextBridge` API 安全地将主进程的变量暴露给渲染进程。

### 优势

1. **安全性**: 使用 `contextBridge` 隔离上下文，防止 XSS 攻击
2. **灵活性**: 可以注入任何类型的变量（对象、函数、原始类型）
3. **兼容性**: 适用于本地页面和外部 URL
4. **类型安全**: TypeScript 支持完整的类型定义

## 🛠️ 实现步骤

### 1. 修改 Preload 脚本 (`src/preload/index.ts`)

```typescript
import { contextBridge } from 'electron'

// 定义要注入的环境变量
const environment = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  ELECTRON_RENDERER_URL: process.env.ELECTRON_RENDERER_URL || '',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  platform: process.platform,
  appVersion: process.env.npm_package_version || '1.0.0'
}

// 使用 contextBridge 注入到渲染进程
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('ENV', environment)
  } catch (error) {
    console.error(error)
  }
}
```

### 2. 添加 TypeScript 类型定义 (`src/preload/index.d.ts`)

```typescript
interface Environment {
  NODE_ENV: string
  ELECTRON_RENDERER_URL: string
  isDev: boolean
  isProd: boolean
  platform: NodeJS.Platform
  appVersion: string
}

declare global {
  interface Window {
    ENV: Environment
  }
}
```

### 3. 配置主进程 (`src/main/index.ts`)

```typescript
import { join } from 'node:path'

function createWindow(): void {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // 关键：指定 preload 脚本
      sandbox: false,
      contextIsolation: true // 启用上下文隔离（推荐）
    }
  })

  // 加载外部 URL
  mainWindow.loadURL('https://example.com')
}
```

## 📖 使用示例

### 在渲染进程中访问注入的变量

#### JavaScript/Vanilla JS

```javascript
// 检查环境
if (window.ENV.isDev) {
  console.log('开发环境')
  // 显示调试工具、启用热重载等
}

// 获取平台信息
if (window.ENV.platform === 'win32') {
  // Windows 特定逻辑
}

// 获取应用版本
console.log('当前版本:', window.ENV.appVersion)
```

#### React

```tsx
import React from 'react'

function App() {
  const isDev = window.ENV.isDev

  return (
    <div>
      <h1>环境: {window.ENV.NODE_ENV}</h1>
      <p>版本: {window.ENV.appVersion}</p>
      {isDev && <DebugPanel />}
    </div>
  )
}
```

#### Vue 3

```vue
<template>
  <div>
    <p>当前环境: {{ ENV.NODE_ENV }}</p>
    <p v-if="ENV.isDev">开发模式</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const ENV = window.ENV
</script>
```

#### Angular

```typescript
import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <div>
      <p>Environment: {{ ENV.NODE_ENV }}</p>
      <p>Platform: {{ ENV.platform }}</p>
    </div>
  `
})
export class AppComponent {
  ENV = window.ENV
}
```

## 🧪 测试验证

### 方法 1: 使用快捷键

在运行的应用中按 **Ctrl/Cmd + Shift + T** 加载测试页面。

### 方法 2: 开发者工具控制台

1. 打开开发者工具 (F12 或 Cmd+Option+I)
2. 在控制台中输入：

```javascript
// 查看所有环境变量
console.log(window.ENV)

// 查看特定变量
console.log('NODE_ENV:', window.ENV.NODE_ENV)
console.log('Platform:', window.ENV.platform)

// 表格形式展示
console.table(window.ENV)
```

### 方法 3: 在外部 URL 中测试

加载任何外部页面（如 https://google.com），然后在控制台执行：

```javascript
console.log('Injected ENV:', window.ENV)
```

应该能看到完整的对象定义。

## ⚠️ 安全注意事项

### 1. 敏感信息处理

❌ **不要注入敏感信息**:
```typescript
// 危险！不要这样做
contextBridge.exposeInMainWorld('secrets', {
  apiKey: 'xxx',
  databasePassword: 'yyy'
})
```

✅ **只注入必要的信息**:
```typescript
// 安全
contextBridge.exposeInMainWorld('ENV', {
  isDev: process.env.NODE_ENV === 'development',
  version: app.getVersion()
})
```

### 2. 启用上下文隔离

```typescript
// src/main/index.ts
mainWindow = new BrowserWindow({
  webPreferences: {
    contextIsolation: true, // ✅ 必须启用
    sandbox: true,          // ✅ 推荐启用
    nodeIntegration: false  // ✅ 必须禁用
  }
})
```

### 3. 使用 Readonly

防止渲染进程修改注入的变量：

```typescript
import { Readonly } from '../types'

const environment: Readonly<Environment> = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  // ...
})
```

### 4. 验证加载的页面

只向可信的页面注入变量：

```typescript
mainWindow.webContents.on('did-finish-load', () => {
  const url = mainWindow.webContents.getURL()

  // 只向特定域名注入
  if (url.startsWith('https://trusted-domain.com')) {
    mainWindow.webContents.executeJavaScript(`
      console.log('Environment variables injected')
    `)
  }
})
```

## 🔧 高级用法

### 动态环境变量

根据加载的 URL 动态设置环境变量：

```typescript
// src/preload/index.ts
const { session } = require('electron')

session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
  if (details.url.includes('staging')) {
    // 为 staging 环境设置特定变量
    contextBridge.exposeInMainWorld('ENV', {
      environment: 'staging',
      apiEndpoint: 'https://staging-api.example.com'
    })
  }
  callback({})
})
```

### 条件注入

根据某些条件选择性注入：

```typescript
const shouldInject = process.env.NODE_ENV === 'development'

if (shouldInject) {
  contextBridge.exposeInMainWorld('DEBUG_TOOLS', {
    enableLogging: true,
    showPerformanceMetrics: true
  })
}
```

### 多环境配置

```typescript
// src/preload/index.ts
const configs = {
  development: {
    apiBaseUrl: 'http://localhost:3000',
    enableDevTools: true
  },
  staging: {
    apiBaseUrl: 'https://staging-api.example.com',
    enableDevTools: false
  },
  production: {
    apiBaseUrl: 'https://api.example.com',
    enableDevTools: false
  }
}

const currentConfig = configs[process.env.NODE_ENV as keyof typeof configs] || configs.production

contextBridge.exposeInMainWorld('CONFIG', currentConfig)
```

## 📚 相关资源

- [Electron ContextBridge 文档](https://www.electronjs.org/docs/latest/api/context-bridge)
- [Electron Security 最佳实践](https://www.electronjs.org/docs/latest/tutorial/security)
- [Process API 文档](https://www.electronjs.org/docs/latest/api/process)

## 🎯 总结

通过 preload 脚本和 `contextBridge`，我们可以安全地向任何加载的页面注入环境变量和全局配置。这种方法：

✅ 安全可靠
✅ 类型安全
✅ 支持外部 URL
✅ 易于维护
✅ 跨平台兼容

记住始终遵循安全最佳实践，只注入必要的信息，并启用上下文隔离！
