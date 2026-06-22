export const speak = (text: string, lang: 'ja' | 'bn' = 'ja') => {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.8
  window.speechSynthesis.speak(utterance)
}
