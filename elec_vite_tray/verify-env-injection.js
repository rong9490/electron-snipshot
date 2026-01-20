/**
 * 环境变量注入验证脚本
 *
 * 使用方法：
 * 1. 在 Electron 应用中打开开发者工具（F12）
 * 2. 将此脚本内容复制到控制台执行
 * 3. 查看验证结果
 */

console.log('========================================')
console.log('🚀 环境变量注入验证')
console.log('========================================\n')

// 1. 检查 window.ENV 是否存在
if (typeof window.ENV === 'undefined') {
  console.error('❌ window.ENV 未定义！')
  console.error('可能的原因：')
  console.error('  1. preload 脚本未正确加载')
  console.error('  2. contextBridge 未正确配置')
  console.error('  3. 应用未重新编译')
} else {
  console.log('✅ window.ENV 已成功注入！\n')

  // 2. 显示所有环境变量
  console.log('📋 环境变量列表：')
  console.table(window.ENV)

  // 3. 详细显示每个变量
  console.log('\n📝 详细信息：')
  console.log('----------------------------------------')

  const envVars = [
    { key: 'NODE_ENV', value: window.ENV.NODE_ENV, description: '运行环境' },
    { key: 'ELECTRON_RENDERER_URL', value: window.ENV.ELECTRON_RENDERER_URL, description: '渲染进程 URL' },
    { key: 'isDev', value: window.ENV.isDev, description: '是否开发环境' },
    { key: 'isProd', value: window.ENV.isProd, description: '是否生产环境' },
    { key: 'platform', value: window.ENV.platform, description: '操作系统平台' },
    { key: 'appVersion', value: window.ENV.appVersion, description: '应用版本' }
  ]

  envVars.forEach(({ key, value, description }) => {
    const displayValue = value === '' || value === undefined || value === null
      ? '(未设置)'
      : value
    console.log(`${description.padEnd(12)}: ${key} = ${displayValue}`)
  })

  // 4. 功能测试
  console.log('\n🧪 功能测试：')
  console.log('----------------------------------------')

  // 测试条件判断
  if (window.ENV.isDev) {
    console.log('✅ 当前运行在开发环境')
  } else {
    console.log('✅ 当前运行在生产环境')
  }

  // 平台检测
  const platformNames = {
    'win32': 'Windows',
    'darwin': 'macOS',
    'linux': 'Linux'
  }
  console.log(`✅ 检测到操作系统: ${platformNames[window.ENV.platform] || window.ENV.platform}`)

  // 5. 实际应用示例
  console.log('\n💡 实际应用示例：')
  console.log('----------------------------------------')

  console.log('\n// 根据环境配置 API 端点')
  const apiBaseUrl = window.ENV.isDev
    ? 'http://localhost:3000/api'
    : 'https://api.example.com/api'
  console.log(`const apiBaseUrl = "${apiBaseUrl}"`)

  console.log('\n// 平台特定样式')
  const platformClass = `platform-${window.ENV.platform}`
  console.log(`document.body.classList.add('${platformClass}')`)

  console.log('\n// 版本信息显示')
  console.log(`appVersion: "${window.ENV.appVersion}"`)

  // 6. 类型检查
  console.log('\n🔍 类型验证：')
  console.log('----------------------------------------')

  const types = {
    NODE_ENV: typeof window.ENV.NODE_ENV,
    ELECTRON_RENDERER_URL: typeof window.ENV.ELECTRON_RENDERER_URL,
    isDev: typeof window.ENV.isDev,
    isProd: typeof window.ENV.isProd,
    platform: typeof window.ENV.platform,
    appVersion: typeof window.ENV.appVersion
  }

  const expectedTypes = {
    NODE_ENV: 'string',
    ELECTRON_RENDERER_URL: 'string',
    isDev: 'boolean',
    isProd: 'boolean',
    platform: 'string',
    appVersion: 'string'
  }

  let allTypesCorrect = true
  Object.entries(types).forEach(([key, type]) => {
    const expected = expectedTypes[key as keyof typeof expectedTypes]
    const correct = type === expected
    if (!correct) allTypesCorrect = false
    console.log(`${key.padEnd(25)}: ${type.padEnd(10)} ${correct ? '✅' : '❌ (期望: ' + expected + ')'}`)
  })

  // 7. 总结
  console.log('\n========================================')
  if (allTypesCorrect) {
    console.log('✅ 所有类型验证通过！')
    console.log('✅ 环境变量注入工作正常！')
  } else {
    console.log('⚠️  部分类型验证失败')
    console.log('请检查 preload 脚本的实现')
  }
  console.log('========================================\n')

  // 8. 提供快速访问
  console.log('💾 快速访问提示：')
  console.log('  - window.ENV.NODE_ENV       : 环境模式')
  console.log('  - window.ENV.isDev          : 是否开发环境')
  console.log('  - window.ENV.platform       : 操作系统')
  console.log('  - window.ENV.appVersion     : 应用版本')
  console.log()
}

// 9. 提供全局辅助函数（可选）
window.checkEnv = function() {
  console.log('🌍 环境检查：')
  console.log(`  当前环境: ${window.ENV?.NODE_ENV || '未知'}`)
  console.log(`  平台: ${window.ENV?.platform || '未知'}`)
  console.log(`  版本: ${window.ENV?.appVersion || '未知'}`)
  return window.ENV
}

console.log('💡 提示：输入 checkEnv() 可以快速查看环境信息\n')
