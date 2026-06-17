import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { LAYERS } from '../content/ecogridData';
import { circuitTexture, blueprintTexture, radialTexture } from './textures.js'
import {
  deck, buildSense, buildConnect, buildModel, buildIntelligence, buildMonetise,
} from './tiles.js'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const mix = (a, b, t) => a + (b - a) * t
const easeIO = (t) => -(Math.cos(Math.PI * t) - 1) / 2
const D2R = Math.PI / 180

const ASMGAP = 0.45   /* assembled tile pitch  */
const G = 0.6         /* extra exploded gap    */

/* per-layer deck recipe + content builder */
const RECIPES = [
  { build: buildSense,        deckOpts: () => ({ variant: 'solid', body: 0x0a0c10 }) },
  { build: buildConnect,      deckOpts: () => ({ variant: 'glass', top: circuitTexture('#1aed6e') }) },
  { build: buildModel,        deckOpts: () => ({ variant: 'solid', body: 0x0a0c10, top: blueprintTexture('#4fa3e0') }) },
  { build: buildIntelligence, deckOpts: () => ({ variant: 'solid', body: 0x030405 }) },
  { build: buildMonetise,     deckOpts: () => ({ variant: 'glass', top: radialTexture('#2dd4a0') }) },
]

export function initStage(canvas) {
  /* ── renderer / scene / camera ─────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(innerWidth, innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100)

  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.12).texture

  /* ── lights + floor ────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.3))
  const key = new THREE.DirectionalLight(0xe8f5ee, 2.2)
  key.position.set(-4, 7, 4)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0x6b9e82, 0.5)
  fill.position.set(4, 3, -3)
  scene.add(fill)

  const stack = new THREE.Group()
  scene.add(stack)

  /* ── tiles ─────────────────────────────────────────────────── */
  const ASM = LAYERS.map((_, i) => i * ASMGAP)
  const layers = []
  LAYERS.forEach((d, i) => {
    const L = new THREE.Group()
    const { group: plat, strip } = deck(d.color, RECIPES[i].deckOpts(d.hex))
    L.add(plat)
    const { group: content, anims } = RECIPES[i].build(d.color)
    content.position.y = 0.055
    L.add(content)
    L.position.y = ASM[i]
    stack.add(L)
    layers.push({ g: L, content, strip, anims, d, gap: 0, f: 0 })
  })

  /* beams between separated tiles */
  const beams = []
  for (let i = 0; i < 4; i++) {
    const c = LAYERS[i + 1].color
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 1, 8),
      new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.5 }),
    )
    const halo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 1, 8),
      new THREE.MeshBasicMaterial({
        color: c, transparent: true, opacity: 0.1,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }),
    )
    stack.add(core, halo)
    beams.push({ core, halo, a: i, b: i + 1 })
  }
  const updateBeams = () => {
    beams.forEach((b) => {
      const ya = layers[b.a].g.position.y + 0.07
      const yb = layers[b.b].g.position.y - 0.07
      const gap = Math.max(yb - ya, 0.001)
      b.core.position.y = b.halo.position.y = (ya + yb) / 2
      b.core.scale.y = b.halo.scale.y = gap
      b.core.visible = b.halo.visible = yb - ya > 0.62
    })
  }

  /* ambient wisps */
  const PN = 240
  const pg = new THREE.BufferGeometry()
  const pa = new Float32Array(PN * 3)
  for (let i = 0; i < PN; i++) {
    pa[i * 3] = (Math.random() - 0.5) * 1.8
    pa[i * 3 + 1] = Math.random() * 5.4
    pa[i * 3 + 2] = (Math.random() - 0.5) * 1.8
  }
  pg.setAttribute('position', new THREE.BufferAttribute(pa, 3))
  const wisps = new THREE.Points(pg, new THREE.PointsMaterial({
    size: 0.02, color: 0x2dd4a0, transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }))
  stack.add(wisps)

  /* roadmap laser */
  const roadmapLaserCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 40, 8),
    new THREE.MeshBasicMaterial({ color: 0x2dd4a0, transparent: true, opacity: 0.0 }),
  )
  const roadmapLaserHalo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 40, 8),
    new THREE.MeshBasicMaterial({ color: 0x2dd4a0, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false }),
  )
  roadmapLaserCore.position.y = 20
  roadmapLaserHalo.position.y = 20
  stack.add(roadmapLaserCore, roadmapLaserHalo)

  /* ── scroll choreography ───────────────────────────────────── */
  const sections = [...document.querySelectorAll('section[data-key]')]
  const CS = {}
  const measure = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight)
    sections.forEach((s) => {
      const absoluteTop = s.getBoundingClientRect().top + window.scrollY
      CS[s.dataset.key] = clamp(absoluteTop / max, 0, 1)
    })
    /* innerHeight matches the scroll distance of the new CSS sticky wrapper */
    CS.heroSlideEnd = clamp(innerHeight / max, 0, 1)
  }
  measure() /* initial fallback values */
  /* Re-measure after GSAP's pin spacer is in the DOM */
  const lateMeasure = setTimeout(() => { measure(); KEYS = camKeys() }, 800)

  const focusY = (i) => i * (ASMGAP + G) + 0.05
  const camKeys = () => {
    const slideEnd = CS.heroSlideEnd || 0.08
    const l0 = CS['0'] || 0.15
    const p4 = CS['4'] || 0.7
    const problem = CS.problem || p4 + 0.1
    const tiers = CS.tiers || p4 + 0.2
    const modelFinale = CS['model-finale'] || p4 + 0.3
    const zoomOutPoint = mix(p4, problem, 0.3)

    return [
    /* Phase 1 — Hero: compressed stack, framed to the RIGHT viewport half */
    { p: 0,                       az: 30,  el: 20, dist: 7.0,  ty: 1.0,       shift: -2.5 },
    /* Phase 2 — Slide left: model moves left, still compressed */
    { p: slideEnd,                az: 32,  el: 18, dist: 6.0,  ty: 1.0,       shift: 2.2  },
    /* Phase 3 — Layer-by-layer zoom */
    { p: l0,                      az: 30,  el: 13, dist: 2.7,  ty: focusY(0), shift: 1.0 },
    { p: CS['1'],   az: -28, el: 11, dist: 2.6,  ty: focusY(1), shift: 1.0 },
    { p: CS['2'],   az: 32,  el: 17, dist: 2.7,  ty: focusY(2), shift: 1.0 },
    { p: CS['3'],   az: -30, el: 19, dist: 2.6,  ty: focusY(3) + 0.06, shift: 1.0 },
    { p: p4,        az: 27,  el: 15, dist: 2.7,  ty: focusY(4), shift: 1.0 },
    /* Zoom out at zoomOutPoint — model still visible, just pulled back */
    { p: zoomOutPoint, az: 42, el: 18, dist: 10.5, ty: 2.5,    shift: 4.5 },
    /* Phase 4 — Roadmap: camera pans down as model drops */
    { p: problem,   az: 40,  el: 16, dist: 12.0, ty: -5.0,      shift: 5.5 },
    { p: tiers,     az: 38,  el: 14, dist: 12.0, ty: -15.0,     shift: 5.5 },
    { p: modelFinale,az: 45, el: 12, dist: 10.0, ty: -27.5,     shift: 4.8 },
    { p: 1.001,     az: 42,  el: 18, dist: 10.5, ty: -27.5,     shift: 0 },
  ]}
  let KEYS = camKeys()

  let target = 0, prog = 0
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight
    target = clamp(scrollY / max, 0, 1)
    /* rAF is frozen while the tab is hidden — snap so the first visible
       frame is already settled instead of replaying the transition */
    if (document.hidden) prog = target
  }
  addEventListener('scroll', onScroll, { passive: true })
  const onVis = () => { if (document.visibilityState === 'visible') prog = target }
  document.addEventListener('visibilitychange', onVis)

  let mx = 0, my = 0, smx = 0, smy = 0
  const onPointer = (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 2
    my = (e.clientY / innerHeight - 0.5) * 2
  }
  addEventListener('pointermove', onPointer)

  const onResize = () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
    measure()
    KEYS = camKeys()
  }
  addEventListener('resize', onResize)

  /* ── main loop ─────────────────────────────────────────────── */
  const clock = new THREE.Clock()
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  let orbitAngle = 0, raf = 0

  const step = (dt) => {
    const t = clock.elapsedTime

    const lerpFactor = 1.0 - Math.pow(1.0 - 0.045, dt * 60)
    prog += (target - prog) * (reduceMotion ? 1 : lerpFactor)
    smx += (mx - smx) * 0.04
    smy += (my - smy) * 0.04

    const inFinale = prog > mix(CS['4'], CS.problem || CS['4'] + 0.1, 0.55)
    /* Only start layer focus AFTER we've reached layer-0 */
    const pastHero = prog >= (CS['0'] || 0.15) - 0.005
    let active = -1
    if (pastHero && !inFinale) {
      active = 4
      for (let i = 0; i < 4; i++)
        if (prog < mix(CS[String(i)], CS[String(i + 1)], 0.5)) { active = i; break }
    }

    /* exploded view: gap below tile j opens approaching its chapter;
       tiles above the active one also lift, giving its diorama headroom.
       IMPORTANT: only start opening gaps once we've reached layer-0. */
    let cum = 0
    let sumF = 0
    const explodeStart = CS.heroSlideEnd || 0.08
    const explodeEnd = CS['0'] || 0.15
    layers.forEach((L, i) => {
      if (i > 0) {
        const gapProg = prog < explodeStart ? 0 : prog
        const e = easeIO(clamp((gapProg - explodeStart) / Math.max(explodeEnd - explodeStart, 1e-5), 0, 1))
        L.gap = e
        cum += e * G
      }
      
      const wantF = inFinale ? 0.45 : i === active ? 1 : 0
      L.f += (wantF - L.f) * 0.08
      
      const headroom = 0.45 * sumF
      sumF += L.f
      
      const breathe = i === active ? Math.sin(t * 1.6 + i) * 0.012 : 0
      L.g.position.y = ASM[i] + cum + headroom + breathe
      
      L.strip.material.emissiveIntensity = 0.75 + L.f * 1.5
      L.content.scale.setScalar(1 + L.f * 0.045)
      L.anims.forEach((a) => a(t, dt))
    })
    
    /* Model drop — drop directly as you scroll from Layer 5 to Problem */
    const p4 = CS['4'] || 0.7
    const pProblem = CS.problem || p4 + 0.1
    const dropProg = clamp((prog - p4) / Math.max(pProblem - p4, 1e-5), 0, 1)
    stack.position.y = -30 * dropProg

    /* Laser: fade in during the drop, then fade back out once we're in the sections */
    const pTiers = CS.tiers || pProblem + 0.15
    const laserFadeOut = clamp((prog - pProblem) / Math.max(pTiers - pProblem, 1e-5), 0, 1)
    const laserAlpha = dropProg * (1 - laserFadeOut)
    roadmapLaserCore.material.opacity = 0.8 * laserAlpha
    roadmapLaserHalo.material.opacity = 0.2 * laserAlpha

    stack.rotation.y = Math.sin(t * 0.07) * 0.035 + orbitAngle

    /* camera */
    let p0 = KEYS[0], p1 = KEYS[1], pIndex = 0
    for (let i = 0; i < KEYS.length - 1; i++)
      if (prog >= KEYS[i].p && prog <= KEYS[i + 1].p) { p0 = KEYS[i]; p1 = KEYS[i + 1]; pIndex = i; break }
    
    const rawT = clamp((prog - p0.p) / Math.max(p1.p - p0.p, 1e-5), 0, 1)
    /* Use linear interpolation for the hero slide (pIndex 0) to match GSAP's ease:'none' */
    const lt = pIndex === 0 ? rawT : easeIO(rawT)

    const sideMul = camera.aspect < 0.9 ? 0 : camera.aspect < 1.35 ? 0.55 : 1
    let shift = mix(p0.shift, p1.shift, lt) * sideMul
    let az = mix(p0.az, p1.az, lt)
    let el = mix(p0.el, p1.el, lt)
    let dist = mix(p0.dist, p1.dist, lt)
    let ty = mix(p0.ty, p1.ty, lt)

    if (pIndex === 1) {
      const arc = Math.sin(lt * Math.PI)
      dist += arc * 2.5
      ty += arc * 0.8
      shift -= arc * 0.8
    }

    const orbitAmt = clamp((prog - (CS['4'] || 0.7)) / Math.max(1 - (CS['4'] || 0.7), 1e-5), 0, 1)
    if (!reduceMotion) orbitAngle += dt * 0.22 * easeIO(orbitAmt)
    az += smx * 4
    el -= smy * 2.5

    const distMul = camera.aspect < 0.8 ? 1.9 : camera.aspect < 1.1 ? 1.3 : 1
    const a = az * D2R, e = el * D2R
    camera.position.set(
      Math.cos(e) * Math.sin(a) * dist * distMul + shift,
      ty + Math.sin(e) * dist * distMul,
      Math.cos(e) * Math.cos(a) * dist * distMul,
    )
    camera.lookAt(shift, ty, 0)

    /* css halo removed */

    /* wisps */
    const arr = pg.attributes.position.array
    for (let i = 0; i < PN; i++) {
      arr[i * 3 + 1] += 0.0035
      if (arr[i * 3 + 1] > 5.4) {
        arr[i * 3 + 1] = 0
        arr[i * 3] = (Math.random() - 0.5) * 1.8
        arr[i * 3 + 2] = (Math.random() - 0.5) * 1.8
      }
    }
    pg.attributes.position.needsUpdate = true
    wisps.material.opacity = 0.12 + 0.3 * layers[1].gap

    updateBeams()
    renderer.render(scene, camera)
  }
  const frame = () => {
    raf = requestAnimationFrame(frame)
    step(Math.min(clock.getDelta(), 0.05))
  }
  if (process.env.NODE_ENV === 'development') {
    /* test hook: advance deterministically even while the tab is hidden */
    window.__ovStep = (n = 1) => {
      onScroll()
      for (let i = 0; i < n; i++) { clock.getDelta(); prog = target; step(1 / 60) }
    }
  }
  frame()

  /* ── teardown for React unmount ────────────────────────────── */
  return () => {
    cancelAnimationFrame(raf)
    clearTimeout(lateMeasure)
    removeEventListener('scroll', onScroll)
    document.removeEventListener('visibilitychange', onVis)
    removeEventListener('pointermove', onPointer)
    removeEventListener('resize', onResize)
    scene.traverse((n) => {
      if (n.isMesh || n.isPoints || n.isLineSegments) {
        n.geometry?.dispose()
        const ms = Array.isArray(n.material) ? n.material : [n.material]
        ms.forEach((m) => { m?.map?.dispose(); m?.dispose() })
      }
    })
    pmrem.dispose()
    renderer.dispose()
  }
}
