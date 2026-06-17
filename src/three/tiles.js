import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import {
  circuitTexture, blueprintTexture, radialTexture,
  chartTexture, coinTexture, certTexture,
} from './textures.js'

const D2R = Math.PI / 180

const metal = (c, r = 0.35, m = 0.9) =>
  new THREE.MeshPhysicalMaterial({ color: c, roughness: r * 1.5, metalness: 0.1, transmission: 0.9, ior: 1.5, thickness: 0.5, transparent: true, clearcoat: 1 })
const glow = (c, i = 1) =>
  new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: 0.4, metalness: 0.1 })
const neon = (c, o = 1) =>
  new THREE.MeshBasicMaterial({ color: c, transparent: o < 1, opacity: o })

function shadowed(o) {
  o.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return o
}

/* ── deck: every tile's base board. variant 'solid' | 'glass' ───── */
export function deck(hex, { variant = 'solid', body = 0x0a0c10, top = null } = {}) {
  const g = new THREE.Group()
  const mat = variant === 'glass'
    ? new THREE.MeshPhysicalMaterial({
        color: hex, transparent: true, roughness: 0.45,
        metalness: 0.1, transmission: 0.95, ior: 1.5, thickness: 0.8,
        clearcoat: 1, clearcoatRoughness: 0.1,
      })
    : new THREE.MeshPhysicalMaterial({ 
        color: body, transparent: true, roughness: 0.55, 
        metalness: 0.2, transmission: 0.9, ior: 1.5, thickness: 0.8,
        clearcoat: 1, clearcoatRoughness: 0.2
      })
  const slab = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.09, 1.3, 4, 0.028), mat)
  g.add(slab)
  const strip = new THREE.Mesh(new RoundedBoxGeometry(1.335, 0.015, 1.335, 2, 0.008), glow(hex, 1))
  strip.position.y = 0.04
  g.add(strip)
  if (top) {
    /* glass decks get an additive trace overlay so the glass still reads;
       solid decks get a lit plate */
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(1.18, 1.18),
      variant === 'glass'
        ? new THREE.MeshBasicMaterial({
            map: top, transparent: true, opacity: 0.9,
            blending: THREE.AdditiveBlending, depthWrite: false,
          })
        : new THREE.MeshStandardMaterial({
            map: top, emissive: 0xffffff, emissiveMap: top, emissiveIntensity: 0.55,
            roughness: 0.6, metalness: 0.2,
          }),
    )
    plate.rotation.x = -Math.PI / 2
    plate.position.y = 0.047
    g.add(plate)
  } else {
    const plate = new THREE.Mesh(
      new RoundedBoxGeometry(1.16, 0.012, 1.16, 2, 0.006),
      new THREE.MeshPhysicalMaterial({ 
        color: 0x0a0c10, transparent: true, roughness: 0.45, 
        metalness: 0.1, transmission: 0.95, ior: 1.5, thickness: 0.2 
      }),
    )
    plate.position.y = 0.052
    g.add(plate)
  }
  shadowed(g)
  return { group: g, strip }
}

/* gear: cylinder hub + teeth, meshes visually with a partner */
function gear(r, color = 0x0a0c10) {
  const g = new THREE.Group()
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.045, 64), metal(color, 0.45, 0.85))
  g.add(hub)
  const teeth = 10
  for (let k = 0; k < teeth; k++) {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.045), metal(color, 0.45, 0.85))
    const a = (k / teeth) * Math.PI * 2
    t.position.set(Math.cos(a) * (r + 0.02), 0, Math.sin(a) * (r + 0.02))
    t.rotation.y = -a
    g.add(t)
  }
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.3, r * 0.3, 0.06, 32), metal(0x030405, 0.3, 0.9))
  g.add(pin)
  return g
}

/* ════════ L1 · SENSE — industrial floor: gears, motor, pipes,
   thermal hotspots, alert beacons, CT clamp ════════ */
