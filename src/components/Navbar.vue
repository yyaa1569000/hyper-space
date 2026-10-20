<template>
  <nav class="fixed top-0 left-0 w-full z-40 bg-space-dark/80 backdrop-blur-md border-b border-slate-800/60 px-6 py-4 flex justify-between items-center font-mono">
    <div class="flex items-center gap-2 cursor-pointer" @click="scrollToTop">
      <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
      <span class="font-bold text-lg tracking-wider text-slate-100">HYPER-SPACE</span>
    </div>

    <div class="flex items-center gap-6 text-sm">
      <a href="#skills" class="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">核心技能</a>
      <a href="#projects" class="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">專案作品</a>
      
      <button 
        @click="$emit('open-cmd')"
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-300 transition-colors"
      >
        <span>搜尋</span>
        <kbd class="px-1.5 py-0.5 bg-slate-900 rounded text-[10px] text-slate-400">⌘K</kbd>
      </button>
    </div>
  </nav>
</template>

<script setup>
defineEmits(['open-cmd'])

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>