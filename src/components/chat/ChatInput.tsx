import { useRef, useState, type KeyboardEvent } from 'react'
import { useSendMessage } from '../../hooks/useSendMessage'
import { useStore } from '../../store'

export function ChatInput() {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isTyping = useStore((s) => s.isAssistantTyping)
  const sessionID = useStore((s) => s.sessionID)
  const { mutate: send, isPending } = useSendMessage()

  const disabled = isTyping || isPending || !sessionID

  function submit() {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    send(trimmed)
    setText('')
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function handleInput() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="flex-shrink-0 border-t border-ado-border bg-ado-surface px-4 py-3">
      <div className="flex items-end gap-3 bg-ado-bg rounded-xl border border-ado-border focus-within:border-ado-accent/60 transition-colors px-4 py-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKey}
          placeholder={
            sessionID
              ? 'Ask about Azure DevOps work items… (Enter to send, Shift+Enter for newline)'
              : 'Connecting to Opencode…'
          }
          disabled={disabled && !isTyping}
          rows={1}
          className="flex-1 bg-transparent resize-none text-sm text-ado-text placeholder-ado-muted focus:outline-none leading-relaxed min-h-[24px] max-h-40 disabled:opacity-50"
        />
        <button
          onClick={submit}
          disabled={disabled || !text.trim()}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-ado-accent text-white flex items-center justify-center hover:bg-ado-accentHover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
      <p className="text-xs text-ado-muted mt-2 text-center">
        Powered by Opencode · Azure DevOps MCP
      </p>
    </div>
  )
}