export function buildSense(hex) {
  const g = new THREE.Group()
  const anims = []

  const g1 = gear(0.11); g1.rotation.x = Math.PI / 2
  g1.position.set(-0.42, 0.16, -0.3); g.add(g1)
  const g2 = gear(0.08); g2.rotation.x = Math.PI / 2
  g2.position.set(-0.22, 0.16, -0.3); g2.rotation.z = 0.18; g.add(g2)
  const axle = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.05), metal(0x0a0c10, 0.4, 0.8))
  axle.position.set(-0.32, 0.06, -0.3); g.add(axle)
  anims.push((t, dt) => { g1.rotation.z += dt * 0.9; g2.rotation.z -= dt * 1.24 })

  /* motor: ribbed cylinder + gearbox, with thermal hotspot */
  const motor = new THREE.Group()
  const bodyM = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.3, 64), metal(0x0a0c10, 0.38, 0.85))
  bodyM.rotation.z = Math.PI / 2
  motor.add(bodyM)
  for (let i = -2; i <= 2; i++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.088, 0.008, 16, 64), metal(0x030405, 0.4, 0.85))
    rib.rotation.y = Math.PI / 2
    rib.position.x = i * 0.055
    motor.add(rib)
  }
  const gbox = new THREE.Mesh(new RoundedBoxGeometry(0.13, 0.15, 0.15, 4, 0.015), metal(0x030405, 0.42, 0.8))
  gbox.position.x = 0.2
  motor.add(gbox)
  motor.position.set(0.18, 0.09, -0.32)
  g.add(motor)
  const hotM = glow(0xff5a1f, 1.3)
  const hot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 32, 32), hotM)
  hot.scale.set(1, 0.55, 1)
  hot.position.set(0.12, 0.16, -0.32)
  hot.castShadow = false
  g.add(hot)
  anims.push((t) => { hotM.emissiveIntensity = 1 + 0.8 * Math.sin(t * 2.1) })

  /* pipe run with flanges + CT clamp */
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.06, 64), metal(0x0a0c10, 0.3, 0.95))
  pipe.rotation.z = Math.PI / 2
  pipe.position.set(0, 0.12, 0.18)
  g.add(pipe)
  ;[-0.36, 0.3].forEach((px) => {
    const fl = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.012, 16, 64), metal(0x030405, 0.35, 0.9))
    fl.rotation.y = Math.PI / 2
    fl.position.set(px, 0.12, 0.18)
    g.add(fl)
  })
  const clampM = glow(hex, 1.25)
  const clamp = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.02, 32, 64), clampM)
  clamp.rotation.y = Math.PI / 2
  clamp.position.set(-0.06, 0.12, 0.18)
  g.add(clamp)
  anims.push((t) => { clampM.emissiveIntensity = 1.1 + 0.7 * Math.sin(t * 2.6) })

  /* sensor pucks */
  ;[[0.42, 0.34, 0], [0.14, 0.42, 1.9], [-0.45, 0.36, 3.4]].forEach(([x, z, ph]) => {
    const puck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.056, 0.04, 64), metal(0x030405, 0.35, 0.85))
    puck.position.set(x, 0.02, z)
    g.add(puck)
    const capM = glow(hex, 1)
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.012, 64), capM)
    cap.position.set(x, 0.045, z)
    g.add(cap)
    anims.push((t) => { capM.emissiveIntensity = 0.7 + 0.9 * Math.max(0, Math.sin(t * 1.8 + ph)) })
  })

  /* red alert beacons (reference: warning triangles) */
  ;[[-0.07, -0.05], [0.44, 0.05]].forEach(([x, z], i) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.1, 16), metal(0x030405, 0.4, 0.8))
    post.position.set(x, 0.05, z)
    g.add(post)
    const bM = glow(0xff3b30, 1.4)
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.022, 32, 32), bM)
    b.position.set(x, 0.115, z)
    b.castShadow = false
    g.add(b)
    anims.push((t) => { bM.emissiveIntensity = Math.sin(t * 5 + i * 2) > 0.2 ? 2 : 0.15 })
  })

  /* heat shimmer sparks above the motor */
  const N = 26
  const pgeo = new THREE.BufferGeometry()
  const pos = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    pos[i * 3] = 0.18 + (Math.random() - 0.5) * 0.24
    pos[i * 3 + 1] = 0.16 + Math.random() * 0.3
    pos[i * 3 + 2] = -0.32 + (Math.random() - 0.5) * 0.2
  }
  pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const sparks = new THREE.Points(pgeo, new THREE.PointsMaterial({
    size: 0.013, color: 0xffa14f, transparent: true, opacity: 0.8,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }))
  g.add(sparks)
  anims.push((t, dt) => {
    const a = pgeo.attributes.position.array
    for (let i = 0; i < N; i++) {
      a[i * 3 + 1] += dt * 0.16
      if (a[i * 3 + 1] > 0.5) a[i * 3 + 1] = 0.16
    }
    pgeo.attributes.position.needsUpdate = true
  })

  shadowed(g)
  hot.castShadow = false
  return { group: g, anims }
}

