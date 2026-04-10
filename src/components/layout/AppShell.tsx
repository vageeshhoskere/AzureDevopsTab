import { useSession } from '../../hooks/useSession'
import { useEventStream } from '../../hooks/useEventStream'
import { useStore } from '../../store'
import { ChatWindow } from '../chat/ChatWindow'
import { WorkItemDrawer } from '../workItem/WorkItemDrawer'
import { Spinner } from '../ui/Spinner'

export function AppShell() {
  const { isLoading } = useSession()
  const sessionID = useStore((s) => s.sessionID)

  useEventStream(sessionID)

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-ado-bg flex items-center justify-center gap-3">
        <Spinner size="lg" />
        <span className="text-ado-muted text-sm">Connecting to Opencode…</span>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-ado-bg flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-ado-border bg-ado-surface flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-avatar flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M8 3v10M5 5l6 6M11 5l-6 6" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-ado-accent tracking-tight">WorkHub</span>
        </div>

        {/* Session badge + User avatar */}
        <div className="flex items-center gap-3">
          {sessionID && (
            <div className="flex items-center gap-1.5 bg-ado-surface2 border border-ado-border rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-ado-story" />
              <span className="text-xs text-ado-muted font-medium font-mono">
                {sessionID.slice(0, 8)}
              </span>
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-ado-accent flex items-center justify-center text-white text-xs font-semibold select-none flex-shrink-0">
            VH
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <ChatWindow />
      </main>

      {/* Work item detail drawer (overlay) */}
      <WorkItemDrawer />
    </div>
  )
}
