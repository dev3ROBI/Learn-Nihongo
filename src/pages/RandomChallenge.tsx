import { useState, useCallback } from 'react'
import type { QuizItem, IKanji, IHiragana, IKatakana } from '../types'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { shuffleArray, getRandomItems, getOptions } from '../utils/gameHelpers'

export default function RandomChallenge() {
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)

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
  }, [])

  const handleAnswer = (answer: string) => {
    if (selected !== null || finished) return
    setSelected(answer)
    if (answer === questions[currentIndex].correct) {
      setScore(prev => prev + 1)
    }
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setSelected(null)
      } else {
        setFinished(true)
      }
    }, 800)
  }

  if (!started) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎲</div>
        <h1 className="text-3xl font-bold text-secondary mb-4">র‌্যান্ডম চ্যালেঞ্জ</h1>
        <p className="text-secondary/70 mb-6">হিরাগানা, কাটাকানা ও কানজি মিক্সড ১০টি প্রশ্ন!</p>
        <button
          onClick={generate}
          className="bg-primary text-secondary px-10 py-4 rounded-xl text-xl font-semibold hover:bg-primary/80 transition"
        >
          শুরু করুন!
        </button>
      </div>
    )
  }

  if (finished || questions.length === 0) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold text-secondary mb-2">চ্যালেঞ্জ শেষ!</h2>
        <p className="text-xl text-secondary/80 mb-2">স্কোর: {score} / {questions.length}</p>
        <p className="text-lg text-primary mb-6">{pct}% সঠিক</p>
        <button onClick={generate} className="bg-primary text-secondary px-8 py-3 rounded-xl text-lg font-semibold hover:bg-primary/80 transition">
          আবার খেলুন
        </button>
      </div>
    )
  }

  const q = questions[currentIndex]

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-2 text-secondary/60">
        প্রশ্ন {currentIndex + 1} / {questions.length} | স্কোর: {score}
      </div>
      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-6 text-center">
        <div className="text-7xl mb-4">{q.question}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt: string, i: number) => {
          const isCorrect = opt === q.correct
          const isSelected = opt === selected
          let btnClass = 'bg-white/10 hover:bg-white/20 border border-white/20'
          if (isSelected) btnClass = isCorrect ? 'bg-green-500/80' : 'bg-red-500/80'
          return (
            <button key={i} onClick={() => handleAnswer(opt)} disabled={selected !== null}
              className={`${btnClass} text-secondary rounded-xl p-4 text-lg font-medium transition-all duration-200 disabled:cursor-not-allowed`}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
