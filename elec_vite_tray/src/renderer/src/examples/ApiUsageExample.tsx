/**
 * API 使用示例
 * 演示如何使用暴露的 API
 */

import { useEffect, useState } from 'react'

// 类型声明已通过 src/preload/index.d.ts 全局声明
// 可以直接使用 window.api 而无需额外导入

export function ApiUsageExample() {
	const [config, setConfig] = useState<any>(null)
	const [state, setState] = useState<any>(null)
	const [unreadCount, setUnreadCount] = useState(0)
	const [isMonitoring, setIsMonitoring] = useState(false)
	const [notificationStats, setNotificationStats] = useState<any>(null)

	useEffect(() => {
		// 初始化：加载配置和状态
		loadInitialData()

		// 设置事件监听器
		const cleanupFunctions = [
			// 监听状态变化
			window.api.on.stateChanged((newState) => {
				setState(newState)
			}),

			// 监听未读数变化
			window.api.on.unreadCountChanged((count) => {
				setUnreadCount(count)
			}),

			// 监听配置变化
			window.api.on.configChanged((newConfig) => {
				setConfig(newConfig)
			}),

			// 监听通知点击
			window.api.on.notificationClick((options) => {
				console.log('通知被点击:', options)
			})
		]

		// 清理函数
		return () => {
			cleanupFunctions.forEach((cleanup) => cleanup())
		}
	}, [])

	async function loadInitialData() {
		try {
			// 加载配置
			const configData = await window.api.config.getAll()
			setConfig(configData)

			// 加载状态
			const stateData = await window.api.state.get()
			setState(stateData)
			setUnreadCount(stateData.unreadCount)

			// 检查监控状态
			const monitoring = await window.api.monitoring.isRunning()
			setIsMonitoring(monitoring)

			// 加载通知统计
			const stats = await window.api.notification.getStats()
			setNotificationStats(stats)
		} catch (error) {
			console.error('加载数据失败:', error)
		}
	}

	// ========== 配置操作示例 ==========

	async function updateConfig() {
		try {
			// 更新单个配置
			await window.api.config.set('checkInterval', 30000)

			// 或批量更新
			await window.api.config.setMany({
				checkInterval: 30000,
				enableNotification: true
			})

			// 重新加载配置
			await loadInitialData()
		} catch (error) {
			console.error('更新配置失败:', error)
		}
	}

	async function resetConfig() {
		try {
			await window.api.config.reset()
			await loadInitialData()
		} catch (error) {
			console.error('重置配置失败:', error)
		}
	}

	async function exportConfig() {
		try {
			const configJson = await window.api.config.export()
			console.log('配置导出:', configJson)

			// 可以保存到文件或发送到服务器
		} catch (error) {
			console.error('导出配置失败:', error)
		}
	}

	// ========== 状态操作示例 ==========

	async function incrementUnread() {
		try {
			await window.api.state.incrementUnreadCount(1)
		} catch (error) {
			console.error('增加未读数失败:', error)
		}
	}

	async function clearUnread() {
		try {
			await window.api.state.clearUnreadCount()
		} catch (error) {
			console.error('清空未读数失败:', error)
		}
	}

	async function addTask() {
		try {
			await window.api.state.addTask({
				id: Date.now().toString(),
				name: '示例任务',
				status: 'running',
				progress: 0
			})
		} catch (error) {
			console.error('添加任务失败:', error)
		}
	}

	async function refreshState() {
		try {
			await window.api.state.refresh()
			await loadInitialData()
		} catch (error) {
			console.error('刷新状态失败:', error)
		}
	}

	// ========== 监控控制示例 ==========

	async function toggleMonitoring() {
		try {
			if (isMonitoring) {
				await window.api.monitoring.stop()
			} else {
				await window.api.monitoring.start()
			}

			// 更新状态
			const running = await window.api.monitoring.isRunning()
			setIsMonitoring(running)
		} catch (error) {
			console.error('切换监控状态失败:', error)
		}
	}

	// ========== 通知操作示例 ==========

	async function showNotification() {
		try {
			await window.api.notification.show({
				title: '测试通知',
				body: '这是一条测试通知',
				type: 'info'
			})
		} catch (error) {
			console.error('显示通知失败:', error)
		}
	}

	async function showBatchNotifications() {
		try {
			const notifications = [
				{ title: '通知1', body: '内容1', type: 'info' as const },
				{ title: '通知2', body: '内容2', type: 'warning' as const },
				{ title: '通知3', body: '内容3', type: 'success' as const }
			]

			const count = await window.api.notification.showBatch(notifications, 1000)
			console.log(`成功发送 ${count} 条通知`)
		} catch (error) {
			console.error('批量发送通知失败:', error)
		}
	}

	async function loadNotificationHistory() {
		try {
			const history = await window.api.notification.getHistory(10)
			console.log('通知历史:', history)

			const stats = await window.api.notification.getStats()
			setNotificationStats(stats)
		} catch (error) {
			console.error('加载通知历史失败:', error)
		}
	}

	// ========== 窗口控制示例 ==========

	async function hideWindow() {
		try {
			await window.api.window.hide()
		} catch (error) {
			console.error('隐藏窗口失败:', error)
		}
	}

	// ========== 应用信息示例 ==========

	async function getAppInfo() {
		try {
			const version = await window.api.app.getVersion()
			const name = await window.api.app.getName()
			console.log(`应用: ${name} v${version}`)
		} catch (error) {
			console.error('获取应用信息失败:', error)
		}
	}

	return (
		<div style={{ padding: '20px' }}>
			<h1>API 使用示例</h1>

			{/* 配置部分 */}
			<section style={{ marginBottom: '30px' }}>
				<h2>配置管理</h2>
				{config && (
					<div>
						<p>检查间隔: {config.checkInterval}ms</p>
						<p>通知启用: {config.enableNotification ? '是' : '否'}</p>
						<p>角标启用: {config.enableBadge ? '是' : '否'}</p>
					</div>
				)}
				<div>
					<button onClick={updateConfig}>更新配置</button>
					<button onClick={resetConfig}>重置配置</button>
					<button onClick={exportConfig}>导出配置</button>
				</div>
			</section>

			{/* 状态部分 */}
			<section style={{ marginBottom: '30px' }}>
				<h2>状态管理</h2>
				<p>未读消息: {unreadCount}</p>
				{state && state.tasks && <p>任务数: {state.tasks.length}</p>}
				<div>
					<button onClick={incrementUnread}>增加未读数</button>
					<button onClick={clearUnread}>清空未读数</button>
					<button onClick={addTask}>添加任务</button>
					<button onClick={refreshState}>刷新状态</button>
				</div>
			</section>

			{/* 监控部分 */}
			<section style={{ marginBottom: '30px' }}>
				<h2>监控控制</h2>
				<p>状态: {isMonitoring ? '监控中' : '已停止'}</p>
				<button onClick={toggleMonitoring}>{isMonitoring ? '停止监控' : '开始监控'}</button>
			</section>

			{/* 通知部分 */}
			<section style={{ marginBottom: '30px' }}>
				<h2>通知管理</h2>
				{notificationStats && (
					<div>
						<p>总通知数: {notificationStats.total}</p>
						<p>点击数: {notificationStats.clicked}</p>
					</div>
				)}
				<div>
					<button onClick={showNotification}>显示通知</button>
					<button onClick={showBatchNotifications}>批量通知</button>
					<button onClick={loadNotificationHistory}>加载历史</button>
				</div>
			</section>

			{/* 窗口控制 */}
			<section style={{ marginBottom: '30px' }}>
				<h2>窗口控制</h2>
				<button onClick={hideWindow}>隐藏窗口</button>
			</section>

			{/* 应用信息 */}
			<section>
				<h2>应用信息</h2>
				<button onClick={getAppInfo}>获取应用信息</button>
			</section>
		</div>
	)
}
