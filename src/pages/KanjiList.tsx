import { useEffect, useState } from 'react'
import type { IKanji } from '../types'
import { loadKanji } from '../utils/loadData'
import ItemCard from '../components/ItemCard'

export default function KanjiList() {
  const [data, setData] = useState<IKanji[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadKanji().then(setData)
  }, [])

  const filtered = data.filter(
    item =>
      item.char.includes(search) ||
      item.bangla.includes(search) ||
      item.meaning.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
          কানজি <span className="text-primary">漢</span>
        </h1>
        <p className="text-text-muted mt-1">মোট {data.length}টি N5 কানজি। সার্চ করে খুঁজুন।</p>
      </div>

      <input
        type="text"
        placeholder="🔍 কানজি বা অর্থ লিখুন..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input-field mb-6"
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {filtered.map(item => (
          <ItemCard key={item.char} char={item.char} to={`/kanji/${encodeURIComponent(item.char)}`} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-8">কোনো ফলাফল পাওয়া যায়নি</p>
      )}
    </div>
  )
}
