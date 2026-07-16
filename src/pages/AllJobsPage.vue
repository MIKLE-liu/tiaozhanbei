<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  Sparkles,
  Flame,
  TrendingUp,
  Wallet,
  GraduationCap,
  Briefcase,
  Layers,
  Search,
  X,
} from 'lucide-vue-next'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import SkillRadar from '@/components/Job/SkillRadar.vue'
import TrendChart from '@/components/Job/TrendChart.vue'
import type { JobDetail } from '@/types/job'
import { useAppStore } from '@/stores/appStore'
import { careerDomains, careers } from '@/data/careers'

const router = useRouter()
const appStore = useAppStore()

// ===================== 数据状态 =====================
const domains = ref(['全部领域', ...careerDomains.map((d) => d.label)])
const selectedDomain = ref('全部领域')
const searchKeyword = ref('')
const selectedJob = ref<JobDetail | null>(null)
const hoveredJobId = ref<string | null>(null)
const loadingData = ref(true)
const showUi = ref(true)

// ===================== Three.js 状态 =====================
const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let composer: EffectComposer | null = null
let rafId = 0
let lastTime = 0

const GALAXY_RADIUS = 3600
const WORLD_SIZE = 12000
const ARM_THICKNESS = 380
const ARM_TWIST = 5.2
const SKILL_ORBIT_RADIUS = 220
const BRANCHES = 7 // 与领域数量一致的螺旋臂
const ARM_SPREAD = 0.42
const ARM_THICKNESS_RATIO = 0.11

// 星系缓慢自转
const GALAXY_OMEGA = 0.012
const galaxyAngle = ref(0)

interface CareerObject {
  id: string
  job: JobDetail
  position: THREE.Vector3
  domainId: number
  color: THREE.Color
  size: number
  seed: number
  omega: number
}

interface SkillObject {
  careerId: string
  domainId: number
  local: THREE.Vector3
  position: THREE.Vector3
  color: THREE.Color
  size: number
  omega: number
  seed: number
}

const careerList: CareerObject[] = []
const skillList: SkillObject[] = []

const domainKeyToId = Object.fromEntries(careerDomains.map((d, i) => [d.key, i]))
const domainLabelToKey = Object.fromEntries(careerDomains.map((d) => [d.label, d.key]))
const domainKeyToColor = Object.fromEntries(careerDomains.map((d) => [d.key, d.color]))

let bgPoints: THREE.Points | null = null
let distantPoints: THREE.Points | null = null
let nebulaPoints: THREE.Points | null = null
let dustPoints: THREE.Points | null = null
let careerPoints: THREE.Points | null = null
let skillPoints: THREE.Points | null = null
let galaxyDisk: THREE.Sprite | null = null
let galaxyGroup: THREE.Group | null = null

const raycaster = new THREE.Raycaster()
const mouseNDC = new THREE.Vector2()

const camState = ref({
  x: 0,
  y: 0,
  z: 0,
  yaw: 0,
  pitch: 0,
  speed: 0.6,
})

const mouse = ref({ x: 0, y: 0, down: false, moved: false, lastX: 0, lastY: 0 })
const keys = ref<Record<string, boolean>>({})

// ===================== 工具函数 =====================
function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pseudoRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s += 1831565813
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t += Math.imul(t ^ (t >>> 7), 61 | t) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function mix(a: number, b: number, c: number) {
  return a + b + c - 1.5
}

// 把星系局部坐标转成世界坐标（随星系自转）
const _galWorldTmp = new THREE.Vector3()
function galaxyWorldPosition(local: THREE.Vector3) {
  const a = galaxyAngle.value
  const c = Math.cos(a)
  const s = Math.sin(a)
  return _galWorldTmp.set(
    local.x * c - local.z * s,
    local.y,
    local.x * s + local.z * c,
  )
}

// 简单的 value noise，模拟星际尘埃密度
function noise2D(x: number, y: number) {
  const n = Math.floor(x)
  const m = Math.floor(y)
  const fx = x - n
  const fy = y - m
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)
  const hash = (nx: number, ny: number) => {
    let h = Math.sin(nx * 127.1 + ny * 311.7) * 43758.5453
    return h - Math.floor(h)
  }
  const a = hash(n, m)
  const b = hash(n + 1, m)
  const c = hash(n, m + 1)
  const d = hash(n + 1, m + 1)
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v
}

function makeStarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  // 更柔和的自然星点：中心亮、外围长尾渐变
  g.addColorStop(0, 'rgba(255,255,255,1.0)')
  g.addColorStop(0.06, 'rgba(255,255,255,0.75)')
  g.addColorStop(0.18, 'rgba(255,255,255,0.28)')
  g.addColorStop(0.38, 'rgba(255,255,255,0.08)')
  g.addColorStop(0.65, 'rgba(255,255,255,0.02)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 512, 512)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// 近似正态分布，用于螺旋臂厚度
function normalRnd(rnd: () => number) {
  return (rnd() + rnd() + rnd() + rnd() - 2) / 2
}

// 幂律分布：少量很亮，大量较暗，符合真实恒星亮度
function luminosity(rnd: () => number) {
  return 0.18 + 0.82 * rnd() ** 2.4
}

function makeDiskTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  g.addColorStop(0, 'rgba(60, 68, 110, 0.18)')
  g.addColorStop(0.35, 'rgba(40, 48, 90, 0.10)')
  g.addColorStop(0.65, 'rgba(25, 32, 70, 0.05)')
  g.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 512, 512)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// ===================== 生成星空 =====================
