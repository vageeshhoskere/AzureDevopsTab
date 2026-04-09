export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-1.5">
      <div className="w-8 h-8 rounded-full gradient-avatar flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mt-0.5">
        AI
      </div>
      <div className="ai-message-border pl-4 pr-4 py-3 rounded-r-xl flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-ado-accent inline-block"
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
