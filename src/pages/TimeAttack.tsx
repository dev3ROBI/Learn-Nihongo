import { useState, useEffect, useCallback } from 'react'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { getRandomItems, getOptions } from '../utils/gameHelpers'
import { playCorrect, playWrong, playClick, playComplete } from '../utils/sound'

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
    playClick()
    setSelected(answer)
    if (answer === questions[currentIndex].correct) {
      playCorrect()
      setScore(prev => prev + 1)
    } else {
      playWrong()
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
        <div className="text-6xl mb-4">
          <i className="fa-solid fa-stopwatch text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-4">টাইম অ্যাটাক</h1>
        <p className="text-text-muted mb-6 text-sm">৩০ সেকেন্ডের মধ্যে সর্বোচ্চ প্রশ্নের উত্তর দিন!</p>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
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
        <button onClick={startGame} className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4">
          <i className="fa-solid fa-play mr-2" />শুরু করুন!
        </button>
      </div>
    )
  }

  if (gameState === 'over') {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⏰</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">সময় শেষ!</h2>
        <p className="text-lg sm:text-xl text-text-muted mb-2">
          <i className="fa-solid fa-star text-primary mr-2" />আপনার স্কোর: {score} / {currentIndex + (selected !== null ? 1 : 0)}
        </p>
        <button onClick={startGame} className="btn-primary mt-4">
          <i className="fa-solid fa-rotate mr-2" />আবার খেলুন
        </button>
      </div>
    )
  }

  if (questions.length === 0) return <div className="text-center text-text-muted py-12">লোড হচ্ছে...</div>

  const q = questions[currentIndex]

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-4">
        <div className="text-3xl sm:text-4xl font-bold text-primary">
          <i className="fa-solid fa-clock mr-2" />{timeLeft}s
        </div>
        <div className="w-full bg-surface-alt rounded-full h-2 sm:h-3 mt-2">
          <div
            className="bg-primary h-full rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-center mb-2 text-text-muted text-sm">
        <i className="fa-solid fa-star text-[10px] text-primary mr-1 align-middle" /> স্কোর: {score}
        <span className="mx-2">|</span>
        প্রশ্ন: {currentIndex + 1}/{questions.length}
      </div>

      <div className="card p-6 sm:p-8 mb-6 text-center">
        <div className="text-6xl sm:text-7xl mb-4">{q.question}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt: string, i: number) => {
          const isCorrect = opt === q.correct
          const isSelected = opt === selected
          let btnClass = 'bg-surface hover:bg-surface-hover border border-border text-text-main'
          if (isSelected) {
            btnClass = isCorrect
              ? 'bg-success-bg border-success text-success font-semibold'
              : 'bg-error-bg border-error text-error font-semibold'
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={selected !== null}
              className={`${btnClass} rounded-xl p-3 sm:p-4 text-sm sm:text-base font-medium transition-all duration-200 disabled:cursor-not-allowed active:scale-[0.98]`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
