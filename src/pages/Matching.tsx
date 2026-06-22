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
    const left: MatchItem[] = items.map((item, i) => ({ id: i, text: item.char, pair: i }))
    const right: MatchItem[] = shuffleArray(items.map((item, i) => ({ id: i + 100, text: item.bangla, pair: i })))
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
      <h1 className="text-3xl font-bold text-secondary mb-6">ম্যাচিং গেম 🔗</h1>
      <p className="text-secondary/70 mb-4">বামের অক্ষরের সাথে ডানের বাংলা মিলান।</p>

      <div className="flex gap-2 mb-6">
        {(['hiragana', 'katakana', 'kanji'] as const).map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-lg text-sm ${category === c ? 'bg-primary text-secondary' : 'bg-white/10 text-secondary/70'}`}
          >
            {c === 'hiragana' ? 'হিরাগানা' : c === 'katakana' ? 'কাটাকানা' : 'কানজি'}
          </button>
        ))}
      </div>

      {isComplete ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-secondary mb-4">অভিনন্দন! সব মিলেছে!</h2>
          <button onClick={loadData} className="bg-primary text-secondary px-8 py-3 rounded-xl text-lg hover:bg-primary/80 transition">
            আবার খেলুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-secondary/80 mb-2">জাপানি</h3>
            {leftItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleLeftClick(item.id)}
                className={`w-full p-4 rounded-xl text-2xl text-center transition-all duration-200 ${
                  matched.includes(item.id)
                    ? 'bg-green-500/30 border-2 border-green-400'
                    : selectedLeft === item.id
                    ? 'bg-primary/30 border-2 border-primary'
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
              >
                {item.text}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-secondary/80 mb-2">বাংলা</h3>
            {rightItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleRightClick(item.id)}
                className={`w-full p-4 rounded-xl text-lg text-center transition-all duration-200 ${
                  matched.some(m => leftItems.find(l => l.id === m)?.pair === item.pair)
                    ? 'bg-green-500/30 border-2 border-green-400'
                    : wrongPair === item.id
                    ? 'bg-red-500/30 border-2 border-red-400'
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
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
