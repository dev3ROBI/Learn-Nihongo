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
      setData(all)
      setIndex(0)
      setFlipped(false)
    })
  }, [category])

  const current = data[index] as any
  if (!current) return <div className="text-center text-secondary/60 py-12">লোড হচ্ছে...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary mb-6">ফ্ল্যাশকার্ড 🃏</h1>

      <div className="flex gap-2 mb-6">
        {(['hiragana', 'katakana', 'kanji'] as Category[]).map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-lg text-sm ${category === c ? 'bg-primary text-secondary' : 'bg-white/10 text-secondary/70'}`}
          >
            {c === 'hiragana' ? 'হিরাগানা' : c === 'katakana' ? 'কাটাকানা' : 'কানজি'}
          </button>
        ))}
      </div>

      <div className="max-w-md mx-auto">
        <div
          onClick={() => setFlipped(!flipped)}
          className="bg-white/10 backdrop-blur rounded-2xl p-12 text-center min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:bg-white/15 transition border border-white/20"
        >
          {flipped ? (
            <>
              <div className="text-2xl text-secondary/80 mb-2">{current.bangla}</div>
              <div className="text-lg text-secondary/60">{current.romaji || current.meaning}</div>
              {current.example && (
                <div className="mt-4 text-sm text-secondary/50">
                  <p>{current.example}</p>
                  {current.meaning && <p>{current.meaning}</p>}
                </div>
              )}
            </>
          ) : (
            <div className="text-8xl">{current.char}</div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => { setIndex(prev => Math.max(0, prev - 1)); setFlipped(false) }}
            disabled={index === 0}
            className="bg-white/10 text-secondary px-6 py-3 rounded-xl hover:bg-white/20 transition disabled:opacity-30"
          >
            ← পূর্ববর্তী
          </button>
          <button
            onClick={() => speak(current.char)}
            className="bg-primary text-secondary px-4 py-3 rounded-xl hover:bg-primary/80 transition"
          >
            🔊
          </button>
          <button
            onClick={() => { setIndex(prev => Math.min(data.length - 1, prev + 1)); setFlipped(false) }}
            disabled={index === data.length - 1}
            className="bg-white/10 text-secondary px-6 py-3 rounded-xl hover:bg-white/20 transition disabled:opacity-30"
          >
            পরবর্তী →
          </button>
        </div>

        <div className="text-center mt-4 text-secondary/60">
          {index + 1} / {data.length}
        </div>
      </div>
    </div>
  )
}
