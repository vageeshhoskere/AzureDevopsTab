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

    const unsubDelta = sseClient.on('message.part.delta', (props) => {
      if (props.sessionID !== sessionRef.current) return
      updateMessagePartDelta(props.messageID, props.partID, props.field, props.delta)
    })

    const unsubPartUpdated = sseClient.on('message.part.updated', (props) => {
      if (props.sessionID !== sessionRef.current) return
      // Find which message this part belongs to — part.id is partID,
      // but the event gives us the full part. We need to match by sessionID.
      upsertMessagePart(
        // The event doesn't include messageID directly in part.updated —
        // we use the part's own data; the store will match by scanning messages
        // that belong to this session. This is a best-effort update; the POST
        // response is authoritative.
        sessionRef.current ?? '',
        props.part,
      )
    })

    const unsubMsgUpdated = sseClient.on('message.updated', (props) => {
      if (props.sessionID !== sessionRef.current) return
      const { info } = props
      // Create a placeholder message for streaming assistant replies
      if (info.role === 'assistant' && !info.time.completed) {
        setAssistantTyping(true)
        addMessage({
          id: info.id,
          sessionID: info.sessionID,
          role: 'assistant',
          parts: [],
          workItems: [],
          createdAt: info.time.created,
          isStreaming: true,
        })
      }
    })

    return () => {
      unsubDelta()
      unsubPartUpdated()
      unsubMsgUpdated()
    }
  }, [updateMessagePartDelta, upsertMessagePart, addMessage, setAssistantTyping])
}
