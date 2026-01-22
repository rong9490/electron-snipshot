import Card from './Card'

export default function Dashboard() {
  const stats = [
    { title: '总任务数', value: '1,234', change: '+12%' },
    { title: '完成率', value: '89%', change: '+5%' },
    { title: '活跃用户', value: '456', change: '+8%' },
    { title: '系统状态', value: '正常', change: '稳定' }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">仪表板</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          最近活动
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-700">任务 #1234 已完成</span>
            <span className="text-sm text-gray-500">2 分钟前</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-700">新用户注册</span>
            <span className="text-sm text-gray-500">15 分钟前</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">系统配置更新</span>
            <span className="text-sm text-gray-500">1 小时前</span>
          </div>
        </div>
      </div>
    </div>
  )
}
