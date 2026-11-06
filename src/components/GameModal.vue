<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none"
        @click.self="close"
      >
        <!-- Modal 主體視窗容器 -->
        <div class="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden relative">
          
          <!-- 頂部遊戲切換 Tab -->
          <div class="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
            <div class="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button 
                @click="switchGame('snake')"
                :class="activeGame === 'snake' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'"
                class="px-2.5 py-1 rounded transition-colors"
              >
                🐍 貪吃蛇
              </button>
              <button 
                @click="switchGame('breakout')"
                :class="activeGame === 'breakout' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'"
                class="px-2.5 py-1 rounded transition-colors"
              >
                🧱 打磚塊
              </button>
              <button 
                @click="switchGame('shooter')"
                :class="activeGame === 'shooter' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'"
                class="px-2.5 py-1 rounded transition-colors"
              >
                🚀 太空射擊
              </button>
            </div>

            <button @click="close" class="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800">
              ESC
            </button>
          </div>

          <!-- 分數顯示儀表板 (打磚塊會額外顯示關卡數) -->
          <div class="px-6 py-2 bg-slate-950/40 flex justify-between items-center border-b border-slate-800/60 text-xs">
            <div class="text-slate-400 flex items-center gap-3">
              <span>SCORE: <span class="text-cyan-400 font-bold text-base ml-1">{{ score }}</span></span>
              <span v-if="activeGame === 'breakout'" class="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                LV.{{ breakoutLevel }}
              </span>
            </div>
            <div class="text-slate-400">
              HIGH SCORE: <span class="text-purple-400 font-bold text-base ml-1">{{ currentHighScore }}</span>
            </div>
          </div>

          <!-- 遊戲 Canvas 畫布與訊息提示 -->
          <div class="p-4 flex justify-center bg-slate-950/90 relative overflow-hidden">
            <canvas ref="canvasRef" width="300" height="300" class="border border-slate-800 rounded-lg bg-slate-950"></canvas>

            <!-- 💥 打磚塊過關提示橫幅 (Banner) -->
            <Transition name="fade">
              <div 
                v-if="showLevelNotice" 
                class="absolute top-8 left-1/2 -translate-x-1/2 z-30 bg-cyan-500/90 text-slate-950 font-bold text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-cyan-300 animate-bounce text-center whitespace-nowrap"
              >
                {{ levelNoticeText }}
              </div>
            </Transition>

            <!-- 遮罩：未開始 / Game Over / 勝利通關 -->
            <div 
              v-if="!isPlaying" 
              class="absolute inset-0 m-4 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg text-center p-6 z-20"
            >
              <p v-if="isVictory" class="text-emerald-400 font-bold text-xl mb-2">🎉 恭喜通關！</p>
              <p v-else-if="isGameOver" class="text-red-400 font-bold text-xl mb-2">GAME OVER</p>
              <p v-else class="text-cyan-400 font-bold text-xl mb-2">{{ gameTitle }}</p>

              <p class="text-slate-400 text-xs mb-6 max-w-xs leading-relaxed">
                {{ isVictory ? victoryMessage : gameInstructions }}
              </p>

              <button 
                @click="startGame"
                class="px-6 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 text-sm"
              >
                {{ (isGameOver || isVictory) ? '重新開始' : '開始遊戲' }}
              </button>
            </div>
          </div>

          <!-- 方向控制器 / 操作提示 -->
          <div class="p-3 bg-slate-950/60 border-t border-slate-800 flex justify-center text-center">
            <div v-if="activeGame === 'snake'" class="grid grid-cols-3 gap-1.5 w-32">
              <div></div>
              <button @click="handleSnakeDir('UP')" class="p-1.5 bg-slate-800 rounded text-xs text-slate-300">▲</button>
              <div></div>
              <button @click="handleSnakeDir('LEFT')" class="p-1.5 bg-slate-800 rounded text-xs text-slate-300">◄</button>
              <button @click="handleSnakeDir('DOWN')" class="p-1.5 bg-slate-800 rounded text-xs text-slate-300">▼</button>
              <button @click="handleSnakeDir('RIGHT')" class="p-1.5 bg-slate-800 rounded text-xs text-slate-300">►</button>
            </div>

            <div v-else-if="activeGame === 'breakout'" class="flex gap-3 items-center">
              <button 
                @mousedown="startBtn('left')" @mouseup="stopBtn('left')" @mouseleave="stopBtn('left')"
                @touchstart.prevent="startBtn('left')" @touchend.prevent="stopBtn('left')"
                class="px-4 py-2 bg-slate-800 active:bg-cyan-500 active:text-black rounded text-xs text-slate-200 transition-colors"
              >
                ◄ 長按向左
              </button>
              <span class="text-[10px] text-slate-500">鍵盤 ◄ / ► 或 A / D</span>
              <button 
                @mousedown="startBtn('right')" @mouseup="stopBtn('right')" @mouseleave="stopBtn('right')"
                @touchstart.prevent="startBtn('right')" @touchend.prevent="stopBtn('right')"
                class="px-4 py-2 bg-slate-800 active:bg-cyan-500 active:text-black rounded text-xs text-slate-200 transition-colors"
              >
                長按向右 ►
              </button>
            </div>

            <div v-else-if="activeGame === 'shooter'" class="flex gap-2 items-center">
              <button 
                @mousedown="startBtn('left')" @mouseup="stopBtn('left')" @mouseleave="stopBtn('left')"
                @touchstart.prevent="startBtn('left')" @touchend.prevent="stopBtn('left')"
                class="px-3 py-2 bg-slate-800 active:bg-cyan-500 active:text-black rounded text-xs text-slate-200 transition-colors"
              >
                ◄ 向左
              </button>
              <button 
                @mousedown="startBtn('fire')" @mouseup="stopBtn('fire')" @mouseleave="stopBtn('fire')"
                @touchstart.prevent="startBtn('fire')" @touchend.prevent="stopBtn('fire')"
                class="px-4 py-2 bg-cyan-500 active:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition-colors"
              >
                🔥 按住連射
              </button>
              <button 
                @mousedown="startBtn('right')" @mouseup="stopBtn('right')" @mouseleave="stopBtn('right')"
                @touchstart.prevent="startBtn('right')" @touchend.prevent="stopBtn('right')"
                class="px-3 py-2 bg-slate-800 active:bg-cyan-500 active:text-black rounded text-xs text-slate-200 transition-colors"
              >
                向右 ►
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import confetti from 'canvas-confetti'

