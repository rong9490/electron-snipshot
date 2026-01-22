export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Panel</h1>
          </div>

          <nav className="flex space-x-4">
            <a
              href="/panel"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              首页
            </a>
            <a
              href="/panel/dashboard"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              仪表板
            </a>
            <a
              href="/panel/settings"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              设置
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
