import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../types/chat'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { DemoToggle } from '../ui/DemoToggle'

interface MessageListProps {
  messages: ChatMessage[]
  isTyping: boolean
  onPromptSelect?: (prompt: string) => void
  demoMode?: boolean
  onToggleDemo?: () => void
}

const SUGGESTED_PROMPTS = [
  { label: 'Active items this sprint', prompt: 'What are my active work items this sprint?' },
  { label: 'Critical bugs assigned to me', prompt: 'Show me all critical bugs assigned to me' },
  { label: "What's blocked right now?", prompt: 'What items are currently blocked?' },
  { label: 'Team velocity summary', prompt: 'Summarize the team velocity for the last 2 sprints' },
]

export function MessageList({ messages, isTyping, onPromptSelect, demoMode, onToggleDemo }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isTyping])

  return (
    <>
      <div className="flex-1 overflow-y-auto flex flex-col items-center w-full px-4 py-6" style={{ maxWidth: '100%' }}>
        <div style={{ maxWidth: '860px', width: '100%' }}>
          {messages.length === 0 ? (
          // Empty state - positioned at top with padding, not centered vertically
          <div className="flex flex-col items-center justify-center gap-8 text-center pt-16 animate-fade-in">
            {/* Illustration */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl gradient-avatar flex items-center justify-center shadow-lg shadow-ado-accent/20">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect x="4" y="10" width="28" height="20" rx="4" stroke="white" strokeWidth="2" />
                  <path d="M12 18h12M12 23h7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="26" cy="8" r="4" fill="#A78BFA" stroke="white" strokeWidth="1.5" />
                  <path d="M24.5 8h3M26 6.5v3" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-ado-story rounded-full border-2 border-white flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-ado-text mb-1">Your WorkHub assistant is ready</h2>
              <p className="text-sm text-ado-muted max-w-sm">
                Ask anything about your sprints, work items, or team velocity.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center max-w-xl">
              {SUGGESTED_PROMPTS.map(({ label, prompt }) => (
                <button
                  key={label}
                  onClick={() => onPromptSelect?.(prompt)}
                  className="px-4 py-2 bg-ado-surface border border-ado-border rounded-full text-sm text-ado-muted font-medium hover:border-ado-accent hover:text-ado-accent transition-colors cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Messages view
          <div className="space-y-2">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && !messages.some(m => m.isStreaming) && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
        </div>
      </div>

      {/* Demo toggle button */}
      {onToggleDemo && <DemoToggle isDemo={demoMode ?? false} onToggle={onToggleDemo} />}
    </>
  )
}
