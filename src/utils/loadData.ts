import type { IHiragana, IKatakana, IKanji } from '../types'

export const loadHiragana = (): Promise<IHiragana[]> =>
  fetch('/data/hiragana.json').then(res => res.json())

export const loadKatakana = (): Promise<IKatakana[]> =>
  fetch('/data/katakana.json').then(res => res.json())

export const loadKanji = (): Promise<IKanji[]> =>
  fetch('/data/kanji.json').then(res => res.json())
