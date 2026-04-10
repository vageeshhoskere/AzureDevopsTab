interface DemoToggleProps {
  isDemo: boolean
  onToggle: () => void
}

export function DemoToggle({ isDemo, onToggle }: DemoToggleProps) {
  return (
    <div className="fixed bottom-24 right-6 z-30 flex flex-col gap-1 items-end">
      <button
        onClick={onToggle}
        className="bg-ado-accent text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md shadow-ado-accent/25 hover:bg-ado-accentHover transition-colors duration-150"
      >
        {isDemo ? 'Show empty state' : 'Load demo conversation'}
      </button>
      <p className="text-xs text-ado-muted">for design review only</p>
    </div>
  )
}
