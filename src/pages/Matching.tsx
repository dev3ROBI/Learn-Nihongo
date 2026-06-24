import { useState, useEffect } from 'react'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { shuffleArray } from '../utils/gameHelpers'
import { playCorrect, playWrong, playClick, playComplete } from '../utils/sound'
import { saveQuizResult } from '../utils/progressStore'

type Mode = 'hiragana' | 'katakana' | 'kanji' | 'kanji-hiragana' | 'hiragana-kanji'

const modes: { key: Mode; label: string }[] = [
  { key: 'hiragana', label: 'হিরাগানা' },
  { key: 'katakana', label: 'কাটাকানা' },
  { key: 'kanji', label: 'কানজি' },
  { key: 'kanji-hiragana', label: 'কানজি→হিরা' },
  { key: 'hiragana-kanji', label: 'হিরা→কানজি' },
]

export default function Matching() {
  const [mode, setMode] = useState<Mode>('hiragana')
  const [data, setData] = useState<any[]>([])
  const [pairs, setPairs] = useState<{ id: number; left: string; right: string }[]>([])
  const [shuffledLeft, setShuffledLeft] = useState<{ id: number; text: string }[]>([])
  const [shuffledRight, setShuffledRight] = useState<{ id: number; text: string }[]>([])
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [selectedRight, setSelectedRight] = useState<number | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [wrongPair, setWrongPair] = useState<{ left: number; right: number } | null>(null)
  const [finished, setFinished] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [newBadges, setNewBadges] = useState<string[]>([])

  useEffect(() => {
    Promise.all([loadHiragana(), loadKatakana(), loadKanji()]).then(([h, k, kj]) => {
      const all = mode === 'hiragana' ? h : mode === 'katakana' ? k : kj
      setData(all)
    })
  }, [mode])

  useEffect(() => {
    if (data.length === 0) return
    generateGame()
  }, [data, mode])

  function generateGame() {
    const shuffled = shuffleArray([...data]).slice(0, 5)

    let pairs: { id: number; left: string; right: string }[]
    if (mode === 'kanji-hiragana') {
      pairs = shuffled.map((item: any, i: number) => ({
        id: i,
        left: item.char,
        right: item.onReading || item.kunReading || '—',
      }))
    } else if (mode === 'hiragana-kanji') {
      pairs = shuffled.map((item: any, i: number) => ({
        id: i,
        left: item.onReading || item.kunReading || '—',
        right: item.char,
      }))
    } else {
      pairs = shuffled.map((item: any, i: number) => ({
        id: i,
        left: item.char,
        right: item.bangla,
      }))
    }

    const leftItems = pairs.map(p => ({ id: p.id, text: p.left }))
    const rightItems = pairs.map(p => ({ id: p.id, text: p.right }))

    setPairs(pairs)
    setShuffledLeft(shuffleArray(leftItems))
    setShuffledRight(shuffleArray(rightItems))
    setSelectedLeft(null)
    setSelectedRight(null)
    setMatched(new Set())
    setWrongPair(null)
    setFinished(false)
    setAttempts(0)
    setNewBadges([])
  }

  useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return
    setAttempts(prev => prev + 1)

    if (selectedLeft === selectedRight) {
      playCorrect()
      const newMatched = new Set(matched)
      newMatched.add(selectedLeft)
      setMatched(newMatched)
      setSelectedLeft(null)
      setSelectedRight(null)
      if (newMatched.size === pairs.length) {
        playComplete()
        const result = saveQuizResult({
          type: 'matching',
          category: mode,
          score: pairs.length,
          total: pairs.length + attempts,
          mistakes: [],
        })
        if (result.newBadges.length > 0) setNewBadges(result.newBadges.map(b => b.name))
        setFinished(true)
      }
    } else {
      playWrong()
      setWrongPair({ left: selectedLeft, right: selectedRight })
      setTimeout(() => {
        setSelectedLeft(null)
        setSelectedRight(null)
        setWrongPair(null)
      }, 700)
    }
  }, [selectedRight])

  return (
    <div className="animate-fadeIn max-w-lg mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-4">
        <i className="fa-solid fa-object-group text-primary mr-2" />ম্যাচিং
      </h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
              mode === m.key
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-surface text-text-muted hover:bg-surface-hover border border-border'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {!finished && (
        <div className="flex items-center justify-between text-text-muted text-xs mb-4">
          <span><i className="fa-solid fa-check-circle text-primary mr-1" /> {matched.size}/{pairs.length}</span>
          <span><i className="fa-solid fa-mouse-pointer mr-1" /> {attempts} বার চেষ্টা</span>
        </div>
      )}

      {finished ? (
        <div className="text-center py-8 animate-pop">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-text-main mb-2">সব মিলেছে!</h2>
          {newBadges.map((name, i) => (
            <div key={i} className="bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm mb-4 animate-pop">
              <i className="fa-solid fa-medal" />নতুন ব্যাজ: {name}
            </div>
          ))}
          <div className="card p-4 mb-4 inline-block">
            <p className="text-sm text-text-muted">
              <i className="fa-solid fa-mouse-pointer mr-1" />মোট {attempts} বার চেষ্টায় শেষ
            </p>
            {attempts <= pairs.length && (
              <p className="text-primary font-semibold text-sm mt-1">
                <i className="fa-solid fa-star mr-1" />পারফেক্ট গেম!
              </p>
            )}
          </div>
          <button onClick={generateGame} className="btn-primary">
            <i className="fa-solid fa-rotate mr-2" />আবার খেলুন
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-text-muted text-center mb-4 uppercase tracking-wider">
            বাম থেকে একটি এবং ডান থেকে একটি নির্বাচন করে মিলান
          </p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="space-y-2">
              {shuffledLeft.map(item => {
                const isMatched = matched.has(item.id)
                const isSelected = selectedLeft === item.id
                const isWrong = wrongPair?.left === item.id
                let cardClass = 'border border-border text-text-main'
                if (isMatched) cardClass = 'border-success/50 text-success bg-success-bg/30 opacity-60 cursor-default'
                else if (isSelected) cardClass = 'border-primary bg-primary/10 text-primary ring-2 ring-primary/30 scale-105'
                else if (isWrong) cardClass = 'border-error bg-error-bg/30 text-error ring-2 ring-error/30'
                else cardClass = 'bg-surface hover:bg-surface-hover border border-border text-text-main hover:scale-[1.02]'

                return (
                  <button
                    key={`l-${item.id}`}
                    onClick={() => {
                      if (isMatched || selectedLeft !== null) return
                      playClick()
                      setSelectedLeft(item.id)
                    }}
                    disabled={isMatched || selectedLeft !== null}
                    className={`${cardClass} rounded-xl w-full p-3 text-base sm:text-lg font-medium transition-all duration-200 disabled:cursor-default active:scale-95 shadow-sm text-center`}
                  >
                    {item.text}
                    {isMatched && <i className="fa-solid fa-check ml-1.5 text-success text-xs" />}
                  </button>
                )
              })}
            </div>

            <div className="space-y-2">
              {shuffledRight.map(item => {
                const isMatched = matched.has(item.id)
                const isSelected = selectedRight === item.id
                const isWrong = wrongPair?.right === item.id
                let cardClass = 'border border-border text-text-main'
                if (isMatched) cardClass = 'border-success/50 text-success bg-success-bg/30 opacity-60 cursor-default'
                else if (isSelected) cardClass = 'border-primary bg-primary/10 text-primary ring-2 ring-primary/30 scale-105'
                else if (isWrong) cardClass = 'border-error bg-error-bg/30 text-error ring-2 ring-error/30'
                else cardClass = 'bg-surface hover:bg-surface-hover border border-border text-text-main hover:scale-[1.02]'

                return (
                  <button
                    key={`r-${item.id}`}
                    onClick={() => {
                      if (isMatched || selectedLeft === null || selectedRight !== null) return
                      playClick()
                      setSelectedRight(item.id)
                    }}
                    disabled={isMatched || selectedLeft === null || selectedRight !== null}
                    className={`${cardClass} rounded-xl w-full p-3 text-sm sm:text-base font-medium transition-all duration-200 disabled:cursor-default active:scale-95 shadow-sm text-center`}
                  >
                    {item.text}
                    {isMatched && <i className="fa-solid fa-check ml-1.5 text-success text-xs" />}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
