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
        <p className="text-text-muted">লোড হচ্ছে...</p>
        <Link to="/kanji" className="text-primary block mt-4 hover:underline">← কানজি লিস্টে ফিরুন</Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <Link to="/kanji" className="text-primary hover:underline inline-block mb-6 text-sm">
        ← কানজি লিস্ট
      </Link>

      <div className="card p-6 sm:p-8 mb-6">
        <div className="text-7xl sm:text-8xl mb-4">{item.char}</div>
        <div className="text-lg sm:text-xl text-primary font-semibold mb-4">বাংলা: {item.bangla}</div>
        <div className="text-text-muted mb-4">অর্থ: {item.meaning}</div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface-alt rounded-xl p-3">
            <p className="text-xs text-text-muted uppercase tracking-wide">অন-রিডিং</p>
            <p className="text-lg font-medium text-text-main">{item.onReading}</p>
          </div>
          <div className="bg-surface-alt rounded-xl p-3">
            <p className="text-xs text-text-muted uppercase tracking-wide">কুন-রিডিং</p>
            <p className="text-lg font-medium text-text-main">{item.kunReading}</p>
          </div>
        </div>

        <div className="bg-surface-alt rounded-xl p-4 mb-4">
          <p className="text-xs text-text-muted uppercase tracking-wide mb-1">উদাহরণ</p>
          <p className="text-xl">{item.example}</p>
        </div>

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
