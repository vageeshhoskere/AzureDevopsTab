import { useQuery } from '@tanstack/react-query'
import { sendMessage } from '../api/opencode'
import { useStore } from '../store'
import { extractWorkItemDetail } from '../lib/workItemParser'
import type { WorkItemDetail } from '../types/workItem'

export function useWorkItemDetail(workItemID: number | null) {
  const sessionID = useStore((s) => s.sessionID)
  const cacheWorkItemDetail = useStore((s) => s.cacheWorkItemDetail)
  const cachedDetail = useStore((s) =>
    workItemID != null ? s.workItemDetailCache.get(workItemID) : undefined,
  )

  const query = useQuery<WorkItemDetail>({
    queryKey: ['workItemDetail', workItemID, sessionID],
    enabled: workItemID !== null && sessionID !== null && cachedDetail === undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    queryFn: async () => {
      const response = await sendMessage(sessionID!, {
        parts: [
          {
            type: 'text',
            text: `Get full details for Azure DevOps work item #${workItemID}. Include: title, description, acceptance criteria, state, assignee, priority, tags, iteration path, area path, story points, remaining work, all comments, and related work items. Return the raw work item data from Azure DevOps.`,
          },
        ],
      })
      const detail = extractWorkItemDetail(response.parts, workItemID!)
      if (!detail) {
        // Fallback: build a minimal detail from text parts
        const textContent = response.parts
          .filter((p) => p.type === 'text')
          .map((p) => (p.type === 'text' ? p.text : ''))
          .join('\n')
        const fallback: WorkItemDetail = {
          id: workItemID!,
          title: `Work Item #${workItemID}`,
          type: 'Task',
          state: 'Unknown',
          description: textContent || 'Details unavailable',
        }
        cacheWorkItemDetail(fallback)
        return fallback
      }
      cacheWorkItemDetail(detail)
      return detail
    },
  })

  return {
    detail: cachedDetail ?? query.data,
    isLoading: query.isPending && cachedDetail === undefined,
    error: query.error,
    refetch: query.refetch,
  }
}
