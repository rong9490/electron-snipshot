#!/usr/bin/env bun
/**
 * 验证 Electron + NestJS 打包结果
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[36m',
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

function logWarning(message) {
	log(`⚠ ${message}`, 'yellow')
}

const outDir = 'out'
const mainIndexFile = join(outDir, 'main', 'index.js')

console.log('\n' + '='.repeat(60))
	log('Electron + NestJS 打包验证', 'blue')
	console.log('='.repeat(60) + '\n')

let allPassed = true

// 1. 检查构建输出目录结构
logInfo('检查构建输出目录结构...')

const requiredDirs = [
	{ path: join(outDir, 'main'), name: '主进程代码' },
	{ path: join(outDir, 'preload'), name: '预加载脚本' },
	{ path: join(outDir, 'renderer'), name: '渲染进程代码' },
]

requiredDirs.forEach(({ path, name }) => {
	if (existsSync(path)) {
		logSuccess(`${name}目录存在`)
	} else {
		logError(`${name}目录不存在: ${path}`)
		allPassed = false
	}
})

console.log()

// 2. 检查主进程代码
logInfo('检查主进程代码...')

if (existsSync(mainIndexFile)) {
	logSuccess('主进程入口文件存在')

	const content = readFileSync(mainIndexFile, 'utf-8')

	// 检查关键代码
	const checks = [
		{
			pattern: /@nestjs\/common/,
			name: 'NestJS Common 模块',
		},
		{
			pattern: /@nestjs\/core/,
			name: 'NestJS Core 模块',
		},
		{
			pattern: /@nestjs\/platform-express/,
			name: 'NestJS Express 适配器',
		},
		{
			pattern: /@nestjs\/swagger/,
			name: 'Swagger 模块',
		},
		{
			pattern: /HealthController/,
			name: 'Health Controller',
		},
		{
			pattern: /bootstrapNestJS/,
			name: 'NestJS 启动函数',
		},
		{
			pattern: /shutdownNestJS/,
			name: 'NestJS 关闭函数',
		},
	]

	checks.forEach(({ pattern, name }) => {
		if (pattern.test(content)) {
			logSuccess(`${name}已打包`)
		} else {
			logError(`${name}未找到`)
			allPassed = false
		}
	})
} else {
	logError('主进程入口文件不存在')
	allPassed = false
}

console.log()

// 3. 检查 package.json
logInfo('检查生产依赖...')

try {
	const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))
	const dependencies = packageJson.dependencies || {}

	const requiredDeps = [
		'@nestjs/common',
		'@nestjs/core',
		'@nestjs/platform-express',
		'@nestjs/swagger',
		'swagger-ui-express',
	]

	requiredDeps.forEach((dep) => {
		if (dependencies[dep]) {
			logSuccess(`${dep} 已在 dependencies 中`)
		} else {
			logError(`${dep} 未在 dependencies 中，可能不会被打包`)
			allPassed = false
		}
	})
} catch (error) {
	logError(`读取 package.json 失败: ${error.message}`)
	allPassed = false
}

console.log()

// 4. 检查资源文件
logInfo('检查资源文件...')

const resourcesDir = 'resources'
if (existsSync(resourcesDir)) {
	const iconPath = join(resourcesDir, 'icon.png')
	if (existsSync(iconPath)) {
		logSuccess('托盘图标文件存在')
	} else {
		logWarning('托盘图标文件不存在')
	}
} else {
	logWarning('resources 目录不存在')
}

console.log()

// 5. 检查 electron-builder 配置
logInfo('检查 electron-builder 配置...')

try {
	const builderConfig = readFileSync('electron-builder.yml', 'utf-8')

	if (builderConfig.includes('asarUnpack') && builderConfig.includes('resources')) {
		logSuccess('resources 目录配置为解包（asarUnpack）')
	} else {
		logWarning('resources 目录未配置为 asarUnpack，托盘图标可能无法访问')
	}
} catch (error) {
	logWarning('无法读取 electron-builder.yml')
}

console.log()

// 6. 总结
console.log('='.repeat(60))
log('验证结果汇总', 'blue')
console.log('='.repeat(60))

if (allPassed) {
	logSuccess('所有检查通过！打包配置正确。')
	console.log()
	logInfo('下一步：运行打包命令')
	console.log('   bun run build:mac      # macOS')
	console.log('   bun run build:win      # Windows')
	console.log('   bun run build:linux    # Linux')
	console.log('   bun run build:unpack   # 仅打包不生成安装包（快速测试）')
	console.log()
} else {
	logError('部分检查失败，请修复问题后再打包。')
	console.log()
}

console.log('='.repeat(60) + '\n')

process.exit(allPassed ? 0 : 1)
