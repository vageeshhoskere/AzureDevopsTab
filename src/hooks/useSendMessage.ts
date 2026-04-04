import { useMutation } from '@tanstack/react-query'
import { sendMessage } from '../api/opencode'
import { useStore } from '../store'

export function useSendMessage() {
  const sessionID = useStore((s) => s.sessionID)
  const addMessage = useStore((s) => s.addMessage)
  const finalizeMessage = useStore((s) => s.finalizeMessage)
  const setAssistantTyping = useStore((s) => s.setAssistantTyping)

  return useMutation({
    mutationFn: async (text: string) => {
      if (!sessionID) throw new Error('No active session')
      return sendMessage(sessionID, { parts: [{ type: 'text', text }] })
    },
    onMutate: (text) => {
      if (!sessionID) return
      const id = `user-${Date.now()}`
      addMessage({
        id,
        sessionID,
        role: 'user',
        parts: [{ type: 'text', id: `${id}-text`, text }],
        workItems: [],
        createdAt: Date.now(),
      })
      setAssistantTyping(true)
    },
    onSuccess: (response) => {
      finalizeMessage(response)
    },
    onError: () => {
      setAssistantTyping(false)
    },
  })
}
