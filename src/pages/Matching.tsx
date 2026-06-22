import { useEffect, useState, useCallback } from 'react'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { getRandomItems, shuffleArray } from '../utils/gameHelpers'

type MatchItem = { id: number; text: string; pair: number }

export default function Matching() {
  const [leftItems, setLeftItems] = useState<MatchItem[]>([])
  const [rightItems, setRightItems] = useState<MatchItem[]>([])
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [matched, setMatched] = useState<number[]>([])
  const [wrongPair, setWrongPair] = useState<number | null>(null)
  const [category, setCategory] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana')

  const loadData = useCallback(async () => {
    const [h, k, kj] = await Promise.all([loadHiragana(), loadKatakana(), loadKanji()])
    const raw: any[] = category === 'hiragana' ? h : category === 'katakana' ? k : kj
    const items = getRandomItems(raw, 5)
    const left: MatchItem[] = items.map((item: any, i: number) => ({ id: i, text: item.char, pair: i }))
    const right: MatchItem[] = shuffleArray(items.map((item: any, i: number) => ({ id: i + 100, text: item.bangla, pair: i })))
    setLeftItems(left)
    setRightItems(right)
    setMatched([])
    setSelectedLeft(null)
    setWrongPair(null)
  }, [category])

  useEffect(() => { loadData() }, [loadData])

  const handleLeftClick = (id: number) => {
    if (matched.includes(id)) return
    setSelectedLeft(id)
    setWrongPair(null)
  }

  const handleRightClick = (id: number) => {
    if (selectedLeft === null) return
    const leftItem = leftItems.find(l => l.id === selectedLeft)
    const rightItem = rightItems.find(r => r.id === id)

    if (leftItem && rightItem && leftItem.pair === rightItem.pair) {
      setMatched(prev => [...prev, leftItem.id])
      setSelectedLeft(null)
    } else {
      setWrongPair(id)
      setTimeout(() => {
        setWrongPair(null)
        setSelectedLeft(null)
      }, 600)
    }
  }

  const isComplete = matched.length === 5

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-6">ম্যাচিং গেম 🔗</h1>
      <p className="text-text-muted mb-4">বামের অক্ষরের সাথে ডানের বাংলা মিলান।</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['hiragana', 'katakana', 'kanji'] as const).map(c => (
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

      {isComplete ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main mb-4">অভিনন্দন! সব মিলেছে!</h2>
          <button onClick={loadData} className="btn-primary">
            আবার খেলুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">জাপানি</h3>
            {leftItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleLeftClick(item.id)}
                className={`w-full p-3 sm:p-4 rounded-xl text-xl sm:text-2xl text-center transition-all duration-200 ${
                  matched.includes(item.id)
                    ? 'bg-success-bg border-2 border-success text-success'
                    : selectedLeft === item.id
                    ? 'bg-primary/10 border-2 border-primary text-text-main'
                    : 'bg-surface border border-border text-text-main hover:bg-surface-hover'
                }`}
              >
                {item.text}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">বাংলা</h3>
            {rightItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleRightClick(item.id)}
                className={`w-full p-3 sm:p-4 rounded-xl text-base sm:text-lg text-center transition-all duration-200 ${
                  matched.some(m => leftItems.find(l => l.id === m)?.pair === item.pair)
                    ? 'bg-success-bg border-2 border-success text-success'
                    : wrongPair === item.id
                    ? 'bg-error-bg border-2 border-error text-error'
                    : 'bg-surface border border-border text-text-main hover:bg-surface-hover'
                }`}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
