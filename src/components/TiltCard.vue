<template>
  <div 
    ref="cardRef"
    class="relative overflow-hidden rounded-2xl transition-all ease-out"
    :style="cardStyle"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 滑鼠跟隨霓虹光暈 (Glow Effect) -->
    <div 
      class="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
      :style="glowStyle"
    ></div>

    <!-- 卡片主要內容 -->
    <div class="relative z-20">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const cardRef = ref(null)
const rotateX = ref(0)
const rotateY = ref(0)
const glowX = ref(0)
const glowY = ref(0)
const isHovered = ref(false)

const handleMouseMove = (e) => {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  
  // 計算滑鼠在卡片內部的相對座標
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // 計算傾斜角度（最大傾斜 8 度，視覺感最舒服）
  rotateX.value = -((y - centerY) / centerY) * 8
  rotateY.value = ((x - centerX) / centerX) * 8

  // 紀錄光暈位置
  glowX.value = x
  glowY.value = y
  isHovered.value = true
}

const handleMouseLeave = () => {
  // 滑鼠離開時平滑復原
  rotateX.value = 0
  rotateY.value = 0
  isHovered.value = false
}

// 動態計算 3D 視差轉換
const cardStyle = computed(() => ({
  transform: isHovered.value 
    ? `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale3d(1.02, 1.02, 1.02)` 
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  transition: isHovered.value ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
  transformStyle: 'preserve-3d'
}))

// 動態計算徑向漸層光暈
const glowStyle = computed(() => ({
  opacity: isHovered.value ? 1 : 0,
  background: `radial-gradient(350px circle at ${glowX.value}px ${glowY.value}px, rgba(0, 242, 254, 0.15), transparent 80%)`
}))
</script>