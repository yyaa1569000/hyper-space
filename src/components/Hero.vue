<template>
  <section class="min-h-screen flex flex-col justify-center items-center text-center px-4 relative pt-20 overflow-hidden">
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 mb-6 text-xs text-cyan-400 font-mono">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      FRONTEND INTERACTIVE OS · ONLINE
    </div>

    <h1 class="text-5xl md:text-8xl font-black tracking-tight mb-6 bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-500 bg-clip-text text-transparent">
      HYPER-SPACE
    </h1>

    <p class="text-slate-400 text-lg md:text-2xl max-w-2xl font-light mb-10 leading-relaxed">
      打造具有互動沉浸感與流暢視覺體驗的個人控制中心
    </p>

    <div class="flex flex-wrap gap-4 justify-center items-center font-mono text-sm">
      <a 
        href="#projects" 
        class="px-6 py-3 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
      >
        探索專案作品 ↓
      </a>
      <button 
        @click="$emit('open-cmd')"
        class="px-6 py-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors"
      >
        開啟命令列 (Ctrl+K)
      </button>
    </div>
  </section>
</template>

<script setup>
defineEmits(['open-cmd'])
</script>