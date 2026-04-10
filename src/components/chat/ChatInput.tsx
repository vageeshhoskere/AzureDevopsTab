import { useRef, useEffect, type KeyboardEvent } from 'react'
import { useSendMessage } from '../../hooks/useSendMessage'
import { useStore } from '../../store'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
}

export function ChatInput({ value, onChange }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isTyping = useStore((s) => s.isAssistantTyping)
  const sessionID = useStore((s) => s.sessionID)
  const { mutate: send, isPending } = useSendMessage()

  const disabled = isTyping || isPending || !sessionID

  // Auto-resize whenever value changes (handles prompt chip fills)
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [value])

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    send(trimmed)
    onChange('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="flex-shrink-0 border-t border-ado-border bg-ado-surface px-4 py-4">
      <div style={{ maxWidth: '860px', width: '100%', margin: '0 auto' }}>
        <div className="flex items-end gap-3 bg-ado-surface2 border border-ado-border rounded-2xl px-4 py-3 focus-within:border-ado-accentLight focus-within:ring-2 focus-within:ring-ado-accent/10 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={sessionID ? 'Ask anything about your work…' : 'Connecting to Opencode…'}
          disabled={disabled && !isTyping}
          rows={1}
          className="flex-1 bg-transparent resize-none text-sm text-ado-text placeholder-ado-muted focus:outline-none leading-relaxed min-h-[24px] max-h-[120px] disabled:opacity-50 font-sans"
        />
        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="flex-shrink-0 w-8 h-8 rounded-xl bg-ado-accent text-white flex items-center justify-center hover:bg-ado-accentHover transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ado-accent/40"
          aria-label="Send message"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 12V2M3 6l4-4 4 4" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-ado-muted">
            Powered by <span className="font-medium text-ado-accent">WorkHub AI</span>
          </p>
          <p className="text-xs text-ado-muted">
            <kbd className="bg-ado-surface border border-ado-border rounded px-1.5 py-0.5 text-xs font-mono">Enter</kbd>{' '}
            send &nbsp;·&nbsp;{' '}
            <kbd className="bg-ado-surface border border-ado-border rounded px-1.5 py-0.5 text-xs font-mono">Shift+Enter</kbd>{' '}
            newline
          </p>
        </div>
      </div>
    </div>
  )
}
