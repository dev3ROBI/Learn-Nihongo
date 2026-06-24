import { Link } from 'react-router-dom'
import { getStats } from '../utils/progressStore'

const features = [
  { icon: 'fa-solid fa-j', label: 'হিরাগানা', desc: '৪৬টি বেসিক অক্ষর', to: '/hiragana' },
  { icon: 'fa-solid fa-k', label: 'কাটাকানা', desc: '৪৬টি কাটাকানা অক্ষর', to: '/katakana' },
  { icon: 'fa-solid fa-c', label: 'কানজি', desc: '৮০+ N5 কানজি', to: '/kanji' },
  { icon: 'fa-solid fa-brain', label: 'SRS কার্ড', desc: 'স্পেসড রিপিটিশন', to: '/srs' },
  { icon: 'fa-solid fa-pen-fine', label: 'লেখা প্র্যাকটিস', desc: 'ক্যানভাসে আঁকুন', to: '/writing' },
  { icon: 'fa-solid fa-question', label: 'কুইজ', desc: 'পরীক্ষা দিন', to: '/quiz' },
  { icon: 'fa-solid fa-sliders', label: 'কাস্টম কুইজ', desc: 'নিজে বেছে নিন', to: '/custom-quiz' },
  { icon: 'fa-solid fa-layer-group', label: 'ফ্ল্যাশকার্ড', desc: 'দ্রুত মনে রাখুন', to: '/flashcard' },
  { icon: 'fa-solid fa-stopwatch', label: 'টাইম অ্যাটাক', desc: 'সময়ের সাথে লড়াই', to: '/timeattack' },
  { icon: 'fa-solid fa-puzzle-piece', label: 'ম্যাচিং', desc: 'জোড়া মেলান', to: '/matching' },
  { icon: 'fa-solid fa-dice', label: 'র‌্যান্ডম', desc: 'এলোমেলো চ্যালেঞ্জ', to: '/random' },
  { icon: 'fa-solid fa-calendar-day', label: 'ডেইলি', desc: 'প্রতিদিনের চ্যালেঞ্জ', to: '/daily' },
  { icon: 'fa-solid fa-circle-exclamation', label: 'ভুল রিভিউ', desc: 'ভুলগুলো দেখুন', to: '/mistakes' },
  { icon: 'fa-solid fa-chart-line', label: 'প্রোগ্রেস', desc: 'স্ট্যাটস ও গ্রাফ', to: '/progress' },
]

export default function Home() {
  const stats = getStats()

  return (
    <div>
      <div className="text-center py-8 sm:py-12 md:py-16">
        <div className="text-7xl sm:text-8xl md:text-9xl mb-4">🇯🇵</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-main mb-3 tracking-tight">
          Learn Nihongo
        </h1>
        <p className="text-base sm:text-lg text-text-muted mb-6 max-w-md mx-auto px-4">
          বাংলায় জাপানি ভাষা শিখুন। JLPT N5 লেভেলের জন্য সম্পূর্ণ গাইড।
        </p>

        {stats.totalQuizzes > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
              <i className="fa-solid fa-fire" />{stats.currentStreak} দিন স্ট্রিক
            </div>
            <div className="bg-success-bg text-success px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
              <i className="fa-solid fa-star" />{stats.accuracy}% নির্ভুলতা
            </div>
            <div className="bg-surface text-text-muted px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 border border-border">
              <i className="fa-solid fa-medal" />{stats.badges} ব্যাজ
            </div>
          </div>
        )}

        <Link
          to="/hiragana"
          className="btn-primary inline-flex items-center gap-2 text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4"
        >
          শেখা শুরু করুন <i className="fa-solid fa-arrow-right text-sm" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
        {features.map(f => (
          <Link
            key={f.to}
            to={f.to}
            className="card p-4 sm:p-5 text-center hover:scale-[1.03] active:scale-100 group"
          >
            <div className="text-xl sm:text-2xl mb-2 group-hover:scale-110 transition-transform inline-block w-8 h-8 flex items-center justify-center text-primary">
              <i className={f.icon} />
            </div>
            <div className="font-semibold text-text-main text-sm sm:text-base">{f.label}</div>
            <div className="text-xs text-text-muted mt-1">{f.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
