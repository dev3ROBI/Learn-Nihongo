import { useState, useCallback, useEffect } from 'react'
import type { QuizItem, IQuestion } from '../types'
import { shuffleArray, getRandomItems, getOptions } from '../utils/gameHelpers'

interface QuizGameProps {
  data: QuizItem[]
  type: 'hiragana' | 'katakana' | 'kanji'
  mode?: 'char-to-romaji' | 'char-to-bangla' | 'bangla-to-char'
  timeLimit?: number
  onFinish?: (score: number, total: number) => void
}

function getQuestionKey(type: string, mode: string): keyof QuizItem {
  if (type === 'kanji') {
    if (mode === 'bangla-to-char') return 'bangla'
    return 'bangla'
  }
  if (mode === 'char-to-romaji') return 'bangla'
  if (mode === 'char-to-bangla') return 'bangla'
  return 'bangla'
}

function getAnswerKey(type: string, mode: string): keyof QuizItem {
  if (type === 'kanji' && mode === 'bangla-to-char') return 'bangla'
  return 'bangla'
}

export default function QuizGame({ data, type, mode = 'char-to-bangla', timeLimit, onFinish }: QuizGameProps) {
  const [questions, setQuestions] = useState<IQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeLimit || 30)
  const [gameOver, setGameOver] = useState(false)
  const [totalAnswered, setTotalAnswered] = useState(0)

  useEffect(() => {
    const items = getRandomItems(data, 20)
    const qs: IQuestion[] = items.map(item => {
      let correct: string
      let displayChar: string

      if (type === 'kanji' && mode === 'bangla-to-char') {
        correct = item.char
        displayChar = (item as any).bangla || ''
      } else {
        correct = (item as any).bangla || ''
        displayChar = item.char
      }

      return {
        item: { ...item, char: displayChar } as QuizItem,
        options: getOptions(correct, data, 'bangla' as keyof QuizItem),
        correct,
        type,
      }
    })
    setQuestions(qs)
  }, [data, type, mode])

  useEffect(() => {
    if (!timeLimit || gameOver) return
    if (timeLeft <= 0) {
      setGameOver(true)
      onFinish?.(score, totalAnswered)
      return
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLimit, timeLeft, gameOver, score, totalAnswered, onFinish])

  const handleAnswer = useCallback((answer: string) => {
    if (selected !== null) return
    setSelected(answer)
    const isCorrect = answer === questions[currentIndex].correct
    if (isCorrect) setScore(prev => prev + 1)
    setTotalAnswered(prev => prev + 1)
    setTimeout(() => {
      setSelected(null)
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        setGameOver(true)
        onFinish?.(score + (isCorrect ? 1 : 0), questions.length)
      }
    }, 800)
  }, [selected, questions, currentIndex, score, onFinish])

  if (gameOver || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-secondary mb-2">গেম ওভার!</h2>
        <p className="text-xl text-secondary/80 mb-6">
          আপনার স্কোর: {score} / {totalAnswered || questions.length}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-secondary px-8 py-3 rounded-xl text-lg font-semibold hover:bg-primary/80 transition"
        >
          আবার খেলুন
        </button>
      </div>
    )
  }

  const question = questions[currentIndex]

  return (
    <div className="max-w-lg mx-auto">
      {timeLimit && (
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-primary">{timeLeft}s</div>
          <div className="w-full bg-white/10 rounded-full h-2 mt-1">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / (timeLimit || 30)) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="text-center mb-2 text-secondary/60">
        প্রশ্ন {currentIndex + 1} / {questions.length} | স্কোর: {score}
      </div>

      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-6 text-center">
        <div className="text-7xl mb-4">{question.item.char}</div>
        {type !== 'kanji' && (
          <div className="text-lg text-secondary/70">({(question.item as any).romaji})</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((opt, i) => {
          const isCorrect = opt === question.correct
          const isSelected = opt === selected
          let btnClass = 'bg-white/10 hover:bg-white/20 border border-white/20'

          if (isSelected) {
            btnClass = isCorrect
              ? 'bg-green-500/80 border-green-400'
              : 'bg-red-500/80 border-red-400'
          }

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