function generateUniverse() {
  careerList.length = 0
  skillList.length = 0

  // 按领域分组职业
  const grouped = new Map<string, JobDetail[]>()
  for (const c of careers) {
    if (!grouped.has(c.domain)) grouped.set(c.domain, [])
    grouped.get(c.domain)!.push(c)
  }

  // 职业星沿螺旋臂分布
  for (const [domain, list] of grouped) {
    const domKey = domainLabelToKey[domain]
    if (!domKey) continue
    const domId = domainKeyToId[domKey]
    const colorHex = domainKeyToColor[domKey]
    const armStart = careerDomains.find((d) => d.key === domKey)!.armAngle
    const perArm = list.length

    list.forEach((job, idx) => {
      const rnd = pseudoRandom(hash(job.id + 'pos'))
      const t = (idx + 0.5) / perArm
      const r = 420 + t * (GALAXY_RADIUS - 420)
      const twist = (r / GALAXY_RADIUS) * ARM_TWIST
      const armOffset = mix(rnd(), rnd(), rnd()) * ARM_THICKNESS
      const angle = armStart + twist + armOffset / r

      const x = Math.cos(angle) * r + Math.cos(angle + Math.PI / 2) * armOffset
      const z = Math.sin(angle) * r + Math.sin(angle + Math.PI / 2) * armOffset
      const y = mix(rnd(), rnd(), rnd()) * ARM_THICKNESS * 0.8

      const size = 10 + job.hot * 3 + rnd() * 3
      const career: CareerObject = {
        id: job.id,
        job,
        position: new THREE.Vector3(x, y, z),
        domainId: domId,
        color: new THREE.Color(colorHex),
        size,
        seed: rnd(),
        omega: (rnd() < 0.5 ? 1 : -1) * (0.02 + rnd() * 0.03),
      }
      careerList.push(career)

      // 技能小星围绕职业星
      const skillCount = job.skills.length + Math.floor(rnd() * 3)
      const orbitSeed = hash(job.id + 'skills')
      for (let s = 0; s < skillCount; s++) {
        const srnd = pseudoRandom(orbitSeed + s)
        const theta = s * ((Math.PI * 2) / skillCount) + srnd() * 0.4
        const phi = Math.acos(2 * srnd() - 1)
        const orbitR = SKILL_ORBIT_RADIUS * (0.6 + srnd() * 0.7)
        const lx = orbitR * Math.sin(phi) * Math.cos(theta)
        const ly = orbitR * Math.sin(phi) * Math.sin(theta)
        const lz = orbitR * Math.cos(phi)
        skillList.push({
          careerId: job.id,
          domainId: domId,
          local: new THREE.Vector3(lx, ly, lz),
          position: new THREE.Vector3(x + lx, y + ly, z + lz),
          color: new THREE.Color(colorHex),
          size: 2.2 + srnd() * 2.0,
          omega: career.omega * (1.2 + srnd() * 0.6),
          seed: srnd(),
        })
      }
    })
  }
}

