import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTheme } from './ThemeProvider'

const bottomNavItems = [
  { to: '/', label: 'হোম', icon: 'fa-solid fa-house' },
  { to: '/hiragana', label: 'শেখা', icon: 'fa-solid fa-book-open' },
  { to: '/quiz', label: 'কুইজ', icon: 'fa-solid fa-question' },
  { to: '/flashcard', label: 'কার্ড', icon: 'fa-solid fa-layer-group' },
  { to: '/about', label: 'সম্পর্কে', icon: 'fa-solid fa-circle-info' },
]

const desktopLinks = [
  { to: '/', label: 'হোম' },
  { to: '/hiragana', label: 'হিরাগানা' },
  { to: '/katakana', label: 'কাটাকানা' },
  { to: '/kanji', label: 'কানজি' },
  { to: '/quiz', label: 'কুইজ' },
  { to: '/flashcard', label: 'ফ্ল্যাশকার্ড' },
  { to: '/matching', label: 'ম্যাচিং' },
  { to: '/timeattack', label: 'টাইম অ্যাটাক' },
  { to: '/random', label: 'র‍্যান্ডম' },
  { to: '/about', label: 'সম্পর্কে' },
]

export default function Layout() {
  const location = useLocation()
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-bg-page flex flex-col">
      <header className="bg-primary text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-wide">
            <span className="text-xl">🇯🇵</span>
            <span className="text-lg sm:text-xl hidden xs:inline">Learn Nihongo</span>
            <span className="text-lg sm:text-xl xs:hidden">Nihongo</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <nav className="hidden lg:flex items-center gap-1 mr-2">
              {desktopLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition ${
                    location.pathname === link.to
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={toggle}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition text-white text-lg"
              aria-label="Toggle theme"
            >
              <i className={`${theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border md:hidden z-50">
        <div className="flex justify-around items-center py-1 safe-area-bottom">
          {bottomNavItems.map(item => {
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center px-1 py-1.5 min-w-0 transition ${
                  isActive ? 'text-primary' : 'text-text-muted'
                }`}
              >
                <i className={`${item.icon} text-lg leading-none ${isActive ? 'text-primary' : ''}`} />
                <span className="text-[10px] mt-0.5 truncate w-full text-center font-medium">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