/* ════════ L2 · CONNECT — translucent PCB: chips with glowing dies,
   four protocol-coloured cables with travelling pulses ════════ */
export function buildConnect(hex) {
  const g = new THREE.Group()
  const anims = []

  const chip = (w, d, x, z, ry = 0) => {
    const c = new THREE.Group()
    const bodyC = new THREE.Mesh(new RoundedBoxGeometry(w, 0.045, d, 4, 0.01), metal(0x030405, 0.4, 0.6))
    c.add(bodyC)
    const dieM = glow(hex, 1.2)
    const die = new THREE.Mesh(new THREE.BoxGeometry(w * 0.45, 0.012, d * 0.45), dieM)
    die.position.y = 0.026
    c.add(die)
    const pinM = metal(0x1D9E75, 0.3, 1)
    for (let k = 0; k < 6; k++) {
      const off = -w / 2 + 0.04 + (k * (w - 0.08)) / 5
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.01, 0.03), pinM)
      p1.position.set(off, -0.012, d / 2 + 0.012)
      const p2 = p1.clone()
      p2.position.z = -d / 2 - 0.012
      c.add(p1, p2)
    }
    c.position.set(x, 0.024, z)
    c.rotation.y = ry
    g.add(c)
    return dieM
  }
  const die1 = chip(0.3, 0.3, 0.08, 0.02)
  const die2 = chip(0.18, 0.18, 0.42, -0.3, 0.4)
  const die3 = chip(0.16, 0.2, -0.18, 0.4, -0.25)
  anims.push((t) => {
    die1.emissiveIntensity = 1 + 0.5 * Math.sin(t * 3.1)
    die2.emissiveIntensity = 1 + 0.5 * Math.sin(t * 2.3 + 2)
    die3.emissiveIntensity = 1 + 0.5 * Math.sin(t * 2.7 + 4)
  })

  /* protocol ribbon cables — Modbus/OPC-UA/MQTT/4-20mA colours */
  const CABLES = [0xff8c26, 0x2dd4a0, 0x4fa3e0, 0x7b9dff]
  const curves = []
  CABLES.forEach((cc, i) => {
    const z0 = -0.42 + i * 0.1
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.78, 0.02, z0),
      new THREE.Vector3(-0.5, 0.06, z0 + 0.04),
      new THREE.Vector3(-0.26, 0.1, z0 * 0.4 + 0.05),
      new THREE.Vector3(-0.02, 0.05, 0.02),
    ])
    curves.push(curve)
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 64, 0.011, 16, false),
      new THREE.MeshStandardMaterial({ color: cc, emissive: cc, emissiveIntensity: 0.45, roughness: 0.5 }),
    )
    g.add(tube)
    const plug = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.05), metal(0x030405, 0.4, 0.7))
    plug.position.copy(curve.getPoint(0))
    g.add(plug)
  })
  const pulses = []
  for (let i = 0; i < 8; i++) {
    const cc = CABLES[i % 4]
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.018, 32, 32), neon(cc))
    s.castShadow = false
    g.add(s)
    pulses.push({ s, c: curves[i % 4], off: (i * 0.31) % 1 })
  }
  anims.push((t) => {
    pulses.forEach((p) => p.s.position.copy(p.c.getPoint((t * 0.36 + p.off) % 1)))
  })

  /* antenna + uplink */
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.4, 32), metal(0x0a0c10, 0.3, 0.9))
  mast.position.set(0.5, 0.2, 0.42)
  g.add(mast)
  const tipM = glow(hex, 1.5)
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 32, 32), tipM)
  tip.position.set(0.5, 0.42, 0.42)
  tip.castShadow = false
  g.add(tip)
  const rings = []
  for (let i = 0; i < 3; i++) {
    const rm = neon(hex, 0.5)
    const rr = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.004, 16, 64), rm)
    rr.position.copy(tip.position)
    rr.rotation.x = Math.PI / 2
    g.add(rr)
    rings.push({ rr, rm, off: i / 3 })
  }
  anims.push((t) => {
    tipM.emissiveIntensity = 1.2 + 0.6 * Math.sin(t * 3)
    rings.forEach(({ rr, rm, off }) => {
      const cyc = (t * 0.5 + off) % 1
      rr.scale.setScalar(0.4 + cyc * 2.4)
      rr.position.y = tip.position.y + cyc * 0.12
      rm.opacity = 0.55 * (1 - cyc)
    })
  })

  shadowed(g)
  return { group: g, anims }
}

