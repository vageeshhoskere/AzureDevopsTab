export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-7 h-7 rounded-full bg-ado-accent/20 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-ado-accent">AI</span>
      </div>
      <div className="flex items-center gap-1.5 bg-ado-surface rounded-2xl rounded-tl-sm px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-ado-muted inline-block"
            style={{
              animation: 'dotBounce 1.4s infinite ease-in-out both',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
