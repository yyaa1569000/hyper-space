<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4"
        @click.self="close"
      >
        <div class="w-full max-w-xl bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden font-mono">
          
          <div class="flex items-center px-4 border-b border-slate-800 bg-slate-900/90">
            <Search class="w-5 h-5 text-cyan-400 mr-3" />
            <input 
              ref="searchInput"
              v-model="query"
              type="text" 
              placeholder="輸入指令或搜尋 (例如: projects, skills, status)..." 
              class="w-full py-4 bg-transparent text-slate-100 focus:outline-none placeholder-slate-500 text-sm"
              @keydown.esc="close"
            />
            <span class="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">ESC</span>
          </div>

          <div class="max-h-80 overflow-y-auto p-2">
            <div 
              v-for="item in filteredCommands" 
              :key="item.id"
              @click="execute(item)"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/80 cursor-pointer text-sm text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <div class="flex items-center gap-3">
                <component :is="item.icon" class="w-4 h-4 text-cyan-400" />
                <span>{{ item.label }}</span>
              </div>
              <span class="text-xs text-slate-500 font-sans">{{ item.category }}</span>
            </div>

            <div v-if="filteredCommands.length === 0" class="p-6 text-center text-slate-500 text-sm">
              沒有找到符合的指令 💡
            </div>
          </div>

          <div class="px-4 py-2 bg-slate-950/60 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
            <span>HYPER-SPACE Command Terminal</span>
            <span>按 Enter 執行</span>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Search, Cpu, FolderGit2, Terminal, Sparkles, Gamepad2 } from 'lucide-vue-next'
import confetti from 'canvas-confetti'

const emit = defineEmits(['open-game', 'open-status'])

const isOpen = ref(false)
const query = ref('')
const searchInput = ref(null)

const commands = [
  { id: 'snake', label: '🐍 玩一局貪吃蛇', category: '小遊戲', icon: Gamepad2, action: () => emit('open-game', 'snake') },
  { id: 'breakout', label: '🧱 玩一局霓虹幾何打磚塊', category: '小遊戲', icon: Gamepad2, action: () => emit('open-game', 'breakout') },
  { id: 'shooter', label: '🚀 玩一局復古太空射擊', category: '小遊戲', icon: Gamepad2, action: () => emit('open-game', 'shooter') },
  { id: 'skills', label: '瀏覽技能與架構圖', category: '頁面導覽', icon: Cpu, action: () => scrollTo('skills') },
  { id: 'projects', label: '查看專案作品集 (TeamLog)', category: '頁面導覽', icon: FolderGit2, action: () => scrollTo('projects') },
  { id: 'confetti', label: '觸發慶祝彩蛋 Party!', category: '趣味彩蛋', icon: Sparkles, action: () => triggerConfetti() },
  { id: 'status', label: '查看系統版本與運作狀態', category: '系統資訊', icon: Terminal, action: () => emit('open-status') },
]

const filteredCommands = computed(() => {
  if (!query.value) return commands
  const q = query.value.toLowerCase()
  return commands.filter(c => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
})

const close = () => { isOpen.value = false; query.value = '' }
const open = () => { 
  isOpen.value = true
  nextTick(() => searchInput.value?.focus())
}

const execute = (cmd) => {
  cmd.action()
  close()
}

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const triggerConfetti = () => {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
}

const handleKeyDown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isOpen.value ? close() : open()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))

defineExpose({ open })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>