/* ════════ L3 · MODEL — digital twin: wireframe icosahedron over a
   colourful miniature plant with conveyor + scan sweep ════════ */
export function buildModel(hex) {
  const g = new THREE.Group()
  const anims = []

  /* central twin core */
  const icoM = new THREE.MeshBasicMaterial({ color: 0x2dd4a0, wireframe: true, transparent: true, opacity: 0.85 })
  const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13, 3), icoM)
  ico.position.set(0, 0.36, 0)
  g.add(ico)
  const icoCoreM = glow(hex, 1.3)
  const icoCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.055, 1), icoCoreM)
  icoCore.position.copy(ico.position)
  icoCore.castShadow = false
  g.add(icoCore)
  anims.push((t, dt) => {
    ico.rotation.y += dt * 0.4
    ico.rotation.x = 0.2 * Math.sin(t * 0.6)
    icoCoreM.emissiveIntensity = 1.1 + 0.5 * Math.sin(t * 2)
    ico.position.y = 0.36 + 0.02 * Math.sin(t * 1.2)
    icoCore.position.y = ico.position.y
  })

  /* miniature machines — colourful like the reference render */
  const machine = (x, z, accent, ry = 0) => {
    const m = new THREE.Group()
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.17, 0.1, 0.13, 4, 0.012), metal(0x0a0c10, 0.4, 0.7))
    base.position.y = 0.05
    m.add(base)
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.13, 64),
      new THREE.MeshPhysicalMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.55, roughness: 0.45, metalness: 0.1, transmission: 0.9, ior: 1.5, thickness: 0.3, transparent: true, clearcoat: 1 }))
    drum.rotation.z = Math.PI / 2
    drum.position.y = 0.13
    m.add(drum)
    const stack2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.1, 32), metal(0x030405, 0.4, 0.7))
    stack2.position.set(0.06, 0.2, 0.03)
    m.add(stack2)
    m.position.set(x, 0, z)
    m.rotation.y = ry
    g.add(m)
    return drum
  }
  machine(-0.4, -0.34, 0x7b9dff, 0.3)
  machine(0.38, -0.3, 0xff8c26, -0.2)
  machine(-0.42, 0.3, 0x2dd4a0, -0.4)
  const d4 = machine(0.4, 0.32, 0x4fa3e0, 0.5)
  anims.push((t, dt) => { d4.rotation.x += dt * 2.4 })

  /* conveyor with travelling product cubes */
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.03, 0.1), metal(0x030405, 0.5, 0.6))
  belt.position.set(0, 0.05, 0.02)
  belt.rotation.y = 0.12
  g.add(belt)
  const items = []
  for (let i = 0; i < 4; i++) {
    const it = new THREE.Mesh(new RoundedBoxGeometry(0.04, 0.04, 0.04, 3, 0.008), glow(0x2dd4a0, 0.7))
    it.castShadow = false
    g.add(it)
    items.push({ it, off: i / 4 })
  }
  anims.push((t) => {
    items.forEach(({ it, off }) => {
      const cyc = (t * 0.18 + off) % 1
      const x = -0.36 + cyc * 0.72
      it.position.set(x, 0.085, 0.02 + x * 0.12)
    })
  })

  /* glowing energy routes between machines */
  const routes = [
    [[-0.4, -0.34], [0, 0], 0x7b9dff],
    [[0.38, -0.3], [0, 0], 0xff8c26],
    [[-0.42, 0.3], [0, 0], 0x2dd4a0],
    [[0.4, 0.32], [0, 0], 0x4fa3e0],
  ]
  routes.forEach(([[ax, az], [bx, bz], cc]) => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(ax, 0.03, az),
      new THREE.Vector3((ax + bx) / 2, 0.02, (az + bz) / 2),
      new THREE.Vector3(bx, 0.25, bz),
    )
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.005, 12, false), neon(cc, 0.5))
    tube.castShadow = false
    g.add(tube)
  })

  /* scan ring sweep */
  const ringM = neon(hex, 0.5)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.005, 16, 128), ringM)
  ring.rotation.x = Math.PI / 2
  ring.castShadow = false
  g.add(ring)
  anims.push((t) => {
    const cyc = (t * 0.22) % 1
    ring.position.y = 0.02 + cyc * 0.46
    ringM.opacity = 0.55 * (1 - cyc)
  })

  shadowed(g)
  ico.castShadow = false
  return { group: g, anims }
}