function buildScene() {
  if (!scene) return

  const starTex = makeStarTexture()

  // 银河盘：更柔和、更像弥散星光的径向光晕
  const diskGeo = new THREE.PlaneGeometry(1, 1)
  const diskCanvas = document.createElement('canvas')
  diskCanvas.width = diskCanvas.height = 1024
  const dctx = diskCanvas.getContext('2d')!
  const dg = dctx.createRadialGradient(512, 512, 0, 512, 512, 512)
  dg.addColorStop(0, 'rgba(255, 238, 200, 0.10)')
  dg.addColorStop(0.18, 'rgba(255, 220, 175, 0.055)')
  dg.addColorStop(0.42, 'rgba(200, 205, 255, 0.030)')
  dg.addColorStop(0.72, 'rgba(90, 110, 190, 0.012)')
  dg.addColorStop(1, 'rgba(0, 0, 0, 0)')
  dctx.fillStyle = dg
  dctx.fillRect(0, 0, 1024, 1024)
  const diskTex = new THREE.CanvasTexture(diskCanvas)
  diskTex.colorSpace = THREE.SRGBColorSpace
  const diskMat = new THREE.MeshBasicMaterial({
    map: diskTex,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
  galaxyDisk = new THREE.Mesh(diskGeo, diskMat) as unknown as THREE.Sprite
  galaxyDisk.scale.set(GALAXY_RADIUS * 2.6, GALAXY_RADIUS * 2.6, 1)
  galaxyDisk.rotation.x = -Math.PI / 2

  // 星系组：所有随星系自转的元素放这里
  galaxyGroup = new THREE.Group()
  galaxyGroup.add(galaxyDisk)
  scene.add(galaxyGroup)

  // 螺旋臂辅助：把索引映射到领域臂角
  const armAngleOf = (branchIdx: number) =>
    careerDomains[Math.floor(((branchIdx % BRANCHES) / BRANCHES) * careerDomains.length)].armAngle

  // ================= 背景星：核球 + 螺旋臂 + 晕轮 =================
  const bgCount = 120000
  const bgGeo = new THREE.BufferGeometry()
  const bgPos = new Float32Array(bgCount * 3)
  const bgColor = new Float32Array(bgCount * 3)
  const bgScale = new Float32Array(bgCount)
  const bgPhase = new Float32Array(bgCount)

  const cCore = new THREE.Color('#ffefc0')
  const cBulge = new THREE.Color('#fff4d9')
  const cInner = new THREE.Color('#fffbf0')
  const cWhite = new THREE.Color('#ffffff')
  const cBlue = new THREE.Color('#c8d8ff')
  const cHalo = new THREE.Color('#ff9eb8')
  const cNebula = new THREE.Color('#b8a4ff')
  const tmpC = new THREE.Color()

  const rnd = pseudoRandom(31337)
  const invR = 3.6 / GALAXY_RADIUS

  for (let idx = 0; idx < bgCount; idx++) {
    const t = idx / bgCount
    const isHalo = t >= 0.78
    const isBulge = !isHalo && t >= 0.58
    const isArm = !isHalo && !isBulge

    let x = 0, y = 0, z = 0, scale = 0.5
    tmpC.copy(cWhite)

    if (isHalo) {
      // 晕轮：稀疏球星
      const rMin = GALAXY_RADIUS * 0.22
      const rMax = GALAXY_RADIUS * 0.55
      const r = rMin + (rMax - rMin) * rnd()
      const theta = rnd() * Math.PI * 2
      const phi = Math.acos(2 * rnd() - 1)
      const diskN = Math.sqrt(Math.max(0, 1 - Math.cos(phi) * Math.cos(phi)))
      x = r * diskN * Math.cos(theta)
      z = r * diskN * Math.sin(theta)
      y = r * Math.cos(phi) * 0.55 + (rnd() - 0.5) * GALAXY_RADIUS * 0.05
      const g = r / GALAXY_RADIUS
      scale = luminosity(rnd) * (0.7 + rnd() * 0.5) * (1.1 - g * 0.6)
      tmpC.copy(cWhite).lerp(cBlue, Math.min(1, (g - 0.12) / 0.35))
      if (rnd() < 0.03) tmpC.copy(cHalo)
    } else if (isBulge) {
      // 核球：中心密集，颜色暖
      const r = GALAXY_RADIUS * rnd() ** 1.4
      const theta = rnd() * Math.PI * 2
      const phi = Math.acos(2 * rnd() - 1)
      const diskN = Math.sqrt(Math.max(0, 1 - Math.cos(phi) * Math.cos(phi)))
      x = r * diskN * Math.cos(theta)
      z = r * diskN * Math.sin(theta)
      y = r * Math.cos(phi) * 0.42 + (rnd() - 0.5) * GALAXY_RADIUS * 0.04
      const g = r / GALAXY_RADIUS
      scale = luminosity(rnd) * (0.9 + rnd() * 0.45) * (1.0 - g * 0.35)
      if (g < 0.08) tmpC.copy(cCore).lerp(cBulge, g / 0.08)
      else if (g < 0.28) tmpC.copy(cBulge).lerp(cInner, (g - 0.08) / 0.2)
      else tmpC.copy(cInner).lerp(cWhite, Math.min(1, (g - 0.28) / 0.5))
    } else {
      // 螺旋臂：更清晰的臂结构 + 自然弥散
      const rMin = GALAXY_RADIUS * 0.12
      const rMax = GALAXY_RADIUS * 1.02
      const r = rMin + (rMax - rMin) * rnd() ** 0.55
      const g = r / GALAXY_RADIUS
      const branch = Math.floor(rnd() * BRANCHES)
      const twist = g * ARM_TWIST
      const armBase = armAngleOf(branch)
      // 臂内高斯分布 + 少量弥散星
      const armOffsetRaw = normalRnd(rnd) * ARM_SPREAD * (0.6 + g * 0.5)
      const armDensity = Math.exp(-(armOffsetRaw * armOffsetRaw) / (ARM_SPREAD * ARM_SPREAD) * 2.0)
      const interArm = rnd() < 0.12 ? normalRnd(rnd) * ARM_SPREAD * 2.6 : armOffsetRaw
      const angle = armBase + twist + interArm
      const thick = ARM_THICKNESS * (0.5 + g * 0.6)
      x = Math.cos(angle) * r + normalRnd(rnd) * thick
      z = Math.sin(angle) * r + normalRnd(rnd) * thick
      y = normalRnd(rnd) * thick * 0.35 + (rnd() - 0.5) * GALAXY_RADIUS * 0.02

      const nVal = noise2D(x * invR, z * invR)
      scale =
        luminosity(rnd) *
        (0.35 + armDensity * 0.85 + nVal * 0.25) *
        (0.6 + rnd() * 0.5)

      if (g < 0.12) tmpC.copy(cBulge).lerp(cInner, g / 0.12)
      else if (g < 0.4) tmpC.copy(cInner).lerp(cWhite, (g - 0.12) / 0.28)
      else tmpC.copy(cWhite).lerp(cBlue, Math.min(1, (g - 0.4) / 0.55))

      // 臂内偶尔出现粉色恒星形成区
      if (armDensity > 0.5 && rnd() < 0.045) tmpC.lerp(cNebula, 0.55)
      // 红色巨星
      if (armDensity > 0.55 && rnd() < 0.025) tmpC.copy(cHalo)
    }

    bgPos[idx * 3] = x
    bgPos[idx * 3 + 1] = y
    bgPos[idx * 3 + 2] = z
    const brightness = 1.25
    bgColor[idx * 3] = tmpC.r * scale * brightness
    bgColor[idx * 3 + 1] = tmpC.g * scale * brightness
    bgColor[idx * 3 + 2] = tmpC.b * scale * brightness
    bgScale[idx] = scale
    bgPhase[idx] = rnd() * Math.PI * 2
  }

  bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3))
  bgGeo.setAttribute('color', new THREE.BufferAttribute(bgColor, 3))
  bgGeo.setAttribute('aScale', new THREE.BufferAttribute(bgScale, 1))
  bgGeo.setAttribute('aPhase', new THREE.BufferAttribute(bgPhase, 1))

  const bgMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer?.getPixelRatio() || 1 },
      uStarTex: { value: starTex },
      uSizeScale: { value: 1400 },
    },
    vertexShader: `
      attribute vec3 color;
      attribute float aScale;
      attribute float aPhase;
      varying vec3 vColor;
      varying float vTw;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uSizeScale;
      void main() {
        vColor = color;
        vTw = 0.75 + 0.25 * sin(uTime * 0.35 + aPhase);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = max(1.0, aScale * 5.0 * uPixelRatio * (uSizeScale / max(1.0, -mv.z)));
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vTw;
      uniform sampler2D uStarTex;
      void main() {
        vec4 tex = texture2D(uStarTex, gl_PointCoord);
        if (tex.a < 0.01) discard;
        vec3 col = vColor * tex.rgb * (1.1 + vTw * 0.25);
        gl_FragColor = vec4(col, tex.a * 0.92);
      }
    `,
  })
  bgPoints = new THREE.Points(bgGeo, bgMat)
  bgPoints.frustumCulled = false
  galaxyGroup.add(bgPoints)

  // 暗星云：用 NormalBlending 制造旋臂间的暗带，增强真实感
  const dustCount = 6000
  const dustGeo = new THREE.BufferGeometry()
  const dustPos = new Float32Array(dustCount * 3)
  const dustSize = new Float32Array(dustCount)
  const dustAlpha = new Float32Array(dustCount)
  for (let i = 0; i < dustCount; i++) {
    const drnd = pseudoRandom(i + 77000)
    const g = 0.15 + drnd() * 0.75
    const r = g * GALAXY_RADIUS
    const branch = Math.floor(drnd() * BRANCHES)
    const twist = g * ARM_TWIST
    const armBase = armAngleOf(branch)
    // 位于两条臂之间
    const offset = ARM_SPREAD * (1.3 + drnd() * 0.9) * (drnd() < 0.5 ? 1 : -1)
    const angle = armBase + twist + offset
    const thick = ARM_THICKNESS * (0.7 + g * 0.5)
    dustPos[i * 3] = Math.cos(angle) * r + normalRnd(drnd) * thick
    dustPos[i * 3 + 1] = normalRnd(drnd) * thick * 0.25
    dustPos[i * 3 + 2] = Math.sin(angle) * r + normalRnd(drnd) * thick
    dustSize[i] = 60 + drnd() * 120
    dustAlpha[i] = 0.035 + drnd() * 0.04
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  dustGeo.setAttribute('aSize', new THREE.BufferAttribute(dustSize, 1))
  dustGeo.setAttribute('aAlpha', new THREE.BufferAttribute(dustAlpha, 1))
  const dustMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uPixelRatio: { value: renderer?.getPixelRatio() || 1 },
    },
    vertexShader: `
      attribute float aSize;
      attribute float aAlpha;
      varying float vAlpha;
      uniform float uPixelRatio;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPixelRatio * (900.0 / max(1.0, -mv.z));
        vAlpha = aAlpha;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float a = exp(-d * d * 3.2);
        if (a < 0.002) discard;
        gl_FragColor = vec4(0.02, 0.03, 0.06, a * vAlpha);
      }
    `,
  })
  dustPoints = new THREE.Points(dustGeo, dustMat)
  dustPoints.frustumCulled = false
  galaxyGroup.add(dustPoints)

  // 远景星：球壳分布，带颜色变化
  const distCount = 8000
  const distGeo = new THREE.BufferGeometry()
  const distPos = new Float32Array(distCount * 3)
  const distColor = new Float32Array(distCount * 3)
  const distPhase = new Float32Array(distCount)
  const drnd = pseudoRandom(44221)
  for (let i = 0; i < distCount; i++) {
    const theta = drnd() * Math.PI * 2
    const phi = Math.acos(2 * drnd() - 1)
    const r = 7800 + drnd() * 2400
    distPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    distPos[i * 3 + 1] = r * Math.cos(phi)
    distPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    const s = 0.55 + drnd() * 0.45
    const tone = drnd()
    distColor[i * 3] = s * (0.9 + tone * 0.15)
    distColor[i * 3 + 1] = s * (0.9 + tone * 0.08)
    distColor[i * 3 + 2] = s * (1.0 + tone * 0.18)
    distPhase[i] = drnd() * Math.PI * 2
  }
  distGeo.setAttribute('position', new THREE.BufferAttribute(distPos, 3))
  distGeo.setAttribute('color', new THREE.BufferAttribute(distColor, 3))
  distGeo.setAttribute('aPhase', new THREE.BufferAttribute(distPhase, 1))
  const distMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer?.getPixelRatio() || 1 },
      uStarTex: { value: starTex },
      uSizeScale: { value: 2200 },
    },
    vertexShader: `
      attribute vec3 color;
      attribute float aPhase;
      varying vec3 vColor;
      varying float vTw;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uSizeScale;
      void main() {
        vColor = color;
        vTw = 0.8 + 0.2 * sin(uTime * 0.2 + aPhase);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = max(0.8, 2.6 * uPixelRatio * (uSizeScale / max(1.0, -mv.z)));
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vTw;
      uniform sampler2D uStarTex;
      void main() {
        vec4 tex = texture2D(uStarTex, gl_PointCoord);
        if (tex.a < 0.01) discard;
        vec3 col = vColor * tex.rgb * vTw;
        gl_FragColor = vec4(col, tex.a * 0.6);
      }
    `,
  })
  distantPoints = new THREE.Points(distGeo, distMat)
  distantPoints.frustumCulled = false
  scene.add(distantPoints)

  // 星云：多色大型光晕粒子
  const nebCount = 8000
  const nebGeo = new THREE.BufferGeometry()
  const nebPos = new Float32Array(nebCount * 3)
  const nebSize = new Float32Array(nebCount)
  const nebAlpha = new Float32Array(nebCount)
  const nebColor = new Float32Array(nebCount * 3)
  const nebPalette = [
    new THREE.Color('#6b8cff'),
    new THREE.Color('#9b6bff'),
    new THREE.Color('#ff6b9d'),
    new THREE.Color('#4deeea'),
  ]

  for (let i = 0; i < nebCount; i++) {
    const nrnd = pseudoRandom(i + 20000)
    const g = 0.12 + nrnd() * 0.88
    const r = g * GALAXY_RADIUS
    const branch = Math.floor(nrnd() * BRANCHES)
    const twist = g * ARM_TWIST
    const armBase = armAngleOf(branch)
    const offset = normalRnd(nrnd) * ARM_SPREAD * 1.2
    const angle = armBase + twist + offset
    const thick = ARM_THICKNESS * (0.6 + g * 0.5)
    nebPos[i * 3] = Math.cos(angle) * r + normalRnd(nrnd) * thick
    nebPos[i * 3 + 1] = normalRnd(nrnd) * thick * 0.35
    nebPos[i * 3 + 2] = Math.sin(angle) * r + normalRnd(nrnd) * thick
    nebSize[i] = nrnd() * 90 + 35
    nebAlpha[i] = nrnd() * 0.035 + 0.012
    const c = nebPalette[Math.floor(nrnd() * nebPalette.length)]
    nebColor[i * 3] = c.r
    nebColor[i * 3 + 1] = c.g
    nebColor[i * 3 + 2] = c.b
  }
  nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3))
  nebGeo.setAttribute('aSize', new THREE.BufferAttribute(nebSize, 1))
  nebGeo.setAttribute('aAlpha', new THREE.BufferAttribute(nebAlpha, 1))
  nebGeo.setAttribute('aColor', new THREE.BufferAttribute(nebColor, 3))

  const nebMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPixelRatio: { value: renderer?.getPixelRatio() || 1 },
    },
    vertexShader: `
      attribute float aSize;
      attribute float aAlpha;
      attribute vec3 aColor;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uPixelRatio;
      void main() {
        vColor = aColor;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPixelRatio * (900.0 / max(1.0, -mv.z));
        vAlpha = aAlpha;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float a = exp(-d * d * 4.5);
        if (a < 0.002) discard;
        gl_FragColor = vec4(vColor, a * vAlpha * 0.65);
      }
    `,
  })
  nebulaPoints = new THREE.Points(nebGeo, nebMat)
  nebulaPoints.frustumCulled = false
  galaxyGroup.add(nebulaPoints)

  // 职业星：更亮的恒星
  const cGeo = new THREE.BufferGeometry()
  const cPos = new Float32Array(careerList.length * 3)
  const cColor = new Float32Array(careerList.length * 3)
  const cSize = new Float32Array(careerList.length)
  const cSeed = new Float32Array(careerList.length)
  const cDomainId = new Float32Array(careerList.length)

  careerList.forEach((c, i) => {
    cPos[i * 3] = c.position.x
    cPos[i * 3 + 1] = c.position.y
    cPos[i * 3 + 2] = c.position.z
    cColor[i * 3] = c.color.r
    cColor[i * 3 + 1] = c.color.g
    cColor[i * 3 + 2] = c.color.b
    cSize[i] = c.size
    cSeed[i] = c.seed
    cDomainId[i] = c.domainId
  })
  cGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3))
  cGeo.setAttribute('aColor', new THREE.BufferAttribute(cColor, 3))
  cGeo.setAttribute('aSize', new THREE.BufferAttribute(cSize, 1))
  cGeo.setAttribute('aSeed', new THREE.BufferAttribute(cSeed, 1))
  cGeo.setAttribute('aDomainId', new THREE.BufferAttribute(cDomainId, 1))

  const cMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer?.getPixelRatio() || 1 },
      uFilterDomain: { value: -1 },
      uSizeScale: { value: 950 },
    },
    vertexShader: `
      attribute vec3 aColor;
      attribute float aSize;
      attribute float aSeed;
      attribute float aDomainId;
      varying vec3 vColor;
      varying float vTw;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uFilterDomain;
      uniform float uSizeScale;
      void main() {
        if (aSize < 0.001) { gl_Position = vec4(2.0,2.0,2.0,1.0); gl_PointSize = 0.0; return; }
        vColor = aColor;
        vTw = 0.7 + 0.3 * sin(uTime * 0.6 + aSeed * 6.2831853);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float dim = (uFilterDomain < 0.0 || abs(aDomainId - uFilterDomain) < 0.5) ? 1.0 : 0.0;
        gl_PointSize = dim * clamp(aSize * (uSizeScale / -mv.z), 1.5, 80.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vTw;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float core = 1.0 - smoothstep(0.0, 0.14, d);
        float glow = exp(-d * d * 5.5);
        float a = max(core * 0.9, glow * 0.6);
        if (a < 0.015) discard;
        vec3 finalColor = vColor * (1.0 + core * 2.5) * 2.2;
        gl_FragColor = vec4(finalColor, a * vTw);
      }
    `,
  })
  careerPoints = new THREE.Points(cGeo, cMat)
  careerPoints.frustumCulled = false
  galaxyGroup.add(careerPoints)

  // 技能星：围绕职业星的小行星
  const sGeo = new THREE.BufferGeometry()
  const sPos = new Float32Array(skillList.length * 3)
  const sColor = new Float32Array(skillList.length * 3)
  const sSize = new Float32Array(skillList.length)
  const sDomainId = new Float32Array(skillList.length)

  skillList.forEach((s, i) => {
    sPos[i * 3] = s.position.x
    sPos[i * 3 + 1] = s.position.y
    sPos[i * 3 + 2] = s.position.z
    sColor[i * 3] = s.color.r
    sColor[i * 3 + 1] = s.color.g
    sColor[i * 3 + 2] = s.color.b
    sSize[i] = s.size
    sDomainId[i] = s.domainId
  })
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
  sGeo.setAttribute('aColor', new THREE.BufferAttribute(sColor, 3))
  sGeo.setAttribute('aSize', new THREE.BufferAttribute(sSize, 1))
  sGeo.setAttribute('aDomainId', new THREE.BufferAttribute(sDomainId, 1))

  const sMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPixelRatio: { value: renderer?.getPixelRatio() || 1 },
      uFilterDomain: { value: -1 },
      uSizeScale: { value: 950 },
    },
    vertexShader: `
      attribute vec3 aColor;
      attribute float aSize;
      attribute float aDomainId;
      varying vec3 vColor;
      uniform float uPixelRatio;
      uniform float uFilterDomain;
      uniform float uSizeScale;
      void main() {
        vColor = aColor;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float dim = (uFilterDomain < 0.0 || abs(aDomainId - uFilterDomain) < 0.5) ? 1.0 : 0.15;
        gl_PointSize = dim * clamp(aSize * (uSizeScale / -mv.z), 0.7, 36.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
        float a = exp(-d * d * 4.0);
        if (a < 0.004) discard;
        vec3 finalColor = vColor * (0.9 + a * 1.6);
        gl_FragColor = vec4(finalColor, a * 0.95);
      }
    `,
  })
  skillPoints = new THREE.Points(sGeo, sMat)
  skillPoints.frustumCulled = false
  galaxyGroup.add(skillPoints)
}

