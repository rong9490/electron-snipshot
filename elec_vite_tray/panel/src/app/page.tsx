import Dashboard from './components/Dashboard'

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          欢迎使用 Panel
        </h1>
        <p className="text-gray-600">
          这是 Elec Vite Tray 应用的管理面板，基于 Next.js 构建
        </p>
      </div>

      <Dashboard />
    </div>
  )
}
