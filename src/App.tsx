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
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}
