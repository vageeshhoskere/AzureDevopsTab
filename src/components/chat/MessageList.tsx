import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../types/chat'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'

interface MessageListProps {
  messages: ChatMessage[]
  isTyping: boolean
}

export function MessageList({ messages, isTyping }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isTyping])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-ado-accent/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-ado-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ado-text">Ask about your work items</h2>
          <p className="text-sm text-ado-muted mt-1 max-w-sm">
            Try: "List open bugs assigned to me" or "Show active tasks in Sprint 42"
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {[
            'List my open bugs',
            'Show active tasks in current sprint',
            'Find high priority items',
            'What was closed this week?',
          ].map((prompt) => (
            <span
              key={prompt}
              className="px-3 py-1.5 bg-ado-surface border border-ado-border rounded-full text-xs text-ado-muted hover:text-ado-text hover:border-ado-accent/50 transition-colors cursor-default"
            >
              {prompt}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-1">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
