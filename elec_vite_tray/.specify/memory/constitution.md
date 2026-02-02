<!--
==============================================================================
SYNC IMPACT REPORT
==============================================================================
Version change: 0.0.0 → 1.0.0
Rationale: Initial constitution ratification based on established project practices

Modified principles: N/A (initial version)

Added sections:
- I. Modular Architecture & EventBus
- II. Type Safety & Code Quality
- III. IPC Communication Standards
- IV. NestJS Integration Discipline
- V. Testing Standards
- VI. Platform Compliance
- VII. Simplicity & YAGNI

Removed sections: N/A (initial version)

Templates requiring updates:
✅ plan-template.md - Constitution Check section will reference these principles
✅ spec-template.md - Aligned with type safety and modular architecture requirements
✅ tasks-template.md - Testing and task organization reflect these principles

Follow-up TODOs: None
==============================================================================
-->

# SnipShot Constitution

## Core Principles

### I. Modular Architecture & EventBus

应用主进程 MUST 采用模块化架构设计，所有功能模块通过 EventBus 实现松耦合通信。

**Rules**:
- 模块初始化顺序 MUST 严格遵循依赖关系：EventBus → ConfigManager → StateManager → NotificationManager → TrayManager → IPCHandlers
- 模块销毁顺序 MUST 与初始化顺序相反（反向依赖）
- 所有模块间通信 MUST 通过 EventBus 进行，禁止直接模块间调用
- 每个模块 MUST 负责单一功能域，保持独立可测试性
- 模块状态变更 MUST 通过事件通知，不鼓励直接状态查询

**Rationale**: EventBus 解耦使模块可以独立开发、测试和维护，避免循环依赖，便于功能扩展和替换。明确的初始化/销毁顺序确保资源正确管理和依赖可用性。

### II. Type Safety & Code Quality

项目 MUST 强制执行类型安全和代码质量标准，TypeScript 为唯一开发语言。

**Rules**:
- 所有代码变更 MUST 通过 `bun run typecheck` 类型检查（主进程和渲染进程）
- 代码格式化和检查 MUST 使用 Biome（`bun run check`），禁止手动格式化
- 构建过程 MUST 包含类型检查步骤（`bun run build` 预检查）
- 所有新增代码 MUST 使用 TypeScript 严格类型，禁止 `any` 类型除非有明确注释说明原因
- IPC 通信接口 MUST 在 preload 层定义完整类型签名

**Rationale**: Electron 应用跨进程通信的复杂性要求编译期类型安全保障。Biome 提供一致的代码风格和快速检查，防止运行时类型错误和跨进程通信失败。

### III. IPC Communication Standards

主进程与渲染进程通信 MUST 遵循标准化 IPC 模式，确保类型安全和可维护性。

**Rules**:
- 渲染进程 → 主进程：使用 `ipcRenderer.invoke()` 等待响应
- 主进程 → 渲染进程：使用 `webContents.send()` 发送事件通知
- 所有 IPC 接口 MUST 在 `src/preload/index.ts` 的 `api` 对象中定义类型
- 所有 IPC 处理器 MUST 在 `src/main/modules/IPCHandlers.ts` 中注册
- 事件类型定义 MUST 在 `src/main/types.ts` 中集中管理
- 禁止绕过 preload 层直接使用 `ipcRenderer` 或 `remote` 模块

**Rationale**: 类型化的 IPC 接口确保编译期错误检查，集中管理防止通信接口碎片化，contextBridge 保证安全性。

### IV. NestJS Integration Discipline

NestJS 服务 MUST 作为 Electron 主进程的集成模块，遵循模块化和优雅生命周期管理。

**Rules**:
- NestJS 服务器 MUST 在主进程启动时通过 `bootstrapNestJS()` 初始化
- NestJS 服务器 MUST 在应用退出时通过 `shutdownNestJS()` 优雅关闭
- NestJS API MUST 使用全局前缀 `/api`，开发环境提供 Swagger 文档 `/api/docs`
- NestJS 模块可以依赖注入 Electron 模块（ConfigManager、StateManager）
- 新增 NestJS 模块 MUST 在 `src/main/nestjs/modules/` 下创建独立目录
- NestJS 控制器 SHOULD 通过 IPC Handlers 暴露给渲染进程，而非直接调用

**Rationale**: 集成 NestJS 提供标准化 API 和 Swagger 文档，优雅关闭防止资源泄漏，模块化设计支持功能扩展。

### V. Testing Standards

测试使用 Vitest 框架，虽然测试是可选的（需在规格中明确要求），但一旦实施 MUST 遵循标准。

**Rules**:
- 测试文件 SHOULD 放置在 `tests/` 目录下，按 contract/integration/unit 分类
- 测试命令 MUST 使用 `bun run test`、`bun run test:watch`、`bun run test:ui` 或 `bun run test:coverage`
- NestJS API 测试 SHOULD 使用 Supertest 进行 HTTP 端点测试
- 单元测试 SHOULD 覆盖核心业务逻辑和模块接口
- 集成测试 SHOULD 验证跨模块通信和 IPC 交互

