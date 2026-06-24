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
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  useEffect(() => {
    Promise.all([loadHiragana(), loadKatakana(), loadKanji()]).then(([h, k, kj]) => {
      const all = category === 'hiragana' ? h : category === 'katakana' ? k : kj
      setData(all)
    })
  }, [category])

  const startGame = useCallback(() => {
    const items = getRandomItems(data, 50)
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
    setStreak(0)
    setBestStreak(0)
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
    const isCorrect = answer === questions[currentIndex].correct
    if (isCorrect) {
      playCorrect()
      setScore(prev => prev + 1)
      setStreak(prev => {
        const n = prev + 1
        if (n > bestStreak) setBestStreak(n)
        return n
      })
    } else {
      playWrong()
      setStreak(0)
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
      <div className="text-center py-12 animate-fadeIn">
        <div className="text-6xl mb-4">
          <i className="fa-solid fa-stopwatch text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-4">টাইম অ্যাটাক</h1>
        <p className="text-text-muted mb-6 text-sm max-w-xs mx-auto">
          ৩০ সেকেন্ডের মধ্যে সর্বোচ্চ প্রশ্নের উত্তর দিন! প্রতিটি সঠিক উত্তরের জন্য ১ পয়েন্ট।
        </p>
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
    const totalAttempted = currentIndex + (selected !== null ? 1 : 0)
    return (
      <div className="text-center py-12 animate-pop max-w-sm mx-auto">
        <div className="text-6xl mb-4">⏰</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">সময় শেষ!</h2>
        <div className="card p-5 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">সঠিক উত্তর</span>
            <span className="font-bold text-success">{score}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">মোট উত্তর</span>
            <span className="font-bold text-text-main">{totalAttempted}</span>
          </div>
          {totalAttempted > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">নির্ভুলতা</span>
              <span className="font-bold text-text-main">{Math.round((score / totalAttempted) * 100)}%</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">সর্বোচ্চ ধারাবাহিক</span>
            <span className="font-bold text-primary">{bestStreak}×</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">গতি</span>
            <span className="font-bold text-text-main">{totalAttempted > 0 ? (totalAttempted / 30 * 60).toFixed(1) : 0}/মিনিট</span>
          </div>
        </div>
        <button onClick={startGame} className="btn-primary">
          <i className="fa-solid fa-rotate mr-2" />আবার খেলুন
        </button>
      </div>
    )
  }

  if (questions.length === 0) return <div className="text-center text-text-muted py-12">লোড হচ্ছে...</div>

  const q = questions[currentIndex]
  const isLowTime = timeLeft <= 10

  return (
    <div className="max-w-lg mx-auto animate-fadeIn">
      <div className="text-center mb-3">
        <div className={`text-3xl sm:text-4xl font-bold transition-colors duration-300 ${isLowTime ? 'text-error animate-pulse' : 'text-primary'}`}>
          <i className={`fa-regular ${isLowTime ? 'fa-bell' : 'fa-clock'} mr-2`} />{timeLeft}s
        </div>
        <div className="w-full bg-surface-alt rounded-full h-2.5 mt-2">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${isLowTime ? 'bg-error' : 'bg-primary'}`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-text-muted text-xs mb-4">
        <span><i className="fa-solid fa-star text-primary mr-1" /> {score}</span>
        <span>প্রশ্ন: {currentIndex + 1}</span>
        {streak >= 3 && (
          <span className="text-primary font-semibold animate-pop inline-flex items-center gap-1">
            <i className="fa-solid fa-fire" /> {streak}
          </span>
        )}
      </div>

      <div className="card p-6 sm:p-8 mb-4 text-center">
        <div className="text-6xl sm:text-7xl mb-4">{q.question}</div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {q.options.map((opt: string, i: number) => {
          const isCorrect = opt === q.correct
          const isSelected = opt === selected
          let btnClass = 'bg-surface hover:bg-surface-hover border border-border text-text-main'
          if (isSelected) {
            btnClass = isCorrect
              ? 'bg-success-bg border-success text-success font-semibold scale-[1.02] ring-2 ring-success/30'
              : 'bg-error-bg border-error text-error font-semibold scale-[1.02] ring-2 ring-error/30'
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={selected !== null}
              className={`${btnClass} rounded-xl p-3 sm:p-4 text-sm sm:text-base font-medium transition-all duration-300 disabled:cursor-not-allowed active:scale-95 shadow-sm`}
            >
              {opt}
              {isSelected && isCorrect && <i className="fa-solid fa-check ml-1.5" />}
              {isSelected && !isCorrect && <i className="fa-solid fa-xmark ml-1.5" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
