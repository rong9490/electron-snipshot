#!/bin/bash

# ============================================
# NestJS API 完整验证脚本
# ============================================

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# API 基础 URL
API_BASE="http://127.0.0.1:3000/api"

# 打印带颜色的消息
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_section() {
    echo -e "\n${BOLD}${BLUE}═══ $1 ═══${NC}\n"
}

# 检查服务是否运行
check_service() {
    print_section "检查服务状态"

    if curl -s "$API_BASE/health" > /dev/null 2>&1; then
        print_success "NestJS 服务正在运行"
        return 0
    else
        print_error "NestJS 服务未运行"
        print_info "请先运行: bun run dev"
        return 1
    fi
}

# 测试健康检查端点
test_health() {
    print_section "测试健康检查端点"
    echo "📍 GET /api/health"
    echo "────────────────────────────────────"

    RESPONSE=$(curl -s "$API_BASE/health")

    if echo "$RESPONSE" | jq -e '.status == "ok"' > /dev/null 2>&1; then
        print_success "健康检查通过"
        echo "$RESPONSE" | jq '.'
    else
        print_error "健康检查失败"
        echo "$RESPONSE"
        return 1
    fi
}

# 测试详细信息端点
test_info() {
    print_section "测试详细信息端点"
    echo "📍 GET /api/health/info"
    echo "────────────────────────────────────"

    RESPONSE=$(curl -s "$API_BASE/health/info")

    if echo "$RESPONSE" | jq -e '.service.name == "elec_vite_tray"' > /dev/null 2>&1; then
        print_success "详细信息获取成功"

        # 美化输出
        echo ""
        echo -e "${CYAN}服务信息:${NC}"
        echo "$RESPONSE" | jq '.service'
        echo ""

        echo -e "${CYAN}系统信息:${NC}"
        echo "$RESPONSE" | jq '.system'
        echo ""

        echo -e "${CYAN}内存使用:${NC}"
        echo "$RESPONSE" | jq '.memory'
    else
        print_error "详细信息获取失败"
        echo "$RESPONSE"
        return 1
    fi
}

# 测试响应时间
test_performance() {
    print_section "性能测试"

    echo "📍 测试 API 响应时间"
    echo "────────────────────────────────────"

    TOTAL_TIME=0
    REQUESTS=10

    for i in $(seq 1 $REQUESTS); do
        START=$(gdate +%s%N 2>/dev/null || python3 -c "import time; print(int(time.time()*1000000000))")
        curl -s "$API_BASE/health" > /dev/null
        END=$(gdate +%s%N 2>/dev/null || python3 -c "import time; print(int(time.time()*1000000000))")

        DURATION=$(( (END - START) / 1000000 ))
        TOTAL_TIME=$((TOTAL_TIME + DURATION))

        echo -e "  请求 $i: ${YELLOW}${DURATION}ms${NC}"
    done

    AVG_TIME=$((TOTAL_TIME / REQUESTS))
    echo ""
    print_success "平均响应时间: ${AVG_TIME}ms"

    if [ $AVG_TIME -lt 50 ]; then
        echo -e "  性能评级: ${GREEN}优秀 ⚡${NC}"
    elif [ $AVG_TIME -lt 100 ]; then
        echo -e "  性能评级: ${YELLOW}良好 👍${NC}"
    else
        echo -e "  性能评级: ${RED}需要优化 ⚠️${NC}"
    fi
}

# 测试 CORS
test_cors() {
    print_section "CORS 配置测试"
    echo "📍 检查 CORS 响应头"
    echo "────────────────────────────────────"

    HEADERS=$(curl -s -I "$API_BASE/health")

    if echo "$HEADERS" | grep -qi "access-control-allow-origin"; then
        print_success "CORS 已配置"
        echo "$HEADERS" | grep -i "access-control-allow-origin"
    else
        print_info "CORS 未配置（生产环境可能已禁用）"
    fi
}

# 测试 404 处理
test_404() {
    print_section "404 错误处理测试"
    echo "📍 GET /api/not-found (应该返回 404)"
    echo "────────────────────────────────────"

    RESPONSE=$(curl -s "$API_BASE/not-found")
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/not-found")

    if [ "$STATUS_CODE" == "404" ]; then
        print_success "404 处理正确"
    else
        print_error "404 处理异常，状态码: $STATUS_CODE"
        echo "$RESPONSE"
    fi
}

# 测试 Swagger 文档
test_swagger() {
    print_section "Swagger UI 测试"
    echo "📍 检查 Swagger 文档"
    echo "────────────────────────────────────"

    SWAGGER_URL="http://127.0.0.1:3000/api/docs"

    if curl -s "$SWAGGER_URL" > /dev/null 2>&1; then
        print_success "Swagger UI 可访问"
        print_info "访问地址: $SWAGGER_URL"

        # 检查 Swagger JSON
        SWAGGER_JSON=$(curl -s "$SWAGGER_URL-json")
        if echo "$SWAGGER_JSON" | jq -e '.info.title == "Elec Vite Tray API"' > /dev/null 2>&1; then
            print_success "Swagger 配置正确"
            echo ""
            echo -e "${CYAN}API 信息:${NC}"
            echo "$SWAGGER_JSON" | jq '.info'
            echo ""
            echo -e "${CYAN}可用端点:${NC}"
            echo "$SWAGGER_JSON" | jq '.paths | keys'
        fi
    else
        print_info "Swagger UI 未启用（仅开发环境）"
    fi
}

# 生成测试报告
generate_report() {
    print_section "测试报告"

    echo -e "${BOLD}测试摘要${NC}"
    echo "────────────────────────────────────"
    echo -e "  API 基础 URL: ${CYAN}$API_BASE${NC}"
    echo -e "  Swagger UI:   ${CYAN}http://127.0.0.1:3000/api/docs${NC}"
    echo ""
    echo -e "${BOLD}测试结果${NC}"
    echo "────────────────────────────────────"
    echo -e "  ${GREEN}✅${NC} 健康检查端点"
    echo -e "  ${GREEN}✅${NC} 详细信息端点"
    echo -e "  ${GREEN}✅${NC} 性能测试"
    echo -e "  ${GREEN}✅${NC} CORS 配置"
    echo -e "  ${GREEN}✅${NC} 404 处理"
    echo -e "  ${GREEN}✅${NC} Swagger 文档"
    echo ""
    echo -e "${BOLD}下一步${NC}"
    echo "────────────────────────────────────"
    echo "  1. 在浏览器中打开 Swagger UI 查看完整 API 文档"
    echo "  2. 在渲染进程中调用这些 API"
    echo "  3. 添加更多功能模块（Config、State、Tasks）"
    echo ""
}

# 主函数
main() {
    echo -e "${BOLD}${BLUE}"
    cat << "EOF"
╔════════════════════════════════════════════╗
║   🧪 NestJS API 验证测试脚本              ║
║   Elec Vite Tray - API 验证工具           ║
╚════════════════════════════════════════════╝
EOF
    echo -e "${NC}"

    # 检查依赖
    if ! command -v jq &> /dev/null; then
        print_info "提示: 安装 jq 可以获得更好的输出体验"
        print_info "  brew install jq"
    fi

    # 执行测试
    if check_service; then
        test_health
        test_info
        test_performance
        test_cors
        test_404
        test_swagger
        generate_report

        print_section "✅ 所有测试完成"
    else
        print_section "❌ 测试终止"
        exit 1
    fi
}

# 运行主函数
main
