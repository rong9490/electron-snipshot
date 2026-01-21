#!/bin/bash

# NestJS API 测试脚本

echo "🧪 测试 NestJS API 端点"
echo "================================"

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 3

# 测试健康检查端点
echo ""
echo "1️⃣ 测试健康检查端点: GET /api/health"
curl -s http://localhost:3000/api/health | python3 -m json.tool || echo "❌ 请求失败"

echo ""
echo "2️⃣ 测试详细信息端点: GET /api/health/info"
curl -s http://localhost:3000/api/health/info | python3 -m json.tool || echo "❌ 请求失败"

echo ""
echo "✅ 测试完成！"
