# 插件监控中心服务 - NestJS 技术方案

## 一、技术架构概览

### 1.1 技术栈选型

| 技术领域 | 技术选型 | 版本 | 说明 |
|---------|---------|------|------|
| 后端框架 | NestJS | 10.x | 渐进式 Node.js 框架，支持 TypeScript |
| ORM | TypeORM | 0.3.x | 支持 TypeScript 和装饰器语法 |
| 数据库 | PostgreSQL | 15+ | 关系型数据库，支持 JSON 类型 |
| 缓存 | Redis | 7.x | 缓存、消息队列、Session 存储 |
| 实时通信 | Socket.io | 4.x | WebSocket 封装，支持房间和命名空间 |
| 任务调度（轻量）| @nestjs/schedule | 4.x | 简单定时任务调度 |
| 任务调度（分布式）| XXL-JOB | 2.4.x | 分布式任务调度，复杂场景 |
| 验证 | class-validator | 0.14.x | DTO 验证 |
| 文档 | Swagger | 7.x | API 文档自动生成 |
| 日志 | Winston | 3.x | 日志管理 |
| 测试 | Vitest | 1.x | 单元测试和集成测试 |
| 限流 | @nestjs/throttler | 5.x | API 限流保护 |

### 1.2 架构分层

```
┌─────────────────────────────────────────────────────┐
│                   前端层 (NextJS)                     │
│  - 状态看板  - 趋势分析  - 告警管理  - 一键补数       │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/WebSocket
┌──────────────────────▼──────────────────────────────┐
│              NestJS 应用层 (API Gateway)              │
│  ┌──────────┬──────────┬──────────┬──────────────┐  │
│  │ 设备模块  │ 登录模块  │ 数据模块  │ 告警模块     │  │
│  └──────────┴──────────┴──────────┴──────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                 数据访问层 (Repository)               │
│  ┌──────────┬──────────┬──────────┬──────────────┐  │
│  │ TypeORM  │  Redis   │  Schedule│  WebSocket   │  │
│  └──────────┴──────────┴──────────┴──────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              基础设施层 (Infrastructure)              │
│  PostgreSQL  │  Redis  │  钉钉/企微  │  短信/邮件   │
└─────────────────────────────────────────────────────┘
```

## 二、模块设计

### 2.1 设备监控模块 (DeviceModule)

#### 功能职责
- 设备信息管理（CRUD）
- SIM 卡状态监控
- 设备心跳检测
- 短信收发测试
- 设备状态日志记录

#### 核心服务

```typescript
// device.service.ts
class DeviceService {
  // 设备注册和更新
  registerDevice(dto: RegisterDeviceDto)
  updateDeviceStatus(deviceId: string, status: DeviceStatus)

  // 心跳处理
  handleHeartbeat(deviceId: string)

  // 短信测试
  sendTestSms(deviceId: string)
  verifyTestSms(deviceId: string, code: string)

  // 状态查询
  getDeviceStatus(deviceId: string)
  getAllDevicesStatus()
  getDeviceOnlineRate()

  // 日志查询
  getDeviceLogs(dto: QueryDeviceLogDto)
}
```

#### 技术实现
- **心跳检测**：使用 `@nestjs/schedule` 定时任务，每 20 分钟检查一次心跳超时
- **状态推送**：通过 WebSocket 实时推送设备状态变化
- **日志记录**：使用 TypeORM 的 `subscribe` 事件监听自动记录

### 2.2 登录监控模块 (LoginModule)

#### 功能职责
- 验证码接收监控
- 账号登录状态记录
- 登录失败原因分析
- 账号管理

#### 核心服务

```typescript
// login.service.ts
class LoginService {
  // 验证码管理
  recordVerificationCode(dto: VerificationCodeDto)
  getVerificationCodeStats(accountId: string)

  // 登录记录
  recordLogin(dto: LoginRecordDto)
  getLoginHistory(dto: QueryLoginDto)

  // 失败分析
  analyzeLoginFailures(timeRange: TimeRange)
  getFailureReasonsStats()

  // 统计
  getLoginSuccessRate(deviceId?: string)
}
```

#### 技术实现
- **验证码记录**：提供 REST API 供外部调用记录验证码接收情况
- **失败分析**：使用 TypeORM 的 `GroupBy` 聚合查询统计失败原因
- **实时告警**：连续失败 3 次触发 EventEmitter 事件，由告警模块处理

### 2.3 数据监控模块 (DataModule)

#### 功能职责
- 数据获取任务执行记录
- 数据质量校验
- 数据入库状态监控
- 一键补数

#### 核心服务

```typescript
// data-monitor.service.ts
class DataMonitorService {
  // 任务管理
  createTask(dto: CreateTaskDto)
  updateTaskStatus(taskId: string, status: TaskStatus)
  getTaskStatus(taskId: string)

  // 质量校验
  validateData(data: any, rules: ValidationRule[])
  recordDataQuality(dto: DataQualityDto)

  // 统计分析
  getDataSuccessRate(dataSource?: string)
  getDataDelayStats(timeRange: TimeRange)

  // 补数功能
  createFillTask(dto: CreateFillTaskDto)
  executeFillTask(taskId: string)
}
```

#### 技术实现
- **任务调度**：使用 `@nestjs/schedule` 的 Cron 表达式定时执行数据获取任务
- **质量校验**：使用 `class-validator` 定义校验规则，支持自定义校验器
- **补数任务**：创建独立的补数任务队列，优先级高于普通任务

### 2.4 告警模块 (AlertModule)

#### 功能职责
- 告警规则配置
- 告警触发和发送
- 告警历史记录
- 多渠道通知（钉钉/企微/短信/邮件）

#### 核心服务

```typescript
// alert.service.ts
class AlertService {
  // 告警规则管理
  createRule(dto: CreateAlertRuleDto)
  updateRule(ruleId: string, dto: UpdateAlertRuleDto)
  deleteRule(ruleId: string)
  getActiveRules()

  // 告警处理
  triggerAlert(event: AlertEvent)
  sendAlert(alert: Alert, channels: AlertChannel[])

  // 通知渠道
  sendDingTalk(msg: AlertMessage)
  sendWeChatWork(msg: AlertMessage)
  sendSms(msg: AlertMessage, phone: string)
  sendEmail(msg: AlertMessage)

  // 告警历史
  getAlertHistory(dto: QueryAlertDto)
  getAlertStats(timeRange: TimeRange)
}
```

