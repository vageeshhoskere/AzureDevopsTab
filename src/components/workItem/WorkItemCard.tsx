import type { WorkItem } from '../../types/workItem'
import { WorkItemBadge } from './WorkItemBadge'
import { Avatar } from '../ui/Avatar'
import { useStore } from '../../store'

interface WorkItemCardProps {
  workItem: WorkItem
}

const STATE_COLOR: Record<string, string> = {
  New: 'bg-ado-muted/20 text-ado-muted',
  Active: 'bg-ado-accent/20 text-ado-accent',
  'In Progress': 'bg-ado-accent/20 text-ado-accent',
  'To Do': 'bg-ado-muted/20 text-ado-muted',
  Resolved: 'bg-ado-story/20 text-ado-story',
  Done: 'bg-ado-story/20 text-ado-story',
  Closed: 'bg-ado-muted/20 text-ado-muted',
}

export function WorkItemCard({ workItem }: WorkItemCardProps) {
  const openDrawer = useStore((s) => s.openDrawer)

  const stateColor = STATE_COLOR[workItem.state] ?? 'bg-ado-surface2 text-ado-muted'

  return (
    <button
      onClick={() => openDrawer(workItem.id)}
      className="group w-full text-left bg-ado-surface border border-ado-border rounded-lg p-3 hover:border-ado-accent/50 hover:bg-ado-surface2 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ado-accent"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <WorkItemBadge type={workItem.type} />
          <span className="text-xs text-ado-muted font-mono flex-shrink-0">
            #{workItem.id}
          </span>
        </div>
        <span
          className={`flex-shrink-0 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${stateColor}`}
        >
          {workItem.state}
        </span>
      </div>

      <p className="mt-2 text-sm text-ado-text font-medium line-clamp-2 group-hover:text-white transition-colors">
        {workItem.title}
      </p>

      {workItem.assignee && (
        <div className="mt-2 flex items-center gap-1.5">
          <Avatar name={workItem.assignee.displayName} imageUrl={workItem.assignee.imageUrl} />
          <span className="text-xs text-ado-muted">{workItem.assignee.displayName}</span>
        </div>
      )}
    </button>
  )
}
