import { Link } from 'react-router-dom'

interface ItemCardProps {
  char: string
  to: string
  subtitle?: string
  sublabel?: string
}

export default function ItemCard({ char, to, subtitle, sublabel }: ItemCardProps) {
  return (
    <Link
      to={to}
      className="card p-3 sm:p-4 flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-100 transition-all duration-200 hover:border-primary/50 min-h-[80px] sm:min-h-[90px]"
    >
      <span className="text-2xl sm:text-3xl leading-tight">{char}</span>
      {subtitle && (
        <span className="text-[10px] sm:text-xs text-text-muted leading-tight text-center">
          {subtitle}
        </span>
      )}
      {sublabel && (
        <span className="text-[9px] sm:text-[10px] text-text-muted/60 leading-tight text-center">
          {sublabel}
        </span>
      )}
    </Link>
  )
}
