# Electron Tray 应用增强设计文档

**日期**: 2026-01-20
**类型**: 架构设计
**状态**: 设计完成

---

## 概述

本设计文档描述了如何增强现有的 Electron Tray 应用，从基础托盘功能升级为一个功能完整的状态监控和通知系统。

### 设计目标

- **用户体验**: 提供流畅的托盘交互、快捷键、动画效果
- **状态监控**: 支持定时检查、事件驱动的状态更新
- **智能通知**: 系统通知、托盘角标、图标变色等多种通知方式
- **架构清晰**: 模块化设计，易于测试和维护

### 应用场景

**主要用途**: 状态监控提醒

**监控类型**:
- 消息通知（未读消息、新消息提醒）
- 任务状态（任务进度、系统健康）
- 定时检查（定期轮询状态）
- 事件驱动（实时事件响应）

**通知方式**:
- 系统原生通知
- 托盘图标角标（显示数量）
- 托盘图标变色（状态指示）

---

## 架构设计

### 整体架构：分层模块化

```
主进程模块:
├── TrayManager (托盘管理器)
│   ├── 托盘图标动态更新(角标、变色)
│   ├── 托盘菜单动态构建
│   └── 双击/单击事件处理
├── NotificationManager (通知管理器)
│   ├── 系统通知
│   ├── 通知规则配置
│   └── 通知历史记录
├── StateManager (状态管理器)
│   ├── 状态存储与查询
│   ├── 定时检查任务
│   └── 事件驱动的状态更新
├── ConfigManager (配置管理器)
│   ├── 配置持久化
│   ├── 开机自启动
│   └── 主题设置
└── EventBus (事件总线)
    ├── 模块间通信
    └── IPC 桥接到渲染进程
```

### 架构优势

- ✅ 职责清晰，每个模块独立可测试
- ✅ 易于扩展新功能
- ✅ 事件驱动，支持异步和实时更新
- ✅ 支持所有需求方向（交互、设置、菜单、IPC）

---

## 核心模块设计

### 1. TrayManager (托盘管理器)

**职责**:
- 管理托盘图标生命周期（创建、更新、销毁）
- 动态更新托盘图标（Canvas 绘制角标、切换不同颜色图标）
- 构建和维护托盘菜单（支持动态菜单项）
- 处理托盘交互事件（单击、双击）

**关键 API**:
- `Tray constructor`, `setContextMenu`, `setToolTip`
- `nativeImage.createFromPath`, `resize`
- `Menu.buildFromTemplate`, `MenuItem`
- 托盘事件: `click`, `double-click`, `right-click`

**关键实现**:

```typescript
// 托盘图标角标绘制
private updateBadge(count: number): void {
  const icon = nativeImage.createFromPath(this.iconPath)
  const size = icon.getSize()

  // 创建 Canvas 绘制角标
  const canvas = createCanvas(size.width, size.height)
  const ctx = canvas.getContext('2d')

  // 绘制原图
  ctx.drawImage(icon.toDataURL(), 0, 0)

  // 绘制红色圆形背景
  if (count > 0) {
    const badgeX = size.width - 15
    const badgeY = 15
    ctx.fillStyle = '#FF0000'
    ctx.beginPath()
    ctx.arc(badgeX, badgeY, 10, 0, 2 * Math.PI)
    ctx.fill()

    // 绘制数字
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(
      count > 99 ? '99+' : count.toString(),
      badgeX,
      badgeY + 4
    )
  }

  this.tray.setImage(canvas.toDataURL())
}
```

