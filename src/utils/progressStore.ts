export interface Mistake {
  question: string
  correctAnswer: string
  userAnswer: string
  category: string
  date: string
}

export interface QuizResult {
  date: string
  type: 'quiz' | 'timeattack' | 'matching' | 'random' | 'daily'
  category: string
  score: number
  total: number
  duration?: number
  mistakesCount?: number
}

export interface SRSItem {
  char: string
  type: 'hiragana' | 'katakana' | 'kanji'
  level: number
  nextReview: string
  lastReview: string
  ease: number
}

export interface Badge {
  id: string
  name: string
  icon: string
  unlockedAt: string
  desc: string
}

export interface DailyLog {
  date: string
  quizCount: number
  correctCount: number
  totalCount: number
  streak: number
}

export interface ProgressData {
  results: QuizResult[]
  mistakes: Mistake[]
  srsItems: SRSItem[]
  badges: Badge[]
  dailyLogs: DailyLog[]
}

const STORAGE_KEY = 'nihongo_progress'

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { results: [], mistakes: [], srsItems: [], badges: [], dailyLogs: [] }
}

function save(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getProgress(): ProgressData {
  return load()
}

function updateDailyLog(data: ProgressData, correct: number, total: number) {
  const today = new Date().toISOString().slice(0, 10)
  const existing = data.dailyLogs.find(d => d.date === today)
  if (existing) {
    existing.quizCount++
    existing.correctCount += correct
    existing.totalCount += total
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const prevLog = data.dailyLogs.find(d => d.date === yesterday)
    existing.streak = prevLog ? prevLog.streak + 1 : 1
  } else {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const prevLog = data.dailyLogs.find(d => d.date === yesterday)
    data.dailyLogs.push({
      date: today,
      quizCount: 1,
      correctCount: correct,
      totalCount: total,
      streak: prevLog ? prevLog.streak + 1 : 1,
    })
  }
}

function checkBadges(data: ProgressData) {
  const has = (id: string) => data.badges.some(b => b.id === id)
  const totalQuizzes = data.results.length
  const totalCorrect = data.results.reduce((s, r) => s + r.score, 0)
  const allMistakes = data.mistakes.length

  const badgeDefs: Badge[] = []

  if (!has('first_quiz') && totalQuizzes >= 1)
    badgeDefs.push({ id: 'first_quiz', name: 'প্রথম কুইজ', icon: '🎯', desc: '১ম কুইজ সম্পন্ন', unlockedAt: new Date().toISOString() })
  if (!has('quiz_10') && totalQuizzes >= 10)
    badgeDefs.push({ id: 'quiz_10', name: 'কুইজ মাস্টার', icon: '🏅', desc: '১০টি কুইজ সম্পন্ন', unlockedAt: new Date().toISOString() })
  if (!has('perfect') && data.results.some(r => r.score === r.total && r.total >= 10))
    badgeDefs.push({ id: 'perfect', name: 'পারফেক্ট', icon: '💯', desc: 'একটি কুইজে ১০/১০', unlockedAt: new Date().toISOString() })
  if (!has('streak_3') && data.dailyLogs.some(d => d.streak >= 3))
    badgeDefs.push({ id: 'streak_3', name: 'ধারাবাহিক', icon: '🔥', desc: '৩ দিন ধারাবাহিক', unlockedAt: new Date().toISOString() })
  if (!has('streak_7') && data.dailyLogs.some(d => d.streak >= 7))
    badgeDefs.push({ id: 'streak_7', name: 'সপ্তাহের যোদ্ধা', icon: '⭐', desc: '৭ দিন ধারাবাহিক', unlockedAt: new Date().toISOString() })
  if (!has('score_100') && totalCorrect >= 100)
    badgeDefs.push({ id: 'score_100', name: 'শতক', icon: '🌟', desc: '১০০টি সঠিক উত্তর', unlockedAt: new Date().toISOString() })
  if (!has('no_mistakes_10') && allMistakes === 0 && totalQuizzes >= 5)
    badgeDefs.push({ id: 'no_mistakes_10', name: 'নির্ভুল', icon: '🎯', desc: '৫টি কুইজে কোনো ভুল নেই', unlockedAt: new Date().toISOString() })

  if (badgeDefs.length > 0) {
    data.badges.push(...badgeDefs)
    save(data)
  }
  return badgeDefs
}

export function saveQuizResult(result: Omit<QuizResult, 'date'> & { mistakes: Mistake[] }) {
  const data = load()
  const entry: QuizResult = { ...result, date: new Date().toISOString() }
  data.results.push(entry)
  data.mistakes.push(...result.mistakes)
  updateDailyLog(data, result.score, result.total)
  save(data)
  const newBadges = checkBadges(data)
  return { newBadges }
}

export function getMistakes(): Mistake[] {
  return load().mistakes.slice().reverse()
}

export function getDailyLogs(): DailyLog[] {
  return load().dailyLogs
}

export function getBadges(): Badge[] {
  return load().badges
}

export function getStats() {
  const data = load()
  const totalQuizzes = data.results.length
  const totalCorrect = data.results.reduce((s, r) => s + r.score, 0)
  const totalQuestions = data.results.reduce((s, r) => s + r.total, 0)
  const totalMistakes = data.mistakes.length
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const currentStreak = data.dailyLogs.length > 0 ? data.dailyLogs[data.dailyLogs.length - 1].streak : 0
  const today = new Date().toISOString().slice(0, 10)
  const studiedToday = data.dailyLogs.some(d => d.date === today)

  return {
    totalQuizzes,
    totalCorrect,
    totalQuestions,
    totalMistakes,
    accuracy,
    currentStreak,
    studiedToday,
    badges: data.badges.length,
    srsItems: data.srsItems.length,
  }
}

export function getWeeklyStats() {
  const logs = getDailyLogs()
  const days: { date: string; correct: number; total: number; count: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    const log = logs.find(l => l.date === d)
    days.push(log
      ? { date: d, correct: log.correctCount, total: log.totalCount, count: log.quizCount }
      : { date: d, correct: 0, total: 0, count: 0 })
  }
  return days
}

export function getCategoryStats() {
  const data = load()
  const map = new Map<string, { correct: number; total: number }>()
  for (const r of data.results) {
    const cat = r.category || 'unknown'
    const cur = map.get(cat) || { correct: 0, total: 0 }
    cur.correct += r.score
    cur.total += r.total
    map.set(cat, cur)
  }
  return Array.from(map.entries()).map(([category, stats]) => ({
    category,
    ...stats,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }))
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getSRSItems(): SRSItem[] {
  return load().srsItems
}

export function updateSRSItem(char: string, type: SRSItem['type'], correct: boolean) {
  const data = load()
  let item = data.srsItems.find(s => s.char === char && s.type === type)
  const now = new Date().toISOString()
  if (!item) {
    item = { char, type, level: correct ? 1 : 0, nextReview: now, lastReview: now, ease: 2.5 }
    data.srsItems.push(item)
  }
  item.lastReview = now
  if (correct) {
    item.level = Math.min(item.level + 1, 5)
    item.ease = Math.min(item.ease + 0.15, 3.0)
  } else {
    item.level = Math.max(item.level - 1, 0)
    item.ease = Math.max(item.ease - 0.2, 1.3)
  }
  const intervals = [0, 1, 3, 7, 14, 30]
  const days = intervals[item.level] ?? 30
  const next = new Date(Date.now() + days * 86400000)
  item.nextReview = next.toISOString()
  save(data)
}

export function getDueSRSItems(): SRSItem[] {
  const now = new Date().toISOString()
  return load().srsItems.filter(s => s.nextReview <= now)
}