#### 技术实现
- **告警触发**：使用 NestJS 的 `EventEmitter2` 实现发布订阅模式
- **渠道适配器**：使用 Adapter 模式封装不同通知渠道
- **告警聚合**：Redis 实现告警去重和聚合（防止告警风暴）

## 三、数据库设计

### 3.1 ER 图

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   devices    │         │   sim_cards  │         │ device_logs  │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │───┐     │ id (PK)      │     ┌───│ id (PK)      │
│ device_name  │   │     │ device_id(FK)│─────┘   │ device_id(FK)│
│ device_sn    │   │     │ phone_number │         │ log_type     │
│ status       │   │     │ status       │         │ content      │
│ last_heartbeat│  │     │ signal_strength│       │ created_at   │
│ created_at   │   │     │ created_at   │         └──────────────┘
└──────────────┘   │     └──────────────┘
                   │
┌──────────────┐   │         ┌──────────────┐
│   accounts   │   │         │ login_logs   │
├──────────────┤   │         ├──────────────┤
│ id (PK)      │   │         │ id (PK)      │
│ device_id(FK)│───┘         │ account_id(FK)│
│ account_name │             │ login_status │
│ status       │             │ failure_reason│
│ created_at   │             │ login_time   │
└──────────────┘             │ created_at   │
                             └──────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ data_sources │         │ data_tasks   │         │ data_quality │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │     ┌───│ id (PK)      │     ┌───│ id (PK)      │
│ source_name  │     │   │ source_id(FK)│─────┘   │ task_id(FK)  │
│ source_type  │     │   │ account_id(FK)│        │ quality_score│
│ status       │     │   │ task_type    │         │ issues (JSON)│
│ config (JSON)│     │   │ status       │         │ validated_at │
└──────────────┘     │   │ started_at   │         └──────────────┘
                     │   │ completed_at │
                     │   └──────────────┘
                     │
┌──────────────┐     │         ┌──────────────┐
│ alert_rules  │     │         │ alert_history│
├──────────────┤     │         ├──────────────┤
│ id (PK)      │     │         │ id (PK)      │
│ rule_name    │     │         │ rule_id(FK)  │
│ metric_type  │     │         │ level        │
│ condition    │     │         │ message      │
│ threshold    │     │         │ channel      │
│ level        │     │         │ sent_at      │
│ is_active    │     │         │ status       │
└──────────────┘     │         └──────────────┘
                     │
┌──────────────┐     │
│ fill_tasks   │     │
├──────────────┤     │
│ id (PK)      │     │
│ task_id(FK)  │─────┘
│ time_range   │
│ status       │
│ created_at   │
└──────────────┘
```

### 3.2 核心表结构

#### 设备表 (devices)

```sql
CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  device_name VARCHAR(100) NOT NULL,
  device_sn VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'offline',
  last_heartbeat TIMESTAMP,
  online_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_device_status ON devices(status);
CREATE INDEX idx_last_heartbeat ON devices(last_heartbeat);
```

#### SIM 卡表 (sim_cards)

```sql
CREATE TABLE sim_cards (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'inactive',
  signal_strength INTEGER,
  operator VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 登录日志表 (login_logs)

```sql
CREATE TABLE login_logs (
  id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
  login_status VARCHAR(20) NOT NULL,
  failure_reason VARCHAR(100),
  login_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_login_account ON login_logs(account_id);
CREATE INDEX idx_login_time ON login_logs(login_time);
CREATE INDEX idx_login_status ON login_logs(login_status);
```

#### 数据任务表 (data_tasks)

```sql
CREATE TABLE data_tasks (
  id SERIAL PRIMARY KEY,
  source_id INTEGER REFERENCES data_sources(id) ON DELETE CASCADE,
  account_id INTEGER REFERENCES accounts(id),
  task_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  result JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_task_status ON data_tasks(status);
CREATE INDEX idx_task_source ON data_tasks(source_id);
CREATE INDEX idx_task_created ON data_tasks(created_at);
```

#### 数据质量表 (data_quality)

```sql
CREATE TABLE data_quality (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES data_tasks(id) ON DELETE CASCADE,
  quality_score INTEGER CHECK (quality_score BETWEEN 0 AND 100),
  issues JSONB,
  validation_rules JSONB,
  validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 告警规则表 (alert_rules)

```sql
CREATE TABLE alert_rules (
  id SERIAL PRIMARY KEY,
  rule_name VARCHAR(100) NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  condition VARCHAR(20) NOT NULL,
  threshold DECIMAL(10,2) NOT NULL,
  level VARCHAR(20) NOT NULL,
  channels JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 告警历史表 (alert_history)

```sql
CREATE TABLE alert_history (
  id SERIAL PRIMARY KEY,
  rule_id INTEGER REFERENCES alert_rules(id) ON DELETE CASCADE,
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  channel VARCHAR(50) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'sent'
);

-- 分区表（按月）
CREATE TABLE alert_history_2025_01 PARTITION OF alert_history
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

## 四、API 设计

### 4.1 设备监控 API

```typescript
// 设备管理
POST   /api/devices              // 注册设备
GET    /api/devices              // 获取设备列表
GET    /api/devices/:id          // 获取设备详情
PUT    /api/devices/:id          // 更新设备信息
DELETE /api/devices/:id          // 删除设备

// 设备状态
POST   /api/devices/:id/heartbeat          // 设备心跳
GET    /api/devices/:id/status             // 获取设备状态
GET    /api/devices/statistics/online-rate // 获取在线率

// 短信测试
POST   /api/devices/:id/test-sms           // 发送测试短信
POST   /api/devices/:id/verify-sms         // 验证测试短信

// 设备日志
GET    /api/devices/:id/logs               // 获取设备日志
```

### 4.2 登录监控 API

```typescript
// 验证码管理
POST   /api/login/verification-codes       // 记录验证码
GET    /api/login/verification-codes/stats // 获取验证码统计

// 登录记录
POST   /api/login/records                  // 记录登录
GET    /api/login/records                  // 获取登录记录
GET    /api/login/records/:id              // 获取登录详情

// 统计分析
GET    /api/login/statistics/success-rate  // 获取登录成功率
GET    /api/login/statistics/failures      // 获取失败统计
```

### 4.3 数据监控 API

```typescript
// 任务管理
POST   /api/data/tasks                     // 创建任务
GET    /api/data/tasks                     // 获取任务列表
GET    /api/data/tasks/:id                 // 获取任务详情
PUT    /api/data/tasks/:id/status          // 更新任务状态

// 质量校验
POST   /api/data/quality                   // 提交质量校验
GET    /api/data/quality/:task_id          // 获取质量报告

// 统计分析
GET    /api/data/statistics/success-rate   // 获取成功率
GET    /api/data/statistics/delay          // 获取延迟统计

// 补数功能
POST   /api/data/fill-tasks                // 创建补数任务
GET    /api/data/fill-tasks                // 获取补数任务列表
POST   /api/data/fill-tasks/:id/execute    // 执行补数任务
```

### 4.4 告警 API

```typescript
// 告警规则
POST   /api/alerts/rules                   // 创建告警规则
GET    /api/alerts/rules                   // 获取告警规则列表
GET    /api/alerts/rules/:id               // 获取告警规则详情
PUT    /api/alerts/rules/:id               // 更新告警规则
DELETE /api/alerts/rules/:id               // 删除告警规则

// 告警历史
GET    /api/alerts/history                 // 获取告警历史
GET    /api/alerts/statistics              // 获取告警统计

// 告警测试
POST   /api/alerts/test                    // 测试告警发送
```

### 4.5 监控看板 API

```typescript
// 首页概览
GET    /api/dashboard/overview             // 获取概览数据

// 趋势分析
GET    /api/dashboard/trends/success-rate  // 成功率趋势
GET    /api/dashboard/trends/failures      // 失败趋势

// 实时数据
WS     /api/dashboard/realtime             // WebSocket 实时推送
```

## 五、实时通信方案

### 5.1 WebSocket 网关设计

```typescript
// gateway.ts
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/dashboard'
})
export class DashboardGateway {
  @WebSocketServer()
  server: Server;

