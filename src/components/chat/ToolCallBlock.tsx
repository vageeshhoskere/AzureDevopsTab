import { useState } from 'react'
import type { OcToolPart } from '../../types/opencode'
import { Spinner } from '../ui/Spinner'

interface ToolCallBlockProps {
  part: OcToolPart
}

function formatToolName(name: string): string {
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
    <div className="my-2 border border-ado-border rounded-xl overflow-hidden bg-ado-surface shadow-sm text-xs">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-ado-surface2 transition-colors"
        disabled={isRunning}
      >
        {isRunning && <Spinner size="sm" className="flex-shrink-0" />}
        {isDone && (
          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-ado-story flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 4l1.5 1.5 3.5-3" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
        {isError && (
          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-ado-bug flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M2 2l4 4M6 2L2 6" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
          </span>
        )}

        <span className="text-ado-muted flex-1">
          {isRunning && 'Calling '}
          <span className="text-ado-accent font-semibold">{formatToolName(part.tool)}</span>
          {isDone && <span className="text-ado-muted font-normal ml-1">— {summary}</span>}
          {isError && <span className="text-ado-bug ml-1">— Failed</span>}
        </span>

        {(isDone || isError) && (
          <svg
            className="ml-auto text-ado-muted transition-transform duration-200 flex-shrink-0"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            width="14" height="14" viewBox="0 0 14 14" fill="none"
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {expanded && isDone && (
        <div className="px-4 pb-3 border-t border-ado-border">
          <pre className="mt-2 text-ado-muted overflow-x-auto whitespace-pre-wrap break-all text-[11px] max-h-48 font-mono leading-relaxed">
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
        <div className="px-4 pb-3 border-t border-ado-border">
          <p className="mt-2 text-ado-bug text-[11px]">{state.error}</p>
        </div>
      )}
    </div>
  )
}
