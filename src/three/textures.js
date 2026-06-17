import * as THREE from 'three'

const cv = (s = 512) => {
  const c = document.createElement('canvas')
  c.width = c.height = s
  return [c, c.getContext('2d')]
}
const tex = (c) => {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 16
  t.generateMipmaps = true
  t.minFilter = THREE.LinearMipmapLinearFilter
  return t
}
/* deterministic prng so the art never flickers between mounts */
const rng = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/* PCB traces — right-angle runs with via dots, used emissively on L2 */
export function circuitTexture(color = '#1aed6e') {
  const [c, x] = cv(1024)
  x.fillStyle = '#050f0a'
  x.fillRect(0, 0, 1024, 1024)
  const r = rng(7)
  x.strokeStyle = color
  x.fillStyle = color
  x.lineWidth = 3
  x.globalAlpha = 0.85
  for (let i = 0; i < 46; i++) {
    let px = 40 + r() * 944, py = 40 + r() * 944
    x.beginPath()
    x.moveTo(px, py)
    x.beginPath(); x.arc(px, py, 7, 0, 7); x.fill()
    x.beginPath(); x.moveTo(px, py)
    const seg = 2 + ((r() * 4) | 0)
    for (let s = 0; s < seg; s++) {
      const L = 60 + r() * 200
      if ((s + i) % 2 === 0) px = Math.max(24, Math.min(1000, px + (r() > 0.5 ? L : -L)))
      else py = Math.max(24, Math.min(1000, py + (r() > 0.5 ? L : -L)))
      x.lineTo(px, py)
    }
    x.stroke()
    x.beginPath(); x.arc(px, py, 7, 0, 7); x.fill()
  }
  x.globalAlpha = 0.5
  x.lineWidth = 1.5
  for (let p = 64; p < 1024; p += 64) {
    x.beginPath(); x.moveTo(p, 0); x.lineTo(p, 18); x.stroke()
    x.beginPath(); x.moveTo(p, 1006); x.lineTo(p, 1024); x.stroke()
  }
  x.globalAlpha = 1
  return tex(c)
}

/* blueprint floor grid for L3 */
export function blueprintTexture(color = '#4fa3e0') {
  const [c, x] = cv(1024)
  x.fillStyle = '#0d2818'
  x.fillRect(0, 0, 1024, 1024)
  x.strokeStyle = color
  x.globalAlpha = 0.22
  x.lineWidth = 1.5
  for (let p = 0; p <= 1024; p += 51.2) {
    x.beginPath(); x.moveTo(p, 0); x.lineTo(p, 1024); x.stroke()
    x.beginPath(); x.moveTo(0, p); x.lineTo(1024, p); x.stroke()
  }
  x.globalAlpha = 0.5
  x.lineWidth = 2.5
  x.strokeRect(102, 102, 820, 820)
  x.globalAlpha = 1
  return tex(c)
}

/* radial “value flows outward” arrows for L5 deck */
export function radialTexture(color = '#2dd4a0') {
  const [c, x] = cv(1024)
  x.fillStyle = '#050f0a'
  x.fillRect(0, 0, 1024, 1024)
  x.strokeStyle = color
  x.fillStyle = color
  const cx = 512, cy = 512
  x.globalAlpha = 0.55
  x.lineWidth = 3
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 + Math.PI / 8
    const x1 = cx + Math.cos(a) * 170, y1 = cy + Math.sin(a) * 170
    const x2 = cx + Math.cos(a) * 400, y2 = cy + Math.sin(a) * 400
    x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke()
    const ah = 16
    x.beginPath()
    x.moveTo(x2, y2)
    x.lineTo(x2 - Math.cos(a - 0.35) * ah, y2 - Math.sin(a - 0.35) * ah)
    x.lineTo(x2 - Math.cos(a + 0.35) * ah, y2 - Math.sin(a + 0.35) * ah)
    x.closePath(); x.fill()
  }
  x.lineWidth = 4
  ;[150, 460].forEach((rr) => { x.beginPath(); x.arc(cx, cy, rr, 0, 7); x.stroke() })
  x.globalAlpha = 1
  return tex(c)
}