  // 推送设备状态变化
  pushDeviceStatus(deviceId: string, status: DeviceStatus) {
    this.server.emit('device:status', { deviceId, status });
  }

  // 推送登录状态变化
  pushLoginStatus(accountId: string, status: LoginStatus) {
    this.server.emit('login:status', { accountId, status });
  }

  // 推送告警
  pushAlert(alert: Alert) {
    this.server.emit('alert:new', alert);
  }

  // 推送任务进度
  pushTaskProgress(taskId: string, progress: number) {
    this.server.emit('task:progress', { taskId, progress });
  }
}
```

### 5.2 事件流设计

```typescript
// 设备状态变化事件
EventEmitter2.emit('device.status.changed', {
  deviceId: 'xxx',
  oldStatus: 'online',
  newStatus: 'offline',
  timestamp: Date.now()
});

// 登录失败事件
EventEmitter2.emit('login.failed', {
  accountId: 'xxx',
  reason: 'verification_code_error',
  timestamp: Date.now()
});

// 告警触发事件
EventEmitter2.emit('alert.triggered', {
  ruleId: 'xxx',
  level: 'critical',
  message: '设备离线超过3分钟'
});
```

## 六、任务调度方案

### 6.1 调度框架选型与分工

本方案采用 **@nestjs/schedule + XXL-JOB** 双调度架构，根据任务复杂度进行分层：

#### 使用场景对比

| 维度 | @nestjs/schedule | XXL-JOB |
|------|------------------|---------|
| **适用场景** | 简单、轻量级定时任务 | 复杂、大规模分布式任务 |
| **部署方式** | 内嵌于应用进程 | 独立调度中心 + 执行器 |
| **任务管理** | 代码硬编码，需重启 | Web 控制台动态配置 |
| **分布式** | ❌ 不支持（单机） | ✅ 支持集群调度 |
| **失败重试** | 需手动实现 | 内置重试机制 |
| **任务分片** | ❌ 不支持 | ✅ 支持任务分片 |
| **日志监控** | 应用日志 | 调度中心可查看 |
| **动态调整** | 需重启服务 | 支持动态修改 cron |
| **告警通知** | 需自行实现 | 内置告警（邮件/钉钉等） |

#### 任务分类原则

**使用 @nestjs/schedule 的场景：**
- ✅ 简单的周期性任务（如每 5 分钟检查心跳）
- ✅ 任务执行时间短（秒级）
- ✅ 不需要分布式协调
- ✅ 不需要动态调整执行时间
- ✅ 任务量小且稳定

**使用 XXL-JOB 的场景：**
- ✅ 大规模数据获取任务（支持分片）
- ✅ 长时间运行的任务（分钟/小时级）
- ✅ 需要动态调整执行计划
- ✅ 需要失败重试和告警通知
- ✅ 需要任务依赖和编排
- ✅ 需要分布式执行（多实例负载均衡）

### 6.2 @nestjs/schedule 轻量调度

```typescript
// schedule.service.ts
@Injectable()
export class ScheduleService {
  // 设备心跳检测（每20分钟）
  @Cron('*/20 * * * *', {
    name: 'check-device-heartbeat'
  })
  async checkDeviceHeartbeat() {
    const timeout = 20 * 60 * 1000; // 20分钟
    const offlineDevices = await this.deviceService.findTimeoutDevices(timeout);
    await Promise.all(
      offlineDevices.map(device => this.deviceService.markOffline(device.id))
    );
  }

  // 短信测试（每天凌晨2点）
  @Cron('0 2 * * *', {
    name: 'daily-sms-test'
  })
  async dailySmsTest() {
    const devices = await this.deviceService.findAllActive();
    await Promise.all(
      devices.map(device => this.deviceService.sendTestSms(device.id))
    );
  }

