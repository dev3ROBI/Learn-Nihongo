export interface IHiragana {
  char: string;
  romaji: string;
  bangla: string;
  example?: string;
  meaning?: string;
}

export interface IKatakana {
  char: string;
  romaji: string;
  bangla: string;
  example?: string;
  meaning?: string;
}

export interface IKanji {
  char: string;
  meaning: string;
  onReading: string;
  kunReading: string;
  example: string;
  bangla: string;
  banglaUccharon?: string;
}

export type QuizItem = IHiragana | IKatakana | IKanji;

export interface IQuestion {
  item: QuizItem;
  options: string[];
  correct: string;
  type: 'hiragana' | 'katakana' | 'kanji';
}
