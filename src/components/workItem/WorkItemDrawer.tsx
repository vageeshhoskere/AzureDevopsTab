import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../store'
import { useWorkItemDetail } from '../../hooks/useWorkItemDetail'
import { WorkItemDetail } from './WorkItemDetail'
import { Button } from '../ui/Button'

export function WorkItemDrawer() {
  const drawerOpen = useStore((s) => s.drawerOpen)
  const selectedWorkItemID = useStore((s) => s.selectedWorkItemID)
  const closeDrawer = useStore((s) => s.closeDrawer)

  const { detail, isLoading, error, refetch } = useWorkItemDetail(selectedWorkItemID)

  return (
    <AnimatePresence>
      {drawerOpen && selectedWorkItemID !== null && (
        <>
          {/* Backdrop — click to close */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            onClick={closeDrawer}
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-[42vw] min-w-[380px] max-w-[640px] bg-ado-surface border-l border-ado-border z-50 flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.10)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-ado-border flex-shrink-0">
              <div className="min-w-0">
                <span className="text-xs font-mono text-ado-accent font-semibold">
                  #{selectedWorkItemID}
                </span>
                {detail && (
                  <h2 className="text-base font-semibold text-ado-text mt-0.5 line-clamp-1">
                    {detail.title}
                  </h2>
                )}
                {isLoading && !detail && (
                  <div className="h-5 w-48 bg-ado-surface2 rounded animate-pulse mt-0.5" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {detail?.url && (
                  <a
                    href={detail.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-ado-accent hover:text-ado-accentLight transition-colors"
                    title="Open in Azure DevOps"
                  >
                    Open ↗
                  </a>
                )}
                <Button variant="ghost" size="sm" onClick={closeDrawer} aria-label="Close">
                  ✕
                </Button>
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