// ===================== 初始化 =====================
function initThree() {
  if (!canvasRef.value || !containerRef.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x03040a)
  scene.fog = new THREE.Fog(0x03040a, 9000, 26000)

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  camera = new THREE.PerspectiveCamera(60, width / height, 1, WORLD_SIZE * 2)
  // 置身星系内部，从盘面较高处斜望银河
  camera.position.set(1400, 1100, 900)
  camera.lookAt(-300, -200, -400)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: false,
    powerPreference: 'high-performance',
    alpha: false,
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x03040a, 1)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.85,
    0.65,
    0.16,
  )
  bloom.strength = 0.85
  bloom.radius = 0.65
  bloom.threshold = 0.16
  composer.addPass(bloom)

  generateUniverse()
  buildScene()
}

function resizeRenderer() {
  if (!containerRef.value || !camera || !renderer || !composer) return
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  composer.setSize(width, height)
}

function updateCamera(dt: number) {
  if (!camera) return
  const speed = 45 * camState.value.speed * dt
  const yaw = camState.value.yaw
  const pitch = camState.value.pitch

  const cosYaw = Math.cos(yaw)
  const sinYaw = Math.sin(yaw)
  const cosPitch = Math.cos(pitch)

  let dx = 0
  let dz = 0

  if (keys.value['w'] || keys.value['W']) {
    dx += sinYaw * cosPitch * speed
    dz += cosYaw * cosPitch * speed
  }
  if (keys.value['s'] || keys.value['S']) {
    dx -= sinYaw * cosPitch * speed
    dz -= cosYaw * cosPitch * speed
  }
  if (keys.value['a'] || keys.value['A']) {
    dx -= cosYaw * speed
    dz += sinYaw * speed
  }
  if (keys.value['d'] || keys.value['D']) {
    dx += cosYaw * speed
    dz -= sinYaw * speed
  }

  camera.position.x += dx
  camera.position.z += dz

  camera.position.y = Math.max(-WORLD_SIZE / 2, Math.min(WORLD_SIZE / 2, camera.position.y))

  const lookDir = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    Math.cos(yaw) * Math.cos(pitch),
  )
  camera.lookAt(camera.position.clone().add(lookDir))
}

