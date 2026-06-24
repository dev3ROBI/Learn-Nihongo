import { useEffect, useState, useCallback } from 'react'
import type { IHiragana, IKatakana, IKanji, QuizItem } from '../types'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { speak } from '../utils/speak'
import { playClick } from '../utils/sound'
import Loader from '../components/Loader'

type Category = 'hiragana' | 'katakana' | 'kanji'

export default function Flashcard() {
  const [category, setCategory] = useState<Category>('hiragana')
  const [data, setData] = useState<QuizItem[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([loadHiragana(), loadKatakana(), loadKanji()]).then(([h, k, kj]) => {
      const all = category === 'hiragana' ? h : category === 'katakana' ? k : kj
      setData(all as QuizItem[])
      setIndex(0)
      setFlipped(false)
      setLoading(false)
    })
  }, [category])

  const handlePrev = useCallback(() => {
    if (index > 0) { setIndex(prev => prev - 1); setFlipped(false); playClick() }
  }, [index])

  const handleNext = useCallback(() => {
    if (index < data.length - 1) { setIndex(prev => prev + 1); setFlipped(false); playClick() }
  }, [index, data.length])

  if (loading) return <Loader text="ফ্ল্যাশকার্ড লোড হচ্ছে..." />

  const current = data[index] as any
  if (!current) return <div className="text-center text-text-muted py-12">কোনো ডেটা নেই</div>

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-4">
        <i className="fa-solid fa-layer-group text-primary mr-2" />ফ্ল্যাশকার্ড
      </h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['hiragana', 'katakana', 'kanji'] as Category[]).map(c => (
          <button
            key={c}
            onClick={() => { setCategory(c); playClick() }}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              category === c
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-surface text-text-muted hover:bg-surface-hover border border-border'
            }`}
          >
            {c === 'hiragana' ? 'হিরাগানা' : c === 'katakana' ? 'কাটাকানা' : 'কানজি'}
          </button>
        ))}
      </div>

      <div className="max-w-md mx-auto">
        <div className="w-full bg-surface-alt rounded-full h-1.5 mb-4">
          <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${((index + 1) / data.length) * 100}%` }} />
        </div>

        <div
          onClick={() => { setFlipped(!flipped); playClick() }}
          className="card p-8 sm:p-12 text-center min-h-[280px] sm:min-h-[320px] flex flex-col items-center justify-center cursor-pointer select-none hover:ring-2 hover:ring-primary/20 transition-all"
        >
          {flipped ? (
            <>
              <div className="text-xs text-text-muted/50 uppercase tracking-wider mb-2">অর্থ</div>
              <div className="text-xl sm:text-2xl text-text-main mb-2 font-semibold">{current.bangla}</div>
              <div className="text-base sm:text-lg text-text-muted">{current.romaji || current.meaning}</div>
              {current.onReading && (
                <div className="flex gap-3 mt-3 text-xs text-text-muted/60">
                  <span>音: {current.onReading}</span>
                  {current.kunReading && <span>訓: {current.kunReading}</span>}
                </div>
              )}
              {current.example && (
                <div className="mt-4 pt-4 border-t border-border w-full text-sm">
                  <p className="text-base text-text-main">{current.example}</p>
                  {current.meaning && <p className="mt-1 text-text-muted">{current.meaning}</p>}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-xs text-text-muted/50 uppercase tracking-wider mb-2">অক্ষর</div>
              <div className="text-7xl sm:text-8xl">{current.char}</div>
            </>
          )}
        </div>
        <p className="text-center text-text-muted/40 text-xs mt-2">
          <i className="fa-solid fa-hand-pointer mr-1" />কার্ডে ক্লিক করুন উল্টাতে
        </p>

        <div className="flex justify-center gap-3 mt-4">
          <button onClick={handlePrev} disabled={index === 0} className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed">
            <i className="fa-solid fa-chevron-left mr-1" />পূর্ববর্তী
          </button>
          <button onClick={() => speak(current.char)} className="btn-primary px-4" aria-label="Speak">
            <i className="fa-solid fa-volume-high" />
          </button>
          <button onClick={handleNext} disabled={index === data.length - 1} className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed">
            পরবর্তি<i className="fa-solid fa-chevron-right ml-1" />
          </button>
        </div>

        <div className="text-center mt-3 text-text-muted text-sm">
          <i className="fa-regular fa-bookmark mr-1" /> {index + 1} / {data.length}
        </div>
      </div>
    </div>
  )
}
