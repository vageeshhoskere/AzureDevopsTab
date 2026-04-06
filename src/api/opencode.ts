import type { OcSession, OcMessageWithParts, OcPromptInput } from '../types/opencode'
import { client } from './client'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function unwrap<T>(result: { data?: T; error?: unknown }): T {
  if (result.error) throw new Error(`Opencode: ${JSON.stringify(result.error)}`)
  if (result.data === undefined) throw new Error('Opencode: empty response')
  return result.data
}

// ─── Sessions ────────────────────────────────────────────────────────────────

export async function createSession(): Promise<OcSession> {
  const result = await client.session.create()
  return unwrap(result) as unknown as OcSession
}

export async function getSession(id: string): Promise<OcSession> {
  const result = await client.session.get({ path: { id } })
  return unwrap(result) as unknown as OcSession
}

export async function listSessions(): Promise<OcSession[]> {
  const result = await client.session.list()
  return unwrap(result) as unknown as OcSession[]
}

// ─── Messages ────────────────────────────────────────────────────────────────

export async function listMessages(sessionID: string): Promise<OcMessageWithParts[]> {
  const result = await client.session.messages({ path: { id: sessionID } })
  return unwrap(result) as unknown as OcMessageWithParts[]
}

/**
 * Send a message to a session. The POST resolves when the full response is
 * ready (authoritative). Meanwhile, live text deltas arrive via the /event
 * SSE stream.
 */
export async function sendMessage(
  sessionID: string,
  input: OcPromptInput,
): Promise<OcMessageWithParts> {
  const result = await client.session.prompt({
    path: { id: sessionID },
    // OcPromptInput.parts is structurally compatible with the SDK's TextPartInput/FilePartInput
    body: input as Parameters<typeof client.session.prompt>[0]['body'],
  })
  return unwrap(result) as unknown as OcMessageWithParts
}
