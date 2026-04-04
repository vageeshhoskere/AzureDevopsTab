// ─── Session ────────────────────────────────────────────────────────────────

export interface OcSession {
  id: string
  slug: string
  projectID: string
  title: string
  directory: string
  time: { created: number; updated: number; archived?: number }
}

// ─── Message parts ───────────────────────────────────────────────────────────

export interface OcTextPart {
  type: 'text'
  id: string
  text: string
  time?: { created: number; completed?: number }
  synthetic?: boolean
}

export interface OcReasoningPart {
  type: 'reasoning'
  id: string
  text: string
}

export interface OcFilePart {
  type: 'file'
  id: string
  url: string
  filename?: string
  mime?: string
}

export interface OcStepStartPart {
  type: 'step-start'
  id: string
}

export interface OcStepFinishPart {
  type: 'step-finish'
  id: string
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
  name: 'MessageError'
  data: { type: 'auth' | 'api' | 'context'; message: string }
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

export type OcBusEvent =
  | { type: 'server.connected'; properties: Record<string, never> }
  | { type: 'server.heartbeat'; properties: Record<string, never> }
  | { type: 'message.updated'; properties: { sessionID: string; info: OcMessageInfo } }
  | { type: 'message.removed'; properties: { sessionID: string; messageID: string } }
  | {
      type: 'message.part.updated'
      properties: { sessionID: string; part: OcPartType; time: number }
    }
  | {
      type: 'message.part.delta'
      properties: {
        sessionID: string
        messageID: string
        partID: string
        field: string
        delta: string
      }
    }
  | {
      type: 'message.part.removed'
      properties: { sessionID: string; messageID: string; partID: string }
    }
