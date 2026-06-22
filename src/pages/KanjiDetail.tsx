import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { IKanji } from '../types'
import { loadKanji } from '../utils/loadData'
import { speak } from '../utils/speak'

export default function KanjiDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<IKanji | null>(null)

  useEffect(() => {
    loadKanji().then(data => {
      const found = data.find(d => d.char === id)
      setItem(found || null)
    })
  }, [id])

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary/60">লোড হচ্ছে...</p>
        <Link to="/kanji" className="text-primary block mt-4 hover:underline">← কানজি লিস্টে ফিরুন</Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <Link to="/kanji" className="text-primary hover:underline block mb-6 text-left">← কানজি লিস্ট</Link>

      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-6">
        <div className="text-8xl mb-4">{item.char}</div>
        <div className="text-xl text-primary font-semibold mb-4">বাংলা: {item.bangla}</div>
        <div className="text-lg text-secondary/80 mb-2">অর্থ: {item.meaning}</div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-accent/50 rounded-xl p-3">
            <p className="text-xs text-secondary/60">অন-রিডিং</p>
            <p className="text-lg">{item.onReading}</p>
          </div>
          <div className="bg-accent/50 rounded-xl p-3">
            <p className="text-xs text-secondary/60">কুন-রিডিং</p>
            <p className="text-lg">{item.kunReading}</p>
          </div>
        </div>

        <div className="bg-accent/50 rounded-xl p-4 mb-4">
          <p className="text-sm text-secondary/60">উদাহরণ</p>
          <p className="text-xl">{item.example}</p>
        </div>

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
