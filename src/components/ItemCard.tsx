import { Link } from 'react-router-dom'

interface ItemCardProps {
  char: string
  to: string
}

export default function ItemCard({ char, to }: ItemCardProps) {
  return (
    <Link
      to={to}
      className="bg-white/10 backdrop-blur rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center text-4xl cursor-pointer border border-white/20 hover:border-primary/50"
    >
      {char}
    </Link>
  )
}
