import { useState, useCallback } from 'react'
import type { QuizItem, IKanji, IHiragana, IKatakana } from '../types'
import { loadHiragana, loadKatakana, loadKanji } from '../utils/loadData'
import { shuffleArray, getRandomItems, getOptions } from '../utils/gameHelpers'
import { playCorrect, playWrong, playClick, playComplete } from '../utils/sound'
import { saveQuizResult } from '../utils/progressStore'
import type { Mistake } from '../utils/progressStore'

interface Selection {
  hiragana: boolean
  katakana: boolean
  kanji: boolean
  kanjiReverse: boolean
  kanjiHiragana: boolean
  hiraganaKanji: boolean
}

const defaults: Selection = {
  hiragana: true, katakana: false, kanji: true,
  kanjiReverse: false, kanjiHiragana: false, hiraganaKanji: false,
}

export default function CustomQuiz() {
  const [selection, setSelection] = useState<Selection>(defaults)
  const [questionCount, setQuestionCount] = useState(10)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [mistakes, setMistakes] = useState<Mistake[]>([])

  const toggle = (key: keyof Selection) => {
    setSelection(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const selectAll = () => {
    setSelection({ hiragana: true, katakana: true, kanji: true, kanjiReverse: true, kanjiHiragana: true, hiraganaKanji: true })
  }

  const deselectAll = () => {
    setSelection({ hiragana: false, katakana: false, kanji: false, kanjiReverse: false, kanjiHiragana: false, hiraganaKanji: false })
  }

  const generate = useCallback(async () => {
    const [h, k, kj] = await Promise.all([loadHiragana(), loadKatakana(), loadKanji()])
    const mixed: QuizItem[] = []

    if (selection.hiragana) mixed.push(...getRandomItems(h, 4))
    if (selection.katakana) mixed.push(...getRandomItems(k, 4))
    if (selection.kanji) mixed.push(...getRandomItems(kj, 4))
    if (selection.kanjiReverse) {
      const items = getRandomItems(kj, 4).map((item: IKanji) => ({
        ...item, _qKey: 'bangla' as const, _aKey: 'char' as const,
        _question: item.bangla, _correct: item.char,
      }))
      mixed.push(...items as any)
    }
    if (selection.kanjiHiragana) {
      const items = getRandomItems(kj, 4).map((item: IKanji) => ({
        _question: item.char,
        _options: getOptions(item.onReading || item.kunReading || '—', kj, 'onReading' as keyof QuizItem),
        _correct: item.onReading || item.kunReading || '—',
      }))
      mixed.push(...items as any)
    }
    if (selection.hiraganaKanji) {
      const items = getRandomItems(kj, 4).map((item: IKanji) => ({
        _question: item.onReading || item.kunReading || '—',
        _options: getOptions(item.char, kj, 'char' as keyof QuizItem),
        _correct: item.char,
      }))
      mixed.push(...items as any)
    }

    const sliced = shuffleArray(mixed).slice(0, questionCount)
    const qs = sliced.map((item: any) => {
      if (item._question) {
        return { question: item._question, options: item._options, correct: item._correct, category: 'কাস্টম' }
      }
      const isKanji = 'meaning' in item
      const correct = isKanji
        ? (item as IKanji).bangla
        : (item as IHiragana | IKatakana).bangla
      const pool = isKanji ? kj : h
      const options = getOptions(correct, pool, 'bangla' as keyof QuizItem)
      const category = isKanji ? 'কানজি' : (item as any).romaji ? 'হিরাগানা' : 'কাটাকানা'
      return { question: item.char, options, correct, category }
    })

    setQuestions(qs)
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
    setStarted(true)
    setMistakes([])
  }, [selection, questionCount])

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
      category: q.category || 'কাস্টম',
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
        saveQuizResult({
          type: 'quiz',
          category: 'custom',
          score: newScore,
          total: questions.length,
          mistakes: newMistakes,
        })
        setFinished(true)
      }
    }, 800)
  }

  if (!started) {
    return (
      <div className="animate-fadeIn max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-6">
          <i className="fa-solid fa-sliders text-primary mr-2" />কাস্টম কুইজ
        </h1>

        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-text-main">ক্যাটাগরি নির্বাচন</h2>
            <div className="flex gap-1">
              <button onClick={selectAll} className="text-xs text-primary hover:bg-primary/10 px-2 py-1 rounded-lg transition">সব</button>
              <button onClick={deselectAll} className="text-xs text-text-muted hover:bg-surface-hover px-2 py-1 rounded-lg transition">ক্লিয়ার</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(defaults) as (keyof Selection)[]).map(key => (
              <button key={key} onClick={() => toggle(key)}
                className={`p-3 rounded-xl text-sm font-medium border transition-all ${
                  selection[key]
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-text-muted border-border hover:bg-surface-hover'
                }`}>
                {key === 'hiragana' ? 'হিরাগানা' :
                 key === 'katakana' ? 'কাটাকানা' :
                 key === 'kanji' ? 'কানজি → বাংলা' :
                 key === 'kanjiReverse' ? 'বাংলা → কানজি' :
                 key === 'kanjiHiragana' ? 'কানজি → হিরা' :
                 'হিরা → কানজি'}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-text-main mb-3">প্রশ্ন সংখ্যা</h2>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map(n => (
              <button key={n} onClick={() => setQuestionCount(n)}
                className={`flex-1 p-3 rounded-xl text-sm font-medium border transition-all ${
                  questionCount === n
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-text-muted border-border hover:bg-surface-hover'
                }`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <button onClick={generate} className="btn-primary w-full text-center">
          <i className="fa-solid fa-play mr-2" />কুইজ শুরু করুন
        </button>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="text-center py-12 animate-pop max-w-sm mx-auto">
        <div className="text-6xl mb-4">{pct >= 70 ? '🎉' : '💪'}</div>
        <h2 className="text-2xl font-bold text-text-main mb-4">কুইজ শেষ!</h2>
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
        <button onClick={() => setStarted(false)} className="btn-primary">
          <i className="fa-solid fa-rotate mr-2" />নতুন কুইজ
        </button>
      </div>
    )
  }

  const q = questions[currentIndex]
  const progress = (currentIndex / questions.length) * 100

  return (
    <div className="max-w-lg mx-auto animate-fadeIn">
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
            </button>
          )
        })}
      </div>
    </div>
  )
}
