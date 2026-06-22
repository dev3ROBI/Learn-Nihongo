import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { IHiragana } from '../types'
import { loadHiragana } from '../utils/loadData'
import { speak } from '../utils/speak'

export default function HiraganaDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<IHiragana | null>(null)

  useEffect(() => {
    loadHiragana().then(data => {
      const found = data.find(d => d.char === id)
      setItem(found || null)
    })
  }, [id])

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary/60">লোড হচ্ছে...</p>
        <Link to="/hiragana" className="text-primary block mt-4 hover:underline">← হিরাগানা লিস্টে ফিরুন</Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <Link to="/hiragana" className="text-primary hover:underline block mb-6 text-left">← হিরাগানা লিস্ট</Link>

      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-6">
        <div className="text-8xl mb-4">{item.char}</div>
        <div className="text-2xl text-secondary/80 mb-2">{item.romaji}</div>
        <div className="text-xl text-primary font-semibold mb-4">বাংলা: {item.bangla}</div>

        {item.example && (
          <div className="bg-accent/50 rounded-xl p-4 mb-4">
            <p className="text-sm text-secondary/60">উদাহরণ</p>
            <p className="text-xl">{item.example}</p>
            <p className="text-secondary/70">{item.meaning}</p>
          </div>
        )}

        <button
          onClick={() => speak(item.char)}
          className="bg-primary text-secondary px-6 py-3 rounded-xl text-lg font-semibold hover:bg-primary/80 transition"
        >
          🔊 উচ্চারণ শুনুন
        </button>
      </div>
    </div>
  )
}