```typescript
// 动态托盘菜单构建
private buildMenu(): Menu {
  const state = this.stateManager.getState()
  const config = this.configManager.getConfig()

  const menuItems: MenuItemOptions[] = [
    {
      label: `未读消息: ${state.unreadCount}`,
      enabled: false,
      visible: config.enableBadge
    },
    { type: 'separator' },
    {
      label: '显示窗口',
      click: () => this.eventBus.emit('window:show')
    },
    {
      label: '隐藏窗口',
      click: () => this.eventBus.emit('window:hide')
    },
    { type: 'separator' },
    {
      label: '监控状态',
      submenu: [
        {
          label: state.isMonitoring ? '停止监控' : '开始监控',
          click: () => {
            if (state.isMonitoring) {
              this.stateManager.stopChecking()
            } else {
              this.stateManager.startChecking(config.checkInterval)
            }
          }
        },
        {
          label: '立即检查',
          click: () => this.stateManager.checkState()
        }
      ]
    },
    { type: 'separator' },
    {
      label: '设置',
      click: () => {
        this.eventBus.emit('window:show')
        this.eventBus.emit('settings:navigate')
      }
    },
    {
      label: '关于',
      click: () => app.showAboutPanel()
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        this.eventBus.emit('app:quit')
      }
    }
  ]

  return Menu.buildFromTemplate(menuItems)
}
```

---

### 2. NotificationManager (通知管理器)

**职责**:
- 发送系统原生通知（Notification）
- 管理通知规则（频率限制、优先级）
- 维护通知历史记录
- 支持通知交互（点击回调）

**关键 API**:
- `new Notification(options)`
- `Notification.show()`, `close()`
- 通知事件: `click`, `close`, `reply`
- Electron 的 Notification API vs HTML5 Notification

**关键实现**:

```typescript
class NotificationManager {
  private lastNotificationTime = 0
  private minInterval = 2000 // 最小间隔2秒

  show(options: NotificationOptions): boolean {
    // 频率限制
    const now = Date.now()
    if (now - this.lastNotificationTime < this.minInterval) {
      console.warn('[Notification] Rate limited')
      return false
    }

    try {
      const notification = new Notification(options)
      notification.on('click', () => {
        this.eventBus.emit('notification:click', options)
      })
      notification.show()

      this.lastNotificationTime = now
      return true
    } catch (error) {
      console.error('[Notification] Show failed:', error)
      return false
    }
  }
}
```

---

### 3. StateManager (状态管理器)

**职责**:
- 存储和查询应用状态（未读数、任务状态等）
- 定时检查任务（setInterval, cron）
- 处理状态变化事件
- 提供状态查询接口

**关键概念**:
- 状态存储结构设计
- 定时器管理（防止内存泄漏）
- 状态变化事件触发

**关键实现**:

```typescript
class StateManager {
  private checkTimer?: NodeJS.Timeout

  // 安全的定时检查
  startChecking(interval: number) {
    this.stopChecking() // 先清理

    this.checkTimer = setInterval(async () => {
      try {
        await this.checkState()
      } catch (error) {
        console.error('[StateManager] Check failed:', error)
        // 发送错误通知
        this.eventBus.emit('notification:show', {
          title: '状态检查失败',
          body: error.message,
          type: 'error'
        })
      }
    }, interval)
  }

  stopChecking() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer)
      this.checkTimer = undefined
    }
  }

  private async checkState(): Promise<void> {
    // 这里可以：
    // 1. 发起 HTTP 请求检查远程状态
    // 2. 读取本地文件/数据库
    // 3. 通过 IPC 从渲染进程获取

    const oldState = this.state

    // 示例：模拟状态变化
    const newUnreadCount = Math.floor(Math.random() * 10)

    if (newUnreadCount !== oldState.unreadCount) {
      this.state = {
        ...oldState,
        unreadCount: newUnreadCount,
        lastCheckTime: Date.now()
      }

      // 发出状态变化事件
      this.eventBus.emit('state:changed', this.state)
    }
  }
}
```

---

### 4. ConfigManager (配置管理器)

**职责**:
- 配置持久化（electron-store 或 JSON 文件）
- 开机自启动管理（app.setLoginItemSettings）
- 读写用户设置
- 配置变更通知