function updateSkillStars(timeSec: number) {
  if (!skillPoints || !careerPoints) return
  const careerMap = new Map(careerList.map((c) => [c.id, c]))
  const posAttr = skillPoints.geometry.getAttribute('position') as THREE.BufferAttribute

  skillList.forEach((s, i) => {
    const parent = careerMap.get(s.careerId)
    if (!parent) return
    const angle = timeSec * s.omega
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const rx = s.local.x * cos - s.local.z * sin
    const rz = s.local.x * sin + s.local.z * cos
    s.position.set(parent.position.x + rx, parent.position.y + s.local.y, parent.position.z + rz)
    posAttr.setXYZ(i, s.position.x, s.position.y, s.position.z)
  })
  posAttr.needsUpdate = true
}

function animate(timestamp: number) {
  rafId = requestAnimationFrame(animate)
  if (!renderer || !camera || !composer) return

  const dt = Math.min((timestamp - lastTime) / 1000, 0.05) || 0.016
  lastTime = timestamp
  const timeSec = timestamp / 1000

  updateCamera(dt)
  updateSkillStars(timeSec)

  // 更新 uniforms
  if (careerPoints) (careerPoints.material as THREE.ShaderMaterial).uniforms.uTime.value = timestamp
  if (bgPoints) (bgPoints.material as THREE.ShaderMaterial).uniforms.uTime.value = timeSec
  if (distantPoints) (distantPoints.material as THREE.ShaderMaterial).uniforms.uTime.value = timeSec

  // 星系缓慢自转 + 相机引力跟随
  galaxyAngle.value = (galaxyAngle.value + dt * GALAXY_OMEGA) % (Math.PI * 2)
  if (galaxyGroup) galaxyGroup.rotation.y = galaxyAngle.value

  const distSq = camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2
  if (distSq < (GALAXY_RADIUS * 1.15) ** 2) {
    const c = Math.cos(dt * GALAXY_OMEGA)
    const s = Math.sin(dt * GALAXY_OMEGA)
    const x = camera.position.x
    const z = camera.position.z
    camera.position.x = x * c + z * s
    camera.position.z = -x * s + z * c
    camState.value.yaw += dt * GALAXY_OMEGA
  }

  // 更新标签
  updateLabels()

  composer.render()
}

