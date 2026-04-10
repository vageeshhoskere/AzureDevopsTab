import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../store'
import { useWorkItemDetail } from '../../hooks/useWorkItemDetail'
import { WorkItemDetail } from './WorkItemDetail'

export function WorkItemDrawer() {
  const drawerOpen = useStore((s) => s.drawerOpen)
  const selectedWorkItemID = useStore((s) => s.selectedWorkItemID)
  const closeDrawer = useStore((s) => s.closeDrawer)
  // URL fallback: look up work item URL from chat messages while detail is loading
  const workItemUrl = useStore((s) => {
    if (selectedWorkItemID === null) return undefined
    for (const msg of s.messages) {
      const found = msg.workItems.find((w) => w.id === selectedWorkItemID)
      if (found?.url) return found.url
    }
    return undefined
  })

  const { detail, isLoading, error, refetch } = useWorkItemDetail(selectedWorkItemID)

  return (
    <AnimatePresence>
      {drawerOpen && selectedWorkItemID !== null && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ado-text/5"
            onClick={closeDrawer}
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-[42vw] min-w-[380px] max-w-[640px] bg-ado-surface border-l border-ado-border z-50 flex flex-col"
            style={{ boxShadow: '-8px 0 40px rgba(30,27,75,0.12)' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-ado-border flex-shrink-0">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-mono font-semibold text-ado-accent">
                  #{selectedWorkItemID}
                </span>
                {detail && (
                  <h2 className="text-base font-semibold text-ado-text mt-0.5 line-clamp-1 pr-4">
                    {detail.title}
                  </h2>
                )}
                {isLoading && !detail && (
                  <div className="h-5 w-48 bg-ado-surface2 rounded-md animate-pulse mt-0.5" />
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 mt-0.5">
                {(detail?.url ?? workItemUrl) && (
                  <a
                    href={detail?.url ?? workItemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-ado-accent hover:text-ado-accentHover transition-colors flex items-center gap-1"
                  >
                    Open in ADO
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 8L8 2M4 2h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
                <button
                  onClick={closeDrawer}
                  aria-label="Close"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-ado-muted hover:bg-ado-surface2 hover:text-ado-text transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <WorkItemDetail
              detail={detail}
              isLoading={isLoading}
              error={error as Error | null}
              onRetry={() => refetch()}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
