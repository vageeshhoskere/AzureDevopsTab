import { useEffect, useState } from 'react'
import { createSession, getSession } from '../api/opencode'
import { useStore } from '../store'

const SESSION_KEY = 'devops-tab-session-id'

export function useSession() {
  const setSessionID = useStore((s) => s.setSessionID)
  const setConnectionError = useStore((s) => s.setConnectionError)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const stored = sessionStorage.getItem(SESSION_KEY)

      if (stored) {
        try {
          await getSession(stored)
          if (!cancelled) {
            setSessionID(stored)
            setConnectionError(null)
          }
        } catch (err) {
          // Session expired or server not reachable
          sessionStorage.removeItem(SESSION_KEY)
          if (!cancelled) await createNew()
        }
      } else {
        await createNew()
      }

      if (!cancelled) setIsLoading(false)
    }

    async function createNew() {
      try {
        const session = await createSession()
        if (!cancelled) {
          sessionStorage.setItem(SESSION_KEY, session.id)
          setSessionID(session.id)
          setConnectionError(null)
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Cannot connect to Opencode'
          setConnectionError(msg)
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [setSessionID, setConnectionError])

  return { isLoading }
}