// ===================== DOM 标签 =====================
interface LabelItem {
  id: string
  name: string
  domain: string
  color: string
  x: number
  y: number
  scale: number
  dimmed: boolean
  hovered: boolean
}

const visibleLabels = ref<LabelItem[]>([])

function updateLabels() {
  if (!camera || !containerRef.value) return
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  const selectedKey = selectedDomain.value === '全部领域' ? null : domainLabelToKey[selectedDomain.value]
  const selectedId = selectedKey === null ? -1 : domainKeyToId[selectedKey]

  const labels: LabelItem[] = []
  const temp = new THREE.Vector3()

  careerList.forEach((c) => {
    if (selectedId >= 0 && c.domainId !== selectedId && hoveredJobId.value !== c.id) return
    temp.copy(c.position)
    temp.project(camera)
    if (temp.z > 1) return
    const x = (temp.x * 0.5 + 0.5) * width
    const y = (-temp.y * 0.5 + 0.5) * height
    const scale = Math.max(0.3, Math.min(2.5, 900 / Math.max(10, c.position.distanceTo(camera.position))))
    labels.push({
      id: c.id,
      name: c.job.name,
      domain: c.job.domain,
      color: '#' + c.color.getHexString(),
      x,
      y,
      scale,
      dimmed: selectedId >= 0 && c.domainId !== selectedId,
      hovered: hoveredJobId.value === c.id,
    })
  })

  visibleLabels.value = labels
}

// ===================== 交互事件 =====================
function getCareerAt(x: number, y: number): CareerObject | null {
  if (!camera || !containerRef.value || !careerPoints) return null
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  mouseNDC.set((x / width) * 2 - 1, -(y / height) * 2 + 1)

  // 使用简单的屏幕投影拾取，比 Raycaster 对 Points 更稳定
  const selectedKey = selectedDomain.value === '全部领域' ? null : domainLabelToKey[selectedDomain.value]
  const selectedId = selectedKey === null ? -1 : domainKeyToId[selectedKey]
  const temp = new THREE.Vector3()
  let best: CareerObject | null = null
  let bestDist = Infinity

  careerList.forEach((c) => {
    if (selectedId >= 0 && c.domainId !== selectedId) return
    temp.copy(c.position).project(camera)
    const sx = (temp.x * 0.5 + 0.5) * width
    const sy = (-temp.y * 0.5 + 0.5) * height
    if (temp.z > 1) return
    const hitRadius = Math.max(18, c.size * 3)
    const dx = x - sx
    const dy = y - sy
    const dist = dx * dx + dy * dy
    if (dist <= hitRadius * hitRadius && dist < bestDist) {
      bestDist = dist
      best = c
    }
  })
  return best
}

function handleMouseMove(e: MouseEvent) {
  const rect = containerRef.value?.getBoundingClientRect()
  if (!rect) return
  mouse.value.x = e.clientX - rect.left
  mouse.value.y = e.clientY - rect.top

  if (mouse.value.down) {
    const dx = e.clientX - mouse.value.lastX
    const dy = e.clientY - mouse.value.lastY
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) mouse.value.moved = true
    camState.value.yaw += dx * 0.003
    camState.value.pitch += dy * 0.003
    camState.value.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, camState.value.pitch))
    mouse.value.lastX = e.clientX
    mouse.value.lastY = e.clientY
  }

  const hit = getCareerAt(mouse.value.x, mouse.value.y)
  hoveredJobId.value = hit?.id ?? null
}

