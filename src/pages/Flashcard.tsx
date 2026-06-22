import { useEffect, useState } from 'react'
import type { IHiragana, IKatakana, IKanji, QuizItem } from '../types'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { speak } from '../utils/speak'

type Category = 'hiragana' | 'katakana' | 'kanji'

export default function Flashcard() {
  const [category, setCategory] = useState<Category>('hiragana')
  const [data, setData] = useState<QuizItem[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    Promise.all([loadHiragana(), loadKatakana(), loadKanji()]).then(([h, k, kj]) => {
      const all = category === 'hiragana' ? h : category === 'katakana' ? k : kj
      setData(all as QuizItem[])
      setIndex(0)
      setFlipped(false)
    })
  }, [category])

  const current = data[index] as any
  if (!current) return <div className="text-center text-text-muted py-12">লোড হচ্ছে...</div>

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-6">ফ্ল্যাশকার্ড 🃏</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['hiragana', 'katakana', 'kanji'] as Category[]).map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition ${
              category === c
                ? 'bg-primary text-white'
                : 'bg-surface text-text-muted hover:bg-surface-hover border border-border'
            }`}
          >
            {c === 'hiragana' ? 'হিরাগানা' : c === 'katakana' ? 'কাটাকানা' : 'কানজি'}
          </button>
        ))}
      </div>

      <div className="max-w-md mx-auto">
        <div
          onClick={() => setFlipped(!flipped)}
          className="card p-8 sm:p-12 text-center min-h-[280px] sm:min-h-[320px] flex flex-col items-center justify-center cursor-pointer select-none"
        >
          {flipped ? (
            <>
              <div className="text-xl sm:text-2xl text-text-main mb-2 font-semibold">{current.bangla}</div>
              <div className="text-base sm:text-lg text-text-muted">{current.romaji || current.meaning}</div>
              {current.example && (
                <div className="mt-4 text-sm text-text-muted/70">
                  <p className="text-base text-text-main">{current.example}</p>
                  {current.meaning && <p className="mt-1">{current.meaning}</p>}
                </div>
              )}
            </>
          ) : (
            <div className="text-7xl sm:text-8xl">{current.char}</div>
          )}
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => { setIndex(prev => Math.max(0, prev - 1)); setFlipped(false) }}
            disabled={index === 0}
            className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← পূর্ববর্তী
          </button>
          <button
            onClick={() => speak(current.char)}
            className="btn-primary px-4"
            aria-label="Speak"
          >
            🔊
          </button>
          <button
            onClick={() => { setIndex(prev => Math.min(data.length - 1, prev + 1)); setFlipped(false) }}
            disabled={index === data.length - 1}
            className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
          >
            পরবর্তী →
          </button>
        </div>

        <div className="text-center mt-4 text-text-muted text-sm">
          {index + 1} / {data.length}
        </div>
      </div>
    </div>
  )
}
