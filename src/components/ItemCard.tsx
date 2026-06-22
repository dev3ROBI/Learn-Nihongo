import { Link } from 'react-router-dom'

interface ItemCardProps {
  char: string
  to: string
}

export default function ItemCard({ char, to }: ItemCardProps) {
  return (
    <Link
      to={to}
      className="card p-4 sm:p-5 flex items-center justify-center text-3xl sm:text-4xl hover:scale-105 active:scale-100 transition-all duration-200 hover:border-primary/50"
    >
      {char}
    </Link>
  )
}