const isOpen = ref(false)
const isPlaying = ref(false)
const isGameOver = ref(false)
const isVictory = ref(false)
const victoryMessage = ref('')
const activeGame = ref('snake')
const score = ref(0)

// 打磚塊關卡與提示
const breakoutLevel = ref(1)
const showLevelNotice = ref(false)
const levelNoticeText = ref('')
let levelNoticeTimer = null

// 鍵盤與 UI 按鈕長按狀態追蹤
const keysHeld = {}
const btnState = ref({ left: false, right: false, fire: false })

const startBtn = (action) => { btnState.value[action] = true }
const stopBtn = (action) => { btnState.value[action] = false }
const clearInputState = () => {
  Object.keys(keysHeld).forEach(key => keysHeld[key] = false)
  btnState.value = { left: false, right: false, fire: false }
}

const highScores = ref({
  snake: parseInt(localStorage.getItem('hs_snake') || '0'),
  breakout: parseInt(localStorage.getItem('hs_breakout') || '0'),
  shooter: parseInt(localStorage.getItem('hs_shooter') || '0')
})

const currentHighScore = computed(() => highScores.value[activeGame.value] || 0)

const canvasRef = ref(null)
let ctx = null
let animationFrameId = null

const gameTitle = computed(() => {
  if (activeGame.value === 'snake') return '貪吃蛇'
  if (activeGame.value === 'breakout') return 'NEON BREAKOUT'
  return 'RETRO SPACE SHOOTER'
})