**Rationale**: Vitest 与 Vite 生态无缝集成，测试分层覆盖不同粒度的交互验证。可选测试策略避免过度工程化。

### VI. Platform Compliance

应用 MUST 遵守各平台（Windows、macOS、Linux）的用户体验惯例和技术规范。

**Rules**:
- macOS：关闭窗口 ≠ 退出应用，应用保持在 Dock 和托盘中
- Windows/Linux：所有窗口关闭时应用自动退出（除非托盘活跃）
- 托盘行为：macOS 双击显示/隐藏窗口，Windows/Linux 单击显示窗口
- 图标路径 MUST 正确处理开发和生产环境差异（`app.asar.unpacked`）
- 沙箱设置：当前禁用（`sandbox: false`）以支持 Node.js 集成
- 上下文隔离 MUST 启用，所有通信通过 contextBridge

**Rationale**: 平台一致性是用户体验基础，违反平台惯例会导致用户困惑和负面评价。正确的路径处理确保打包后资源访问正常。

### VII. Simplicity & YAGNI

开发 MUST 遵循简单性原则，避免过度设计和不必要的抽象。

**Rules**:
- 避免为未来可能的需求添加复杂性，仅在当前需求明确时实施
- 避免创建单次使用的抽象层和辅助函数
- 优先使用框架和库提供的标准功能，避免自定义封装
- 不再使用的代码 MUST 完全删除，不保留"以防万一"的注释代码
- 避免为了对称性或"完整性"添加不需要的功能

**Rationale**: 过度抽象和未使用的代码增加维护负担，降低代码可读性。YAGNI（You Aren't Gonna Need It）原则保持代码库精简和聚焦。

## Package Management & Tooling

### Bun Enforcement

项目 MUST 专门使用 Bun 作为包管理器，通过 preinstall 钩子强制执行。

**Rules**:
- 所有命令 MUST 使用 `bun` 而非 `npm` 或 `yarn`
- `package.json` 的 `preinstall` 钩子配置 `npx only-allow bun` 防止误用其他包管理器
- 依赖安装 MUST 使用 `bun install`
- 脚本执行 MUST 使用 `bun run` 而非 `npm run`

**Rationale**: Bun 提供更快的安装速度和一致的依赖解析机制，强制执行防止团队成员使用不同包管理器导致 lockfile 冲突。

### Electron-Vite Build

构建配置 MUST 使用 electron-vite 进行多进程打包，确保开发和生产环境一致性。

**Rules**:
- 主进程、预加载脚本、渲染进程配置 MUST 在 `electron.vite.config.ts` 中定义
- 渲染进程 MUST 使用 React 插件和路径别名 `@renderer/*`
- 构建过程 MUST 先执行类型检查，然后执行 electron-vite build
- 开发环境 MUST 支持热模块替换（HMR）
- 使用 `electron-builder` 进行跨平台打包，配置在 `electron-builder.yml`

**Rationale**: electron-vite 统一 Vite 生态系统，提供快速构建和热重载，类型检查前置防止运行时错误。

## Development Workflow

### Code Quality Gates

所有代码变更 MUST 通过质量检查门禁才能合并。

**Gates**:
1. **Type Check**: `bun run typecheck` - 主进程和渲染进程 TypeScript 类型检查
2. **Biome Check**: `bun run check` - 代码格式化和 Lint 检查
3. **Build**: `bun run build` - 生产环境构建验证
4. **Test (optional)**: `bun run test` - 如果规格中要求测试

### Code Review

代码审查 SHOULD 关注以下方面：
- 模块化原则：是否通过 EventBus 解耦，是否遵循初始化顺序
- 类型安全：IPC 接口是否定义完整类型，是否避免 `any`
- 平台兼容性：是否遵守各平台用户体验惯例
- 简单性：是否存在过度设计或不必要的抽象
- 测试覆盖：如果要求测试，是否覆盖核心场景

## Governance

### Amendment Procedure

宪章修订 MUST 遵循以下流程：
1. 提出修订理由和影响范围分析
2. 更新宪章文档并递增版本号（语义化版本控制）
3. 同步更新所有依赖模板（plan-template.md、spec-template.md、tasks-template.md）
4. 在 Sync Impact Report 中记录变更内容和受影响文件
5. 通知所有团队成员新版本生效

### Versioning Policy

- **MAJOR**: 移除或重新定义核心原则，向后不兼容的治理变更
- **MINOR**: 新增原则或实质性扩展指导内容
- **PATCH**: 澄清措辞、修正错别字、非语义改进

### Compliance Review

所有特性规格和实现计划 MUST 在 Constitution Check 章节中明确声明与宪章原则的一致性。任何违反原则的设计 MUST 在 Complexity Tracking 表格中说明必要性和拒绝更简单方案的原因。

### Runtime Guidance

本宪章定义项目级治理原则。具体的代码模式、CLI 命令和开发流程参考 `CLAUDE.md` 获取运行时指导。

**Version**: 1.0.0 | **Ratified**: 2025-01-25 | **Last Amended**: 2025-01-25
