import { useState, useCallback, useEffect } from 'react'
import type { QuizItem, IKanji, IHiragana, IKatakana } from '../types'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { shuffleArray, getRandomItems, getOptions } from '../utils/gameHelpers'
import { playCorrect, playWrong, playClick, playComplete } from '../utils/sound'
import { saveQuizResult, getStats } from '../utils/progressStore'
import type { Mistake } from '../utils/progressStore'

function getTodaySeed(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function DailyChallenge() {
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [newBadges, setNewBadges] = useState<string[]>([])
  const stats = getStats()

  const generate = useCallback(async () => {
    const [h, k, kj] = await Promise.all([loadHiragana(), loadKatakana(), loadKanji()])
    const count = 5
    const mixed: QuizItem[] = shuffleArray([
      ...getRandomItems(h, Math.min(count, h.length)),
      ...getRandomItems(k, Math.min(count, k.length)),
      ...getRandomItems(kj, Math.min(count, kj.length)),
    ]).slice(0, 10)

    const qs = mixed.map(item => {
      const isKanji = 'meaning' in item
      const correct = isKanji ? (item as IKanji).bangla : (item as IHiragana | IKatakana).bangla
      const pool = isKanji ? kj : h
      const options = getOptions(correct, pool, 'bangla' as keyof QuizItem)
      const category = isKanji ? 'কানজি' : (item as any).romaji ? 'হিরাগানা' : 'কাটাকানা'
      return { question: item.char, options, correct, category, item }
    })

    setQuestions(qs)
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
    setStarted(true)
    setMistakes([])
    setNewBadges([])
  }, [])

  useEffect(() => {
    if (getTodaySeed()) generate()
  }, [])

  const handleAnswer = (answer: string) => {
    if (selected !== null || finished) return
    playClick()
    const q = questions[currentIndex]
    const isCorrect = answer === q.correct
    const newScore = score + (isCorrect ? 1 : 0)
    const newMistake = isCorrect ? null : {
      question: q.question,
      correctAnswer: q.correct,
      userAnswer: answer,
      category: q.category,
      date: new Date().toISOString(),
    }
    const newMistakes = newMistake ? [...mistakes, newMistake] : mistakes

    setSelected(answer)
    if (isCorrect) {
      playCorrect()
      setScore(newScore)
    } else {
      playWrong()
      setMistakes(newMistakes as any)
    }
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setSelected(null)
      } else {
        playComplete()
        const result = saveQuizResult({
          type: 'daily',
          category: 'daily-challenge',
          score: newScore,
          total: questions.length,
          mistakes: newMistakes,
        })
        if (result.newBadges.length > 0) {
          setNewBadges(result.newBadges.map(b => b.name))
        }
        setFinished(true)
      }
    }, 800)
  }

  if (!started) {
    return (
      <div className="text-center py-12 animate-fadeIn max-w-sm mx-auto">
        <div className="text-6xl mb-4">
          <i className="fa-solid fa-calendar-day text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">ডেইলি চ্যালেঞ্জ</h1>
        <p className="text-text-muted text-sm mb-2">প্রতিদিন ১০টি করে নতুন প্রশ্ন!</p>
        {stats.studiedToday && (
          <div className="inline-flex items-center gap-2 bg-success-bg text-success px-4 py-2 rounded-full text-sm font-medium mb-4">
            <i className="fa-solid fa-check-circle" />আজকের চ্যালেঞ্জ শেষ
          </div>
        )}
        <button onClick={generate} className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 mt-4">
          <i className="fa-solid fa-play mr-2" />শুরু করুন!
        </button>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="text-center py-12 animate-pop max-w-sm mx-auto">
        <div className="text-6xl mb-4">{pct >= 70 ? '🎉' : '💪'}</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-1">ডেইলি চ্যালেঞ্জ শেষ!</h2>
        {newBadges.map((name, i) => (
          <div key={i} className="bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm mb-4 animate-pop">
            <i className="fa-solid fa-medal" />নতুন ব্যাজ: {name}
          </div>
        ))}
        <div className="card p-5 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">সঠিক</span>
            <span className="font-bold text-success">{score}/{questions.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">নির্ভুলতা</span>
            <span className="font-bold text-text-main">{pct}%</span>
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
        <i className="fa-solid fa-calendar-day text-primary mr-2" />ডেইলি চ্যালেঞ্জ
      </h1>

      <div className="w-full bg-surface-alt rounded-full h-1.5 mb-4">
        <div className="bg-primary h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between text-text-muted text-xs mb-4">
        <span>{currentIndex + 1}/{questions.length}</span>
        <span><i className="fa-solid fa-star text-primary mr-1" />{score}</span>
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
