import { useEffect, useState } from 'react'
import type { IHiragana } from '../types'
import { loadHiragana } from '../utils/loadData'
import ItemCard from '../components/ItemCard'

export default function HiraganaList() {
  const [data, setData] = useState<IHiragana[]>([])

  useEffect(() => {
    loadHiragana().then(setData)
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary mb-6">হিরাগানা <span className="text-primary">あ</span></h1>
      <p className="text-secondary/70 mb-6">মোট {data.length}টি অক্ষর। প্রতিটি কার্ডে ক্লিক করে বিস্তারিত দেখুন।</p>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.map(item => (
          <ItemCard key={item.char} char={item.char} to={`/hiragana/${encodeURIComponent(item.char)}`} />
        ))}
      </div>
    </div>
  )
}
