import { useEffect, useState, useRef } from 'react'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { speak } from '../utils/speak'
import type { QuizItem } from '../types'
import Loader from '../components/Loader'

type Category = 'hiragana' | 'katakana' | 'kanji'

const STROKE_COLORS = [
  '#DC2626', '#2563EB', '#16A34A', '#D97706',
  '#7C3AED', '#DB2777', '#0891B2', '#65A30D',
]

export default function WritingPractice() {
  const [category, setCategory] = useState<Category>('hiragana')
  const [data, setData] = useState<QuizItem[]>([])
  const [current, setCurrent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokeCount, setStrokeCount] = useState(0)
  const [undoStack, setUndoStack] = useState<ImageData[]>([])
  const [showGuide, setShowGuide] = useState(true)
  const [score, setScore] = useState<number | null>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([loadHiragana(), loadKatakana(), loadKanji()]).then(([h, k, kj]) => {
      const all = category === 'hiragana' ? h : category === 'katakana' ? k : kj
      setData(all as QuizItem[])
      pickRandom(all as QuizItem[])
      setLoading(false)
    })
  }, [category])

  function pickRandom(items: QuizItem[]) {
    const idx = Math.floor(Math.random() * items.length)
    setCurrent(items[idx])
    setStrokeCount(0)
    setUndoStack([])
    setScore(null)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(2, 2)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#DC2626'
    ctx.lineWidth = 4
    drawGrid(ctx, canvas.offsetWidth, canvas.offsetHeight)
    setScore(null)
  }, [current])

  function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = '#47556940'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.strokeRect(1, 1, w - 2, h - 2)
    ctx.beginPath()
    ctx.moveTo(w / 2, 0)
    ctx.lineTo(w / 2, h)
    ctx.moveTo(0, h / 2)
    ctx.lineTo(w, h / 2)
    ctx.stroke()
    ctx.setLineDash([])
  }

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top
    return { x: Math.max(0, Math.min(x, rect.width)), y: Math.max(0, Math.min(y, rect.height)) }
  }

  function startDrawing(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const pos = getPos(e)
    setIsDrawing(true)
    setStrokeCount(prev => prev + 1)
    setUndoStack(prev => [...prev.slice(-20), ctx.getImageData(0, 0, canvas.width, canvas.height)])
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const pos = getPos(e)
    const colorIdx = (strokeCount - 1) % STROKE_COLORS.length
    ctx.strokeStyle = STROKE_COLORS[colorIdx]
    ctx.lineWidth = 4
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  function stopDrawing() {
    setIsDrawing(false)
  }

  function undo() {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    if (undoStack.length > 0) {
      const prev = undoStack[undoStack.length - 1]
      ctx.putImageData(prev, 0, 0)
      setUndoStack(prev => prev.slice(0, -1))
      setStrokeCount(prev => Math.max(0, prev - 1))
    } else {
      clearCanvas()
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    drawGrid(ctx, canvas.offsetWidth, canvas.offsetHeight)
    setUndoStack([])
    setStrokeCount(0)
    setScore(null)
  }

  function checkDrawing() {
    const canvas = canvasRef.current
    if (!canvas || !current) return
    setChecking(true)

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    const refCanvas = document.createElement('canvas')
    refCanvas.width = w * 2
    refCanvas.height = h * 2
    const refCtx = refCanvas.getContext('2d')
    if (!refCtx) { setChecking(false); return }
    refCtx.scale(2, 2)
    refCtx.fillStyle = '#FFFFFF'
    refCtx.fillRect(0, 0, w, h)
    const fontSize = Math.min(w, h) * 0.65
    refCtx.fillStyle = '#000000'
    refCtx.font = `${fontSize}px "Noto Sans JP", "Inter", sans-serif`
    refCtx.textAlign = 'center'
    refCtx.textBaseline = 'middle'
    refCtx.fillText(current.char, w / 2, h / 2 + 2)

    const userData = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data
    const refData = refCtx.getImageData(0, 0, refCanvas.width, refCanvas.height).data

    let userPixels = 0
    let refPixels = 0
    let matchPixels = 0

    for (let i = 0; i < userData.length; i += 4) {
      const userBright = (userData[i] + userData[i + 1] + userData[i + 2]) / 3
      const refBright = (refData[i] + refData[i + 1] + refData[i + 2]) / 3
      const isUserDark = userBright < 128
      const isRefDark = refBright < 128

      if (isUserDark) userPixels++
      if (isRefDark) refPixels++
      if (isUserDark && isRefDark) matchPixels++
    }

    refCanvas.remove()
    const union = userPixels + refPixels - matchPixels
    const pct = union > 0 ? Math.round((matchPixels / union) * 100) : 0
    setScore(Math.min(100, Math.max(0, pct)))
    setChecking(false)
  }

  function nextChar() { pickRandom(data) }

  function getScoreColor(s: number): string {
    if (s >= 80) return 'text-success'
    if (s >= 60) return 'text-primary'
    if (s >= 40) return 'text-yellow-500'
    return 'text-error'
  }

  function getScoreLabel(s: number): string {
    if (s >= 80) return 'চমৎকার! 🎉'
    if (s >= 60) return 'ভালো! 👍'
    if (s >= 40) return 'চলতে থাকে 💪'
    return 'আরও প্র্যাকটিস করুন 📝'
  }

  if (loading) return <Loader text="লোড হচ্ছে..." />
  if (!current) return <div className="text-center text-text-muted py-12">কোনো ডেটা নেই</div>

  return (
    <div className="animate-fadeIn max-w-md mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-4">
        <i className="fa-solid fa-pen-fine text-primary mr-2" />রাইটিং প্র্যাকটিস
      </h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['hiragana', 'katakana', 'kanji'] as Category[]).map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              category === c ? 'bg-primary text-white shadow-md' : 'bg-surface text-text-muted border border-border hover:bg-surface-hover'
            }`}>
            {c === 'hiragana' ? 'হিরাগানা' : c === 'katakana' ? 'কাটাকানা' : 'কানজি'}
          </button>
        ))}
      </div>

      <div className="text-center mb-4">
        <div className="text-5xl sm:text-6xl mb-1">{current.char}</div>
        <div className="text-text-muted text-sm">{current.bangla}</div>
        <div className="text-text-muted/60 text-xs">{current.romaji || current.meaning}</div>
      </div>

      <div className="flex justify-center gap-3 mb-4">
        <button onClick={() => speak(current.char)} className="btn-primary px-4 py-2 text-sm">
          <i className="fa-solid fa-volume-high mr-1" />উচ্চারণ
        </button>
        <button onClick={() => setShowGuide(!showGuide)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
          showGuide ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'
        }`}>
          <i className="fa-regular fa-eye mr-1" />গাইড
        </button>
      </div>

      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          className="w-full aspect-square bg-surface rounded-2xl border-2 border-border touch-none cursor-crosshair"
          style={{ height: '300px' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {showGuide && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[8rem] sm:text-[10rem] font-bold opacity-[0.06] select-none text-text-main">
              {current.char}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-center mb-3">
        <button onClick={undo} className="btn-ghost text-sm" disabled={undoStack.length === 0}>
          <i className="fa-solid fa-rotate-left mr-1" />আনডু
        </button>
        <button onClick={clearCanvas} className="btn-ghost text-sm">
          <i className="fa-solid fa-eraser mr-1" />মুছুন
        </button>
        <button onClick={checkDrawing} disabled={checking || strokeCount === 0} className="btn-primary text-sm disabled:opacity-40">
          <i className="fa-solid fa-check mr-1" />{checking ? 'চেক হচ্ছে...' : 'চেক করুন'}
        </button>
        <button onClick={nextChar} className="btn-ghost text-sm">
          <i className="fa-solid fa-arrow-right mr-1" />পরবর্তী
        </button>
      </div>

      {score !== null && (
        <div className="animate-pop text-center mb-3">
          <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl border-2 backdrop-blur-sm ${
            score >= 80
              ? 'bg-success-bg/80 border-success/30'
              : score >= 60
              ? 'bg-primary/10 border-primary/20'
              : score >= 40
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400/30'
              : 'bg-error-bg/80 border-error/30'
          }`}>
            <div className="text-center">
              <div className={`text-2xl font-extrabold ${getScoreColor(score)}`}>{score}%</div>
              <div className={`text-xs font-medium mt-0.5 ${getScoreColor(score)}`}>{getScoreLabel(score)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-text-muted">
        <i className="fa-solid fa-paintbrush mr-1" />স্ট্রোক: {strokeCount}
      </div>
    </div>
  )
}