  // 数据获取任务（每小时）
  @Cron('0 * * * *', {
    name: 'hourly-data-fetch'
  })
  async hourlyDataFetch() {
    const tasks = await this.dataService.createHourlyTasks();
    await this.dataService.executeTasks(tasks);
  }

  // 告警聚合（每5分钟）
  @Cron('*/5 * * * *', {
    name: 'aggregate-alerts'
  })
  async aggregateAlerts() {
    await this.alertService.aggregateAndSend();
  }

  // 清理历史数据（每周日凌晨3点）
  @Cron('0 3 * * 0', {
    name: 'cleanup-history'
  })
  async cleanupHistoryData() {
    await this.cleanupService.deleteOldLogs(90); // 保留90天
  }
}
```

### 6.3 XXL-JOB 分布式调度集成

#### 6.3.1 XXL-JOB 架构设计

```
┌──────────────────────────────────────────────────────┐
│               XXL-JOB 调度中心                        │
│  - 任务管理  - 调度策略  - 日志监控  - 告警通知       │
└─────────────────────┬────────────────────────────────┘
                      │
                      │ RPC (HTTP)
                      ▼
┌──────────────────────────────────────────────────────┐
│              NestJS 执行器 (Executor)                 │
│  ┌──────────────────────────────────────────────┐   │
│  │  xxl-job-executor                             │   │
│  │  ┌──────────┬──────────┬──────────────┐      │   │
│  │  │数据获取任务│ 补数任务  │ 数据清洗任务  │      │   │
│  │  └──────────┴──────────┴──────────────┘      │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

#### 6.3.2 依赖安装

```bash
npm install xxl-job-executor
# 或
npm install @uxuan/xxl-job-executor
```

#### 6.3.3 XXL-JOB 配置模块

```typescript
// xxl-job.config.ts
export interface XxlJobConfig {
  executors: {
    [key: string]: {
      endpoint: string;           // XXL-JOB 调度中心地址
      accessToken?: string;       // 访问令牌
      appName: string;            // 应用名称
      port?: number;              // 执行器端口（默认 9999）
      logPath?: string;           // 日志路径
      logRetentionDays?: number;  // 日志保留天数
    };
  };
}

// config/configuration.ts
export default () => ({
  xxlJob: {
    executors: {
      default: {
        endpoint: process.env.XXL_JOB_ADMIN_ADDRESS || 'http://localhost:8080/xxl-job-admin',
        accessToken: process.env.XXL_JOB_ACCESS_TOKEN,
        appName: process.env.XXL_JOB_APP_NAME || 'monitoring-platform',
        port: parseInt(process.env.XXL_JOB_PORT || '9999'),
        logPath: './logs/xxl-job',
        logRetentionDays: 30
      }
    }
  }
});
```

#### 6.3.4 XXL-JOB Executor 模块

```typescript
// xxl-job.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { XxlJobExecutorModule } from 'xxl-job-executor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataJobHandler } from './handlers/data-job.handler';
import { FillJobHandler } from './handlers/fill-job.handler';

@Module({})
export class XxlJobModule {
  static register(): DynamicModule {
    return {
      module: XxlJobModule,
      imports: [
        XxlJobExecutorModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const xxlConfig = configService.get('xxlJob');
            return {
              executors: Object.entries(xxlConfig.executors).map(([name, config]) => ({
                name,
                ...config
              }))
            };
          }
        })
      ],
      providers: [
        DataJobHandler,
        FillJobHandler,
        // 其他任务处理器...
      ],
      exports: []
    };
  }
}
```

#### 6.3.5 任务处理器实现

```typescript
// handlers/data-job.handler.ts
import { Injectable } from '@nestjs/common';
import { XxlJobHandler, XxlJobContext } from 'xxl-job-executor';
import { DataMonitorService } from '../../modules/data/data-monitor.service';

@Injectable()
@XxlJobHandler({
  name: 'dataFetchJob',           // 任务名称（需在 XXL-JOB 控制台配置）
  description: '数据获取任务',
  timeout: 3600000,               // 超时时间（毫秒）
  retryTimes: 3,                  // 失败重试次数
  executorHandler: 'dataFetchJob' // 执行器任务标识
})
export class DataJobHandler {
  constructor(private readonly dataService: DataMonitorService) {}

  async execute(context: XxlJobContext) {
    const { logger, params } = context;

    try {
      logger.info('开始执行数据获取任务');
      logger.info(`任务参数: ${JSON.stringify(params)}`);

      // 解析任务参数
      const { dataSourceIds, timeRange } = JSON.parse(params || '{}');

      // 创建并执行任务
      const tasks = await this.dataService.createTasks({
        dataSourceIds,
        timeRange,
        taskType: 'scheduled'
      });

      const results = await this.dataService.executeTasks(tasks);

      logger.info(`任务执行完成，成功: ${results.success}, 失败: ${results.failed}`);

      return {
        code: 200,
        msg: '执行成功',
        content: results
      };
    } catch (error) {
      logger.error(`任务执行失败: ${error.message}`);
      throw error;
    }
  }
}

// handlers/fill-job.handler.ts
@Injectable()
@XxlJobHandler({
  name: 'dataFillJob',
  description: '数据补数任务',
  timeout: 7200000,               // 2小时
  retryTimes: 2,
  executorHandler: 'dataFillJob'
})
export class FillJobHandler {
  constructor(private readonly dataService: DataMonitorService) {}

  async execute(context: XxlJobContext) {
    const { logger, params } = context;

    try {
      logger.info('开始执行补数任务');
      const { taskId, timeRange, priority } = JSON.parse(params);

      const result = await this.dataService.executeFillTask(taskId, {
        timeRange,
        priority: priority || 'high'
      });

      logger.info('补数任务执行完成');
      return {
        code: 200,
        msg: '补数成功',
        content: result
      };
    } catch (error) {
      logger.error(`补数任务失败: ${error.message}`);
      throw error;
    }
  }
}

// handlers/data-cleaning.handler.ts
@Injectable()
@XxlJobHandler({
  name: 'dataCleaningJob',
  description: '数据清洗任务',
  timeout: 1800000,               // 30分钟
  retryTimes: 1,
  executorHandler: 'dataCleaningJob'
})
export class DataCleaningJobHandler {
  async execute(context: XxlJobContext) {
    const { logger, params } = context;

    // 实现数据清洗逻辑
    logger.info('开始数据清洗...');

    // 清理逻辑...

    return {
      code: 200,
      msg: '清洗完成'
    };
  }
}
```