const gameInstructions = computed(() => {
  if (activeGame.value === 'snake') return '使用方向鍵 / WASD 控制貪吃蛇吃掉能量核心。填滿地圖即算過關！'
  if (activeGame.value === 'breakout') return '長按方向鍵流暢移動擋板，打完所有磚塊即可晉級下一關！'
  return '長按方向鍵滑順平移，按住空白鍵或發射鈕可持續自動連射。'
})

const open = (gameType = 'snake') => {
  activeGame.value = gameType
  isOpen.value = true
  isGameOver.value = false
  isVictory.value = false
  isPlaying.value = false
  showLevelNotice.value = false
  clearInputState()
  nextTick(() => {
    if (canvasRef.value) {
      ctx = canvasRef.value.getContext('2d')
      drawStaticBackground()
    }
  })
}

const close = () => {
  isOpen.value = false
  showLevelNotice.value = false
  stopGameLoop()
  clearInputState()
}

const switchGame = (gameType) => {
  stopGameLoop()
  clearInputState()
  activeGame.value = gameType
  score.value = 0
  breakoutLevel.value = 1
  isGameOver.value = false
  isVictory.value = false
  isPlaying.value = false
  showLevelNotice.value = false
  nextTick(() => drawStaticBackground())
}

let lastTime = 0
const gameLoop = (timestamp) => {
  if (!isPlaying.value) return

  const deltaTime = timestamp - lastTime
  lastTime = timestamp

  ctx.clearRect(0, 0, 300, 300)
  drawStaticBackground()

  if (activeGame.value === 'snake') updateSnake(deltaTime)
  else if (activeGame.value === 'breakout') updateBreakout()
  else if (activeGame.value === 'shooter') updateShooter()

  if (isPlaying.value) {
    animationFrameId = requestAnimationFrame(gameLoop)
  }
}

const startGame = () => {
  score.value = 0
  breakoutLevel.value = 1
  isGameOver.value = false
  isVictory.value = false
  isPlaying.value = true
  showLevelNotice.value = false
  clearInputState()

  if (activeGame.value === 'snake') initSnake()
  else if (activeGame.value === 'breakout') initBreakout()
  else if (activeGame.value === 'shooter') initShooter()

  lastTime = performance.now()
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  animationFrameId = requestAnimationFrame(gameLoop)
}

const stopGameLoop = () => {
  isPlaying.value = false
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
}

const updateHighScore = () => {
  if (score.value > highScores.value[activeGame.value]) {
    highScores.value[activeGame.value] = score.value
    localStorage.setItem(`hs_${activeGame.value}`, score.value.toString())
  }
}

const triggerGameOver = () => {
  stopGameLoop()
  isGameOver.value = true
  clearInputState()
  updateHighScore()
}

const triggerVictory = (msg) => {
  stopGameLoop()
  isVictory.value = true
  victoryMessage.value = msg
  clearInputState()
  updateHighScore()
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } })
}

const drawStaticBackground = () => {
  if (!ctx) return
  ctx.fillStyle = '#020617'
  ctx.fillRect(0, 0, 300, 300)
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1
  for (let i = 0; i <= 300; i += 20) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 300); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(300, i); ctx.stroke()
  }
}

// 繪製圓角矩形工具函式
const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.fill()
}

// -----------------------------------------------------------------
// 1. 貪吃蛇 (120ms/格 步頻 + 沒路走自動過關)
// -----------------------------------------------------------------
let snake = []
let prevSnake = []
let dirQueue = []
let snakeDir = 'RIGHT'
let food = { x: 0, y: 0 }
let snakeTimer = 0
const SNAKE_STEP_SPEED = 120 // 🎯 貪吃蛇前進速度：改為 120ms / 格

const initSnake = () => {
  snake = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }]
  prevSnake = JSON.parse(JSON.stringify(snake))
  snakeDir = 'RIGHT'
  dirQueue = []
  snakeTimer = 0
  generateSnakeFood()
}

