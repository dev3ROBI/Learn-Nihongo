import { useEffect, useState } from 'react'
import type { IKatakana } from '../types'
import { loadKatakana } from '../utils/loadData'
import ItemCard from '../components/ItemCard'
import Loader from '../components/Loader'

export default function KatakanaList() {
  const [data, setData] = useState<IKatakana[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadKatakana().then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <Loader text="কাটাকানা লোড হচ্ছে..." />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
          <i className="fa-solid fa-k text-primary mr-2" />কাটাকানা <span className="text-primary">ア</span>
        </h1>
        <p className="text-text-muted mt-1 text-sm">মোট {data.length}টি অক্ষর। কার্ডে ক্লিক করে বিস্তারিত দেখুন।</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {data.map(item => (
          <ItemCard
            key={item.char}
            char={item.char}
            to={`/katakana/${encodeURIComponent(item.char)}`}
            subtitle={item.bangla}
            sublabel={item.romaji}
          />
        ))}
      </div>
    </div>
  )
}
