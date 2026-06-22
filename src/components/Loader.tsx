export default function Loader({ text = 'লোড হচ্ছে...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-surface-alt rounded-full" />
        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
        <div className="absolute inset-2 border-4 border-surface-alt rounded-full" />
        <div className="absolute inset-2 border-4 border-primary/60 rounded-full border-b-transparent animate-spin animation-delay-150" />
      </div>
      <p className="text-text-muted text-sm animate-pulse">{text}</p>
    </div>
  )
}