const generateSnakeFood = () => {
  // 檢查是否所有格子 (15x15 = 225) 都被填滿了 (沒路走 = 通關)
  if (snake.length >= 225) {
    triggerVictory('你太強了！貪吃蛇已填滿整個地圖大滿貫通關！')
    return
  }

  const emptyCells = []
  for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 15; y++) {
      if (!snake.some(s => s.x === x && s.y === y)) {
        emptyCells.push({ x, y })
      }
    }
  }

  // 沒空位產生食物 -> 判定為完美通關！
  if (emptyCells.length === 0) {
    triggerVictory('完美通關！貪吃蛇已無路可走（地圖全滿）！')
    return
  }

  food = emptyCells[Math.floor(Math.random() * emptyCells.length)]
}

const handleSnakeDir = (dir) => {
  const lastDir = dirQueue.length > 0 ? dirQueue[dirQueue.length - 1] : snakeDir
  if (dir === 'UP' && lastDir !== 'DOWN' && lastDir !== 'UP') dirQueue.push('UP')
  if (dir === 'DOWN' && lastDir !== 'UP' && lastDir !== 'DOWN') dirQueue.push('DOWN')
  if (dir === 'LEFT' && lastDir !== 'RIGHT' && lastDir !== 'LEFT') dirQueue.push('LEFT')
  if (dir === 'RIGHT' && lastDir !== 'LEFT' && lastDir !== 'RIGHT') dirQueue.push('RIGHT')
  if (dirQueue.length > 2) dirQueue.shift()
}

const updateSnake = (deltaTime) => {
  snakeTimer += deltaTime || 0

  if (snakeTimer >= SNAKE_STEP_SPEED) {
    snakeTimer -= SNAKE_STEP_SPEED
    
    if (dirQueue.length > 0) {
      snakeDir = dirQueue.shift()
    }

    prevSnake = JSON.parse(JSON.stringify(snake))

    const head = { ...snake[0] }
    if (snakeDir === 'UP') head.y -= 1
    if (snakeDir === 'DOWN') head.y += 1
    if (snakeDir === 'LEFT') head.x -= 1
    if (snakeDir === 'RIGHT') head.x += 1

    if (head.x < 0 || head.x >= 15 || head.y < 0 || head.y >= 15 || snake.some(s => s.x === head.x && s.y === head.y)) {
      triggerGameOver()
      return
    }

    snake.unshift(head)
    if (head.x === food.x && head.y === food.y) {
      score.value += 10
      generateSnakeFood()
      prevSnake.push({ ...prevSnake[prevSnake.length - 1] })
    } else {
      snake.pop()
    }
  }

  const progress = Math.min(1, snakeTimer / SNAKE_STEP_SPEED)

  const pulse = Math.sin(performance.now() / 150) * 1.5
  ctx.fillStyle = '#00f2fe'; ctx.shadowColor = '#00f2fe'; ctx.shadowBlur = 10
  ctx.beginPath()
  ctx.arc(food.x * 20 + 10, food.y * 20 + 10, 7 + pulse, 0, Math.PI * 2)
  ctx.fill()

  snake.forEach((s, idx) => {
    const p = prevSnake[idx] || s
    const interpX = p.x + (s.x - p.x) * progress
    const interpY = p.y + (s.y - p.y) * progress

    const size = idx === 0 ? 18 : 16
    const offset = (20 - size) / 2
    const posX = interpX * 20 + offset
    const posY = interpY * 20 + offset

    ctx.fillStyle = idx === 0 ? '#38bdf8' : '#a855f7'
    ctx.shadowColor = idx === 0 ? '#38bdf8' : '#a855f7'
    ctx.shadowBlur = idx === 0 ? 10 : 4

    drawRoundedRect(ctx, posX, posY, size, size, 5)
  })
  ctx.shadowBlur = 0
}

