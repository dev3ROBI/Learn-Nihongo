import { useEffect, useState, useCallback } from 'react'
import type { IHiragana, IKatakana, IKanji, QuizItem } from '../types'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { getRandomItems, getOptions } from '../utils/gameHelpers'

type Tab = 'hiragana' | 'katakana' | 'kanji' | 'kanji-reverse'

const tabs: { key: Tab; label: string }[] = [
  { key: 'hiragana', label: 'হিরাগানা' },
  { key: 'katakana', label: 'কাটাকানা' },
  { key: 'kanji', label: 'কানজি → বাংলা' },
  { key: 'kanji-reverse', label: 'বাংলা → কানজি' },
]

export default function Quiz() {
  const [activeTab, setActiveTab] = useState<Tab>('hiragana')
  const [hiragana, setHiragana] = useState<IHiragana[]>([])
  const [katakana, setKatakana] = useState<IKatakana[]>([])
  const [kanji, setKanji] = useState<IKanji[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)

  const loadAll = useCallback(async () => {
    const [h, k, kj] = await Promise.all([loadHiragana(), loadKatakana(), loadKanji()])
    setHiragana(h)
    setKatakana(k)
    setKanji(kj)
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  useEffect(() => {
    generateQuestions()
  }, [activeTab, hiragana, katakana, kanji])

  function generateQuestions() {
    let data: any[]
    let qKey: string
    let aKey: string

    if (activeTab === 'hiragana') {
      data = getRandomItems(hiragana, 10)
      qKey = 'char'
      aKey = 'bangla'
    } else if (activeTab === 'katakana') {
      data = getRandomItems(katakana, 10)
      qKey = 'char'
      aKey = 'bangla'
    } else if (activeTab === 'kanji') {
      data = getRandomItems(kanji, 10)
      qKey = 'char'
      aKey = 'bangla'
    } else {
      data = getRandomItems(kanji, 10)
      qKey = 'bangla'
      aKey = 'char'
    }

    const qs = data.map((item: any) => ({
      question: item[qKey],
      options: getOptions(item[aKey], data, aKey as keyof QuizItem),
      correct: item[aKey],
    }))
    setQuestions(qs)
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
  }

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

  if (questions.length === 0) {
    return <div className="text-center text-text-muted py-12">লোড হচ্ছে...</div>
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">{percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">কুইজ শেষ!</h2>
        <p className="text-lg sm:text-xl text-text-muted mb-2">আপনার স্কোর: {score} / {questions.length}</p>
        <p className="text-primary font-semibold mb-6">{percentage}% সঠিক</p>
        <button onClick={generateQuestions} className="btn-primary">
          আবার খেলুন
        </button>
      </div>
    )
  }

  const q = questions[currentIndex]

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-6">কুইজ 🎯</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-primary text-white'
                : 'bg-surface text-text-muted hover:bg-surface-hover border border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="text-center mb-2 text-text-muted text-sm">
        প্রশ্ন {currentIndex + 1} / {questions.length} | স্কোর: {score}
      </div>

      <div className="card p-6 sm:p-8 mb-6 text-center max-w-lg mx-auto">
        <div className="text-6xl sm:text-7xl mb-4">{q.question}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
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
