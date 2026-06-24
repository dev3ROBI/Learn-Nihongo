import { useEffect, useState } from 'react'
import type { IKatakana } from '../types'
import { loadKatakana } from '../utils/loadData'
import ItemCard from '../components/ItemCard'
import Loader from '../components/Loader'

export default function KatakanaList() {
  const [data, setData] = useState<IKatakana[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadKatakana().then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <Loader text="কাটাকানা লোড হচ্ছে..." />

  const filtered = search
    ? data.filter(item =>
        item.char.includes(search) ||
        item.romaji.toLowerCase().includes(search.toLowerCase()) ||
        item.bangla.includes(search)
      )
    : data

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
          <i className="fa-solid fa-k text-primary mr-2" />কাটাকানা <span className="text-primary">ア</span>
        </h1>
        <p className="text-text-muted mt-1 text-sm">মোট {data.length}টি অক্ষর। কার্ডে ক্লিক করে বিস্তারিত দেখুন।</p>
      </div>

      <div className="relative mb-6">
        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50 text-sm" />
        <input
          type="text"
          placeholder="অক্ষর, রোমাজি বা বাংলা লিখুন..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {filtered.map(item => (
          <ItemCard
            key={item.char}
            char={item.char}
            to={`/katakana/${encodeURIComponent(item.char)}`}
            subtitle={item.bangla}
            sublabel={item.romaji}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted text-sm">
          <i className="fa-solid fa-circle-exclamation mr-2" />কোনো ফলাফল পাওয়া যায়নি
        </div>
      )}
    </div>
  )
}
