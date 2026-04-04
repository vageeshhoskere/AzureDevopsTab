import type { OcPartType } from './opencode'
import type { WorkItem } from './workItem'

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  sessionID: string
  role: MessageRole
  parts: OcPartType[]
  workItems: WorkItem[]
  createdAt: number
  isStreaming?: boolean
  error?: string
}

export interface ChatSession {
  id: string
  title: string
  createdAt: number
}
