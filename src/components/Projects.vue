<template>
  <section id="projects" class="py-24 px-6 max-w-6xl mx-auto border-t border-slate-800/60">
    <div class="mb-12 text-center">
      <h2 class="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-2">// FEATURED PROJECTS</h2>
      <p class="text-3xl md:text-4xl font-bold text-slate-100">精選專案展示</p>
    </div>

    <div class="grid grid-cols-1 gap-8">
      <!-- 使用 TiltCard 包裹作品卡片 -->
      <TiltCard 
        v-for="project in projectsData" 
        :key="project.id"
      >
        <div class="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl">
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="tag in project.tags" 
              :key="tag"
              class="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50"
            >
              {{ tag }}
            </span>
          </div>

          <h3 class="text-2xl md:text-3xl font-bold text-slate-100 mb-2">
            {{ project.title }}
          </h3>
          <p class="text-sm font-mono text-cyan-400 mb-4">{{ project.subtitle }}</p>

          <p class="text-slate-300 text-base mb-6 leading-relaxed">
            {{ project.description }}
          </p>

          <ul class="space-y-2 mb-8">
            <li 
              v-for="(point, idx) in project.highlights" 
              :key="idx"
              class="text-sm text-slate-400 flex items-start gap-2"
            >
              <span class="text-cyan-400 font-mono">▸</span>
              <span>{{ point }}</span>
            </li>
          </ul>

          <div class="flex gap-4 font-mono text-xs">
            <a 
              :href="project.demo" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="px-4 py-2 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 transition-colors"
            >
              Live Preview
            </a>
          </div>
        </div>
      </TiltCard>
    </div>
  </section>
</template>

<script setup>
import { projectsData } from '../data/projects.js'
import TiltCard from './TiltCard.vue'
</script>