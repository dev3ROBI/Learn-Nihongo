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
        <p className="text-text-muted">লোড হচ্ছে...</p>
        <Link to="/hiragana" className="text-primary block mt-4 hover:underline">← হিরাগানা লিস্টে ফিরুন</Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <Link to="/hiragana" className="text-primary hover:underline inline-block mb-6 text-sm">
        ← হিরাগানা লিস্ট
      </Link>

      <div className="card p-6 sm:p-8 mb-6">
        <div className="text-7xl sm:text-8xl mb-4">{item.char}</div>
        <div className="text-xl sm:text-2xl text-text-muted mb-2">{item.romaji}</div>
        <div className="text-lg sm:text-xl text-primary font-semibold mb-4">বাংলা: {item.bangla}</div>

        {item.example && (
          <div className="bg-surface-alt rounded-xl p-4 mb-4">
            <p className="text-xs text-text-muted uppercase tracking-wide mb-1">উদাহরণ</p>
            <p className="text-xl">{item.example}</p>
            <p className="text-text-muted text-sm">{item.meaning}</p>
          </div>
        )}

        <button
          onClick={() => speak(item.char)}
          className="btn-primary"
        >
          🔊 উচ্চারণ শুনুন
        </button>
      </div>
    </div>
  )
}
