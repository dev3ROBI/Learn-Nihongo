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
      <h1 className="text-3xl font-bold text-secondary mb-6">কানজি <span className="text-primary">漢</span></h1>
      <p className="text-secondary/70 mb-4">মোট {data.length}টি N5 কানজি। সার্চ করে খুঁজুন।</p>

      <input
        type="text"
        placeholder="🔍 কানজি বা অর্থ লিখুন..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-secondary placeholder-secondary/50 mb-6 focus:outline-none focus:border-primary"
      />

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map(item => (
          <ItemCard key={item.char} char={item.char} to={`/kanji/${encodeURIComponent(item.char)}`} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-secondary/60 py-8">কোনো ফলাফল পাওয়া যায়নি</p>
      )}
    </div>
  )
}
