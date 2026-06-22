import { Link, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'হোম', icon: '🏠' },
  { to: '/hiragana', label: 'হিরাগানা', icon: 'あ' },
  { to: '/katakana', label: 'কাটাকানা', icon: 'ア' },
  { to: '/kanji', label: 'কানজি', icon: '漢' },
  { to: '/about', label: 'সম্পর্কে', icon: 'ℹ️' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-accent flex flex-col">
      <header className="bg-primary text-secondary py-4 px-6 shadow-lg">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          🇯🇵 Learn Nihongo
        </Link>
      </header>

      <main className="flex-1 pb-20 md:pb-6 px-4 py-6 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-primary text-secondary md:hidden z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center px-2 py-1 text-xs ${
                location.pathname === item.to ? 'opacity-100 scale-110' : 'opacity-70'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