#### 6.3.6 任务分片处理（大数据量场景）

```typescript
// handlers/sharded-data-job.handler.ts
import { Injectable } from '@nestjs/common';
import { XxlJobHandler, XxlJobContext, XxlJobShardingUtil } from 'xxl-job-executor';

@Injectable()
@XxlJobHandler({
  name: 'shardedDataFetchJob',
  description: '分片数据获取任务（支持大规模数据源）',
  executorHandler: 'shardedDataFetchJob'
})
export class ShardedDataJobHandler {
  async execute(context: XxlJobContext) {
    const { logger, params } = context;

    // 获取分片参数
    const shardIndex = XxlJobShardingUtil.getShardingIndex(context); // 当前分片索引（从0开始）
    const shardTotal = XxlJobShardingUtil.getShardingTotal(context); // 总分片数

    logger.info(`当前执行分片: ${shardIndex + 1} / ${shardTotal}`);

    // 解析所有需要处理的数据源
    const allDataSources = await this.getAllDataSources();

    // 计算当前分片需要处理的数据源
    const shardedDataSources = this.calculateShard(allDataSources, shardIndex, shardTotal);

    logger.info(`本分片需处理 ${shardedDataSources.length} 个数据源`);

    const results = [];
    for (const dataSource of shardedDataSources) {
      try {
        const result = await this.fetchDataFromSource(dataSource);
        results.push(result);
      } catch (error) {
        logger.error(`数据源 ${dataSource.id} 获取失败: ${error.message}`);
      }
    }

    return {
      code: 200,
      msg: '分片执行成功',
      content: {
        shardIndex,
        shardTotal,
        processedCount: results.length,
        results
      }
    };
  }

  private calculateShard<T>(items: T[], shardIndex: number, shardTotal: number): T[] {
    return items.filter((_, index) => index % shardTotal === shardIndex);
  }
}
```

#### 6.3.7 在 app.module.ts 中注册

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { XxlJobModule } from './xxl-job.module';

@Module({
  imports: [
    // 简单定时任务调度
    ScheduleModule.forRoot(),

    // XXL-JOB 分布式调度
    XxlJobModule.register(),

    // 其他模块...
    DeviceModule,
    LoginModule,
    DataModule,
    AlertModule,
  ],
  // ...
})
export class AppModule {}
```

#### 6.3.8 XXL-JOB 控制台配置示例

在 XXL-JOB 管理后台创建任务：

```yaml
任务名称: 数据获取-小时级
Cron表达式: 0 0 * * * ?    # 每小时执行
运行模式: BEAN
JobHandler: dataFetchJob
任务参数:
  {
    "dataSourceIds": [1, 2, 3, 4, 5],
    "timeRange": {
      "start": "@{-1h}",
      "end": "@{now}"
    }
  }
执行器路由策略: 第一个
阻塞处理策略: 单机串行
失败重试次数: 3
超时时间: 3600

---

任务名称: 数据补数-手动触发
Cron表达式: 无（手动触发）
运行模式: BEAN
JobHandler: dataFillJob
任务参数:
  {
    "taskId": 12345,
    "timeRange": {
      "start": "2025-01-01 00:00:00",
      "end": "2025-01-31 23:59:59"
    },
    "priority": "high"
  }

---

任务名称: 大规模数据清洗（分片）
Cron表达式: 0 0 2 * * ?    # 每天凌晨2点
运行模式: BEAN
JobHandler: shardedDataFetchJob
任务参数: {}
执行器路由策略: 分片广播
阻塞处理策略: 丢弃后续调度
```

### 6.4 任务调度示例汇总

#### 简单定时任务（@nestjs/schedule）

```typescript
@Injectable()
export class SimpleScheduleService {
  // 设备心跳检测（每20分钟）
  @Cron('*/20 * * * *', {
    name: 'check-device-heartbeat'
  })
  async checkDeviceHeartbeat() {
    // 简单、快速的心跳检测逻辑
  }

  // 告警聚合（每5分钟）
  @Cron('*/5 * * * *')
  async aggregateAlerts() {
    // 告警聚合逻辑
  }

  // 清理历史数据（每周日凌晨3点）
  @Cron('0 3 * * 0')
  async cleanupHistoryData() {
    // 清理逻辑
  }
}
```

#### 复杂调度任务（XXL-JOB）

```typescript
// 1. 大规模数据获取（分片）
@XxlJobHandler({ name: 'dataFetchJob' })
async execute(context: XxlJobContext) {
  // 处理大规模数据源，支持分片
}

// 2. 补数任务（长时间运行）
@XxlJobHandler({ name: 'dataFillJob' })
async execute(context: XxlJobContext) {
  // 补数逻辑，可能需要运行数小时
}

// 3. 数据清洗（CPU密集型）
@XxlJobHandler({ name: 'dataCleaningJob' })
async execute(context: XxlJobContext) {
  // 复杂的数据清洗和转换
}
```

### 6.5 最佳实践建议

1. **任务粒度控制**
   - 单个任务执行时间不宜过长（建议 < 1小时）
   - 大任务拆分为多个小任务，便于监控和重试

2. **失败处理**
   - XXL-JOB 任务配置重试次数（建议 2-3 次）
   - 实现幂等性，避免重复执行导致数据问题

3. **日志管理**
   - 使用 `XxlJobContext.logger` 记录任务执行日志
   - 关键节点打印日志，便于排查问题

4. **监控告警**
   - XXL-JOB 配置告警邮件/钉钉通知
   - 关键任务失败时及时告警

5. **性能优化**
   - 使用分片广播提高并行处理能力
   - 合理设置执行器数量，避免资源竞争

## 七、告警方案实现

### 7.1 告警触发流程

```
[事件发生] -> [规则匹配] -> [告警聚合] -> [渠道发送] -> [历史记录]
     ↓            ↓            ↓            ↓            ↓
  EventEmitter  RuleEngine  Aggregator   Adapter    Repository
