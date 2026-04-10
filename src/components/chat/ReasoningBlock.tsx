import { useState, useEffect } from 'react'
import type { OcReasoningPart } from '../../types/opencode'

interface ReasoningBlockProps {
  part: OcReasoningPart
  isStreaming?: boolean
}

export function ReasoningBlock({ part, isStreaming }: ReasoningBlockProps) {
  // Expand while streaming, collapse once done
  const [open, setOpen] = useState(!!isStreaming)

  useEffect(() => {
    if (!isStreaming) setOpen(false)
  }, [isStreaming])

  const wordCount = part.text?.trim().split(/\s+/).filter(Boolean).length ?? 0

  return (
    <div className="px-4 py-1">
      <div className="rounded-lg border border-dashed border-ado-border bg-ado-bg overflow-hidden">
        {/* Header */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-ado-surface/60 transition-colors group"
        >
          {/* Sparkle / thinking icon */}
          <span className="flex-shrink-0 w-4 h-4 text-ado-issue">
            {isStreaming ? (
              // Animated dots while streaming
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <circle cx="3" cy="8" r="1.5" fill="currentColor" className="animate-[dotBounce_1.4s_infinite_ease-in-out_both]" style={{ animationDelay: '0s' }} />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" className="animate-[dotBounce_1.4s_infinite_ease-in-out_both]" style={{ animationDelay: '0.2s' }} />
                <circle cx="13" cy="8" r="1.5" fill="currentColor" className="animate-[dotBounce_1.4s_infinite_ease-in-out_both]" style={{ animationDelay: '0.4s' }} />
              </svg>
            ) : (
              // Brain-like icon when done
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M6 2C4.343 2 3 3.343 3 5c0 .552.149 1.07.41 1.515A2.5 2.5 0 0 0 2 9a2.5 2.5 0 0 0 1.5 2.274C3.5 12.766 4.619 14 6 14h4c1.381 0 2.5-1.234 2.5-2.726A2.5 2.5 0 0 0 14 9a2.5 2.5 0 0 0-1.41-2.485C12.851 6.07 13 5.552 13 5c0-1.657-1.343-3-3-3H6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M8 5v4M6.5 7.5 8 9l1.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>

          {/* Label */}
          <span className="flex-1 text-xs font-medium text-ado-muted">
            {isStreaming ? (
              <span className="text-ado-issue">Thinking…</span>
            ) : (
              <span>Thought process <span className="font-normal opacity-60">· {wordCount} words</span></span>
            )}
          </span>

          {/* Chevron */}
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className={`w-3.5 h-3.5 text-ado-muted flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Body */}
        {open && (
          <div className="border-t border-dashed border-ado-border px-3 py-2.5 max-h-48 overflow-y-auto">
            <p className="text-xs text-ado-muted italic leading-relaxed font-mono whitespace-pre-wrap break-words">
              {part.text}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
