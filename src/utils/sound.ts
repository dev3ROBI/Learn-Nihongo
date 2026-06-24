let audioCtx: AudioContext | null = null
let muted = localStorage.getItem('sound_muted') === 'true'

export function isMuted() { return muted }

export function toggleMute() {
  muted = !muted
  localStorage.setItem('sound_muted', String(muted))
}

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

export function playCorrect() {
  if (muted) return
  const ctx = getCtx()
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.connect(g)
  g.connect(ctx.destination)
  o.type = 'sine'
  o.frequency.setValueAtTime(523, ctx.currentTime)
  o.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
  o.frequency.setValueAtTime(784, ctx.currentTime + 0.2)
  g.gain.setValueAtTime(0.3, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
  o.start(ctx.currentTime)
  o.stop(ctx.currentTime + 0.4)
}

export function playWrong() {
  if (muted) return
  const ctx = getCtx()
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.connect(g)
  g.connect(ctx.destination)
  o.type = 'sawtooth'
  o.frequency.setValueAtTime(300, ctx.currentTime)
  o.frequency.setValueAtTime(200, ctx.currentTime + 0.15)
  g.gain.setValueAtTime(0.2, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
  o.start(ctx.currentTime)
  o.stop(ctx.currentTime + 0.3)
}

export function playClick() {
  if (muted) return
  const ctx = getCtx()
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.connect(g)
  g.connect(ctx.destination)
  o.type = 'sine'
  o.frequency.setValueAtTime(800, ctx.currentTime)
  g.gain.setValueAtTime(0.15, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
  o.start(ctx.currentTime)
  o.stop(ctx.currentTime + 0.08)
}

export function playComplete() {
  if (muted) return
  const ctx = getCtx()
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g)
    g.connect(ctx.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)
    g.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3)
    o.start(ctx.currentTime + i * 0.12)
    o.stop(ctx.currentTime + i * 0.12 + 0.3)
  })
}
