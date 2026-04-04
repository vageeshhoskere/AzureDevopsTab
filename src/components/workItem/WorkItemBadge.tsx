import type { WorkItemType } from '../../types/workItem'
import { clsx } from 'clsx'

interface WorkItemBadgeProps {
  type: WorkItemType
  className?: string
}

const TYPE_CONFIG: Record<string, { bg: string; text: string; icon: string }> = {
  Bug: { bg: 'bg-ado-bug/20', text: 'text-ado-bug', icon: '🐛' },
  Task: { bg: 'bg-ado-task/20', text: 'text-ado-task', icon: '✓' },
  'User Story': { bg: 'bg-ado-story/20', text: 'text-ado-story', icon: '📖' },
  Story: { bg: 'bg-ado-story/20', text: 'text-ado-story', icon: '📖' },
  Epic: { bg: 'bg-ado-epic/20', text: 'text-ado-epic', icon: '⚡' },
  Feature: { bg: 'bg-ado-feature/20', text: 'text-ado-feature', icon: '🔧' },
  Issue: { bg: 'bg-ado-issue/20', text: 'text-ado-issue', icon: '⚠' },
}

const DEFAULT_CONFIG = { bg: 'bg-ado-surface2', text: 'text-ado-muted', icon: '•' }

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
      <span aria-hidden>{config.icon}</span>
      {type}
    </span>
  )
}
