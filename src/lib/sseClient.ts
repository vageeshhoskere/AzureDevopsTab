import type { OcBusEvent } from '../types/opencode'
import { createEventSource } from '../api/opencode'

type EventType = OcBusEvent['type']
type HandlerFor<T extends EventType> = (
  properties: Extract<OcBusEvent, { type: T }>['properties'],
) => void

const MAX_RETRIES = 5
const BASE_DELAY_MS = 1000

class SseClient {
  private es: EventSource | null = null
  private handlers = new Map<string, Set<HandlerFor<EventType>>>()
  private retryCount = 0
  private retryTimer: ReturnType<typeof setTimeout> | null = null
  private connected = false

  get isConnected() {
    return this.connected
  }

  connect(): void {
    if (this.es) return
    this._open()
  }

  disconnect(): void {
    if (this.retryTimer) clearTimeout(this.retryTimer)
    this.es?.close()
    this.es = null
    this.connected = false
    this.retryCount = 0
  }

  on<T extends EventType>(type: T, handler: HandlerFor<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    const set = this.handlers.get(type)!
    set.add(handler as unknown as HandlerFor<EventType>)
    return () => set.delete(handler as unknown as HandlerFor<EventType>)
  }

  private _open(): void {
    const es = createEventSource()
    this.es = es

    es.addEventListener('message', (e: MessageEvent) => {
      this._dispatch(e.data as string)
    })

    es.addEventListener('open', () => {
      this.connected = true
      this.retryCount = 0
    })

    es.addEventListener('error', () => {
      this.connected = false
      es.close()
      this.es = null
      this._scheduleReconnect()
    })
  }

  private _scheduleReconnect(): void {
    if (this.retryCount >= MAX_RETRIES) return
    const delay = BASE_DELAY_MS * Math.pow(2, this.retryCount)
    this.retryCount++
    this.retryTimer = setTimeout(() => {
      this._open()
    }, delay)
  }

  private _dispatch(raw: string): void {
    try {
      const event = JSON.parse(raw) as OcBusEvent
      const set = this.handlers.get(event.type)
      if (set) {
        set.forEach((h) => h(event.properties as never))
      }
    } catch {
      // ignore malformed events
    }
  }
}

export const sseClient = new SseClient()