/* ════════ L4 · INTELLIGENCE — 3-D neural lattice with a firing wave,
   floating dashboard panels ════════ */
export function buildIntelligence(hex) {
  const g = new THREE.Group()
  const anims = []

  /* lattice: 3 columns × 4 nodes, fully connected col→col */
  const cols = 3, rows = 4
  const nodes = []
  const nodeGeo = new THREE.SphereGeometry(0.03, 32, 32)
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const m = glow(hex, 0.6)
      const n = new THREE.Mesh(nodeGeo, m)
      n.position.set(
        -0.3 + c * 0.3,
        0.14 + r * 0.11 + (c % 2) * 0.02,
        -0.1 + Math.sin(c * 2 + r) * 0.1,
      )
      n.castShadow = false
      g.add(n)
      nodes.push({ n, m, c, r })
    }
  }
  const linePts = []
  for (let c = 0; c < cols - 1; c++)
    for (let a = 0; a < rows; a++)
      for (let b = 0; b < rows; b++) {
        const p1 = nodes[c * rows + a].n.position
        const p2 = nodes[(c + 1) * rows + b].n.position
        linePts.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z)
      }
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3))
  const lines = new THREE.LineSegments(lineGeo,
    new THREE.LineBasicMaterial({ color: hex, transparent: true, opacity: 0.45 }))
  g.add(lines)
  anims.push((t) => {
    /* firing wave sweeps input → output */
    nodes.forEach(({ m, c, r }) => {
      const phase = ((t * 0.9 - c * 0.45 - r * 0.06) % 3 + 3) % 3
      m.emissiveIntensity = 0.8 + (phase < 0.5 ? (1 - phase / 0.5) * 2.4 : 0)
    })
  })

  /* floating dashboards */
  const panel = (kind, x, z, ry, w = 0.34) => {
    const p = new THREE.Mesh(
      new THREE.PlaneGeometry(w, w),
      new THREE.MeshBasicMaterial({ map: chartTexture(kind, '#7b9dff'), transparent: true, side: THREE.DoubleSide }),
    )
    p.position.set(x, 0.34, z)
    p.rotation.y = ry
    p.castShadow = false
    g.add(p)
    return p
  }
  const pa = panel('line', -0.44, 0.18, 0.7)
  const pb = panel('bar', 0.45, 0.14, -0.65)
  anims.push((t) => {
    pa.position.y = 0.34 + 0.018 * Math.sin(t * 1.1)
    pb.position.y = 0.33 + 0.018 * Math.sin(t * 1.3 + 1.4)
  })

  /* soft glow pad under the lattice */
  const padM = new THREE.MeshBasicMaterial({
    color: hex, transparent: true, opacity: 0.16,
    blending: THREE.AdditiveBlending, depthWrite: false })
  const pad = new THREE.Mesh(new THREE.CircleGeometry(0.24, 64), padM)
  pad.rotation.x = -Math.PI / 2
  pad.position.y = 0.012
  pad.castShadow = false
  g.add(pad)
  anims.push((t) => { padM.opacity = 0.12 + 0.07 * Math.sin(t * 1.6) })

  shadowed(g)
  nodes.forEach(({ n }) => { n.castShadow = false })
  return { group: g, anims }
}

/* ════════ L5 · MONETISE — coin stacks, blockchain ring, certificate,
   and the sky beam: reality → value ════════ */
