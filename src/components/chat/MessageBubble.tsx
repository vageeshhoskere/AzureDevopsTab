import type { ChatMessage } from '../../types/chat'
import type { OcReasoningPart } from '../../types/opencode'
import { UserMessage } from './UserMessage'
import { AssistantMessage } from './AssistantMessage'
import { ReasoningBlock } from './ReasoningBlock'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'user') {
    return <UserMessage parts={message.parts} />
  }

  const reasoningParts = message.parts.filter((p): p is OcReasoningPart => p.type === 'reasoning')
  const otherParts = message.parts.filter((p) => p.type !== 'reasoning')

  const hasRenderableContent =
    otherParts.some((p) => (p.type === 'text' && !!p.text?.trim()) || p.type === 'tool') ||
    message.workItems.length > 0

  return (
    <>
      {reasoningParts.map((p) => (
        <ReasoningBlock key={p.id} part={p} isStreaming={message.isStreaming} />
      ))}
      {hasRenderableContent && (
        <AssistantMessage
          parts={otherParts}
          workItems={message.workItems}
          isStreaming={message.isStreaming}
        />
      )}
    </>
  )
}