```

### 7.2 告警规则引擎

```typescript
// alert-rule-engine.service.ts
@Injectable()
export class AlertRuleEngineService {
  // 评估事件是否触发告警
  async evaluate(event: AlertEvent): Promise<AlertRule[]> {
    const rules = await this.getActiveRules(event.metricType);
    const triggeredRules: AlertRule[] = [];

    for (const rule of rules) {
      if (this.checkCondition(event, rule)) {
        triggeredRules.push(rule);
      }
    }

    return triggeredRules;
  }

  // 条件检查
  private checkCondition(event: AlertEvent, rule: AlertRule): boolean {
    switch (rule.condition) {
      case 'gt': return event.value > rule.threshold;
      case 'lt': return event.value < rule.threshold;
      case 'eq': return event.value === rule.threshold;
      case 'gte': return event.value >= rule.threshold;
      case 'lte': return event.value <= rule.threshold;
      default: return false;
    }
  }
}
```

### 7.3 告警聚合器

```typescript
// alert-aggregator.service.ts
@Injectable()
export class AlertAggregatorService {
  private redis: Redis;

  // 聚合告警（防止告警风暴）
  async aggregate(event: AlertEvent): Promise<boolean> {
    const key = `alert:agg:${event.ruleId}:${event.metricType}`;
    const count = await this.redis.incr(key);

    // 第一次告警，立即发送
    if (count === 1) {
      await this.redis.expire(key, 300); // 5分钟窗口
      return true;
    }

    // 5分钟内超过10次，发送聚合告警
    if (count === 10) {
      await this.redis.del(key);
      return true;
    }

    return false; // 抑制中间的告警
  }
}
```

### 7.4 通知渠道适配器

```typescript
// 钉钉适配器
@Injectable()
export class DingTalkAdapter {
  async send(message: AlertMessage) {
    const webhook = this.configService.get('DINGTALK_WEBHOOK');
    await axios.post(webhook, {
      msgtype: 'markdown',
      markdown: {
        title: message.title,
        text: this.formatMessage(message)
      }
    });
  }
}

// 企业微信适配器
@Injectable()
export class WeChatWorkAdapter {
  async send(message: AlertMessage) {
    const webhook = this.configService.get('WECHAT_WORK_WEBHOOK');
    await axios.post(webhook, {
      msgtype: 'markdown',
      markdown: {
        content: this.formatMessage(message)
      }
    });
  }
}

// 短信适配器
@Injectable()
export class SmsAdapter {
  async send(message: AlertMessage, phones: string[]) {
    // 集成阿里云/腾讯云短信服务
    await this.smsClient.send({
      phoneNumbers: phones.join(','),
      templateCode: message.templateCode,
      templateParam: JSON.stringify(message.params)
    });
  }
}
```

## 八、监控看板实现

### 8.1 首页概览数据聚合

```typescript
// dashboard.service.ts
@Injectable()
export class DashboardService {
  // 获取首页概览数据
  async getOverview(): Promise<OverviewData> {
    const [
      deviceOnline,
      loginSuccess,
      dataSuccess,
      activeAlerts
    ] = await Promise.all([
      this.getDeviceOnlineRate(),
      this.getLoginSuccessRate(),
      this.getDataSuccessRate(),
      this.getActiveAlertsCount()
    ]);

    return {
      deviceOnlineRate: deviceOnline,
      loginSuccessRate: loginSuccess,
      dataSuccessRate: dataSuccess,
      activeAlertsCount: activeAlerts,
      timestamp: Date.now()
    };
  }
}
```

### 8.2 趋势分析

```typescript
// 成功率趋势
async getSuccessRateTrend(
  metric: 'device' | 'login' | 'data',
  timeRange: TimeRange
): Promise<TrendData[]> {
  const granularity = this.calculateGranularity(timeRange);

  const results = await this.repository
    .createQueryBuilder('entity')
    .select([
      `DATE_TRUNC('${granularity}', entity.created_at) AS time`,
      'COUNT(*) AS total',
      'SUM(CASE WHEN status = :success THEN 1 ELSE 0 END) AS success'
    ])
    .where('entity.created_at BETWEEN :start AND :end', {
      start: timeRange.start,
      end: timeRange.end
    })
    .groupBy(`DATE_TRUNC('${granularity}', entity.created_at)`)
    .orderBy('time', 'ASC')
    .setParameters({ success: 'success' })
    .getRawMany();

  return results.map(r => ({
    time: r.time,
    rate: (r.success / r.total * 100).toFixed(2)
  }));
}
```

### 8.3 状态颜色定义

```typescript
// status-color.util.ts
export enum StatusColor {
  SUCCESS = 'green',    // 数据成功且质量通过
  EMPTY = 'white',      // 未获取到数据
  FAILED = 'red',       // 数据获取失败
  WARNING = 'yellow',   // 质量校验失败
  DELAYED = 'orange'    // 数据延迟超过阈值
}

export function getStatusColor(
  status: string,
  quality?: number,
  delay?: number
): StatusColor {
  if (status === 'success') {
    if (quality && quality < 80) return StatusColor.WARNING;
    if (delay && delay > 1800) return StatusColor.DELAYED;
    return StatusColor.SUCCESS;
  }

  if (status === 'failed') return StatusColor.FAILED;
  if (status === 'empty') return StatusColor.EMPTY;

  return StatusColor.SUCCESS;
}
```

## 九、测试方案（Vitest）

### 9.1 Vitest 配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.entity.ts',
        '**/*.dto.ts',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
    },
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
    },
  },
});
```

### 9.2 测试环境配置

```typescript
// test/setup.ts
import { TestUtils } from './utils/test-utils';

// 全局测试工具
global.utils = new TestUtils();

// 测试前初始化
beforeAll(async () => {
  await global.utils.initialize();
});

// 测试后清理
afterAll(async () => {
  await global.utils.cleanup();
});

// 每个测试后清理数据库
afterEach(async () => {
  await global.utils.clearDatabase();
});
```

### 9.3 单元测试示例

