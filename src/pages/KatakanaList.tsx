import { useEffect, useState } from 'react'
import type { IKatakana } from '../types'
import { loadKatakana } from '../utils/loadData'
import ItemCard from '../components/ItemCard'

export default function KatakanaList() {
  const [data, setData] = useState<IKatakana[]>([])

  useEffect(() => {
    loadKatakana().then(setData)
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary mb-6">কাটাকানা <span className="text-primary">ア</span></h1>
      <p className="text-secondary/70 mb-6">মোট {data.length}টি অক্ষর। প্রতিটি কার্ডে ক্লিক করে বিস্তারিত দেখুন।</p>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.map(item => (
          <ItemCard key={item.char} char={item.char} to={`/katakana/${encodeURIComponent(item.char)}`} />
        ))}
      </div>
    </div>
  )
}