**关键 API**:
- `electron-store` (第三方库)
- `app.getPath('userData')`
- `app.setLoginItemSettings`
- 配置监听机制

**配置结构**:
```typescript
interface AppConfig {
  // 监控配置
  checkInterval: number  // 检查间隔（毫秒）
  enableNotification: boolean

  // 托盘配置
  enableBadge: boolean  // 显示角标
  trayIconColor: 'default' | 'blue' | 'green'

  // 启动配置
  autoStart: boolean
  startMinimized: boolean
}
```

---

### 5. EventBus (事件总线)

**职责**:
- 模块间解耦通信
- 事件订阅和发布
- IPC 桥接（主进程 ↔ 渲染进程）
- 错误处理和重试机制

**实现方式**:
- 使用 Node.js EventEmitter
- 或使用 mitt/tiny-emitter 等轻量库

**核心事件定义**:
```typescript
enum AppEvents {
  // 状态变化事件
  STATE_CHANGED = 'state:changed',
  UNREAD_COUNT_CHANGED = 'unread:count:changed',
  TASK_STATUS_CHANGED = 'task:status:changed',

  // 通知相关
  NOTIFICATION_SHOW = 'notification:show',
  NOTIFICATION_CLICK = 'notification:click',

  // 配置相关
  CONFIG_CHANGED = 'config:changed',

  // 窗口相关
  WINDOW_SHOW = 'window:show',
  WINDOW_HIDE = 'window:hide'
}
```

**增强的错误处理**:
```typescript
class EventBus {
  private emitter: EventEmitter

  constructor() {
    this.emitter = new EventEmitter()

    // 全局错误处理
    this.emitter.on('error', (error) => {
      console.error('[EventBus] Error:', error)
      this.handleError(error)
    })
  }

  // 带重试的发布
  emitWithRetry(event: string, data: any, retries = 3) {
    try {
      this.emitter.emit(event, data)
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => this.emitWithRetry(event, data, retries - 1), 1000)
      } else {
        this.handleError(error)
      }
    }
  }
}
```

---

## 数据流与交互

### 典型交互流程

**场景1：定时检查到新消息**
```
1. StateManager 定时器触发
   ↓
2. StateManager 检测到未读数变化 (0 → 5)
   ↓
3. StateManager 发出 STATE_CHANGED 事件 (携带新状态)
   ↓
4. TrayManager 监听到事件，更新托盘图标（绘制角标 "5"）
   ↓
5. NotificationManager 监听到事件，发送系统通知
   ↓
6. (可选) 通过 IPC 发送给渲染进程更新 UI
```

**场景2：用户点击托盘菜单**
```
1. 用户点击托盘菜单项 "查看任务"
   ↓
2. TrayManager 触发菜单点击回调
   ↓
3. TrayManager 发出 WINDOW_SHOW 事件
   ↓
4. 主进程监听事件，显示窗口
   ↓
5. StateManager 清除未读数，发出 UNREAD_COUNT_CHANGED (0)
   ↓
6. TrayManager 更新托盘图标（移除角标）
```

### IPC 通信设计

**主进程 → 渲染进程** (单向通知):
```typescript
// 主进程发送
mainWindow.webContents.send('app:state-changed', {
  unreadCount: 5,
  tasks: [...]
})

// 渲染进程接收
window.electron.ipcRenderer.on('app:state-changed', (_, data) => {
  // 更新 React 状态
})
```

**渲染进程 → 主进程** (调用 API):
```typescript
// preload/index.ts 暴露 API
contextBridge.exposeInMainWorld('api', {
  // 配置相关
  getConfig: () => ipcRenderer.invoke('config:get'),
  setConfig: (key, value) => ipcRenderer.invoke('config:set', key, value),

  // 状态相关
  getState: () => ipcRenderer.invoke('state:get'),
  refreshState: () => ipcRenderer.invoke('state:refresh'),

  // 托盘相关
  showNotification: (options) => ipcRenderer.invoke('notification:show', options)
})
```