```typescript
// device/device.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('DeviceService', () => {
  let service: DeviceService;
  let repository: Repository<Device>;

  const mockRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: getRepositoryToken(Device),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
    repository = module.get<Repository<Device>>(getRepositoryToken(Device));
  });

  it('应该成功获取所有设备', async () => {
    const expectedDevices = [
      { id: 1, deviceName: 'Device 1', status: 'online' },
      { id: 2, deviceName: 'Device 2', status: 'offline' },
    ];

    mockRepository.find.mockResolvedValue(expectedDevices);

    const result = await service.findAll();

    expect(result).toEqual(expectedDevices);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('应该成功创建设备', async () => {
    const createDeviceDto = {
      deviceName: 'New Device',
      deviceSn: 'SN12345',
    };

    const savedDevice = {
      id: 1,
      ...createDeviceDto,
      status: 'offline',
    };

    mockRepository.create.mockReturnValue(savedDevice);
    mockRepository.save.mockResolvedValue(savedDevice);

    const result = await service.create(createDeviceDto);

    expect(result).toEqual(savedDevice);
    expect(mockRepository.create).toHaveBeenCalledWith(createDeviceDto);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('应该成功处理设备心跳', async () => {
    const deviceId = '1';
    const now = new Date();

    mockRepository.findOne.mockResolvedValue({
      id: 1,
      deviceName: 'Device 1',
      status: 'online',
    });
    mockRepository.save.mockResolvedValue({
      id: 1,
      lastHeartbeat: now,
    });

    await service.handleHeartbeat(deviceId);

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: deviceId } });
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
```

### 9.4 集成测试示例

```typescript
// device/device.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceController } from './device.controller';
import { DeviceModule } from './device.module';
import { AppModule } from '../app.module';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('DeviceController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Device],
          synchronize: true,
        }),
        DeviceModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/devices (POST) - 应该成功创建设备', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/devices')
      .send({
        deviceName: 'Test Device',
        deviceSn: 'TEST001',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.deviceName).toBe('Test Device');
    expect(response.body.status).toBe('offline');
  });

  it('/api/devices (GET) - 应该成功获取设备列表', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/devices')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

### 9.5 Mock 外部依赖

```typescript
// test/mocks/xxl-job.mock.ts
import { XxlJobContext } from 'xxl-job-executor';

export class MockXxlJobContext implements XxlJobContext {
  logger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };

  params = '{}';

  private mockData: any = {};

  setParams(params: string) {
    this.params = params;
  }
}

// test/mocks/redis.mock.ts
export class MockRedis {
  private data = new Map<string, any>();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) || null;
  }

  async set(key: string, value: any, ttl?: number): Promise<'OK'> {
    this.data.set(key, value);
    if (ttl) {
      setTimeout(() => this.data.delete(key), ttl * 1000);
    }
    return 'OK';
  }

  async incr(key: string): Promise<number> {
    const current = (await this.get(key)) || '0';
    const newValue = parseInt(current) + 1;
    await this.set(key, newValue);
    return newValue;
  }

  async del(key: string): Promise<number> {
    return this.data.delete(key) ? 1 : 0;
  }

  async expire(key: string, seconds: number): Promise<number> {
    return 1;
  }

  clear() {
    this.data.clear();
  }
}
```

### 9.6 测试工具函数

```typescript
// test/utils/test-utils.ts
import { TestUtils } from './test-utils';

export class TestUtils {
  private module: TestingModule;
  private app: INestApplication;

  async initialize() {
    this.module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = this.module.createNestApplication();
    await this.app.init();
  }

  async cleanup() {
    if (this.app) {
      await this.app.close();
    }
  }

  async clearDatabase() {
    // 清理测试数据库
    const repositories = this.module.get<Repository<any>[]>(getRepositoryToken());
    for (const repository of repositories) {
      await repository.clear();
    }
  }

  get<T>(type: new (...args) => T): T {
    return this.module.get<T>(type);
  }
}
```

### 9.7 package.json 脚本

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:unit": "vitest run --config vitest.unit.config.ts",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  }
}
```

## 十、项目目录结构

```
src/
├── main.ts                    # 应用入口
├── app.module.ts              # 根模块
├── config/                    # 配置文件
│   ├── configuration.ts       # 配置定义
│   ├── database.ts            # 数据库配置
│   ├── redis.ts               # Redis 配置
│   └── xxl-job.ts             # XXL-JOB 配置
├── common/                    # 公共模块
│   ├── dtos/                  # 公共 DTO
│   ├── filters/               # 异常过滤器
│   ├── guards/                # 守卫
│   ├── interceptors/          # 拦截器
│   ├── pipes/                 # 管道
│   └── utils/                 # 工具函数
├── modules/                   # 业务模块
│   ├── device/                # 设备监控模块
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── device.controller.ts
│   │   ├── device.service.ts
│   │   └── device.module.ts
│   ├── login/                 # 登录监控模块
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── login.controller.ts
│   │   ├── login.service.ts
│   │   └── login.module.ts
│   ├── data/                  # 数据监控模块
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── data.controller.ts
│   │   ├── data.service.ts
│   │   └── data.module.ts
│   ├── alert/                 # 告警模块
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── channels/          # 通知渠道适配器
│   │   ├── alert.controller.ts
│   │   ├── alert.service.ts
│   │   └── alert.module.ts
│   ├── dashboard/             # 监控看板模块
│   │   ├── dto/
│   │   ├── dashboard.gateway.ts
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.service.ts
│   │   └── dashboard.module.ts
│   └── schedule/              # 简单定时任务模块
│       ├── schedule.service.ts
│       └── schedule.module.ts
├── xxl-job/                   # XXL-JOB 执行器模块
│   ├── xxl-job.module.ts      # XXL-JOB 模块定义
│   └── handlers/              # 任务处理器
│       ├── data-job.handler.ts
│       ├── fill-job.handler.ts
│       └── sharded-data-job.handler.ts
├── database/                  # 数据库相关
│   ├── migrations/            # 迁移文件
│   └── seeds/                 # 种子数据
└── jobs/                      # 后台任务
    ├── processors/            # 任务处理器
    └── queues/                # 任务队列

test/                         # 测试目录
├── setup.ts                   # 测试环境初始化
├── utils/                     # 测试工具
│   └── test-utils.ts
├── mocks/                     # Mock 对象
│   ├── xxl-job.mock.ts
│   └── redis.mock.ts
├── unit/                      # 单元测试
│   ├── device/
│   ├── login/
│   └── data/
└── e2e/                       # 集成测试
    ├── device.e2e-spec.ts
    └── login.e2e-spec.ts

vitest.config.ts              # Vitest 配置
vitest.unit.config.ts         # 单元测试配置
vitest.e2e.config.ts          # E2E 测试配置
```