/* floating dashboard panels for L4 — line forecast + bar chart */
export function chartTexture(kind, accent = '#8f7bff') {
  const [c, x] = cv(512)
  x.fillStyle = 'rgba(5,15,10,.96)'
  x.beginPath()
  x.roundRect(0, 0, 512, 512, 36)
  x.fill()
  x.strokeStyle = 'rgba(45,212,160,.16)'
  x.lineWidth = 3
  x.beginPath(); x.roundRect(6, 6, 500, 500, 32); x.stroke()
  x.strokeStyle = 'rgba(45,212,160,.08)'
  x.lineWidth = 2
  for (let p = 96; p < 480; p += 76) {
    x.beginPath(); x.moveTo(48, p); x.lineTo(464, p); x.stroke()
  }
  x.fillStyle = 'rgba(232,245,238,.55)'
  x.font = '600 26px JetBrains Mono, monospace'
  if (kind === 'line') {
    x.fillText('LOAD FORECAST · 15-MIN', 48, 64)
    const pts = [430, 360, 392, 300, 330, 240, 268, 180, 150]
    x.strokeStyle = accent
    x.lineWidth = 7
    x.lineJoin = 'round'
    x.beginPath()
    pts.forEach((py, i) => { const px = 48 + (i * 416) / 8; i ? x.lineTo(px, py) : x.moveTo(px, py) })
    x.stroke()
    x.setLineDash([12, 10])
    x.strokeStyle = 'rgba(255,140,80,.9)'
    x.lineWidth = 4
    x.beginPath(); x.moveTo(48, 210); x.lineTo(464, 210); x.stroke()
    x.setLineDash([])
    x.fillStyle = accent
    pts.forEach((py, i) => {
      const px = 48 + (i * 416) / 8
      x.beginPath(); x.arc(px, py, 8, 0, 7); x.fill()
    })
  } else {
    x.fillText('SAVINGS · MoM', 48, 64)
    const hs = [70, 110, 96, 150, 190, 240, 286]
    hs.forEach((h, i) => {
      const grad = x.createLinearGradient(0, 470 - h, 0, 470)
      grad.addColorStop(0, accent)
      grad.addColorStop(1, 'rgba(45,212,160,.25)')
      x.fillStyle = grad
      x.beginPath()
      x.roundRect(56 + i * 58, 470 - h, 40, h, 8)
      x.fill()
    })
    x.strokeStyle = 'rgba(232,245,238,.5)'
    x.lineWidth = 5
    x.beginPath(); x.moveTo(70, 380); x.lineTo(420, 200); x.stroke()
    x.beginPath(); x.moveTo(420, 200); x.lineTo(376, 196); x.moveTo(420, 200); x.lineTo(404, 240); x.stroke()
  }
  return tex(c)
}

/* coin face */
export function coinTexture(glyph = '₹') {
  const [c, x] = cv(256)
  x.strokeStyle = '#1D9E75'
  x.lineWidth = 10
  x.beginPath(); x.arc(128, 128, 106, 0, 7); x.stroke()
  x.setLineDash([4, 7])
  x.lineWidth = 4
  x.beginPath(); x.arc(128, 128, 88, 0, 7); x.stroke()
  x.setLineDash([])
  x.fillStyle = '#1D9E75'
  x.font = '600 130px Georgia, serif'
  x.textAlign = 'center'
  x.textBaseline = 'middle'
  x.fillText(glyph, 128, 138)
  return tex(c)
}

/* MRV certificate chit for L5 */
export function certTexture() {
  const [c, x] = cv(256)
  x.fillStyle = '#0d2818'
  x.beginPath(); x.roundRect(0, 0, 256, 256, 22); x.fill()
  x.strokeStyle = '#2dd4a0'
  x.lineWidth = 6
  x.beginPath(); x.roundRect(10, 10, 236, 236, 16); x.stroke()
  x.strokeStyle = 'rgba(107,158,130,.45)'
  x.lineWidth = 7
  ;[64, 96, 128].forEach((y) => {
    x.beginPath(); x.moveTo(36, y); x.lineTo(220, y); x.stroke()
  })
  x.strokeStyle = '#2dd4a0'
  x.lineWidth = 14
  x.lineCap = 'round'
  x.beginPath(); x.moveTo(84, 184); x.lineTo(116, 212); x.lineTo(180, 150); x.stroke()
  return tex(c)
}
