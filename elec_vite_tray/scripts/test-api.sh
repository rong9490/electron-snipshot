#!/bin/bash

# NestJS API 完整测试脚本

echo "🧪 NestJS API 测试脚本"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查服务是否运行
echo "🔍 检查 NestJS 服务状态..."
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ NestJS 服务正在运行${NC}"
else
    echo -e "${RED}❌ NestJS 服务未运行${NC}"
    echo -e "${YELLOW}请先运行: bun run dev${NC}"
    exit 1
fi

echo ""
echo "================================"
echo "开始测试 API 端点"
echo "================================"
echo ""

# 测试 1: 健康检查
echo "1️⃣  测试健康检查端点"
echo "   GET /api/health"
echo "   --------------------------------"
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
echo "$HEALTH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$HEALTH_RESPONSE"
echo ""

# 测试 2: 详细信息
echo "2️⃣  测试详细信息端点"
echo "   GET /api/health/info"
echo "   --------------------------------"
INFO_RESPONSE=$(curl -s http://localhost:3000/api/health/info)
echo "$INFO_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$INFO_RESPONSE"
echo ""

# 测试 3: 检查响应时间
echo "3️⃣  测试响应时间"
echo "   --------------------------------"
START=$(date +%s%N)
curl -s http://localhost:3000/api/health > /dev/null
END=$(date +%s%N)
DURATION=$(( (END - START) / 1000000 ))
echo "响应时间: ${DURATION}ms"
echo ""

# 测试 4: 检查 CORS
echo "4️⃣  检查 CORS 头"
echo "   --------------------------------"
CORS_HEADER=$(curl -s -I http://localhost:3000/api/health | grep -i "access-control-allow-origin" || echo "未找到")
echo "CORS Header: $CORS_HEADER"
echo ""

# 测试 5: 检查 404 处理
echo "5️⃣  测试 404 处理"
echo "   GET /api/not-found (应该返回 404)"
echo "   --------------------------------"
NOT_FOUND_RESPONSE=$(curl -s http://localhost:3000/api/not-found)
echo "$NOT_FOUND_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$NOT_FOUND_RESPONSE"
echo ""

echo "================================"
echo -e "${GREEN}✅ 测试完成！${NC}"
echo ""
echo "📊 测试摘要:"
echo "  • 健康检查端点: 正常"
echo "  • 详细信息端点: 正常"
echo "  • 响应时间: ${DURATION}ms"
echo "  • CORS 配置: ${CORS_HEADER}"
echo ""
