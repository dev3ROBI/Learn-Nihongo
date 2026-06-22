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
  }

  const handleAnswer = (answer: string) => {
    if (selected !== null || finished) return
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
    return (
      <div className="text-center py-12 animate-fadeIn">
        <div className="text-6xl mb-4">{percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">কুইজ শেষ!</h2>
        <p className="text-lg sm:text-xl text-text-muted mb-2">
          <i className="fa-solid fa-star text-primary mr-2" />আপনার স্কোর: {score} / {questions.length}
        </p>
        <p className="text-primary font-semibold mb-6">{percentage}% সঠিক</p>
        <button onClick={generateQuestions} className="btn-primary">
          <i className="fa-solid fa-rotate mr-2" />আবার খেলুন
        </button>
      </div>
    )
  }

  const q = questions[currentIndex]

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-6">
        <i className="fa-solid fa-circle-question text-primary mr-2" />কুইজ
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-surface text-text-muted hover:bg-surface-hover border border-border hover:scale-102'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="text-center mb-4 text-text-muted text-sm">
        <i className="fa-solid fa-circle text-[6px] text-primary mr-1 align-middle" /> প্রশ্ন {currentIndex + 1} / {questions.length}
        <span className="mx-2">|</span>
        <i className="fa-solid fa-star text-[10px] text-primary mr-1 align-middle" /> স্কোর: {score}
      </div>

      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="text-xs text-text-muted font-medium uppercase tracking-wider">
          {activeTab === 'kanji-hiragana' ? 'এই কানজিটির হিরাগানা রিডিং বেছে নিন' :
           activeTab === 'hiragana-kanji' ? 'এই রিডিংয়ের সঠিক কানজি বেছে নিন' :
           'সঠিক উত্তরটি বেছে নিন'}
        </div>
        <div className="card p-6 sm:p-8 text-center max-w-sm mx-auto w-full">
          <div className="text-6xl sm:text-7xl mb-2">{q.question}</div>
          {(activeTab === 'hiragana-kanji') && (
            <div className="text-text-muted/50 text-xs mt-1">হিরাগানা রিডিং</div>
          )}
          {(activeTab === 'kanji-hiragana') && (
            <div className="text-text-muted/50 text-xs mt-1">কানজি অক্ষর</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        {q.options.map((opt: string, i: number) => {
          const isCorrect = opt === q.correct
          const isSelected = opt === selected
          let btnClass = 'bg-surface hover:bg-surface-hover border border-border text-text-main hover:scale-102'

          if (isSelected) {
            btnClass = isCorrect
              ? 'bg-success-bg border-success text-success font-semibold scale-105'
              : 'bg-error-bg border-error text-error font-semibold scale-105'
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={selected !== null}
              className={`${btnClass} rounded-xl p-3 sm:p-4 text-sm sm:text-base font-medium transition-all duration-300 disabled:cursor-not-allowed active:scale-95 shadow-sm`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
