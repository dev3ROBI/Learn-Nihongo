import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="max-w-lg mx-auto py-8 animate-fadeIn">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🇯🇵</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">
          Learn Nihongo
        </h1>
        <p className="text-text-muted text-sm sm:text-base">
          বাংলা ভাষাভাষীদের জন্য JLPT N5 লেভেলের জাপানি ভাষা শেখার সম্পূর্ণ অ্যাপ।
        </p>
      </div>

      <div className="card p-5 sm:p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-lg sm:text-xl font-semibold text-text-main mb-3">
          <i className="fa-solid fa-star text-primary mr-2" />বৈশিষ্ট্য
        </h2>
        <ul className="space-y-2.5 text-text-muted text-sm sm:text-base">
          {[
            'হিরাগানা ও কাটাকানা — ৪৬টি করে অক্ষর',
            '৮০+ N5 লেভেলের কানজি',
            'SRS ফ্ল্যাশকার্ড (স্পেসড রিপিটিশন)',
            'কুইজ, কাস্টম কুইজ, টাইম অ্যাটাক',
            'ম্যাচিং গেম — কানজি-হিরাগানা মেলানো',
            'ডেইলি চ্যালেঞ্জ',
            'লেখা প্র্যাকটিস — ক্যানভাসে আঁকুন',
            'প্রোগ্রেস ড্যাশবোর্ড, ব্যাজ ও স্ট্যাটস',
            'ভুল পর্যালোচনা',
            'উচ্চারণ — Speech Synthesis',
            'PWA — ইনস্টলযোগ্য',
            'ডার্ক ও লাইট মোড',
            'পূর্ণ রেস্পন্সিভ ডিজাইন',
          ].map(text => (
            <li key={text} className="flex items-start gap-2">
              <i className="fa-solid fa-check text-success mt-0.5 shrink-0" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-5 sm:p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-lg sm:text-xl font-semibold text-text-main mb-3">
          <i className="fa-solid fa-code text-primary mr-2" />প্রযুক্তি স্ট্যাক
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: 'fa-brands fa-react', label: 'React 19' },
            { icon: 'fa-brands fa-js', label: 'TypeScript' },
            { icon: 'fa-solid fa-bolt', label: 'Vite 8' },
            { icon: 'fa-brands fa-css3-alt', label: 'Tailwind v4' },
            { icon: 'fa-solid fa-route', label: 'React Router 7' },
            { icon: 'fa-solid fa-volume-high', label: 'Web Speech API' },
          ].map(t => (
            <div key={t.label} className="bg-surface-alt/50 rounded-xl p-3 flex items-center gap-3">
              <i className={`${t.icon} text-primary text-lg`} />
              <span className="text-text-muted text-sm">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 sm:p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-lg sm:text-xl font-semibold text-text-main mb-3">
          <i className="fa-solid fa-user text-primary mr-2" />ডেভেলপার
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl shrink-0">
            <i className="fa-solid fa-user text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text-main">Robiul Islam</h3>
            <p className="text-text-muted text-sm">ফুল-স্ট্যাক ডেভেলপার</p>
          </div>
        </div>
        <p className="text-text-muted text-sm leading-relaxed mb-4">
          আমি একজন প্যাশনেট ফুল-স্ট্যাক ডেভেলপার। আমি React, TypeScript, PHP,
          এবং JavaScript নিয়ে কাজ করি। এই অ্যাপটি তৈরি করেছি বাংলাভাষীদের জাপানি
          ভাষা শেখার জন্য।
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://me.robicodes.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-globe" /> ওয়েবসাইট
          </a>
          <a
            href="https://github.com/dev3ROBI"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm inline-flex items-center gap-2"
          >
            <i className="fa-brands fa-github" /> GitHub
          </a>
          <a
            href="https://www.facebook.com/iam.robi69/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm inline-flex items-center gap-2"
          >
            <i className="fa-brands fa-facebook" /> Facebook
          </a>
        </div>
      </div>

      <p className="text-center text-text-muted/50 text-xs">
        তৈরি করেছেন <i className="fa-solid fa-heart text-primary mx-0.5" /> দিয়ে — Robiul Islam
      </p>
    </div>
  )
}
