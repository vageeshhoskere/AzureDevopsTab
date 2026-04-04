import type { ChatMessage } from '../../types/chat'
import { UserMessage } from './UserMessage'
import { AssistantMessage } from './AssistantMessage'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'user') {
    return <UserMessage parts={message.parts} />
  }
  return (
    <AssistantMessage
      parts={message.parts}
      workItems={message.workItems}
      isStreaming={message.isStreaming}
    />
  )
}
