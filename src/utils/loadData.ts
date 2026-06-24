import type { IHiragana, IKatakana, IKanji } from '../types'

const cache = new Map<string, any[]>()

async function loadJSON<T>(path: string): Promise<T[]> {
  if (cache.has(path)) return cache.get(path) as T[]
  try {
    const res = await fetch(path)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`)
    const data: T[] = await res.json()
    cache.set(path, data)
    return data
  } catch (err) {
    console.error(`Failed to load ${path}:`, err)
    return []
  }
}

export const loadHiragana = (): Promise<IHiragana[]> =>
  loadJSON<IHiragana>('/data/hiragana.json')

export const loadKatakana = (): Promise<IKatakana[]> =>
  loadJSON<IKatakana>('/data/katakana.json')

export const loadKanji = (): Promise<IKanji[]> =>
  loadJSON<IKanji>('/data/kanji.json')
