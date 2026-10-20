<template>
  <section id="skills" class="py-24 px-6 max-w-6xl mx-auto">
    <div class="mb-12 text-center">
      <h2 class="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-2">// SYSTEM ARCHITECTURE</h2>
      <p class="text-3xl md:text-4xl font-bold text-slate-100">核心技術與架構地圖</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 使用 TiltCard 包裹卡片 -->
      <TiltCard 
        v-for="node in skillNodes" 
        :key="node.id"
      >
        <div class="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl h-full flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-4">
              <span class="text-xs font-mono text-slate-500">{{ node.category }}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                {{ node.status }}
              </span>
            </div>

            <h3 class="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">
              {{ node.title }}
            </h3>
            
            <p class="text-slate-400 text-sm leading-relaxed">
              {{ node.desc }}
            </p>
          </div>
        </div>
      </TiltCard>
    </div>
  </section>
</template>

<script setup>
import { skillNodes } from '../data/skills.js'
import TiltCard from './TiltCard.vue'
</script>