// -----------------------------------------------------------------
// 2. 打磚塊 (打完磚塊自動進入下一關 + 球速提升 20%)
// -----------------------------------------------------------------
let paddle = { x: 120, w: 60, h: 8 }
let ball = { x: 150, y: 220, dx: 2.5, dy: -2.5, r: 4 }
let bricks = []
let particles = []
const PADDLE_SPEED = 5.5

const initBreakout = () => {
  breakoutLevel.value = 1
  paddle = { x: 120, w: 60, h: 8 }
  setupBreakoutLevel()
}

// 依關卡數設定磚塊與球速
const setupBreakoutLevel = () => {
  const speedMultiplier = 1 + (breakoutLevel.value - 1) * 0.2 // 每關球速 +20%
  const baseSpeed = 2.5 * speedMultiplier

  ball = { 
    x: paddle.x + paddle.w / 2, 
    y: 220, 
    dx: (Math.random() > 0.5 ? 1 : -1) * baseSpeed, 
    dy: -baseSpeed, 
    r: 4 
  }

  bricks = []
  particles = []
  const colors = ['#f43f5e', '#a855f7', '#38bdf8', '#10b981']
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      bricks.push({ x: c * 48 + 7, y: r * 20 + 30, w: 42, h: 14, active: true, color: colors[r] })
    }
  }
}

const createParticles = (x, y, color) => {
  for (let i = 0; i < 8; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      alpha: 1,
      color
    })
  }
}

const updateBreakout = () => {
  if (keysHeld['ArrowLeft'] || keysHeld['KeyA'] || btnState.value.left) {
    paddle.x = Math.max(0, paddle.x - PADDLE_SPEED)
  }
  if (keysHeld['ArrowRight'] || keysHeld['KeyD'] || btnState.value.right) {
    paddle.x = Math.min(300 - paddle.w, paddle.x + PADDLE_SPEED)
  }

  ball.x += ball.dx
  ball.y += ball.dy

  if (ball.x - ball.r < 0 || ball.x + ball.r > 300) ball.dx *= -1
  if (ball.y - ball.r < 0) ball.dy *= -1
  if (ball.y + ball.r > 300) { triggerGameOver(); return }

  if (ball.y + ball.r >= 270 && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
    ball.dy = -Math.abs(ball.dy)
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)
    const hitRatio = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2)
    ball.dx = hitRatio * (speed * 0.9)
  }

  bricks.forEach(b => {
    if (b.active && ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y && ball.y < b.y + b.h) {
      b.active = false
      ball.dy *= -1
      score.value += 15
      createParticles(b.x + b.w / 2, b.y + b.h / 2, b.color)
    }
  })

  // 🎯 檢查是否清空所有磚塊 (進入下一關)
  if (bricks.length > 0 && bricks.every(b => !b.active)) {
    breakoutLevel.value++
    score.value += 100 // 通關加分
    
    levelNoticeText.value = `⚡ 進入第 ${breakoutLevel.value} 關！(球速已提升)`
    showLevelNotice.value = true
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } })

    if (levelNoticeTimer) clearTimeout(levelNoticeTimer)
    levelNoticeTimer = setTimeout(() => {
      showLevelNotice.value = false
    }, 2200)

    setupBreakoutLevel()
  }

  ctx.fillStyle = '#00f2fe'; ctx.shadowColor = '#00f2fe'; ctx.shadowBlur = 8
  ctx.fillRect(paddle.x, 270, paddle.w, paddle.h)

  ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'; ctx.fill()

  bricks.forEach(b => {
    if (b.active) {
      ctx.fillStyle = b.color; ctx.shadowColor = b.color; ctx.shadowBlur = 4
      ctx.fillRect(b.x, b.y, b.w, b.h)
    }
  })

  particles.forEach((p, idx) => {
    p.x += p.vx; p.y += p.vy; p.alpha -= 0.04
    if (p.alpha <= 0) particles.splice(idx, 1)
    else {
      ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha
      ctx.fillRect(p.x, p.y, 2, 2)
      ctx.globalAlpha = 1
    }
  })
  ctx.shadowBlur = 0
}

