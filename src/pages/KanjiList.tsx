import { useEffect, useState } from 'react'
import type { IKanji } from '../types'
import { loadKanji } from '../utils/loadData'
import ItemCard from '../components/ItemCard'
import Loader from '../components/Loader'

export default function KanjiList() {
  const [data, setData] = useState<IKanji[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadKanji().then(d => { setData(d); setLoading(false) })
  }, [])

  const filtered = data.filter(
    item =>
      item.char.includes(search) ||
      item.bangla.includes(search) ||
      item.meaning.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Loader text="কানজি লোড হচ্ছে..." />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
          <i className="fa-solid fa-c text-primary mr-2" />কানজি <span className="text-primary">漢</span>
        </h1>
        <p className="text-text-muted mt-1 text-sm">মোট {data.length}টি N5 কানজি। সার্চ করে খুঁজুন।</p>
      </div>

      <div className="relative mb-6">
        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50 text-sm" />
        <input
          type="text"
          placeholder="কানজি বা অর্থ লিখুন..."
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
            to={`/kanji/${encodeURIComponent(item.char)}`}
            subtitle={item.bangla}
            sublabel={item.meaning}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-8 text-sm">
          <i className="fa-solid fa-circle-exclamation mr-2" />কোনো ফলাফল পাওয়া যায়নি
        </p>
      )}
    </div>
  )
}
