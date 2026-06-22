export default function About() {
  return (
    <div className="max-w-lg mx-auto text-center py-8">
      <div className="text-6xl mb-4">🇯🇵</div>
      <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-4">
        <i className="fa-solid fa-circle-info text-primary mr-2" />Learn Nihongo
      </h1>
      <p className="text-text-muted mb-6 text-sm sm:text-base">
        একটি বাংলা ভাষাভাষীদের জন্য JLPT N5 লেভেলের জাপানি ভাষা শেখার অ্যাপ।
      </p>

      <div className="card p-5 sm:p-6 mb-4 text-left">
        <h2 className="text-lg sm:text-xl font-semibold text-text-main mb-3">
          <i className="fa-solid fa-star text-primary mr-2" />বৈশিষ্ট্য
        </h2>
        <ul className="space-y-2 text-text-muted text-sm sm:text-base">
          <li><i className="fa-solid fa-check text-success mr-2" />হিরাগানা ও কাটাকানা শেখা</li>
          <li><i className="fa-solid fa-check text-success mr-2" />৮০+ N5 কানজি</li>
          <li><i className="fa-solid fa-check text-success mr-2" />কুইজ ও ফ্ল্যাশকার্ড</li>
          <li><i className="fa-solid fa-check text-success mr-2" />টাইম অ্যাটাক গেম</li>
          <li><i className="fa-solid fa-check text-success mr-2" />ম্যাচিং গেম</li>
          <li><i className="fa-solid fa-check text-success mr-2" />উচ্চারণ শুনুন</li>
        </ul>
      </div>

      <div className="card p-5 sm:p-6 text-left">
        <h2 className="text-lg sm:text-xl font-semibold text-text-main mb-3">
          <i className="fa-solid fa-code text-primary mr-2" />প্রযুক্তি
        </h2>
        <ul className="space-y-2 text-text-muted text-sm sm:text-base">
          <li><i className="fa-brands fa-react text-primary mr-2" />React + TypeScript</li>
          <li><i className="fa-solid fa-bolt text-primary mr-2" />Vite</li>
          <li><i className="fa-brands fa-css3-alt text-primary mr-2" />Tailwind CSS</li>
          <li><i className="fa-solid fa-route text-primary mr-2" />React Router</li>
        </ul>
      </div>

      <p className="text-text-muted/50 text-xs sm:text-sm mt-6">
        তৈরি হয়েছে <i className="fa-solid fa-heart text-primary" /> দিয়ে
      </p>
    </div>
  )
}
