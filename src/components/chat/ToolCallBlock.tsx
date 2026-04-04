import { useState } from 'react'
import type { OcToolPart } from '../../types/opencode'
import { Spinner } from '../ui/Spinner'

interface ToolCallBlockProps {
  part: OcToolPart
}

function formatToolName(name: string): string {
  // e.g. "azure_devops__get_work_items" → "Get Work Items"
  return name
    .replace(/^[^_]+__/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function ToolCallBlock({ part }: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(false)
  const { state } = part
  const isRunning = state.status === 'running' || state.status === 'pending'
  const isError = state.status === 'error'
  const isDone = state.status === 'completed'

  let summary = ''
  if (isDone) {
    try {
      const out = JSON.parse(state.output) as { count?: number; value?: unknown[] }
      const count = out.count ?? (Array.isArray(out.value) ? out.value.length : null)
      summary = count !== null ? `Retrieved ${count} item${count !== 1 ? 's' : ''}` : 'Completed'
    } catch {
      summary = 'Completed'
    }
  }

  return (
    <div className="my-2 border border-ado-border rounded-lg overflow-hidden bg-ado-bg text-xs">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-ado-surface2 transition-colors"
        disabled={isRunning}
      >
        {isRunning && <Spinner size="sm" className="flex-shrink-0" />}
        {isDone && (
          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-ado-story/20 text-ado-story flex items-center justify-center text-[10px]">
            ✓
          </span>
        )}
        {isError && (
          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-ado-bug/20 text-ado-bug flex items-center justify-center text-[10px]">
            ✗
          </span>
        )}
        <span className="text-ado-muted">
          {isRunning && 'Calling '}
          <span className="text-ado-accent font-medium">{formatToolName(part.tool)}</span>
          {isDone && <span className="text-ado-muted ml-1">— {summary}</span>}
          {isError && <span className="text-ado-bug ml-1">— Failed</span>}
        </span>
        {(isDone || isError) && (
          <span className="ml-auto text-ado-muted">{expanded ? '▲' : '▼'}</span>
        )}
      </button>

      {expanded && isDone && (
        <div className="px-3 pb-3 border-t border-ado-border">
          <pre className="mt-2 text-ado-muted overflow-x-auto whitespace-pre-wrap break-all text-[11px] max-h-48">
            {(() => {
              try {
                return JSON.stringify(JSON.parse(state.output), null, 2)
              } catch {
                return state.output
              }
            })()}
          </pre>
        </div>
      )}

      {expanded && isError && (
        <div className="px-3 pb-3 border-t border-ado-border">
          <p className="mt-2 text-ado-bug text-[11px]">{state.error}</p>
        </div>
      )}
    </div>
  )
}
