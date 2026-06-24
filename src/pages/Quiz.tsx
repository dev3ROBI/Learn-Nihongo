import { useEffect, useState, useCallback } from 'react'
import type { IHiragana, IKatakana, IKanji, QuizItem } from '../types'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { getRandomItems, getOptions, getKanjiReading, getKanjiReadingOptions } from '../utils/gameHelpers'
import { playCorrect, playWrong, playClick, playComplete } from '../utils/sound'

type Tab = 'hiragana' | 'katakana' | 'kanji' | 'kanji-reverse' | 'kanji-hiragana' | 'hiragana-kanji'

const tabs: { key: Tab; label: string }[] = [
  { key: 'hiragana', label: 'হিরাগানা' },
  { key: 'katakana', label: 'কাটাকানা' },
  { key: 'kanji', label: 'কানজি → বাংলা' },
  { key: 'kanji-reverse', label: 'বাংলা → কানজি' },
  { key: 'kanji-hiragana', label: 'কানজি → হিরা' },
  { key: 'hiragana-kanji', label: 'হিরা → কানজি' },
]

function getInstructions(tab: Tab): string {
  switch (tab) {
    case 'kanji-hiragana': return 'এই কানজিটির হিরাগানা/কাটাকানা রিডিং বেছে নিন'
    case 'hiragana-kanji': return 'এই রিডিংয়ের সঠিক কানজি বেছে নিন'
    case 'kanji-reverse': return 'বাংলা অর্থ দেখে সঠিক কানজি বেছে নিন'
    default: return 'সঠিক উত্তরটি বেছে নিন'
  }
}

function getRating(score: number, total: number): { emoji: string; label: string } {
  const p = score / total
  if (p >= 0.9) return { emoji: '🏆', label: 'অসাধারণ!' }
  if (p >= 0.7) return { emoji: '🎉', label: 'ভালো!' }
  if (p >= 0.5) return { emoji: '👍', label: 'চলতে থাকে!' }
  return { emoji: '💪', label: 'আরও প্র্যাকটিস প্রয়োজন' }
}

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
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

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
    let data: any[] = []
    let qKey = 'char'
    let aKey = 'bangla'

    if (activeTab === 'hiragana') {
      data = getRandomItems(hiragana, 10)
    } else if (activeTab === 'katakana') {
      data = getRandomItems(katakana, 10)
    } else if (activeTab === 'kanji') {
      data = getRandomItems(kanji, 10)
    } else if (activeTab === 'kanji-reverse') {
      data = getRandomItems(kanji, 10)
      qKey = 'bangla'
      aKey = 'char'
    }

    let qs: any[]

    if (activeTab === 'kanji-hiragana') {
      data = getRandomItems(kanji, 10)
      qs = data.map((item: IKanji) => ({
        question: item.char,
        options: getKanjiReadingOptions(getKanjiReading(item), kanji),
        correct: getKanjiReading(item),
      }))
    } else if (activeTab === 'hiragana-kanji') {
      data = getRandomItems(kanji, 10)
      qs = data.map((item: IKanji) => ({
        question: getKanjiReading(item),
        options: getOptions(item.char, data, 'char' as keyof QuizItem),
        correct: item.char,
      }))
    } else {
      qs = data.map((item: any) => ({
        question: item[qKey],
        options: getOptions(item[aKey], data, aKey as keyof QuizItem),
        correct: item[aKey],
      }))
    }

    setQuestions(qs)
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
    setStreak(0)
    setBestStreak(0)
  }

  const handleAnswer = (answer: string) => {
    if (selected !== null || finished) return
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
        playComplete()
        setFinished(true)
      }
    }, 800)
  }

  if (questions.length === 0) {
    return <div className="text-center text-text-muted py-12">লোড হচ্ছে...</div>
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100)
    const rating = getRating(score, questions.length)
    return (
      <div className="text-center py-12 animate-pop max-w-sm mx-auto">
        <div className="text-7xl mb-4">{rating.emoji}</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-1">কুইজ শেষ!</h2>
        <p className="text-primary font-semibold text-lg mb-4">{rating.label}</p>
        <div className="card p-5 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">সঠিক উত্তর</span>
            <span className="font-bold text-success">{score}/{questions.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">নির্ভুলতা</span>
            <span className="font-bold text-text-main">{percentage}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">সর্বোচ্চ ধারাবাহিক</span>
            <span className="font-bold text-primary">{bestStreak}×</span>
          </div>
          <div className="w-full bg-surface-alt rounded-full h-2 mt-1">
            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${percentage}%` }} />
          </div>
        </div>
        <button onClick={generateQuestions} className="btn-primary">
          <i className="fa-solid fa-rotate mr-2" />আবার খেলুন
        </button>
      </div>
    )
  }

  const q = questions[currentIndex]
  const progress = ((currentIndex) / questions.length) * 100

  return (
    <div className="animate-fadeIn max-w-lg mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-4">
        <i className="fa-solid fa-circle-question text-primary mr-2" />কুইজ
      </h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-surface text-text-muted hover:bg-surface-hover border border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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

      <div className="text-xs text-text-muted font-medium text-center mb-3 uppercase tracking-wider">
        {getInstructions(activeTab)}
      </div>

      <div className="card p-6 sm:p-8 text-center mb-5 w-full">
        <div className="text-6xl sm:text-7xl mb-1">{q.question}</div>
        {(activeTab === 'hiragana-kanji') && (
          <div className="text-text-muted/50 text-xs mt-1">হিরাগানা রিডিং</div>
        )}
        {(activeTab === 'kanji-hiragana') && (
          <div className="text-text-muted/50 text-xs mt-1">কানজি অক্ষর</div>
        )}
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
