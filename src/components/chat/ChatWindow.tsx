import { useState, useEffect } from 'react'
import { useStore } from '../../store'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { DEMO_MESSAGES, DEMO_WORK_ITEM_DETAILS } from '../../data/demoData'

export function ChatWindow() {
  const messages = useStore((s) => s.messages)
  const isTyping = useStore((s) => s.isAssistantTyping)
  const connectionError = useStore((s) => s.connectionError)
  const cacheWorkItemDetail = useStore((s) => s.cacheWorkItemDetail)
  const [inputText, setInputText] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)

  const displayMessages = isDemoMode ? DEMO_MESSAGES : messages

  // Populate work item detail cache when entering demo mode
  useEffect(() => {
    if (isDemoMode) {
      Object.entries(DEMO_WORK_ITEM_DETAILS).forEach(([_, detail]) => {
        cacheWorkItemDetail(detail)
      })
    }
  }, [isDemoMode, cacheWorkItemDetail])

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

      <MessageList
        messages={displayMessages}
        isTyping={isDemoMode ? false : isTyping}
        onPromptSelect={setInputText}
        demoMode={isDemoMode}
        onToggleDemo={() => setIsDemoMode(!isDemoMode)}
      />
      <ChatInput value={inputText} onChange={setInputText} />
    </div>
  )
}
