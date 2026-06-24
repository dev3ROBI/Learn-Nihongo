import { useEffect, useState, useCallback } from 'react'
import type { IHiragana, IKatakana, IKanji, QuizItem } from '../types'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { speak } from '../utils/speak'
import { playClick, playCorrect, playWrong } from '../utils/sound'
import { getDueSRSItems, updateSRSItem, getSRSItems } from '../utils/progressStore'
import Loader from '../components/Loader'

type Category = 'hiragana' | 'katakana' | 'kanji'

export default function SRSFlashcard() {
  const [category, setCategory] = useState<Category>('hiragana')
  const [data, setData] = useState<QuizItem[]>([])
  const [queue, setQueue] = useState<QuizItem[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'review' | 'learn'>('learn')

  useEffect(() => {
    setLoading(true)
    Promise.all([loadHiragana(), loadKatakana(), loadKanji()]).then(([h, k, kj]) => {
      const all = category === 'hiragana' ? h : category === 'katakana' ? k : kj
      setData(all as QuizItem[])
      setLoading(false)
    })
  }, [category])

  const buildQueue = useCallback(() => {
    const due = getDueSRSItems().filter(s => s.type === category)
    if (due.length > 0 && mode === 'review') {
      const items = due.map(d => data.find((item: any) => item.char === d.char)).filter(Boolean) as QuizItem[]
      if (items.length > 0) { setQueue(items); setIndex(0); setFlipped(false); return }
    }
    setQueue(data)
    setIndex(Math.floor(Math.random() * data.length))
    setFlipped(false)
  }, [data, category, mode])

  useEffect(() => { if (data.length > 0) buildQueue() }, [data, buildQueue])

  const current = queue[index] as any
  if (!current) return <div className="text-center text-text-muted py-12">কোনো ডেটা নেই</div>

  const totalSRS = getSRSItems().filter(s => s.type === category).length

  const handleRating = (correct: boolean) => {
    playClick()
    updateSRSItem(current.char, category, correct)
    if (correct) playCorrect(); else playWrong()
    const next = index + 1
    if (next < queue.length) {
      setIndex(next)
      setFlipped(false)
    } else {
      setQueue(prev => {
        if (prev.length <= 1) return data
        return prev
      })
      setIndex(Math.floor(Math.random() * data.length))
      setFlipped(false)
    }
  }

  return (
    <div className="animate-fadeIn max-w-md mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-4">
        <i className="fa-solid fa-brain text-primary mr-2" />SRS ফ্ল্যাশকার্ড
      </h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['hiragana', 'katakana', 'kanji'] as Category[]).map(c => (
          <button key={c} onClick={() => { setCategory(c); playClick() }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              category === c ? 'bg-primary text-white shadow-md' : 'bg-surface text-text-muted border border-border hover:bg-surface-hover'
            }`}>
            {c === 'hiragana' ? 'হিরাগানা' : c === 'katakana' ? 'কাটাকানা' : 'কানজি'}
          </button>
        ))}
        <button onClick={() => { setMode(m => m === 'review' ? 'learn' : 'review'); playClick() }}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            mode === 'review' ? 'bg-primary text-white shadow-md' : 'bg-surface text-text-muted border border-border hover:bg-surface-hover'
          }`}>
          {mode === 'review' ? 'রিভিউ মোড' : 'লার্ন মোড'}
        </button>
      </div>

      {mode === 'review' && (
        <div className="text-center text-xs text-text-muted mb-4">
          <i className="fa-solid fa-clock mr-1" />রিভিউর অপেক্ষায়: {getDueSRSItems().filter(s => s.type === category).length}টি
          (মোট SRS: {totalSRS})
        </div>
      )}

      <div onClick={() => { if (!flipped) { setFlipped(true); playClick() } }}
        className={`card p-8 sm:p-12 text-center min-h-[280px] sm:min-h-[320px] flex flex-col items-center justify-center cursor-pointer select-none transition-all ${
          flipped ? '' : 'hover:ring-2 hover:ring-primary/20'
        }`}>
        {flipped ? (
          <>
            <div className="text-xs text-text-muted/50 uppercase tracking-wider mb-2">বাংলা অর্থ</div>
            <div className="text-xl sm:text-2xl text-text-main mb-2 font-semibold">{current.bangla}</div>
            <div className="text-text-muted text-sm">{current.romaji || current.meaning}</div>
            {current.onReading && (
              <div className="flex gap-3 mt-3 text-xs text-text-muted/60">
                <span>音: {current.onReading}</span>
                {current.kunReading && <span>訓: {current.kunReading}</span>}
              </div>
            )}
            <div className="flex gap-3 mt-6 w-full max-w-xs">
              <button onClick={(e) => { e.stopPropagation(); handleRating(false) }}
                className="flex-1 bg-error-bg text-error border border-error/30 rounded-xl py-2.5 text-sm font-semibold hover:scale-[1.03] transition">
                <i className="fa-solid fa-xmark mr-1" />ভুল
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleRating(true) }}
                className="flex-1 bg-success-bg text-success border border-success/30 rounded-xl py-2.5 text-sm font-semibold hover:scale-[1.03] transition">
                <i className="fa-solid fa-check mr-1" />ঠিক
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-text-muted/50 uppercase tracking-wider mb-2">অক্ষর/কানজি</div>
            <div className="text-7xl sm:text-8xl mb-4">{current.char}</div>
            <p className="text-text-muted/40 text-xs flex items-center gap-1">
              <i className="fa-solid fa-hand-pointer" />ক্লিক করুন উত্তর দেখতে
            </p>
          </>
        )}
      </div>

      <div className="flex justify-center gap-3 mt-4">
        <button onClick={() => speak(current.char)} className="btn-primary px-4">
          <i className="fa-solid fa-volume-high" />
        </button>
      </div>

      <div className="text-center mt-3 text-text-muted text-xs">
        <i className="fa-regular fa-bookmark mr-1" />মোট: {queue.length > 0 ? `${index + 1}/${queue.length}` : `${index + 1}/${data.length}`}
      </div>
    </div>
  )
}
