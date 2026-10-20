<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-mono"
        @click.self="close"
      >
        <div class="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden relative">
          
          <!-- 標頭 -->
          <div class="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="font-bold text-xs text-cyan-400 tracking-wider">// SYSTEM DIAGNOSTICS</span>
            </div>
            <button @click="close" class="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors">
              ESC
            </button>
          </div>

          <!-- 內容數據區塊 -->
          <div class="p-6 space-y-4">
            <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div class="text-xs text-slate-500 mb-1">SYSTEM STATUS</div>
              <div class="text-base font-bold text-emerald-400 flex items-center gap-2">
                <span>● ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                <span class="text-slate-500 block mb-1">VERSION</span>
                <span class="text-slate-200 font-bold">HYPER-SPACE v1.0</span>
              </div>
              <div class="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                <span class="text-slate-500 block mb-1">CORE ENGINE</span>
                <span class="text-cyan-400 font-bold">Vue 3 + Vite</span>
              </div>
              <div class="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                <span class="text-slate-500 block mb-1">RESPONSE TIME</span>
                <span class="text-purple-400 font-bold">&lt; 1ms</span>
              </div>
              <div class="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                <span class="text-slate-500 block mb-1">SECURITY</span>
                <span class="text-emerald-400 font-bold">ENCRYPTED</span>
              </div>
            </div>

            <p class="text-slate-400 text-xs leading-relaxed pt-2 border-t border-slate-800/80">
              HYPER-SPACE 控制中心運作正常，所有視覺特效、互動組件與動畫模組皆處於最佳效能狀態。
            </p>
          </div>

          <!-- 按鈕區 -->
          <div class="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-end">
            <button 
              @click="close"
              class="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 text-xs transition-colors shadow-lg shadow-cyan-500/20"
            >
              確認關閉
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)

const open = () => { isOpen.value = true }
const close = () => { isOpen.value = false }

const handleKeyDown = (e) => {
  if (isOpen.value && e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))

defineExpose({ open })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>