---

## 生命周期管理

### 模块初始化顺序

在 `app.whenReady()` 中:
```typescript
// 1. 初始化事件总线（最先）
const eventBus = new EventBus()

// 2. 初始化配置管理器
const configManager = new ConfigManager(eventBus)

// 3. 初始化状态管理器（依赖配置）
const stateManager = new StateManager(eventBus, configManager)

// 4. 初始化通知管理器
const notificationManager = new NotificationManager(eventBus, configManager)

// 5. 初始化托盘管理器（最后，依赖其他模块）
const trayManager = new TrayManager(eventBus, configManager, stateManager)

// 6. 启动状态监控
if (configManager.get('isMonitoring')) {
  stateManager.startChecking(configManager.get('checkInterval'))
}
```

### 清理顺序

在 `app.before-quit` 中:
```typescript
app.on('before-quit', () => {
  isQuitting = true

  // 反向清理
  stateManager.stopChecking()
  trayManager.destroy()
  notificationManager.destroy()
  configManager.destroy()
  eventBus.destroy()
})
```

---

## 文件结构

```
src/main/
├── index.ts                    # 入口，模块初始化
├── modules/
│   ├── TrayManager.ts
│   ├── NotificationManager.ts
│   ├── StateManager.ts
│   ├── ConfigManager.ts
│   └── EventBus.ts
├── types/
│   └── index.ts                # 共享类型定义
└── utils/
    └── tray-icons.ts           # 托盘图标生成工具

src/preload/
├── index.ts                    # 扩展 preload API
└── index.d.ts                  # TypeScript 类型定义

src/renderer/
├── src/
│   ├── pages/
│   │   └── Settings.tsx        # 设置页面
│   └── components/
│       └── StatusBar.tsx       # 状态栏组件
```

---

## 测试策略

### 单元测试

**测试工具栈**:
- Vitest (已配置)
- @testing-library
- sinon (用于 mock)

**EventBus 测试**:
```typescript
describe('EventBus', () => {
  it('should emit and receive events', () => {
    const bus = new EventBus()
    const mock = vi.fn()

    bus.on('test-event', mock)
    bus.emit('test-event', { data: 'test' })

    expect(mock).toHaveBeenCalledWith({ data: 'test' })
  })

  it('should handle errors gracefully', () => {
    const bus = new EventBus()
    bus.on('error', vi.fn())

    expect(() => {
      bus.emit('test-event', null)
    }).not.toThrow()
  })
})
```

**StateManager 测试**:
```typescript
describe('StateManager', () => {
  it('should update state and emit event', async () => {
    const eventBus = new EventBus()
    const mock = vi.fn()
    eventBus.on('state:changed', mock)

    const manager = new StateManager(eventBus, mockConfig)
    await manager.checkState()

    expect(mock).toHaveBeenCalled()
  })

  it('should start and stop checking', () => {
    const manager = new StateManager(eventBus, mockConfig)
    manager.startChecking(1000)

    expect(manager.isChecking()).toBe(true)

    manager.stopChecking()
    expect(manager.isChecking()).toBe(false)
  })
})
```

**ConfigManager 测试**:
```typescript
describe('ConfigManager', () => {
  it('should get and set config', () => {
    const manager = new ConfigManager(eventBus, testConfigPath)

    manager.set('testKey', 'testValue')
    expect(manager.get('testKey')).toBe('testValue')
  })

  it('should persist config to disk', () => {
    const manager = new ConfigManager(eventBus, testConfigPath)
    manager.set('persistent', true)

    // 重新加载
    const manager2 = new ConfigManager(eventBus, testConfigPath)
    expect(manager2.get('persistent')).toBe(true)
  })
})
```

