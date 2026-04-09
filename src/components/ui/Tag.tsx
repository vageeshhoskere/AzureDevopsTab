interface TagProps {
  label: string
  className?: string
}

export function Tag({ label, className = '' }: TagProps) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-ado-surface2 text-ado-muted border border-ado-border ${className}`}
    >
      {label}
    </span>
  )
}
