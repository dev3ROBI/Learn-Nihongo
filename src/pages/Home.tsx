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
      <div className="text-center py-8 sm:py-12 md:py-16">
        <div className="text-7xl sm:text-8xl md:text-9xl mb-4">🇯🇵</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-main mb-3 tracking-tight">
          Learn Nihongo
        </h1>
        <p className="text-base sm:text-lg text-text-muted mb-8 max-w-md mx-auto px-4">
          বাংলায় জাপানি ভাষা শিখুন। JLPT N5 লেভেলের জন্য সম্পূর্ণ গাইড।
        </p>
        <Link
          to="/hiragana"
          className="btn-primary inline-flex text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4"
        >
          শেখা শুরু করুন
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
        {features.map(f => (
          <Link
            key={f.to}
            to={f.to}
            className="card p-4 sm:p-5 text-center hover:scale-[1.03] active:scale-100 group"
          >
            <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform inline-block">
              {f.icon}
            </div>
            <div className="font-semibold text-text-main text-sm sm:text-base">{f.label}</div>
            <div className="text-xs text-text-muted mt-1">{f.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