**NotificationManager 测试**:
```typescript
describe('NotificationManager', () => {
  it('should respect rate limiting', () => {
    const manager = new NotificationManager(eventBus, mockConfig)

    const result1 = manager.show({ title: 'Test1' })
    const result2 = manager.show({ title: 'Test2' })

    expect(result1).toBe(true)
    expect(result2).toBe(false) // 被限流
  })
})
```

### 集成测试

**完整流程测试**:
```typescript
describe('Tray App Integration', () => {
  it('should handle full notification flow', async () => {
    // 1. 初始化所有模块
    const eventBus = new EventBus()
    const configManager = new ConfigManager(eventBus)
    const stateManager = new StateManager(eventBus, configManager)
    const notificationManager = new NotificationManager(eventBus, configManager)

    // 2. Mock Notification.show
    const showSpy = vi.spyOn(Notification.prototype, 'show')

    // 3. 模拟状态变化
    stateManager.setState({ unreadCount: 5 })
    await stateManager.checkState()

    // 4. 验证通知被发送
    expect(showSpy).toHaveBeenCalled()
  })
})
```

---

## 实施计划

### Phase 1: 基础架构 (1-2天)
- [ ] 创建模块文件结构
- [ ] 实现 EventBus (带错误处理)
- [ ] 实现基础类型定义
- [ ] 编写 EventBus 单元测试

### Phase 2: 配置和状态管理 (1-2天)
- [ ] 实现 ConfigManager (使用 electron-store)
- [ ] 实现 StateManager (含定时检查)
- [ ] 编写 ConfigManager 和 StateManager 测试
- [ ] 验证配置持久化

### Phase 3: 托盘增强 (2-3天)
- [ ] 实现 TrayManager
  - [ ] 基础托盘创建
  - [ ] 动态菜单构建
  - [ ] 托盘图标角标绘制
  - [ ] 托盘图标状态变色
- [ ] 编写托盘相关测试
- [ ] 测试不同平台 (Windows/macOS/Linux)

### Phase 4: 通知系统 (1天)
- [ ] 实现 NotificationManager
- [ ] 添加通知限流和规则
- [ ] 实现通知历史记录
- [ ] 编写通知测试

### Phase 5: IPC 通信 (1-2天)
- [ ] 扩展 preload API
- [ ] 实现 IPC handlers
- [ ] 渲染进程集成测试
- [ ] 文档化 API

### Phase 6: UI 和设置界面 (2-3天)
- [ ] 创建设置页面 React 组件
- [ ] 实现配置表单
- [ ] 状态展示组件
- [ ] 主题切换功能

### Phase 7: 打包和优化 (1天)
- [ ] 打包测试
- [ ] 性能优化
- [ ] 错误日志收集
- [ ] 文档完善

---

## 学习资源

### Electron API 文档

- **Tray**: https://www.electronjs.org/docs/latest/api/tray
- **Notification**: https://www.electronjs.org/docs/latest/api/notification
- **Menu**: https://www.electronjs.org/docs/latest/api/menu
- **IPC**: https://www.electronjs.org/docs/latest/tutorial/ipc

### 关键学习点

1. **Tray API**: 图标处理、菜单构建、事件监听
2. **Notification**: 系统通知 vs 自定义通知
3. **IPC 通信**: contextBridge 安全通信
4. **进程管理**: app 生命周期、窗口管理
5. **原生集成**: 开机启动、系统托盘、通知权限

---

## 总结

本设计通过分层模块化架构，将 Electron Tray 应用从基础功能升级为功能完整的状态监控和通知系统。每个模块职责清晰，易于测试和维护，支持未来功能扩展。

关键特性：
- ✅ 事件驱动的模块通信
- ✅ 完善的错误处理机制
- ✅ 动态托盘图标和菜单
- ✅ 智能通知系统
- ✅ 配置持久化和开机启动
- ✅ 完整的单元测试和集成测试

通过分阶段实施，可以逐步构建出功能强大且用户友好的托盘应用。