function handleMouseDown(e: MouseEvent) {
  mouse.value.down = true
  mouse.value.moved = false
  mouse.value.lastX = e.clientX
  mouse.value.lastY = e.clientY
}

function handleMouseUp() {
  mouse.value.down = false
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()
  camState.value.speed = Math.max(0.2, Math.min(2.5, camState.value.speed - e.deltaY * 0.001))
}

function handleKeyDown(e: KeyboardEvent) {
  keys.value[e.key] = true
  if (e.key === 'h' || e.key === 'H') showUi.value = !showUi.value
}

function handleKeyUp(e: KeyboardEvent) {
  keys.value[e.key] = false
}

function handleCanvasClick() {
  if (mouse.value.moved) return
  const hit = getCareerAt(mouse.value.x, mouse.value.y)
  if (hit) {
    selectedJob.value = hit.job
  }
}

function closeDetail() {
  selectedJob.value = null
}

function goToJobDetail(id: string) {
  router.push(`/jobs/${id}`)
}

function analyzeMatch(job: JobDetail) {
  appStore.selectJob(job.id)
  router.push('/resume')
}

function goBack() {
  router.push('/jobs')
}

function fireLevel(level: number) {
  return '🔥'.repeat(level)
}

const filteredJobs = computed(() => {
  if (!searchKeyword.value) return careers
  const kw = searchKeyword.value.toLowerCase()
  return careers.filter(
    (j) =>
      j.name.toLowerCase().includes(kw) ||
      j.domain.toLowerCase().includes(kw) ||
      j.skills.some((s) => s.toLowerCase().includes(kw)),
  )
})

function flyToJob(job: JobDetail) {
  if (!camera) return
  const c = careerList.find((x) => x.id === job.id)
  if (c) {
    const angle = Math.atan2(c.position.z - camera.position.z, c.position.x - camera.position.x)
    camState.value.yaw = angle
    camState.value.pitch = 0
    camera.position.set(
      c.position.x - Math.cos(angle) * 1400,
      c.position.y + 200,
      c.position.z - Math.sin(angle) * 1400,
    )
  }
  searchKeyword.value = ''
}

watch(selectedDomain, () => {
  const key = selectedDomain.value === '全部领域' ? null : domainLabelToKey[selectedDomain.value]
  const domId = key === null ? -1 : domainKeyToId[key]
  if (careerPoints) {
    ;(careerPoints.material as THREE.ShaderMaterial).uniforms.uFilterDomain.value = domId
  }
  if (skillPoints) {
    ;(skillPoints.material as THREE.ShaderMaterial).uniforms.uFilterDomain.value = domId
  }

  if (selectedDomain.value !== '全部领域' && camera) {
    const first = careerList.find((c) => c.job.domain === selectedDomain.value)
    if (first) {
      const angle = Math.atan2(first.position.z, first.position.x)
      camState.value.yaw = angle
      camState.value.pitch = 0.12
      camera.position.set(
        first.position.x - Math.cos(angle) * 2600,
        first.position.y + 450,
        first.position.z - Math.sin(angle) * 2600,
      )
    }
  }
})

