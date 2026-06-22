import { useEffect, useState } from 'react'
import type { IHiragana } from '../types'
import { loadHiragana } from '../utils/loadData'
import ItemCard from '../components/ItemCard'
import Loader from '../components/Loader'

export default function HiraganaList() {
  const [data, setData] = useState<IHiragana[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHiragana().then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <Loader text="হিরাগানা লোড হচ্ছে..." />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
          <i className="fa-solid fa-j text-primary mr-2" />হিরাগানা <span className="text-primary">あ</span>
        </h1>
        <p className="text-text-muted mt-1 text-sm">মোট {data.length}টি অক্ষর। কার্ডে ক্লিক করে বিস্তারিত দেখুন।</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {data.map(item => (
          <ItemCard
            key={item.char}
            char={item.char}
            to={`/hiragana/${encodeURIComponent(item.char)}`}
            subtitle={item.bangla}
            sublabel={item.romaji}
          />
        ))}
      </div>
    </div>
  )
}