// -----------------------------------------------------------------
// 3. 太空射擊 (保持原速不變)
// -----------------------------------------------------------------
let player = { x: 140, y: 260, w: 20, h: 20 }
let bullets = []
let enemies = []
let shooterTimer = 0
let fireCooldown = 0
const SHIP_SPEED = 4.5

const initShooter = () => {
  player = { x: 140, y: 260, w: 20, h: 20 }
  bullets = []; enemies = []; particles = []
  fireCooldown = 0
}

const updateShooter = () => {
  if (keysHeld['ArrowLeft'] || keysHeld['KeyA'] || btnState.value.left) {
    player.x = Math.max(0, player.x - SHIP_SPEED)
  }
  if (keysHeld['ArrowRight'] || keysHeld['KeyD'] || btnState.value.right) {
    player.x = Math.min(300 - player.w, player.x + SHIP_SPEED)
  }

  if (fireCooldown > 0) fireCooldown--
  const isFiring = keysHeld['Space'] || keysHeld['KeyW'] || keysHeld['ArrowUp'] || btnState.value.fire
  if (isFiring && fireCooldown <= 0) {
    bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 8 })
    fireCooldown = 8
  }

  shooterTimer++
  if (shooterTimer % 32 === 0) {
    enemies.push({ x: Math.random() * 260, y: -20, w: 22, h: 18, speed: 1.2 + Math.random() * 0.8 })
  }

  bullets.forEach((b, idx) => {
    b.y -= 5.5
    if (b.y < -10) bullets.splice(idx, 1)
  })

  enemies.forEach((e, eIdx) => {
    e.y += e.speed

    if (e.y + e.h >= player.y && e.x + e.w >= player.x && e.x <= player.x + player.w) {
      triggerGameOver(); return
    }
    if (e.y > 300) enemies.splice(eIdx, 1)

    bullets.forEach((b, bIdx) => {
      if (b.x + b.w >= e.x && b.x <= e.x + e.w && b.y <= e.y + e.h) {
        createParticles(e.x + e.w / 2, e.y + e.h / 2, '#f43f5e')
        enemies.splice(eIdx, 1)
        bullets.splice(bIdx, 1)
        score.value += 20
      }
    })
  })

  ctx.fillStyle = '#00f2fe'; ctx.shadowColor = '#00f2fe'; ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.moveTo(player.x + player.w / 2, player.y)
  ctx.lineTo(player.x, player.y + player.h)
  ctx.lineTo(player.x + player.w, player.y + player.h)
  ctx.closePath(); ctx.fill()

  ctx.fillStyle = '#38bdf8'
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h))

  ctx.fillStyle = '#f43f5e'; ctx.shadowColor = '#f43f5e'
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h))

  particles.forEach((p, idx) => {
    p.x += p.vx; p.y += p.vy; p.alpha -= 0.05
    if (p.alpha <= 0) particles.splice(idx, 1)
    else {
      ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha
      ctx.fillRect(p.x, p.y, 2.5, 2.5)
      ctx.globalAlpha = 1
    }
  })
  ctx.shadowBlur = 0
}

const handleKeyDown = (e) => {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()

  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space'].includes(e.code)) {
    e.preventDefault()
  }

  keysHeld[e.code] = true

  if (activeGame.value === 'snake') {
    if (['ArrowUp', 'KeyW'].includes(e.code)) handleSnakeDir('UP')
    if (['ArrowDown', 'KeyS'].includes(e.code)) handleSnakeDir('DOWN')
    if (['ArrowLeft', 'KeyA'].includes(e.code)) handleSnakeDir('LEFT')
    if (['ArrowRight', 'KeyD'].includes(e.code)) handleSnakeDir('RIGHT')
  }
}

const handleKeyUp = (e) => {
  keysHeld[e.code] = false
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  stopGameLoop()
})

defineExpose({ open })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>