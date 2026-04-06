// ─── Session ────────────────────────────────────────────────────────────────

export interface OcSession {
  id: string
  slug?: string
  projectID: string
  title: string
  directory: string
  time: { created: number; updated: number; archived?: number }
}

// ─── Message parts ───────────────────────────────────────────────────────────
// These types optionally carry messageID / sessionID so SDK-sourced parts
// (which always include them) are assignable to OcPartType.

export interface OcTextPart {
  type: 'text'
  id: string
  text: string
  messageID?: string
  sessionID?: string
  time?: { created?: number; completed?: number; start?: number; end?: number }
  synthetic?: boolean
}

export interface OcReasoningPart {
  type: 'reasoning'
  id: string
  text: string
  messageID?: string
  sessionID?: string
}

export interface OcFilePart {
  type: 'file'
  id: string
  url: string
  filename?: string
  mime?: string
  messageID?: string
  sessionID?: string
}

export interface OcStepStartPart {
  type: 'step-start'
  id: string
  messageID?: string
  sessionID?: string
}

export interface OcStepFinishPart {
  type: 'step-finish'
  id: string
  messageID?: string
  sessionID?: string
}

export interface OcToolStatePending {
  status: 'pending'
  input: unknown
}

export interface OcToolStateRunning {
  status: 'running'
  input: unknown
}

export interface OcToolStateCompleted {
  status: 'completed'
  input: unknown
  output: string
  title?: string
  time: { start: number; end: number }
}

export interface OcToolStateError {
  status: 'error'
  input: unknown
  error: string
  time: { start: number; end: number }
}

export type OcToolState =
  | OcToolStatePending
  | OcToolStateRunning
  | OcToolStateCompleted
  | OcToolStateError

export interface OcToolPart {
  type: 'tool'
  id: string
  callID: string
  tool: string
  state: OcToolState
  messageID?: string
  sessionID?: string
}

export type OcPartType =
  | OcTextPart
  | OcReasoningPart
  | OcFilePart
  | OcStepStartPart
  | OcStepFinishPart
  | OcToolPart

// ─── Message ─────────────────────────────────────────────────────────────────

export interface OcMessageError {
  name: string
  data: { message: string; [key: string]: unknown }
}

export interface OcMessageInfo {
  id: string
  role: 'user' | 'assistant'
  sessionID: string
  time: { created: number; completed?: number }
  modelID?: string
  providerID?: string
  tokens?: { input: number; output: number; total?: number }
  cost?: number
  error?: OcMessageError
}

export interface OcMessageWithParts {
  info: OcMessageInfo
  parts: OcPartType[]
}

// ─── Prompt input ─────────────────────────────────────────────────────────────

export type OcPromptPart =
  | { type: 'text'; text: string }
  | { type: 'file'; url: string; filename: string; mime: string }

export interface OcPromptInput {
  parts: OcPromptPart[]
  model?: { providerID: string; modelID: string }
  agent?: string
}

// ─── SSE bus events ──────────────────────────────────────────────────────────
// Aligned with the SDK's Event union (@opencode-ai/sdk).
// Key differences from the old custom types:
//   • message.part.delta is gone — delta is now an optional field on message.part.updated
//   • sessionID is no longer in message.updated properties (use info.sessionID instead)
//   • sessionID is no longer in message.part.updated properties (use part.sessionID instead)

export type OcBusEvent =
  | { type: 'server.connected'; properties: Record<string, never> }
  | { type: 'server.heartbeat'; properties: Record<string, never> }
  | { type: 'message.updated'; properties: { info: OcMessageInfo } }
  | { type: 'message.removed'; properties: { sessionID: string; messageID: string } }
  | {
      type: 'message.part.updated'
      properties: {
        part: OcPartType
        /** Incremental text delta (only present during streaming). */
        delta?: string
      }
    }
  | {
      type: 'message.part.removed'
      properties: { sessionID: string; messageID: string; partID: string }
    }
  | { type: string; properties: unknown }
