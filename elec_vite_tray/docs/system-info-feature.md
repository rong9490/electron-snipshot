# 系统信息功能说明

## 功能概述

已成功为 Electron 托盘应用添加了系统信息查看功能。用户可以通过托盘菜单快速查看系统状态、服务状态和端口信息。

## 新增功能

### 1. 系统信息菜单

在托盘右键菜单中新增了"系统信息"子菜单,包含以下选项:

- **查看系统状态**: 显示操作系统、CPU、内存、进程等信息
- **查看服务状态**: 显示应用状态、监控状态、任务统计等
- **查看端口信息**: 显示应用使用的端口及服务信息
- **查看全部信息**: 显示完整的系统信息报告

### 2. 系统状态信息

显示内容包括:

**系统信息:**
- 操作系统平台和版本
- 系统架构 (x64/arm 等)
- 主机名
- 系统运行时间

**CPU 信息:**
- CPU 型号
- 核心数
- 当前使用率

**内存信息:**
- 总内存 (MB)
- 已用内存 (MB)
- 空闲内存 (MB)
- 内存使用率 (%)

**进程信息:**
- 进程 PID
- Electron 版本
- Node 版本
- Chrome 版本
- 进程内存占用

### 3. 服务状态信息

显示内容包括:

**应用信息:**
- 应用名称和版本
- 监控状态 (运行中/已停止)
- 是否开机自启
- 检查间隔设置

**任务统计:**
- 总任务数
- 运行中的任务数
- 已完成的任务数
- 失败的任务数

**配置信息:**
- 是否启用通知
- 是否启用角标
- 托盘图标颜色设置

### 4. 端口信息

显示内容包括:
- 端口号
- 端口类型 (renderer/api/websocket)
- 端口状态 (listening/closed/error)
- 端口描述
- 完整 URL (如果可用)

## 交互功能

### 对话框按钮

每个系统信息对话框都提供三个操作按钮:

1. **刷新**: 重新获取并显示最新的系统信息
2. **复制到剪贴板**: 将当前显示的系统信息复制到剪贴板
3. **关闭**: 关闭对话框

## 技术实现

### 新增模块

**SystemInfo.ts** (`src/main/modules/SystemInfo.ts`)

系统信息收集模块,提供以下功能:

- `getSystemStatus()`: 获取系统状态信息
- `getServiceStatus()`: 获取服务状态信息
- `getPortInfo()`: 获取端口信息
- `getAll()`: 获取完整系统信息
- `formatToText()`: 格式化系统信息为可读文本

### 修改的模块

**TrayManager.ts** (`src/main/modules/TrayManager.ts`)

添加了以下功能:

- 新增"系统信息"子菜单
- 实现 `showSystemInfo()` 方法显示信息对话框
- 实现信息格式化方法

**index.ts** (`src/main/index.ts`)

- 集成 TrayManager 到主进程
- 在应用启动时创建托盘
- 在应用退出时清理托盘资源

## 使用方法

### 启动应用

```bash
bun run dev
```

### 查看系统信息

1. 在系统托盘中找到应用图标
2. 右键点击托盘图标
3. 选择"系统信息"子菜单
4. 选择要查看的信息类型
5. 查看弹出的信息对话框
6. 可选择"刷新"、"复制到剪贴板"或"关闭"

## 代码架构

```
src/main/
├── modules/
│   ├── SystemInfo.ts      # 系统信息收集模块 (新增)
│   ├── TrayManager.ts     # 托盘管理器 (已更新)
│   ├── ConfigManager.ts   # 配置管理器
│   ├── StateManager.ts    # 状态管理器
│   └── ...
└── index.ts               # 主进程入口 (已更新)
```

## 数据流

```
用户点击托盘菜单
    ↓
TrayManager.showSystemInfo()
    ↓
SystemInfo.getAll()
    ↓
收集系统/服务/端口信息
    ↓
格式化为文本
    ↓
显示对话框 (dialog.showMessageBox)
    ↓
用户操作 (刷新/复制/关闭)
```

## 扩展性

### 添加新的信息类型

1. 在 `SystemInfo.ts` 中定义新的接口
2. 实现数据收集方法
3. 在 `TrayManager.ts` 中添加菜单项
4. 实现格式化方法

### 自定义显示格式

修改 `formatSystemStatus()`、`formatServiceStatus()` 或 `formatPortInfo()` 方法来自定义显示格式。

### 添加新的端口检测

在 `SystemInfo.getPortInfo()` 方法中添加环境变量检测逻辑:

```typescript
if (process.env.YOUR_PORT) {
  ports.push({
    port: parseInt(process.env.YOUR_PORT),
    type: 'custom',
    status: 'listening',
    description: '自定义服务'
  })
}
```

## 注意事项

1. **权限要求**: 某些系统信息可能需要特定权限才能访问
2. **跨平台兼容性**: 不同操作系统上某些信息可能不可用或格式不同
3. **性能影响**: 系统信息收集是实时的,频繁刷新可能会影响性能
4. **隐私保护**: 系统信息可能包含敏感数据,请注意隐私保护

## 测试建议

1. 在不同操作系统上测试 (Windows/macOS/Linux)
2. 测试不同的系统配置
3. 验证信息的准确性
4. 测试复制到剪贴板功能
5. 测试刷新功能

## 未来优化

- [ ] 添加图表可视化 (CPU/内存使用率图表)
- [ ] 支持自定义信息显示项
- [ ] 添加历史数据记录
- [ ] 支持导出为文件 (JSON/CSV)
- [ ] 添加实时监控模式
- [ ] 创建独立的状态窗口 (替代对话框)
- [ ] 支持远程服务器信息查看
- [ ] 添加告警阈值设置

## 相关文档

- [Tray 增强设计文档](./plans/2026-01-20-tray-enhancement-design.md)
- [Electron Tray API](https://www.electronjs.org/docs/latest/api/tray)
- [Electron Dialog API](https://www.electronjs.org/docs/latest/api/dialog)
