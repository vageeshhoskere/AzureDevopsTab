import { useStore } from '../../store'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

export function ChatWindow() {
  const messages = useStore((s) => s.messages)
  const isTyping = useStore((s) => s.isAssistantTyping)
  const connectionError = useStore((s) => s.connectionError)

  return (
    <div className="flex flex-col h-full w-full">
      {/* Connection error banner */}
      {connectionError && (
        <div className="flex-shrink-0 bg-ado-bug/10 border-b border-ado-bug/30 px-4 py-2 text-sm text-ado-bug flex items-center gap-2">
          <span>⚠</span>
          <span>Cannot connect to Opencode: {connectionError}</span>
        </div>
      )}

      <MessageList messages={messages} isTyping={isTyping} />
      <ChatInput />
    </div>
  )
}
