import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { IKanji } from '../types'
import { loadKanji } from '../utils/loadData'
import { speak } from '../utils/speak'
import Loader from '../components/Loader'

export default function KanjiDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<IKanji | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    loadKanji().then(data => {
      const found = data.find(d => d.char === id)
      setItem(found || null)
      setLoading(false)
    })
  }, [id])

  if (loading) return <Loader text="লোড হচ্ছে..." />

  if (!item) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <i className="fa-solid fa-circle-exclamation text-4xl text-text-muted mb-4" />
        <p className="text-text-muted">কানজিটি পাওয়া যায়নি</p>
        <Link to="/kanji" className="text-primary block mt-4 hover:underline">
          <i className="fa-solid fa-arrow-left mr-1" />কানজি লিস্টে ফিরুন
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto text-center animate-fadeIn">
      <Link to="/kanji" className="text-primary hover:underline inline-flex items-center mb-6 text-sm gap-1">
        <i className="fa-solid fa-arrow-left" /> কানজি লিস্ট
      </Link>

      <div className="card p-6 sm:p-8 mb-6">
        <div className="text-7xl sm:text-8xl mb-2">{item.char}</div>

        {item.banglaUccharon && (
          <div className="inline-flex items-center gap-2 bg-surface-alt rounded-full px-4 py-1.5 mb-3">
            <i className="fa-solid fa-language text-primary text-xs" />
            <span className="text-sm text-text-muted font-medium">{item.banglaUccharon}</span>
          </div>
        )}

        <div className="text-lg sm:text-xl text-primary font-semibold mb-1">বাংলা: {item.bangla}</div>
        <div className="text-text-muted text-sm mb-4">
          <i className="fa-solid fa-globe mr-1" />অর্থ: {item.meaning}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface-alt rounded-xl p-3">
            <p className="text-xs text-text-muted uppercase tracking-wide">
              <i className="fa-solid fa-music mr-1" />অন-রিডিং
            </p>
            <p className="text-lg font-medium text-text-main">{item.onReading}</p>
          </div>
          <div className="bg-surface-alt rounded-xl p-3">
            <p className="text-xs text-text-muted uppercase tracking-wide">
              <i className="fa-solid fa-book mr-1" />কুন-রিডিং
            </p>
            <p className="text-lg font-medium text-text-main">{item.kunReading || '—'}</p>
          </div>
        </div>

        <div className="bg-surface-alt rounded-xl p-4 mb-4">
          <p className="text-xs text-text-muted uppercase tracking-wide mb-1">
            <i className="fa-solid fa-pen-fine mr-1" />উদাহরণ
          </p>
          <p className="text-xl">{item.example}</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => speak(item.char)} className="btn-primary">
            <i className="fa-solid fa-volume-high mr-2" />উচ্চারণ শুনুন
          </button>
          {item.onReading && (
            <button onClick={() => speak(item.onReading)} className="btn-ghost text-sm">
              <i className="fa-solid fa-ear-listen mr-1" />অন-রিডিং
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