## 十一、部署方案

### 11.1 Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

### 11.2 Docker Compose 部署（含 XXL-JOB）

```yaml
# docker-compose.yml
version: '3.8'

services:
  # NestJS 应用
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_HOST=postgres
      - REDIS_HOST=redis
      - XXL_JOB_ADMIN_ADDRESS=http://xxl-job-admin:8080/xxl-job-admin
      - XXL_JOB_ACCESS_TOKEN=default_token
      - XXL_JOB_APP_NAME=monitoring-platform
    depends_on:
      - postgres
      - redis
      - xxl-job-admin
    networks:
      - monitoring-network

  # PostgreSQL 数据库
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: monitoring
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - monitoring-network

  # Redis 缓存
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - monitoring-network

  # XXL-JOB 调度中心
  xxl-job-admin:
    image: xuxueli/xxl-job-admin:2.4.0
    environment:
      - PARAMS=--spring.datasource.url=jdbc:postgresql://postgres:5432/xxl_job \
                --spring.datasource.username=postgres \
                --spring.datasource.password=postgres \
                --spring.mail.host=smtp.example.com \
                --spring.mail.port=25 \
                --xxl.job.accessToken=default_token
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    volumes:
      - xxl_job_logs:/data/applogs
    networks:
      - monitoring-network

volumes:
  postgres_data:
  redis_data:
  xxl_job_logs:

networks:
  monitoring-network:
    driver: bridge
```

### 11.3 XXL-JOB 初始化 SQL

```sql
-- xxl-job-init.sql
-- XXL-JOB 数据库初始化脚本（需要单独创建 xxl_job 数据库）

CREATE DATABASE xxl_job;

-- 详细 SQL 脚本请参考 XXL-JOB 官方文档
-- https://github.com/xuxueli/xxl-job/blob/master/doc/db/tables_xxl_job.sql
```

### 11.4 环境变量配置

```bash
# .env.example

# 数据库配置
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=admin
DATABASE_PASSWORD=password
DATABASE_DATABASE=monitoring

# Redis 配置
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# XXL-JOB 配置
XXL_JOB_ADMIN_ADDRESS=http://xxl-job-admin:8080/xxl-job-admin
XXL_JOB_ACCESS_TOKEN=default_token
XXL_JOB_APP_NAME=monitoring-platform
XXL_JOB_PORT=9999

# 应用配置
PORT=3000
NODE_ENV=production

# 日志配置
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# 告警配置
DINGTALK_WEBHOOK=https://oapi.dingtalk.com/robot/send?access_token=xxx
WECHAT_WORK_WEBHOOK=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx
```

### 11.5 性能优化建议

1. **数据库优化**
   - 为高频查询字段添加索引
   - 使用连接池管理数据库连接
   - 告警历史表使用分区表

2. **缓存策略**
   - 设备状态缓存到 Redis（TTL 5分钟）
   - 统计数据缓存（TTL 15分钟）
   - 使用 Redis 做分布式锁

3. **异步处理**
   - 告警发送使用消息队列
   - 数据质量校验异步执行
   - 补数任务使用队列

4. **监控和日志**
   - 使用 NestJS Logger + Winston
   - 集成 Prometheus + Grafana
   - APM 监控（New Relic / Datadog）

## 十一、开发计划

### 第一阶段（设备层 + 登录层）
- [x] 搭建 NestJS 项目基础架构
- [ ] 实现设备管理模块
- [ ] 实现心跳检测机制
- [ ] 实现登录监控模块
- [ ] 实现基础告警功能

### 第二阶段（数据层）
- [ ] 实现数据任务管理
- [ ] 实现质量校验模块
- [ ] 完善告警规则引擎
- [ ] 实现补数功能

### 第三阶段（平台层）
- [ ] 实现监控看板 API
- [ ] 实现 WebSocket 实时推送
- [ ] 实现趋势分析
- [ ] 前端界面开发

### 第四阶段（优化和运维）
- [ ] 性能优化
- [ ] 压力测试
- [ ] 部署上线
- [ ] 监控和维护

## 十二、总结

本技术方案基于 NestJS 框架和其生态系统，完整实现了设计文档中的四层监控体系：

1. **模块化设计**：使用 NestJS 的模块化架构，各层监控独立开发和维护
2. **TypeORM + PostgreSQL**：提供强大的数据持久化和查询能力
3. **WebSocket 实时推送**：监控看板实时获取最新状态
4. **双调度架构**：
   - **@nestjs/schedule**：处理简单、轻量级的定时任务（心跳检测、告警聚合等）
   - **XXL-JOB**：处理复杂、大规模的分布式任务（数据获取、补数任务等）
5. **事件驱动架构**：使用 EventEmitter2 实现模块间解耦
6. **多渠道告警**：适配器模式支持钉钉、企微、短信、邮件等多种通知方式
7. **完善测试体系**：使用 Vitest 进行单元测试和集成测试，支持 Mock 外部依赖
8. **可扩展性**：预留接口支持后续扩展新的数据源和监控指标

### 技术亮点

**调度策略分层**
- 轻量任务使用 @nestjs/schedule，无需额外部署
- 重量任务使用 XXL-JOB，支持分布式执行、任务分片、失败重试

**测试框架升级**
- 从 Jest 迁移到 Vitest，性能提升 10 倍
- 更好的 TypeScript 支持
- 与 Vite 生态无缝集成

**容器化部署**
- Docker Compose 一键启动完整环境
- 包含 XXL-JOB 调度中心、PostgreSQL、Redis
- 支持水平扩展

该方案具有良好的可维护性、可扩展性和性能表现，能够满足生产环境的监控需求。