export function buildMonetise(hex) {
  const g = new THREE.Group()
  const anims = []

  const coinA = new THREE.MeshPhysicalMaterial({
    color: 0x2dd4a0, roughness: 0.4, metalness: 0.1, transmission: 0.9, ior: 1.5, thickness: 0.1, transparent: true, clearcoat: 1, emissive: 0x1D9E75, emissiveIntensity: 0.45 })
  const coinB = new THREE.MeshPhysicalMaterial({
    color: 0x1D9E75, roughness: 0.45, metalness: 0.1, transmission: 0.9, ior: 1.5, thickness: 0.1, transparent: true, clearcoat: 1, emissive: 0x0a0c10, emissiveIntensity: 0.35 })

  const stackAt = (x, z, n, glyph) => {
    let top = 0
    for (let i = 0; i < n; i++) {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.026, 64), i % 2 ? coinA : coinB)
      c.position.set(x + (Math.sin(i * 9) * 0.012), 0.013 + i * 0.028, z + Math.cos(i * 7) * 0.01)
      c.rotation.y = i * 0.7
      g.add(c)
      top = c.position.y + 0.013
    }
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.09, 64),
      new THREE.MeshBasicMaterial({ map: coinTexture(glyph), transparent: true }))
    face.rotation.x = -Math.PI / 2
    face.position.set(x, top + 0.002, z)
    g.add(face)
  }
  stackAt(-0.36, 0.18, 6, '₹')
  stackAt(-0.14, 0.34, 4, '$')
  stackAt(-0.42, -0.08, 3, '€')

  /* blockchain — linked ledger cubes orbiting the beam */
  const chain = new THREE.Group()
  chain.position.set(0.3, 0.22, -0.25)
  g.add(chain)
  const cubes = []
  const R = 0.16
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const cube = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.06, 0.06, 3, 0.01),
      new THREE.MeshPhysicalMaterial({ color: 0x030405, emissive: hex, emissiveIntensity: 0.7, roughness: 0.45, metalness: 0.1, transmission: 0.9, ior: 1.5, thickness: 0.2, transparent: true, clearcoat: 1 }))
    cube.position.set(Math.cos(a) * R, Math.sin(i * 2) * 0.03, Math.sin(a) * R)
    chain.add(cube)
    cubes.push(cube)
  }
  const chainLinePts = []
  for (let i = 0; i < 5; i++) {
    const p1 = cubes[i].position, p2 = cubes[(i + 1) % 5].position
    chainLinePts.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z)
  }
  const chainGeo = new THREE.BufferGeometry()
  chainGeo.setAttribute('position', new THREE.Float32BufferAttribute(chainLinePts, 3))
  chain.add(new THREE.LineSegments(chainGeo,
    new THREE.LineBasicMaterial({ color: hex, transparent: true, opacity: 0.6 })))
  anims.push((t, dt) => {
    chain.rotation.y += dt * 0.5
    cubes.forEach((c, i) => { c.rotation.y += dt * (0.4 + i * 0.1) })
  })

  /* MRV certificate chit */
  const cert = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.18),
    new THREE.MeshBasicMaterial({ map: certTexture(), transparent: true, side: THREE.DoubleSide }))
  cert.position.set(0.42, 0.2, 0.3)
  cert.rotation.y = -0.7
  cert.castShadow = false
  g.add(cert)
  anims.push((t) => {
    cert.position.y = 0.2 + 0.015 * Math.sin(t * 1.2 + 2)
    cert.rotation.y = -0.7 + 0.08 * Math.sin(t * 0.8)
  })

  /* the sky beam — value leaving the stack */
  const beamM = new THREE.MeshBasicMaterial({
    color: hex, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false })
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.11, 1.7, 64, 1, true), beamM)
  beam.position.y = 0.9
  g.add(beam)
  const beamCoreM = new THREE.MeshBasicMaterial({
    color: 0x2dd4a0, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })
  const beamCore = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, 1.7, 64, 1, true), beamCoreM)
  beamCore.position.y = 0.9
  g.add(beamCore)
  const padM = glow(hex, 1.4)
  const padRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.014, 32, 128), padM)
  padRing.rotation.x = Math.PI / 2
  padRing.position.y = 0.03
  g.add(padRing)
  anims.push((t) => {
    beamM.opacity = 0.24 + 0.12 * Math.sin(t * 1.7)
    beamCoreM.opacity = 0.4 + 0.18 * Math.sin(t * 2.3 + 1)
    padM.emissiveIntensity = 1.2 + 0.6 * Math.sin(t * 1.7)
  })

  /* value motes rising inside the beam */
  const N = 30
  const mgeo = new THREE.BufferGeometry()
  const mpos = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2, rr = Math.random() * 0.07
    mpos[i * 3] = Math.cos(a) * rr
    mpos[i * 3 + 1] = Math.random() * 1.6
    mpos[i * 3 + 2] = Math.sin(a) * rr
  }
  mgeo.setAttribute('position', new THREE.BufferAttribute(mpos, 3))
  const motes = new THREE.Points(mgeo, new THREE.PointsMaterial({
    size: 0.02, color: 0x2dd4a0, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false }))
  g.add(motes)
  anims.push((t, dt) => {
    const a = mgeo.attributes.position.array
    for (let i = 0; i < N; i++) {
      a[i * 3 + 1] += dt * (0.25 + (i % 5) * 0.04)
      if (a[i * 3 + 1] > 1.7) a[i * 3 + 1] = 0.05
    }
    mgeo.attributes.position.needsUpdate = true
  })

  shadowed(g)
  beam.castShadow = beamCore.castShadow = false
  return { group: g, anims }
}
