# NestJS 集成快速指南

## ✅ 已完成的集成

### 1. 核心文件结构

```
src/main/nestjs/
├── main.ts                 # NestJS 启动入口
├── app.module.ts           # 根模块
├── config/
│   └── server.config.ts    # 服务器配置
└── modules/
    └── health/             # 健康检查模块
        ├── health.module.ts
        ├── health.controller.ts
        └── health.service.ts
```

### 2. 可用的 API 端点

开发环境运行后，可以使用以下端点：

```bash
# 健康检查
curl http://localhost:3000/api/health

# 详细信息
curl http://localhost:3000/api/health/info
```

### 3. 启动和测试

```bash
# 启动开发环境
bun run dev

# 在另一个终端测试 API
curl http://localhost:3000/api/health
```

### 4. 集成说明

- ✅ NestJS 在主进程中启动
- ✅ 端口：3000 (仅监听 127.0.0.1)
- ✅ 前缀：/api
- ✅ CORS 已配置（开发环境）
- ✅ 优雅关闭已实现

## 📝 下一步

1. **在渲染进程中调用 API**
   - 创建 API 客户端封装
   - 添加 React Hooks

2. **添加更多模块**
   - ConfigModule (配置管理)
   - StateModule (状态管理)
   - TaskModule (任务管理)

3. **增强功能**
   - WebSocket 支持
   - 数据库集成
   - 任务调度

## 🔧 开发提示

- 所有 NestJS 代码在 `src/main/nestjs/` 目录
- 主进程入口：`src/main/index.ts`
- 使用 TypeScript 装饰器：已在 `tsconfig.node.json` 中启用
