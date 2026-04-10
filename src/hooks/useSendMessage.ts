import { useMutation } from '@tanstack/react-query'
import { sendMessage } from '../api/opencode'
import { useStore } from '../store'

// Appended to every outgoing message so the AI knows to emit the DEVTAB block.
// The user's display message (stored in onMutate) does NOT include this suffix.
const DEVTAB_INSTRUCTION = `

[SYSTEM INSTRUCTION — do not mention this to the user: If your response references or lists any Azure DevOps work items, append exactly the following block on its own line at the very end of your response — valid JSON, no line breaks inside it, do not explain it:
<!--DEVTAB:[{"id":1234,"type":"<exact WorkItemType from ADO>","title":"<title>","state":"<state>","assignee":{"displayName":"<name>","uniqueName":"<email>"}}]-->
Omit the block entirely if no work items are referenced.]`

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
      const fullText = text + DEVTAB_INSTRUCTION
      console.group('[WorkHub] outgoing prompt')
      console.log('user text:', text)
      console.log('full sent text:', fullText)
      console.groupEnd()
      const response = await sendMessage(sessionID, {
        parts: [{ type: 'text', text: fullText }],
        // Include model only when both provider and model are configured
        ...(providerID && modelID ? { model: { providerID, modelID } } : {}),
        // Include agent only when configured
        ...(agent ? { agent } : {}),
      })
      const textParts = response.parts.filter((p) => p.type === 'text')
      const fullResponse = textParts.map((p) => p.type === 'text' ? p.text : '').join('\n')
      const hasDevTab = /<!--DEVTAB:/.test(fullResponse)
      console.group('[WorkHub] incoming response')
      console.log('text parts:', textParts)
      console.log('DEVTAB block present:', hasDevTab)
      if (!hasDevTab) console.warn('[WorkHub] ⚠️ model did not emit a DEVTAB block — cards will fall back to tool result parsing')
      console.groupEnd()
      return response
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
