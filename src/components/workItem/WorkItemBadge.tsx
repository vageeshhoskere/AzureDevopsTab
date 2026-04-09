import type { WorkItemType } from '../../types/workItem'
import { clsx } from 'clsx'

interface WorkItemBadgeProps {
  type: WorkItemType
  className?: string
}

const TYPE_CONFIG: Record<string, { bg: string; text: string }> = {
  Bug:          { bg: 'bg-ado-bug/10',     text: 'text-ado-bug' },
  Task:         { bg: 'bg-ado-task/10',    text: 'text-ado-task' },
  'User Story': { bg: 'bg-ado-story/10',   text: 'text-ado-story' },
  Story:        { bg: 'bg-ado-story/10',   text: 'text-ado-story' },
  Epic:         { bg: 'bg-ado-epic/10',    text: 'text-ado-epic' },
  Feature:      { bg: 'bg-ado-feature/10', text: 'text-ado-feature' },
  Issue:        { bg: 'bg-ado-issue/10',   text: 'text-ado-issue' },
}

const DEFAULT_CONFIG = { bg: 'bg-ado-surface2', text: 'text-ado-muted' }

export function WorkItemBadge({ type, className }: WorkItemBadgeProps) {
  const config = TYPE_CONFIG[type] ?? DEFAULT_CONFIG
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
        config.bg,
        config.text,
        className,
      )}
    >
      <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden>
        <circle cx="3" cy="3" r="3" fill="currentColor" />
      </svg>
      {type}
    </span>
  )
}
