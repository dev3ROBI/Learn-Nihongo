import { useState } from 'react'
import { getStats, getWeeklyStats, getCategoryStats, getBadges, getDailyLogs, clearProgress } from '../utils/progressStore'

function weekDayLabel(dateStr: string): string {
  const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি']
  const d = new Date(dateStr)
  return days[d.getDay()]
}

export default function ProgressDashboard() {
  const [stats] = useState(() => getStats())
  const [weekly] = useState(() => getWeeklyStats())
  const [catStats] = useState(() => getCategoryStats())
  const [badges] = useState(() => getBadges())
  const [logs] = useState(() => getDailyLogs())
  const [showClear, setShowClear] = useState(false)

  const maxWeekly = Math.max(...weekly.map(w => w.correct), 1)

  return (
    <div className="animate-fadeIn max-w-lg mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-6">
        <i className="fa-solid fa-chart-line text-primary mr-2" />প্রোগ্রেস ড্যাশবোর্ড
      </h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.currentStreak}</div>
          <div className="text-xs text-text-muted">দিন ধারাবাহিক</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-success">{stats.accuracy}%</div>
          <div className="text-xs text-text-muted">নির্ভুলতা</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-text-main">{stats.totalQuizzes}</div>
          <div className="text-xs text-text-muted">মোট কুইজ</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-text-main">{stats.totalCorrect}</div>
          <div className="text-xs text-text-muted">সঠিক উত্তর</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-text-main">{stats.totalQuestions}</div>
          <div className="text-xs text-text-muted">মোট প্রশ্ন</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-text-main">{stats.totalMistakes}</div>
          <div className="text-xs text-text-muted">মোট ভুল</div>
        </div>
      </div>

      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">
          <i className="fa-solid fa-calendar-week text-primary text-sm" />সাপ্তাহিক অগ্রগতি
        </h2>
        <div className="flex items-end gap-1.5 h-24">
          {weekly.map((day, i) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-text-muted/60 font-medium">{day.correct}</span>
              <div
                className="w-full rounded-t-md transition-all bg-primary/70 hover:bg-primary"
                style={{ height: `${(day.correct / maxWeekly) * 100}%`, minHeight: day.correct > 0 ? '4px' : '2px' }}
              />
              <span className={`text-[10px] font-medium ${i === 6 ? 'text-primary' : 'text-text-muted/60'}`}>
                {weekDayLabel(day.date)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {catStats.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-primary text-sm" />ক্যাটাগরি স্ট্যাটস
          </h2>
          <div className="space-y-3">
            {catStats.map(cat => (
              <div key={cat.category}>
                <div className="flex justify-between text-xs text-text-muted mb-1">
                  <span>{cat.category}</span>
                  <span>{cat.correct}/{cat.total} ({cat.accuracy}%)</span>
                </div>
                <div className="w-full bg-surface-alt rounded-full h-2">
                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${cat.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {badges.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">
            <i className="fa-solid fa-medal text-primary text-sm" />ব্যাজসমূহ ({badges.length})
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {badges.map(b => (
              <div key={b.id} className="flex items-center gap-2 bg-surface-alt rounded-xl p-3">
                <span className="text-xl">{b.icon}</span>
                <div>
                  <div className="text-sm font-medium text-text-main">{b.name}</div>
                  <div className="text-[10px] text-text-muted">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-text-main mb-3 flex items-center gap-2">
          <i className="fa-solid fa-fire text-primary text-sm" />ডেইলি স্ট্রিক
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {logs.slice(-14).map(log => (
            <div key={log.date} className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                log.correctCount > 0
                  ? log.correctCount === log.totalCount
                    ? 'bg-success-bg text-success'
                    : 'bg-primary/10 text-primary'
                  : 'bg-surface-alt text-text-muted/40'
              }`}>
                {new Date(log.date).getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setShowClear(true)} className="text-text-muted/50 text-xs hover:text-error transition w-full text-center py-3 group">
        <i className="fa-solid fa-trash-can mr-1 group-hover:scale-110 transition-transform inline-block" />সব ডাটা মুছুন
      </button>

      {showClear && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-modal-backdrop"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          onClick={() => setShowClear(false)}
        >
          <div
            className="animate-modal w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-surface rounded-2xl border border-border shadow-2xl p-6 sm:p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-error-bg flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-trash-can text-xl text-error" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">ডাটা মুছবেন?</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                আপনার সব প্রোগ্রেস, স্কোর, ব্যাজ ও স্ট্রিক স্থায়ীভাবে মুছে যাবে।<br />
                <span className="text-error font-medium">এই কাজটি ফিরিয়ে আনা যাবে না।</span>
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { clearProgress(); setShowClear(false); window.location.reload() }}
                  className="w-full bg-error text-white rounded-xl py-3 font-semibold hover:bg-red-700 transition active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-trash-can" />হ্যাঁ, সব মুছুন
                </button>
                <button
                  onClick={() => setShowClear(false)}
                  className="w-full bg-surface-alt text-text-main rounded-xl py-3 font-medium hover:bg-surface-hover transition active:scale-[0.98]"
                >
                  বাতিল করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
