import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ChatMessage } from '../types/chat'
import type { OcMessageWithParts, OcPartType } from '../types/opencode'
import type { WorkItemDetail } from '../types/workItem'
import { extractWorkItems } from '../lib/workItemParser'

// ─── Chat slice ───────────────────────────────────────────────────────────────

interface ChatSlice {
  sessionID: string | null
  messages: ChatMessage[]
  isAssistantTyping: boolean
  connectionError: string | null

  setSessionID: (id: string) => void
  addMessage: (msg: ChatMessage) => void
  updateMessagePartDelta: (
    messageID: string,
    partID: string,
    field: string,
    delta: string,
  ) => void
  upsertMessagePart: (messageID: string, part: OcPartType) => void
  finalizeMessage: (final: OcMessageWithParts) => void
  setAssistantTyping: (v: boolean) => void
  setConnectionError: (err: string | null) => void
}

// ─── Drawer slice ─────────────────────────────────────────────────────────────

interface DrawerSlice {
  drawerOpen: boolean
  selectedWorkItemID: number | null
  workItemDetailCache: Map<number, WorkItemDetail>

  openDrawer: (id: number) => void
  closeDrawer: () => void
  cacheWorkItemDetail: (detail: WorkItemDetail) => void
}

// ─── App slice ────────────────────────────────────────────────────────────────

interface AppSlice {
  baseURL: string
  /** AI provider ID (from VITE_OPENCODE_PROVIDER_ID). null = use backend default. */
  providerID: string | null
  /** AI model ID (from VITE_OPENCODE_MODEL_ID). null = use backend default. */
  modelID: string | null
  /** Opencode agent name (from VITE_OPENCODE_AGENT). null = use backend default. */
  agent: string | null
  setBaseURL: (url: string) => void
}

// ─── Combined store ───────────────────────────────────────────────────────────

type AppStore = ChatSlice & DrawerSlice & AppSlice

export const useStore = create<AppStore>()(
  immer((set) => ({
    // ── Chat ──
    sessionID: null,
    messages: [],
    isAssistantTyping: false,
    connectionError: null,

    setSessionID: (id) =>
      set((s) => {
        s.sessionID = id
      }),

    addMessage: (msg) =>
      set((s) => {
        const exists = s.messages.findIndex((m) => m.id === msg.id)
        if (exists >= 0) {
          s.messages[exists] = msg
        } else {
          s.messages.push(msg)
        }
      }),

    updateMessagePartDelta: (messageID, partID, field, delta) =>
      set((s) => {
        const msg = s.messages.find((m) => m.id === messageID)
        if (!msg) return
        const part = msg.parts.find((p) => p.id === partID)
        if (!part) {
          // Create a new text part for streaming
          if (field === 'text') {
            msg.parts.push({
              type: 'text',
              id: partID,
              text: delta,
            })
          }
          return
        }
        if (part.type === 'text' && field === 'text') {
          part.text += delta
        }
      }),

    upsertMessagePart: (messageID, part) =>
      set((s) => {
        const msg = s.messages.find((m) => m.id === messageID)
        if (!msg) return
        const idx = msg.parts.findIndex((p) => p.id === part.id)
        if (idx >= 0) {
          msg.parts[idx] = part
        } else {
          msg.parts.push(part)
        }
        // Re-extract work items when a tool part is updated
        if (part.type === 'tool') {
          msg.workItems = extractWorkItems(msg.parts)
        }
      }),

    finalizeMessage: (final) =>
      set((s) => {
        const idx = s.messages.findIndex((m) => m.id === final.info.id)
        const workItems = extractWorkItems(final.parts)
        const finalized: ChatMessage = {
          id: final.info.id,
          sessionID: final.info.sessionID,
          role: final.info.role,
          parts: final.parts,
          workItems,
          createdAt: final.info.time.created,
          isStreaming: false,
          error: final.info.error?.data.message,
        }
        if (idx >= 0) {
          s.messages[idx] = finalized
        } else {
          s.messages.push(finalized)
        }
        s.isAssistantTyping = false
      }),

    setAssistantTyping: (v) =>
      set((s) => {
        s.isAssistantTyping = v
      }),

    setConnectionError: (err) =>
      set((s) => {
        s.connectionError = err
      }),

    // ── Drawer ──
    drawerOpen: false,
    selectedWorkItemID: null,
    workItemDetailCache: new Map(),

    openDrawer: (id) =>
      set((s) => {
        s.selectedWorkItemID = id
        s.drawerOpen = true
      }),

    closeDrawer: () =>
      set((s) => {
        s.drawerOpen = false
      }),

    cacheWorkItemDetail: (detail) =>
      set((s) => {
        s.workItemDetailCache.set(detail.id, detail)
      }),

    // ── App ──
    baseURL:
      (import.meta.env.VITE_OPENCODE_API_URL as string | undefined) ?? 'http://localhost:4096',

    providerID: (import.meta.env.VITE_OPENCODE_PROVIDER_ID as string | undefined) || null,
    modelID:    (import.meta.env.VITE_OPENCODE_MODEL_ID    as string | undefined) || null,
    agent:      (import.meta.env.VITE_OPENCODE_AGENT       as string | undefined) || null,

    setBaseURL: (url) =>
      set((s) => {
        s.baseURL = url
      }),
  })),
)
