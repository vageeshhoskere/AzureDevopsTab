import DOMPurify from 'dompurify'
import type { WorkItemDetail as WorkItemDetailType } from '../../types/workItem'
import { WorkItemBadge } from './WorkItemBadge'
import { Avatar } from '../ui/Avatar'
import { Tag } from '../ui/Tag'

interface WorkItemDetailProps {
  detail: WorkItemDetailType | undefined
  isLoading: boolean
  error: Error | null
  onRetry: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-b border-ado-border last:border-b-0">
      <h3 className="text-[11px] font-semibold text-ado-muted uppercase tracking-widest mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

function SkeletonLine({ w = 'full' }: { w?: string }) {
  return <div className={`h-4 bg-ado-surface2 rounded-md animate-pulse w-${w}`} />
}

function Skeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-3">
        <SkeletonLine w="1/4" />
        <SkeletonLine />
        <SkeletonLine w="3/4" />
      </div>
      <div className="space-y-3">
        <SkeletonLine w="1/4" />
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine w="1/2" />
      </div>
      <div className="space-y-2">
        <SkeletonLine w="1/4" />
        <SkeletonLine w="3/4" />
        <SkeletonLine w="1/2" />
      </div>
    </div>
  )
}

function priorityLabel(p: number): string {
  return ['', 'Critical', 'High', 'Medium', 'Low'][p] ?? String(p)
}

function priorityStyle(p: number): { bg: string; color: string } {
  const styles: Record<number, { bg: string; color: string }> = {
    1: { bg: 'rgba(220,38,38,0.1)',  color: '#DC2626' },
    2: { bg: 'rgba(234,88,12,0.1)',  color: '#EA580C' },
    3: { bg: 'rgba(217,119,6,0.1)',  color: '#D97706' },
    4: { bg: 'rgba(100,116,139,0.1)', color: '#64748B' },
  }
  return styles[p] ?? { bg: 'rgba(100,116,139,0.1)', color: '#64748B' }
}

export function WorkItemDetail({ detail, isLoading, error, onRetry }: WorkItemDetailProps) {
  if (isLoading) return <Skeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4 p-6">
        <p className="text-ado-muted text-sm text-center">
          Failed to load work item details.
          <br />
          <span className="text-xs opacity-70">{error.message}</span>
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm bg-ado-accent text-white rounded-lg hover:bg-ado-accentHover transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!detail) return null

  const pStyle = detail.priority != null ? priorityStyle(detail.priority) : null

  return (
    <div className="overflow-y-auto flex-1 px-6 py-2">
      {/* Details */}
      <Section title="Details">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <div>
            <span className="text-ado-muted block text-xs mb-1.5">Type</span>
            <WorkItemBadge type={detail.type} />
          </div>
          <div>
            <span className="text-ado-muted block text-xs mb-1.5">State</span>
            <span className="text-ado-text font-medium">{detail.state}</span>
          </div>

          {detail.assignee && (
            <div className="col-span-2">
              <span className="text-ado-muted block text-xs mb-1.5">Assigned To</span>
              <div className="flex items-center gap-2.5">
                <Avatar name={detail.assignee.displayName} imageUrl={detail.assignee.imageUrl} size="md" />
                <div>
                  <p className="text-sm text-ado-text font-medium">{detail.assignee.displayName}</p>
                  {detail.assignee.uniqueName && (
                    <p className="text-xs text-ado-muted">{detail.assignee.uniqueName}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {detail.priority != null && pStyle && (
            <div>
              <span className="text-ado-muted block text-xs mb-1.5">Priority</span>
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: pStyle.bg, color: pStyle.color }}
              >
                {priorityLabel(detail.priority)}
              </span>
            </div>
          )}

          {detail.storyPoints != null && (
            <div>
              <span className="text-ado-muted block text-xs mb-1.5">Story Points</span>
              <span className="text-ado-text text-sm font-medium">{detail.storyPoints}</span>
            </div>
          )}

          {detail.remainingWork != null && (
            <div>
              <span className="text-ado-muted block text-xs mb-1.5">Remaining Work</span>
              <span className="text-ado-text text-sm font-medium">{detail.remainingWork}h</span>
            </div>
          )}

          {detail.iteration && (
            <div className="col-span-2">
              <span className="text-ado-muted block text-xs mb-1.5">Iteration</span>
              <span className="text-xs font-mono text-ado-text bg-ado-surface2 px-2 py-0.5 rounded">
                {detail.iteration}
              </span>
            </div>
          )}

          {detail.area && (
            <div className="col-span-2">
              <span className="text-ado-muted block text-xs mb-1.5">Area Path</span>
              <span className="text-xs font-mono text-ado-text bg-ado-surface2 px-2 py-0.5 rounded">
                {detail.area}
              </span>
            </div>
          )}
        </div>
      </Section>

      {/* Tags */}
      {detail.tags && detail.tags.length > 0 && (
        <Section title="Tags">
          <div className="flex flex-wrap gap-1.5">
            {detail.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </Section>
      )}

      {/* Description */}
      {detail.description && (
        <Section title="Description">
          <div
            className="text-sm text-ado-text leading-relaxed prose max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(detail.description) }}
          />
        </Section>
      )}

      {/* Acceptance Criteria */}
      {detail.acceptanceCriteria && (
        <Section title="Acceptance Criteria">
          <div
            className="text-sm text-ado-text leading-relaxed prose max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(detail.acceptanceCriteria) }}
          />
        </Section>
      )}

      {/* Related Items */}
      {detail.relations && detail.relations.length > 0 && (
        <Section title={`Related Items (${detail.relations.length})`}>
          <div className="space-y-2">
            {detail.relations.map((rel) => (
              <div
                key={`${rel.type}-${rel.id}`}
                className="flex items-center justify-between bg-ado-bg rounded-lg p-2.5 border border-ado-border"
              >
                <div>
                  <span className="text-xs text-ado-muted">{rel.type} · </span>
                  <span className="text-xs font-mono font-semibold text-ado-accent">#{rel.id}</span>
                  <p className="text-sm text-ado-text mt-0.5 line-clamp-1">{rel.title}</p>
                </div>
                <svg className="w-3.5 h-3.5 text-ado-muted flex-shrink-0 ml-3" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Comments */}
      {detail.comments && detail.comments.length > 0 && (
        <Section title={`Comments (${detail.comments.length})`}>
          <div className="space-y-3">
            {detail.comments.map((comment) => (
              <div key={comment.id} className="bg-ado-bg rounded-xl p-3.5 border border-ado-border">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar name={comment.author.displayName} size="sm" />
                  <span className="text-xs font-semibold text-ado-text">
                    {comment.author.displayName}
                  </span>
                  <span className="text-xs text-ado-muted ml-auto">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div
                  className="text-sm text-ado-text leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.text) }}
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Timestamps */}
      {(detail.createdAt || detail.updatedAt) && (
        <Section title="Timestamps">
          <div className="grid grid-cols-2 gap-3">
            {detail.createdAt && (
              <div>
                <span className="block text-xs text-ado-muted mb-1">Created</span>
                <span className="text-xs text-ado-text">{new Date(detail.createdAt).toLocaleString()}</span>
              </div>
            )}
            {detail.updatedAt && (
              <div>
                <span className="block text-xs text-ado-muted mb-1">Updated</span>
                <span className="text-xs text-ado-text">{new Date(detail.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  )
}
