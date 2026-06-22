export default function About() {
  return (
    <div className="max-w-lg mx-auto text-center py-8">
      <div className="text-6xl mb-4">🇯🇵</div>
      <h1 className="text-3xl font-bold text-secondary mb-4">Learn Nihongo</h1>
      <p className="text-secondary/70 mb-6">
        একটি বাংলা ভাষাভাষীদের জন্য JLPT N5 লেভেলের জাপানি ভাষা শেখার অ্যাপ।
      </p>

      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-4 text-left">
        <h2 className="text-xl font-semibold text-secondary mb-3">বৈশিষ্ট্য</h2>
        <ul className="space-y-2 text-secondary/70">
          <li>✅ হিরাগানা ও কাটাকানা শেখা</li>
          <li>✅ ৮০+ N5 কানজি</li>
          <li>✅ কুইজ ও ফ্ল্যাশকার্ড</li>
          <li>✅ টাইম অ্যাটাক গেম</li>
          <li>✅ ম্যাচিং গেম</li>
          <li>✅ উচ্চারণ শুনুন</li>
        </ul>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-left">
        <h2 className="text-xl font-semibold text-secondary mb-3">প্রযুক্তি</h2>
        <ul className="space-y-2 text-secondary/70">
          <li>⚛️ React + TypeScript</li>
          <li>⚡ Vite</li>
          <li>🎨 Tailwind CSS</li>
          <li>🗺️ React Router</li>
        </ul>
      </div>

      <p className="text-secondary/50 text-sm mt-6">
        তৈরি করেছেন ❤️ দিয়ে
      </p>
    </div>
  )
}
