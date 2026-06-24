import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import HiraganaList from './pages/HiraganaList'
import HiraganaDetail from './pages/HiraganaDetail'
import KatakanaList from './pages/KatakanaList'
import KatakanaDetail from './pages/KatakanaDetail'
import KanjiList from './pages/KanjiList'
import KanjiDetail from './pages/KanjiDetail'
import Quiz from './pages/Quiz'
import Flashcard from './pages/Flashcard'
import Matching from './pages/Matching'
import TimeAttack from './pages/TimeAttack'
import RandomChallenge from './pages/RandomChallenge'
import About from './pages/About'
import MistakeReview from './pages/MistakeReview'
import DailyChallenge from './pages/DailyChallenge'
import CustomQuiz from './pages/CustomQuiz'
import SRSFlashcard from './pages/SRSFlashcard'
import ProgressDashboard from './pages/ProgressDashboard'
import WritingPractice from './pages/WritingPractice'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/hiragana" element={<HiraganaList />} />
        <Route path="/hiragana/:id" element={<HiraganaDetail />} />
        <Route path="/katakana" element={<KatakanaList />} />
        <Route path="/katakana/:id" element={<KatakanaDetail />} />
        <Route path="/kanji" element={<KanjiList />} />
        <Route path="/kanji/:id" element={<KanjiDetail />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/flashcard" element={<Flashcard />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/timeattack" element={<TimeAttack />} />
        <Route path="/random" element={<RandomChallenge />} />
        <Route path="/daily" element={<DailyChallenge />} />
        <Route path="/custom-quiz" element={<CustomQuiz />} />
        <Route path="/srs" element={<SRSFlashcard />} />
        <Route path="/mistakes" element={<MistakeReview />} />
        <Route path="/progress" element={<ProgressDashboard />} />
        <Route path="/writing" element={<WritingPractice />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}