// ===================== 生命周期 =====================
onMounted(async () => {
  document.title = '职海 · 全部职业星图 | 星火智岗'
  initThree()
  await new Promise((r) => setTimeout(r, 800))
  loadingData.value = false

  nextTick(() => {
    containerRef.value?.focus()
    window.addEventListener('resize', resizeRenderer)
    rafId = requestAnimationFrame(animate)
  })
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resizeRenderer)
  renderer?.dispose()
  composer?.dispose()
  scene?.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    mesh.geometry?.dispose()
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((m) => m.dispose())
    } else {
      mesh.material?.dispose()
    }
  })
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative h-screen w-screen overflow-hidden bg-[#07080f] outline-none"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
    @wheel="handleWheel"
    @keydown="handleKeyDown"
    @keyup="handleKeyUp"
    @click="handleCanvasClick"
    tabindex="0"
  >
    <!-- 加载层 -->
    <Transition name="fade">
      <div
        v-if="loadingData"
        class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#07080f]"
      >
        <h1 class="font-display text-5xl font-light tracking-[0.3em] text-amber-200">
          职海
        </h1>
        <p class="mt-4 text-sm tracking-wider text-slate-400">
          正在点亮职业星系…
        </p>
        <div class="mt-6 h-0.5 w-48 overflow-hidden rounded-full bg-slate-800">
          <div class="h-full w-full animate-pulse bg-amber-400" />
        </div>
      </div>
    </Transition>

    <!-- Canvas -->
    <canvas
      ref="canvasRef"
      class="absolute inset-0 block cursor-crosshair"
    />

    <!-- 职业标签层 -->
    <div
      v-if="!loadingData"
      class="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        v-for="label in visibleLabels"
        :key="label.id"
        class="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity duration-200"
        :class="label.dimmed ? 'opacity-30' : label.hovered ? 'opacity-100' : 'opacity-80'"
        :style="{
          left: `${label.x}px`,
          top: `${label.y + 18 * label.scale + 10}px`,
          transform: `translate(-50%, -50%) scale(${Math.max(0.7, Math.min(1.1, label.scale))})`,
          color: label.color,
          textShadow: `0 0 12px ${label.color}80`,
        }"
      >
        <span class="rounded-md bg-[#07080f]/60 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
          {{ label.name }}
        </span>
      </div>
    </div>

    <!-- UI 层 -->
    <Transition name="fade">
      <div
        v-if="!loadingData && showUi"
        class="pointer-events-none absolute inset-0 flex flex-col justify-between p-6"
      >
        <!-- 顶部栏 -->
        <div class="pointer-events-auto flex items-start justify-between">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-4">
              <button
                class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 backdrop-blur-md transition-all hover:border-amber-500/50 hover:text-amber-300"
                @click.stop="goBack"
              >
                <ArrowLeft class="h-5 w-5" />
              </button>
              <div>
                <h1 class="font-display text-2xl font-semibold text-amber-200">
                  职海
                </h1>
                <p class="text-xs text-slate-400">
                  Job Galaxy · 全部职业星图
                </p>
              </div>
            </div>

            <div class="relative ml-14 mt-1">
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索职业…（回车飞到第一个）"
                class="w-64 rounded-xl border border-slate-700 bg-slate-900/60 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 backdrop-blur-md outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                @click.stop
                @keydown.enter="filteredJobs.length && flyToJob(filteredJobs[0])"
              >
            </div>
          </div>

          <div class="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 backdrop-blur-md">
            <div class="text-right">
              <div class="text-lg font-semibold text-amber-200">
                {{ careerList.length }}
              </div>
              <div class="text-[10px] uppercase tracking-wider text-slate-400">
                职业
              </div>
            </div>
            <div class="h-8 w-px bg-slate-700" />
            <div class="text-right">
              <div class="text-lg font-semibold text-amber-200">
                {{ skillList.length }}
              </div>
              <div class="text-[10px] uppercase tracking-wider text-slate-400">
                技能星
              </div>
            </div>
          </div>
        </div>

        <!-- 领域过滤 -->
        <div class="pointer-events-auto absolute left-1/2 top-36 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2">
          <button
            v-for="domain in domains"
            :key="domain"
            class="rounded-full border px-4 py-1.5 text-xs font-medium transition-all"
            :class="
              selectedDomain === domain
                ? 'border-amber-500/60 bg-amber-500/15 text-amber-200'
                : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-slate-200'
            "
            @click.stop="selectedDomain = domain"
          >
            {{ domain }}
          </button>
        </div>

        <!-- 底部栏 -->
        <div class="pointer-events-auto flex items-end justify-between">
          <div class="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-400 backdrop-blur-md">
            <span class="text-amber-300">WASD</span> 飞行 ·
            <span class="text-amber-300">拖拽</span> 转向 ·
            <span class="text-amber-300">滚轮</span> 调速 ·
            <span class="text-amber-300">点职业星</span> 查看详情 ·
            <span class="text-amber-300">H</span> 隐藏界面
          </div>

          <div class="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-400 backdrop-blur-md">
            速度 ×{{ camState.speed.toFixed(2) }} · {{ Math.round(120 * camState.speed) }} 单位/秒
          </div>
        </div>
      </div>
    </Transition>

    <!-- 搜索下拉 -->
    <Transition name="fade">
      <div
        v-if="searchKeyword && filteredJobs.length && !loadingData"
        class="pointer-events-auto absolute left-6 top-36 z-30 w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-900/90 shadow-2xl backdrop-blur-md"
        @click.stop
      >
        <div
          v-for="job in filteredJobs.slice(0, 6)"
          :key="job.id"
          class="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800"
          @click="flyToJob(job)"
        >
          <span>{{ job.name }}</span>
          <span
            class="rounded px-1.5 py-0.5 text-[10px]"
            :style="{ backgroundColor: `${domainKeyToColor[domainLabelToKey[job.domain]]}20`, color: domainKeyToColor[domainLabelToKey[job.domain]] }"
          >
            {{ job.domain }}
          </span>
        </div>
      </div>
    </Transition>

    <!-- 职业详情抽屉 -->
    <Transition name="slide">
      <div
        v-if="selectedJob"
        class="pointer-events-auto absolute right-0 top-0 z-40 h-full w-full max-w-md overflow-y-auto border-l border-slate-700 bg-[#0a0c12]/95 p-6 shadow-2xl backdrop-blur-xl"
        @click.stop
      >
        <div class="flex items-start justify-between">
          <div>
            <h2 class="font-display text-2xl font-bold text-amber-100">
              {{ selectedJob.name }}
            </h2>
            <p class="mt-1 text-sm text-slate-400">
              {{ selectedJob.domain }}
            </p>
          </div>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            @click="closeDetail"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <span class="flex items-center gap-1">
            <Flame class="h-3.5 w-3.5 text-amber-500" />
            热度 {{ fireLevel(selectedJob.hot) }}
          </span>
          <span class="flex items-center gap-1">
            <TrendingUp class="h-3.5 w-3.5 text-emerald-500" />
            需求趋势 ↑{{ selectedJob.trend }}%
          </span>
          <span class="flex items-center gap-1">
            <Wallet class="h-3.5 w-3.5 text-primary-400" />
            薪资 {{ selectedJob.salary }}
          </span>
          <span class="flex items-center gap-1">
            <GraduationCap class="h-3.5 w-3.5 text-slate-400" />
            {{ selectedJob.education }}
          </span>
          <span class="flex items-center gap-1">
            <Briefcase class="h-3.5 w-3.5 text-slate-400" />
            {{ selectedJob.experience }}
          </span>
          <span class="flex items-center gap-1">
            <Layers class="h-3.5 w-3.5 text-slate-400" />
            {{ selectedJob.domain }}
          </span>
        </div>

        <p class="mt-5 text-sm leading-relaxed text-slate-300">
          {{ selectedJob.description }}
        </p>

        <div class="mt-5 flex flex-wrap gap-2">
          <span
            v-for="skill in selectedJob.skills"
            :key="skill"
            class="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300"
          >
            {{ skill }}
          </span>
        </div>

        <div class="mt-6 rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
          <h3 class="mb-3 text-sm font-semibold text-slate-200">
            技能要求雷达图
          </h3>
          <SkillRadar :skills="selectedJob.skillList" />
        </div>

        <div class="mt-5 rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
          <h3 class="mb-3 text-sm font-semibold text-slate-200">
            技能需求趋势变化（近 12 个月）
          </h3>
          <TrendChart :data="selectedJob.trendData" />
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            class="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-slate-900 transition-all hover:bg-amber-400 active:scale-[0.98]"
            @click="goToJobDetail(selectedJob.id)"
          >
            查看完整详情
          </button>
          <button
            class="flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:border-amber-500/50 hover:bg-slate-800 active:scale-[0.98]"
            @click="analyzeMatch(selectedJob)"
          >
            <Sparkles class="h-4 w-4 text-amber-300" />
            AI 匹配度分析
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
