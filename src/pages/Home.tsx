import { Link } from 'react-router-dom'

const features = [
  { icon: 'あ', label: 'হিরাগানা', desc: '৪৬টি বেসিক অক্ষর', to: '/hiragana' },
  { icon: 'ア', label: 'কাটাকানা', desc: '৪৬টি কাটাকানা অক্ষর', to: '/katakana' },
  { icon: '漢', label: 'কানজি', desc: '৮০+ N5 কানজি', to: '/kanji' },
  { icon: '🎯', label: 'কুইজ', desc: 'পরীক্ষা দিন', to: '/quiz' },
  { icon: '🃏', label: 'ফ্ল্যাশকার্ড', desc: 'দ্রুত মনে রাখুন', to: '/flashcard' },
  { icon: '⏱️', label: 'টাইম অ্যাটাক', desc: 'সময়ের সাথে লড়াই', to: '/timeattack' },
  { icon: '🔗', label: 'ম্যাচিং', desc: 'জোড়া মেলান', to: '/matching' },
  { icon: '🎲', label: 'র‌্যান্ডম', desc: 'এলোমেলো চ্যালেঞ্জ', to: '/random' },
]

export default function Home() {
  return (
    <div>
      <div className="text-center py-12">
        <div className="text-8xl mb-4">🇯🇵</div>
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-3">
          Learn Nihongo
        </h1>
        <p className="text-lg text-secondary/70 mb-8 max-w-md mx-auto">
          বাংলায় জাপানি ভাষা শিখুন। JLPT N5 লেভেলের জন্য সম্পূর্ণ গাইড।
        </p>
        <Link
          to="/hiragana"
          className="inline-block bg-primary text-secondary px-10 py-4 rounded-xl text-xl font-semibold hover:bg-primary/80 transition shadow-lg"
        >
          শেখা শুরু করুন
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {features.map(f => (
          <Link
            key={f.to}
            to={f.to}
            className="bg-white/10 backdrop-blur rounded-xl p-5 text-center hover:scale-105 transition-transform duration-200 border border-white/20 hover:border-primary/50"
          >
            <div className="text-3xl mb-2">{f.icon}</div>
            <div className="font-semibold text-secondary">{f.label}</div>
            <div className="text-xs text-secondary/60 mt-1">{f.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
