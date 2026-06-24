import { useState, useCallback } from 'react'
import type { QuizItem, IKanji, IHiragana, IKatakana } from '../types'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { shuffleArray, getRandomItems, getOptions } from '../utils/gameHelpers'
import { playCorrect, playWrong, playClick, playComplete } from '../utils/sound'

export default function RandomChallenge() {
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const generate = useCallback(async () => {
    const [h, k, kj] = await Promise.all([loadHiragana(), loadKatakana(), loadKanji()])
    const mixed: QuizItem[] = shuffleArray([
      ...getRandomItems(h, 4),
      ...getRandomItems(k, 3),
      ...getRandomItems(kj, 3),
    ])

    const qs = mixed.map(item => {
      const isKanji = 'meaning' in item
      const correct = isKanji ? (item as IKanji).bangla : (item as IHiragana | IKatakana).bangla
      const pool = isKanji ? kj : h
      const options = getOptions(correct, pool, 'bangla' as keyof QuizItem)
      return { question: item.char, options, correct }
    })

    setQuestions(qs)
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
    setStarted(true)
    setStreak(0)
    setBestStreak(0)
  }, [])

  const handleAnswer = (answer: string) => {
    if (selected !== null || finished) return
    playClick()
    setSelected(answer)
    if (answer === questions[currentIndex].correct) {
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
        playComplete()
        setFinished(true)
      }
    }, 800)
  }

  if (!started) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <div className="text-6xl mb-4">
          <i className="fa-solid fa-dice text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">র‌্যান্ডম চ্যালেঞ্জ</h1>
        <p className="text-text-muted mb-6 text-sm max-w-xs mx-auto">
          হিরাগানা, কাটাকানা ও কানজি মিক্সড ১০টি প্রশ্ন! সব ক্যাটাগরি থেকে র‌্যান্ডম প্রশ্ন আসবে।
        </p>
        <button onClick={generate} className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4">
          <i className="fa-solid fa-play mr-2" />শুরু করুন!
        </button>
      </div>
    )
  }

  if (finished || questions.length === 0) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
    return (
      <div className="text-center py-12 animate-pop max-w-sm mx-auto">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-1">চ্যালেঞ্জ শেষ!</h2>
        <div className="card p-5 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">সঠিক উত্তর</span>
            <span className="font-bold text-success">{score}/{questions.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">নির্ভুলতা</span>
            <span className="font-bold text-text-main">{pct}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">সর্বোচ্চ ধারাবাহিক</span>
            <span className="font-bold text-primary">{bestStreak}×</span>
          </div>
          <div className="w-full bg-surface-alt rounded-full h-2 mt-1">
            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button onClick={generate} className="btn-primary">
          <i className="fa-solid fa-rotate mr-2" />আবার খেলুন
        </button>
      </div>
    )
  }

  const q = questions[currentIndex]
  const progress = (currentIndex / questions.length) * 100

  return (
    <div className="max-w-lg mx-auto animate-fadeIn">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-4">
        <i className="fa-solid fa-dice text-primary mr-2" />র‌্যান্ডম চ্যালেঞ্জ
      </h1>

      <div className="w-full bg-surface-alt rounded-full h-1.5 mb-4">
        <div className="bg-primary h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between text-text-muted text-xs mb-4">
        <span><i className="fa-solid fa-circle text-[6px] text-primary mr-1 align-middle" /> {currentIndex + 1}/{questions.length}</span>
        <span className="flex items-center gap-3">
          <span><i className="fa-solid fa-star text-[10px] text-primary mr-1 align-middle" /> {score}</span>
          {streak >= 3 && (
            <span className="text-primary font-semibold animate-pop inline-flex items-center gap-1">
              <i className="fa-solid fa-fire" /> {streak}
            </span>
          )}
        </span>
      </div>

      <div className="card p-6 sm:p-8 mb-5 text-center w-full">
        <div className="text-6xl sm:text-7xl mb-1">{q.question}</div>
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
            <button key={i} onClick={() => handleAnswer(opt)} disabled={selected !== null}
              className={`${btnClass} rounded-xl p-3 sm:p-4 text-sm sm:text-base font-medium transition-all duration-300 disabled:cursor-not-allowed active:scale-95 shadow-sm`}>
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
