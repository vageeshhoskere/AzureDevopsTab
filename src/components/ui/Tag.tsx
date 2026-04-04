interface TagProps {
  label: string
  className?: string
}

export function Tag({ label, className = '' }: TagProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium bg-ado-surface2 text-ado-muted border border-ado-border ${className}`}
    >
      {label}
    </span>
  )
}
