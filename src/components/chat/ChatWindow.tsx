import { useStore } from '../../store'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

export function ChatWindow() {
  const messages = useStore((s) => s.messages)
  const isTyping = useStore((s) => s.isAssistantTyping)
  const connectionError = useStore((s) => s.connectionError)

  return (
    <div className="flex flex-col h-full w-full">
      {connectionError && (
        <div className="flex-shrink-0 bg-ado-bug/10 border-b border-ado-bug/20 px-4 py-2 text-sm text-ado-bug flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
            <path d="M7 2l5.5 10H1.5L7 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M7 6v3M7 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Cannot connect to Opencode: {connectionError}</span>
        </div>
      )}

      <MessageList messages={messages} isTyping={isTyping} />
      <ChatInput />
    </div>
  )
}
