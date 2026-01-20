/**
 * 托盘图标工具
 * 提供托盘图标生成、角标绘制等功能
 */

import { nativeImage, type NativeImage } from 'electron'

/**
 * 图标配置
 */
export interface IconConfig {
	size: number
	badgeSize: number
	badgePosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
	badgeColor: string
	textColor: string
	fontSize: number
}

const DEFAULT_CONFIG: IconConfig = {
	size: 16,
	badgeSize: 10,
	badgePosition: 'top-right',
	badgeColor: '#FF0000',
	textColor: '#FFFFFF',
	fontSize: 12
}

/**
 * 创建带角标的托盘图标
 * @param iconPath 原始图标路径
 * @param count 未读数量
 * @param config 图标配置
 * @returns NativeImage
 */
export function createIconWithBadge(
	iconPath: string,
	count: number,
	config: Partial<IconConfig> = {}
): NativeImage {
	const finalConfig = { ...DEFAULT_CONFIG, ...config }

	// 加载原始图标
	const originalIcon = nativeImage.createFromPath(iconPath).resize({
		width: finalConfig.size,
		height: finalConfig.size
	})

	// 如果没有未读数，直接返回原始图标
	if (count <= 0) {
		return originalIcon
	}

	// 注意：真实的角标绘制需要使用 canvas 库
	// 这里提供两种实现方案：

	/**
	 * 方案1: 使用 canvas 库（推荐）
	 *
	 * 需要安装: bun add canvas
	 *
	 * import { createCanvas } from 'canvas'
	 *
	 * const canvas = createCanvas(finalConfig.size, finalConfig.size)
	 * const ctx = canvas.getContext('2d')
	 *
	 * // 绘制原图
	 * ctx.drawImage(originalIcon.toDataURL(), 0, 0)
	 *
	 * // 计算角标位置
	 * const badgeX = finalConfig.size - finalConfig.badgeSize - 2
	 * const badgeY = 2
	 *
	 * // 绘制圆形背景
	 * ctx.fillStyle = finalConfig.badgeColor
	 * ctx.beginPath()
	 * ctx.arc(badgeX, badgeY, finalConfig.badgeSize, 0, 2 * Math.PI)
	 * ctx.fill()
	 *
	 * // 绘制数字
	 * ctx.fillStyle = finalConfig.textColor
	 * ctx.font = `bold ${finalConfig.fontSize}px Arial`
	 * ctx.textAlign = 'center'
	 * ctx.textBaseline = 'middle'
	 *
	 * const displayCount = count > 99 ? '99+' : count.toString()
	 * ctx.fillText(displayCount, badgeX, badgeY + 1)
	 *
	 * return nativeImage.createFromDataURL(canvas.toDataURL())
	 */

	/**
	 * 方案2: 预生成图标（简单但不够灵活）
	 *
	 * 在 resources 目录下准备多个图标：
	 * - icon.png (无角标)
	 * - icon-1.png (1条未读)
	 * - icon-2.png (2条未读)
	 * - icon-5.png (5条未读)
	 * - icon-10.png (10+条未读)
	 *
	 * 根据未读数选择对应的图标
	 */

	// 简化实现：返回原始图标（实际项目中应该使用上述方案之一）
	return originalIcon
}

/**
 * 创建不同状态的托盘图标
 * @param iconPath 原始图标路径
 * @param status 状态类型
 * @returns NativeImage
 */
export function createIconByStatus(
	iconPath: string,
	status: 'default' | 'active' | 'error' | 'success'
): NativeImage {
	const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })

	// 根据状态调整图标颜色或样式
	// 注意：这需要 canvas 支持，或者使用预生成的图标

	switch (status) {
		case 'active':
			// 可以添加蓝色边框或改变颜色
			break
		case 'error':
			// 可以添加红色边框
			break
		case 'success':
			// 可以添加绿色边框
			break
		default:
			break
	}

	return icon
}

/**
 * 图标缓存类
 */
export class IconCache {
	private cache: Map<string, NativeImage> = new Map()
	private maxSize = 50

	/**
	 * 获取缓存的图标
	 */
	get(key: string): NativeImage | undefined {
		return this.cache.get(key)
	}

	/**
	 * 设置缓存
	 */
	set(key: string, icon: NativeImage): void {
		// 如果缓存已满，删除最旧的条目
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value
			if (firstKey !== undefined) {
				this.cache.delete(firstKey)
			}
		}

		this.cache.set(key, icon)
	}

	/**
	 * 清空缓存
	 */
	clear(): void {
		this.cache.clear()
	}

	/**
	 * 删除指定缓存
	 */
	delete(key: string): boolean {
		return this.cache.delete(key)
	}

	/**
	 * 获取缓存大小
	 */
	size(): number {
		return this.cache.size
	}
}

/**
 * 创建图标缓存键
 */
export function createCacheKey(type: string, value: string | number): string {
	return `${type}-${value}`
}
