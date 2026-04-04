import type { OcSession, OcMessageWithParts, OcPromptInput } from '../types/opencode'

const getBase = () =>
  (import.meta.env.VITE_OPENCODE_API_URL as string | undefined) ?? 'http://localhost:4096'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getBase()}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`Opencode API ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

// ─── Sessions ────────────────────────────────────────────────────────────────

export function createSession(): Promise<OcSession> {
  return request<OcSession>('/session', { method: 'POST', body: JSON.stringify({}) })
}

export function getSession(id: string): Promise<OcSession> {
  return request<OcSession>(`/session/${id}`)
}

export function listSessions(): Promise<OcSession[]> {
  return request<OcSession[]>('/session')
}

// ─── Messages ────────────────────────────────────────────────────────────────

export function listMessages(sessionID: string): Promise<OcMessageWithParts[]> {
  return request<OcMessageWithParts[]>(`/session/${sessionID}/message`)
}

/**
 * Send a message to a session. The POST resolves when the full response is
 * ready (authoritative). Meanwhile, live text deltas arrive via the /event
 * SSE stream.
 */
export function sendMessage(
  sessionID: string,
  input: OcPromptInput,
): Promise<OcMessageWithParts> {
  return request<OcMessageWithParts>(`/session/${sessionID}/message`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

// ─── Event stream ─────────────────────────────────────────────────────────────

/** Create an EventSource connected to the /event SSE endpoint. */
export function createEventSource(): EventSource {
  return new EventSource(`${getBase()}/event`)
}
