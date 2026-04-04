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
      {/* Top bar */}
      <header className="flex-shrink-0 h-12 border-b border-ado-border bg-ado-surface flex items-center px-6 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-ado-accent rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-ado-text">DevOps Tab</span>
        </div>
        <span className="text-ado-border">|</span>
        <span className="text-xs text-ado-muted">Azure DevOps · MCP</span>
        {sessionID && (
          <span className="ml-auto text-xs text-ado-muted font-mono">
            session:{sessionID.slice(0, 8)}
          </span>
        )}
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
