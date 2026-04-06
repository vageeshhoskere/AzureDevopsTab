import { useMutation } from '@tanstack/react-query'
import { sendMessage } from '../api/opencode'
import { useStore } from '../store'

export function useSendMessage() {
  const sessionID  = useStore((s) => s.sessionID)
  const providerID = useStore((s) => s.providerID)
  const modelID    = useStore((s) => s.modelID)
  const agent      = useStore((s) => s.agent)
  const addMessage = useStore((s) => s.addMessage)
  const finalizeMessage = useStore((s) => s.finalizeMessage)
  const setAssistantTyping = useStore((s) => s.setAssistantTyping)

  return useMutation({
    mutationFn: async (text: string) => {
      if (!sessionID) throw new Error('No active session')
      return sendMessage(sessionID, {
        parts: [{ type: 'text', text }],
        // Include model only when both provider and model are configured
        ...(providerID && modelID ? { model: { providerID, modelID } } : {}),
        // Include agent only when configured
        ...(agent ? { agent } : {}),
      })
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
