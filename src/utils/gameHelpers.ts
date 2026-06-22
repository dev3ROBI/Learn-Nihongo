import type { QuizItem } from '../types'

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count)
}

export function getOptions(
  correctAnswer: string,
  allData: QuizItem[],
  key: keyof QuizItem
): string[] {
  const wrong = shuffleArray(
    allData.filter(item => item[key] !== correctAnswer)
  )
    .slice(0, 3)
    .map(item => String(item[key]))

  return shuffleArray([correctAnswer, ...wrong])
}
