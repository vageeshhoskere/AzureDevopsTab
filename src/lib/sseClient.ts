import type { OcBusEvent } from '../types/opencode'
import { client } from '../api/client'

type EventType = OcBusEvent['type']
type HandlerFor<T extends EventType> = (
  properties: Extract<OcBusEvent, { type: T }>['properties'],
) => void

class SseClient {
  private handlers = new Map<string, Set<HandlerFor<EventType>>>()
  private abortController: AbortController | null = null
  private connected = false

  get isConnected() {
    return this.connected
  }

  connect(): void {
    if (this.abortController) return // already running
    void this._run()
  }

  disconnect(): void {
    this.abortController?.abort()
    this.abortController = null
    this.connected = false
  }

  on<T extends EventType>(type: T, handler: HandlerFor<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    const set = this.handlers.get(type)!
    set.add(handler as unknown as HandlerFor<EventType>)
    return () => set.delete(handler as unknown as HandlerFor<EventType>)
  }

  private async _run(): Promise<void> {
    this.abortController = new AbortController()
    const signal = this.abortController.signal

    try {
      const { stream } = await client.event.subscribe({
        signal,
        // SDK handles exponential back-off internally; set sensible bounds
        sseDefaultRetryDelay: 1_000,
        sseMaxRetryDelay: 30_000,
      })

      this.connected = true

      for await (const event of stream) {
        if (signal.aborted) break
        this._dispatch(event as unknown as OcBusEvent)
      }
    } catch (err) {
      if (!signal.aborted) {
        console.warn('[SseClient] stream ended unexpectedly:', err)
      }
    } finally {
      this.connected = false
      if (!signal.aborted) {
        // Stream ended without an explicit disconnect — restart after a delay
        this.abortController = null
        setTimeout(() => void this._run(), 3_000)
      } else {
        this.abortController = null
      }
    }
  }

  private _dispatch(event: OcBusEvent): void {
    const set = this.handlers.get(event.type)
    if (set) {
      set.forEach((h) => h(event.properties as never))
    }
  }
}

export const sseClient = new SseClient()
