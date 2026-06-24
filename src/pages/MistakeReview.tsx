import { useState } from 'react'
import type { Mistake } from '../utils/progressStore'
import { getMistakes } from '../utils/progressStore'
import { speak } from '../utils/speak'

export default function MistakeReview() {
  const [mistakes] = useState<Mistake[]>(() => getMistakes())
  const [filter, setFilter] = useState<string>('all')

  const categories = Array.from(new Set(mistakes.map(m => m.category)))
  const filtered = filter === 'all' ? mistakes : mistakes.filter(m => m.category === filter)

  return (
    <div className="animate-fadeIn max-w-lg mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-4">
        <i className="fa-solid fa-circle-exclamation text-primary mr-2" />ভুল পর্যালোচনা
      </h1>

      {mistakes.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <i className="fa-solid fa-check-circle text-5xl text-success mb-4 block" />
          <p className="font-semibold">কোনো ভুল নেই!</p>
          <p className="text-sm mt-1">সব উত্তরই সঠিক হয়েছে। ভালো আছেন!</p>
        </div>
      ) : (
        <>
          <p className="text-text-muted text-sm mb-4">মোট {mistakes.length}টি ভুল রেকর্ড করা আছে</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === 'all' ? 'bg-primary text-white' : 'bg-surface text-text-muted border border-border'}`}>
              সবগুলো
            </button>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === c ? 'bg-primary text-white' : 'bg-surface text-text-muted border border-border'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((m, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-lg font-medium text-text-main mb-1">{m.question}</div>
                    <div className="text-xs text-text-muted mb-2">{m.category} • {new Date(m.date).toLocaleDateString('bn')}</div>
                  </div>
                  <button onClick={() => speak(m.question)}
                    className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition text-sm">
                    <i className="fa-solid fa-volume-high" />
                  </button>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-success font-medium flex items-center gap-1">
                    <i className="fa-solid fa-check" />{m.correctAnswer}
                  </span>
                  <span className="text-text-muted">→</span>
                  <span className="text-error font-medium flex items-center gap-1">
                    <i className="fa-solid fa-xmark" />{m.userAnswer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
