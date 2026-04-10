import type { WorkItem } from '../../types/workItem'
import { Avatar } from '../ui/Avatar'
import { useStore } from '../../store'

interface WorkItemCardProps {
  workItem: WorkItem
}

const TYPE_STRIP_COLOR: Record<string, string> = {
  Bug:          '#DC2626',
  Task:         '#2563EB',
  'User Story': '#059669',
  Story:        '#059669',
  Epic:         '#7C3AED',
  Feature:      '#0891B2',
  Issue:        '#D97706',
}

const TYPE_BADGE: Record<string, { bg: string; color: string }> = {
  Bug:          { bg: 'rgba(220,38,38,0.1)',   color: '#DC2626' },
  Task:         { bg: 'rgba(37,99,235,0.1)',   color: '#2563EB' },
  'User Story': { bg: 'rgba(5,150,105,0.1)',   color: '#059669' },
  Story:        { bg: 'rgba(5,150,105,0.1)',   color: '#059669' },
  Epic:         { bg: 'rgba(124,58,237,0.1)',  color: '#7C3AED' },
  Feature:      { bg: 'rgba(8,145,178,0.1)',   color: '#0891B2' },
  Issue:        { bg: 'rgba(217,119,6,0.1)',   color: '#D97706' },
}

const STATE_STYLE: Record<string, string> = {
  New:         'bg-ado-surface2 text-ado-muted border border-ado-border',
  Active:      'bg-amber-50 text-amber-700 border border-amber-100',
  'In Progress':'bg-blue-50 text-blue-700 border border-blue-100',
  'To Do':     'bg-ado-surface2 text-ado-muted border border-ado-border',
  Resolved:    'bg-emerald-50 text-emerald-700 border border-emerald-100',
  Done:        'bg-emerald-50 text-emerald-700 border border-emerald-100',
  Closed:      'bg-ado-surface2 text-ado-muted border border-ado-border',
}

export function WorkItemCard({ workItem }: WorkItemCardProps) {
  const openDrawer = useStore((s) => s.openDrawer)

  const stripColor = TYPE_STRIP_COLOR[workItem.type] ?? '#64748B'
  const badge = TYPE_BADGE[workItem.type] ?? { bg: 'rgba(100,116,139,0.1)', color: '#64748B' }
  const stateStyle = STATE_STYLE[workItem.state] ?? 'bg-ado-surface2 text-ado-muted border border-ado-border'

  return (
    <div className="group w-full bg-ado-surface border border-ado-border rounded-xl overflow-hidden flex items-center hover:shadow-md hover:shadow-ado-accent/10 hover:-translate-y-px transition-all duration-150">
      {/* Left color strip */}
      <div className="w-1 self-stretch flex-shrink-0" style={{ background: stripColor }} />

      {/* Content — clickable area opens drawer */}
      <button
        onClick={() => openDrawer(workItem)}
        className="flex-1 px-3 py-2.5 flex items-center gap-3 min-w-0 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-ado-accent/30 rounded-r-xl"
      >
        <div className="flex-1 min-w-0">
          {/* Type + ID row */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: badge.bg, color: badge.color }}
            >
              {workItem.type}
            </span>
            <span className="text-xs font-mono text-ado-muted">#{workItem.id}</span>
          </div>
          {/* Title */}
          <p className="text-sm font-medium text-ado-text line-clamp-1">{workItem.title}</p>
        </div>

        {/* Right: state + assignee + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stateStyle}`}>
            {workItem.state}
          </span>
          {workItem.assignee && (
            <Avatar name={workItem.assignee.displayName} imageUrl={workItem.assignee.imageUrl} size="sm" />
          )}
          <svg className="w-3.5 h-3.5 text-ado-muted" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Open in ADO external link */}
      {workItem.url && (
        <a
          href={workItem.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in Azure DevOps"
          onClick={(e) => e.stopPropagation()}
          className="pr-3 pl-1 py-2.5 flex items-center text-ado-muted hover:text-ado-accent transition-colors flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 12L12 2M6 2h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      )}
    </div>
  )
}
