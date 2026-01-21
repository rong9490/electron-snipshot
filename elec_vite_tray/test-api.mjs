/**
 * NestJS API 测试脚本
 * 测试健康检查接口
 */

const BASE_URL = 'http://localhost:3000/api'

// 颜色输出
const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[36m'
}

function log(message, color = 'reset') {
	console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
	log(`✓ ${message}`, 'green')
}

function logError(message) {
	log(`✗ ${message}`, 'red')
}

function logInfo(message) {
	log(`ℹ ${message}`, 'blue')
}

/**
 * 发送 HTTP 请求
 */
async function request(endpoint, method = 'GET', body = null) {
	const options = {
		method,
		headers: {
			'Content-Type': 'application/json'
		}
	}

	if (body) {
		options.body = JSON.stringify(body)
	}

	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, options)
		const data = await response.json()
		return { status: response.status, ok: response.ok, data }
	} catch (error) {
		return { status: 0, ok: false, error: error.message }
	}
}

/**
 * 测试健康检查接口
 */
async function testHealthCheck() {
	logInfo('测试健康检查接口: GET /api/health')
	const result = await request('/health')

	if (result.ok && result.data.status === 'ok') {
		logSuccess('健康检查通过')
		log(`  状态: ${result.data.status}`, 'reset')
		log(`  时间戳: ${result.data.timestamp}`, 'reset')
		log(`  运行时间: ${result.data.uptime.toFixed(2)}s`, 'reset')
		log(`  消息: ${result.data.message}`, 'reset')
		return true
	} else {
		logError('健康检查失败')
		if (result.error) {
			log(`  错误: ${result.error}`, 'red')
		} else {
			log(`  响应: ${JSON.stringify(result.data, null, 2)}`, 'red')
		}
		return false
	}
}

/**
 * 测试详细信息接口
 */
async function testGetInfo() {
	logInfo('测试详细信息接口: GET /api/health/info')
	const result = await request('/health/info')

	if (result.ok && result.data.service && result.data.system) {
		logSuccess('详细信息获取成功')
		log(`  服务名称: ${result.data.service.name}`, 'reset')
		log(`  服务版本: ${result.data.service.version}`, 'reset')
		log(`  运行环境: ${result.data.service.env}`, 'reset')
		log(`  系统: ${result.data.system.platform} ${result.data.system.arch}`, 'reset')
		log(`  Node 版本: ${result.data.system.nodeVersion}`, 'reset')
		log(
			`  内存: ${(result.data.system.memory.free / 1024 / 1024).toFixed(2)}MB / ${(result.data.system.memory.total / 1024 / 1024).toFixed(2)}MB`,
			'reset'
		)
		return true
	} else {
		logError('详细信息获取失败')
		if (result.error) {
			log(`  错误: ${result.error}`, 'red')
		} else {
			log(`  响应: ${JSON.stringify(result.data, null, 2)}`, 'red')
		}
		return false
	}
}

/**
 * 测试 Swagger 文档访问
 */
async function testSwaggerDocs() {
	logInfo('测试 Swagger 文档: GET /api/docs')
	const result = await fetch(`${BASE_URL.replace('/api', '')}/api/docs`, {
		method: 'GET'
	})

	if (result.ok) {
		logSuccess('Swagger 文档可访问')
		log(`  访问地址: http://localhost:3000/api/docs`, 'reset')
		return true
	} else {
		logError('Swagger 文档访问失败')
		log(`  状态码: ${result.status}`, 'red')
		return false
	}
}

/**
 * 主测试函数
 */
async function runTests() {
	console.log('\n' + '='.repeat(60))
	log('NestJS API 测试', 'blue')
	log('测试地址: http://localhost:3000/api', 'yellow')
	console.log('='.repeat(60) + '\n')

	const results = {
		healthCheck: false,
		getInfo: false,
		swaggerDocs: false
	}

	// 等待服务启动
	logInfo('等待服务启动...')
	await new Promise((resolve) => setTimeout(resolve, 2000))

	// 运行测试
	try {
		results.healthCheck = await testHealthCheck()
		console.log()

		results.getInfo = await testGetInfo()
		console.log()

		results.swaggerDocs = await testSwaggerDocs()
		console.log()
	} catch (error) {
		logError(`测试过程中发生错误: ${error.message}`)
	}

	// 汇总结果
	console.log('='.repeat(60))
	log('测试结果汇总', 'blue')
	console.log('='.repeat(60))

	const totalTests = Object.keys(results).length
	const passedTests = Object.values(results).filter(Boolean).length

	Object.entries(results).forEach(([test, passed]) => {
		if (passed) {
			logSuccess(`${test}: 通过`)
		} else {
			logError(`${test}: 失败`)
		}
	})

	console.log('='.repeat(60))
	log(`总计: ${passedTests}/${totalTests} 通过`, passedTests === totalTests ? 'green' : 'yellow')
	console.log('='.repeat(60) + '\n')

	// 返回退出码
	process.exit(passedTests === totalTests ? 0 : 1)
}

// 运行测试
runTests().catch((error) => {
	logError(`测试脚本执行失败: ${error.message}`)
	process.exit(1)
})
