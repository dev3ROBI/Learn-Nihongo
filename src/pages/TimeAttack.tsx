import { useState, useEffect, useCallback } from 'react'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { getRandomItems, getOptions } from '../utils/gameHelpers'

type Category = 'hiragana' | 'katakana' | 'kanji'

export default function TimeAttack() {
  const [category, setCategory] = useState<Category>('hiragana')
  const [data, setData] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle')

  useEffect(() => {
    Promise.all([loadHiragana(), loadKatakana(), loadKanji()]).then(([h, k, kj]) => {
      const all = category === 'hiragana' ? h : category === 'katakana' ? k : kj
      setData(all)
    })
  }, [category])

  const startGame = useCallback(() => {
    const items = getRandomItems(data, 30)
    const qs = items.map((item: any) => ({
      question: item.char,
      options: getOptions(item.bangla, items, 'bangla' as const),
      correct: item.bangla,
    }))
    setQuestions(qs)
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setTimeLeft(30)
    setGameState('playing')
  }, [data])

  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) {
      setGameState('over')
      return
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [gameState, timeLeft])

  const handleAnswer = (answer: string) => {
    if (selected !== null || gameState !== 'playing') return
    setSelected(answer)
    if (answer === questions[currentIndex].correct) {
      setScore(prev => prev + 1)
    }
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setSelected(null)
      } else {
        setGameState('over')
      }
    }, 500)
  }

  if (gameState === 'idle') {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⏱️</div>
        <h1 className="text-3xl font-bold text-secondary mb-4">টাইম অ্যাটাক</h1>
        <p className="text-secondary/70 mb-6">৩০ সেকেন্ডের মধ্যে সর্বোচ্চ প্রশ্নের উত্তর দিন!</p>
        <div className="flex gap-2 justify-center mb-6">
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
        <button
          onClick={startGame}
          className="bg-primary text-secondary px-10 py-4 rounded-xl text-xl font-semibold hover:bg-primary/80 transition"
        >
          শুরু করুন!
        </button>
      </div>
    )
  }

  if (gameState === 'over') {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⏰</div>
        <h2 className="text-3xl font-bold text-secondary mb-2">সময় শেষ!</h2>
        <p className="text-xl text-secondary/80 mb-2">আপনার স্কোর: {score} / {currentIndex + (selected !== null ? 1 : 0)}</p>
        <button
          onClick={startGame}
          className="bg-primary text-secondary px-8 py-3 rounded-xl text-lg font-semibold hover:bg-primary/80 transition mt-4"
        >
          আবার খেলুন
        </button>
      </div>
    )
  }

  if (questions.length === 0) return <div className="text-center text-secondary/60 py-12">লোড হচ্ছে...</div>

  const q = questions[currentIndex]

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-primary">{timeLeft}s</div>
        <div className="w-full bg-white/10 rounded-full h-3 mt-2">
          <div className="bg-primary h-3 rounded-full transition-all duration-1000" style={{ width: `${(timeLeft / 30) * 100}%` }} />
        </div>
      </div>

      <div className="text-center mb-2 text-secondary/60">
        স্কোর: {score} | প্রশ্ন: {currentIndex + 1}/{questions.length}
      </div>

      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-6 text-center">
        <div className="text-7xl mb-4">{q.question}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt: string, i: number) => {
          const isCorrect = opt === q.correct
          const isSelected = opt === selected
          let btnClass = 'bg-white/10 hover:bg-white/20 border border-white/20'
          if (isSelected) btnClass = isCorrect ? 'bg-green-500/80 border-green-400' : 'bg-red-500/80 border-red-400'
          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={selected !== null}
              className={`${btnClass} text-secondary rounded-xl p-4 text-lg font-medium transition-all duration-200 disabled:cursor-not-allowed`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
