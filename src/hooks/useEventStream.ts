import { useEffect, useRef } from 'react'
import { sseClient } from '../lib/sseClient'
import { useStore } from '../store'

export function useEventStream(sessionID: string | null) {
  const upsertMessagePart = useStore((s) => s.upsertMessagePart)
  const updateMessagePartDelta = useStore((s) => s.updateMessagePartDelta)
  const addMessage = useStore((s) => s.addMessage)
  const setAssistantTyping = useStore((s) => s.setAssistantTyping)
  const sessionRef = useRef(sessionID)
  sessionRef.current = sessionID

  useEffect(() => {
    sseClient.connect()

    // message.part.updated carries the full part state.
    // When the assistant is streaming, the event also includes an optional
    // `delta` field containing the incremental text chunk so the UI can
    // append it immediately without waiting for the full part.
    const unsubPartUpdated = sseClient.on('message.part.updated', (props) => {
      const { part, delta } = props
      // SDK parts carry sessionID and messageID directly on the part object
      const partSessionID = (part as { sessionID?: string }).sessionID
      if (partSessionID && partSessionID !== sessionRef.current) return

      const messageID = (part as { messageID?: string }).messageID
      if (!messageID) return

      if (delta !== undefined && part.type === 'text') {
        // Fast-path: append only the delta so text streams smoothly
        updateMessagePartDelta(messageID, part.id, 'text', delta)
      }
      // Always upsert the full part for authoritative state (tool updates, etc.)
      upsertMessagePart(messageID, part)
    })

    // message.updated fires when a new message is created or its metadata changes.
    // In the SDK event model, sessionID lives on info.sessionID, not in properties.
    const unsubMsgUpdated = sseClient.on('message.updated', (props) => {
      const { info } = props
      const infoSessionID = (info as { sessionID?: string }).sessionID
      if (infoSessionID && infoSessionID !== sessionRef.current) return

      if (info.role === 'assistant') {
        if (!info.time.completed) {
          // Create a placeholder message for streaming assistant replies
          setAssistantTyping(true)
          addMessage({
            id: info.id,
            sessionID: infoSessionID ?? sessionRef.current ?? '',
            role: 'assistant',
            parts: [],
            workItems: [],
            createdAt: info.time.created,
            isStreaming: true,
          })
        } else {
          // SSE signals the message is fully complete — clear the typing indicator
          setAssistantTyping(false)
        }
      }
    })

    return () => {
      unsubPartUpdated()
      unsubMsgUpdated()
    }
  }, [updateMessagePartDelta, upsertMessagePart, addMessage, setAssistantTyping])
}
