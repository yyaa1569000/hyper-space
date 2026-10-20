<template>
  <div class="min-h-screen bg-space-dark text-slate-100 font-sans relative">
    <Navbar @open-cmd="openCmd" />
    <Hero @open-cmd="openCmd" />
    <Architecture />
    <Projects />
    
    <!-- 右下角 Arcade 遊戲浮動按鈕 -->
    <button 
      @click="openGame('snake')"
      class="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900/90 border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-mono text-xs shadow-xl shadow-cyan-500/10 backdrop-blur-md hover:scale-105 transition-all active:scale-95 group"
    >
      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
      <Gamepad2 class="w-4 h-4 group-hover:rotate-12 transition-transform" />
      <span>小遊戲</span>
    </button>

    <footer class="py-8 text-center font-mono text-xs text-slate-600 border-t border-slate-900">
      HYPER-SPACE OS © 2026 · Built with Vue 3 & Tailwind CSS
    </footer>

    <!-- Modals -->
    <CommandPalette ref="cmdPaletteRef" @open-game="openGame" @open-status="openStatus" />
    <GameModal ref="gameModalRef" />
    <StatusModal ref="statusModalRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Gamepad2 } from 'lucide-vue-next'
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Architecture from './components/Architecture.vue'
import Projects from './components/Projects.vue'
import CommandPalette from './components/CommandPalette.vue'
import GameModal from './components/GameModal.vue'
import StatusModal from './components/StatusModal.vue'

const cmdPaletteRef = ref(null)
const gameModalRef = ref(null)
const statusModalRef = ref(null)

const openCmd = () => { cmdPaletteRef.value?.open() }
const openStatus = () => { statusModalRef.value?.open() }

const openGame = (gameType = 'snake') => {
  // 確保傳入的參數是字串，避免滑鼠點擊事件物件影響遊戲名稱判斷
  const targetGame = typeof gameType === 'string' ? gameType : 'snake'
  gameModalRef.value?.open(targetGame)
}
</script>