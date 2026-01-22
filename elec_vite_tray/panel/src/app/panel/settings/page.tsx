'use client'

import { useState } from 'react'

export default function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('zh-CN')

  const handleSave = () => {
    alert('设置已保存！')
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">设置</h1>
        <p className="text-gray-600">
          管理应用偏好设置和配置
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧设置菜单 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-1">
              <a
                href="#general"
                className="block px-4 py-2 text-blue-600 bg-blue-50 rounded-lg"
              >
                通用设置
              </a>
              <a
                href="#notifications"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                通知设置
              </a>
              <a
                href="#appearance"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                外观设置
              </a>
              <a
                href="#advanced"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                高级设置
              </a>
            </nav>
          </div>
        </div>

        {/* 右侧设置内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 通用设置 */}
          <div id="general" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              通用设置
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  语言
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  时区
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Asia/Shanghai">亚洲/上海 (GMT+8)</option>
                  <option value="America/New_York">美洲/纽约 (GMT-5)</option>
                  <option value="Europe/London">欧洲/伦敦 (GMT+0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 通知设置 */}
          <div id="notifications" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              通知设置
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    启用通知
                  </p>
                  <p className="text-sm text-gray-500">
                    接收系统通知和更新提醒
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    邮件通知
                  </p>
                  <p className="text-sm text-gray-500">
                    通过邮件接收重要通知
                  </p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-blue-500`}
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
            </div>
          </div>

          {/* 外观设置 */}
          <div id="appearance" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              外观设置
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    深色模式
                  </p>
                  <p className="text-sm text-gray-500">
                    切换到深色主题
                  </p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主题颜色
                </label>
                <div className="flex space-x-3">
                  <button className="w-8 h-8 bg-blue-500 rounded-full ring-2 ring-offset-2 ring-blue-500" />
                  <button className="w-8 h-8 bg-green-500 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-green-500" />
                  <button className="w-8 h-8 bg-purple-500 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-purple-500" />
                  <button className="w-8 h-8 bg-orange-500 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
