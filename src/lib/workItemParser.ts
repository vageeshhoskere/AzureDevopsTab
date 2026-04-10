import type { OcPartType } from '../types/opencode'
import type { WorkItem, WorkItemDetail, WorkItemPerson } from '../types/workItem'

// ─── Hidden block format ──────────────────────────────────────────────────────
// The AI appends <!--DEVTAB:[...]-->  at the end of responses that reference
// work items. We parse this block and strip it from the displayed text.

const DEVTAB_BLOCK_RE = /<!--DEVTAB:(\[[\s\S]*?\])-->/

interface DevTabItem {
  id: number
  type: string
  title: string
  state: string
  assignee?: { displayName: string; uniqueName?: string; imageUrl?: string }
  url?: string
}

function parseDevTabBlock(text: string): WorkItem[] {
  const match = DEVTAB_BLOCK_RE.exec(text)
  if (!match) return []
  try {
    const items = JSON.parse(match[1]) as DevTabItem[]
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      state: item.state,
      assignee: item.assignee
        ? ({
            displayName: item.assignee.displayName,
            uniqueName: item.assignee.uniqueName,
            imageUrl: item.assignee.imageUrl,
          } satisfies WorkItemPerson)
        : undefined,
      url: item.url,
    }))
  } catch {
    return []
  }
}

/** Strip the hidden <!--DEVTAB:[...]-->  block from text before rendering. */
export function stripDevTabBlock(text: string): string {
  return text.replace(DEVTAB_BLOCK_RE, '').trimEnd()
}

/** Extract work items from message parts by reading the hidden DEVTAB block. */
export function extractWorkItems(parts: OcPartType[]): WorkItem[] {
  // Primary: DEVTAB block — accurate types straight from the AI
  for (const part of parts) {
    if (part.type !== 'text') continue
    const items = parseDevTabBlock(part.text)
    if (items.length > 0) {
      console.log('[WorkHub] extractWorkItems: found DEVTAB block →', items)
      return items
    }
  }

  // Fallback: tool results containing ADO JSON — used when the AI hasn't yet
  // started emitting DEVTAB blocks (e.g. first session, instruction ignored)
  for (const part of parts) {
    if (part.type !== 'tool' || part.state.status !== 'completed') continue
    try {
      const items = extractWorkItemsFromAdoJson(JSON.parse(part.state.output))
      if (items.length > 0) {
        console.log('[WorkHub] extractWorkItems: DEVTAB missing, fell back to tool result →', items)
        return items
      }
    } catch { /* skip */ }
  }

  console.log('[WorkHub] extractWorkItems: no work items found in parts', parts)
  return []
}

function extractWorkItemsFromAdoJson(data: unknown): WorkItem[] {
  if (!data || typeof data !== 'object') return []
  const obj = data as Record<string, unknown>

  if ('value' in obj && Array.isArray(obj.value)) {
    return (obj.value as AdoRawWorkItem[]).map(mapDetail).map(toWorkItem)
  }
  if ('id' in obj && 'fields' in obj) {
    return [toWorkItem(mapDetail(obj as AdoRawWorkItem))]
  }
  if (Array.isArray(data)) {
    const items: WorkItem[] = []
    for (const entry of data as unknown[]) {
      if (!entry || typeof entry !== 'object') continue
      const e = entry as Record<string, unknown>
      if (e.type === 'text' && typeof e.text === 'string') {
        try { items.push(...extractWorkItemsFromAdoJson(JSON.parse(e.text))) } catch { /* skip */ }
      } else if ('id' in e && 'fields' in e) {
        items.push(toWorkItem(mapDetail(e as AdoRawWorkItem)))
      }
    }
    return items
  }
  return []
}

function toWorkItem(detail: WorkItemDetail): WorkItem {
  return {
    id: detail.id,
    title: detail.title,
    type: detail.type,
    state: detail.state,
    assignee: detail.assignee,
    url: detail.url,
  }
}

// ─── Detail drawer parsing ────────────────────────────────────────────────────
// When the user opens a work item drawer, a dedicated fetch is made asking the
// AI for full details. The AI returns structured ADO JSON (in a code block or
// tool result) which we parse here.

interface AdoPersonRef {
  displayName: string
  uniqueName?: string
  _links?: { avatar?: { href: string } }
}

interface AdoWorkItemFields {
  'System.Title': string
  'System.WorkItemType': string
  'System.State': string
  'System.AssignedTo'?: AdoPersonRef
  'System.Description'?: string
  'System.Tags'?: string
  'Microsoft.VSTS.Common.AcceptanceCriteria'?: string
  'Microsoft.VSTS.Common.Priority'?: number
  'System.IterationPath'?: string
  'System.AreaPath'?: string
  'System.CreatedDate'?: string
  'System.ChangedDate'?: string
  'Microsoft.VSTS.Scheduling.StoryPoints'?: number
  'Microsoft.VSTS.Scheduling.RemainingWork'?: number
}

interface AdoRawWorkItem {
  id: number
  fields: AdoWorkItemFields
  _links?: { html?: { href: string } }
}

function mapDetail(raw: AdoRawWorkItem): WorkItemDetail {
  const assigneeRef = raw.fields['System.AssignedTo']
  const tags = raw.fields['System.Tags']
    ? raw.fields['System.Tags'].split(';').map((t) => t.trim()).filter(Boolean)
    : undefined
  return {
    id: raw.id,
    title: raw.fields['System.Title'] ?? `Work Item #${raw.id}`,
    type: raw.fields['System.WorkItemType'] ?? 'Work Item',
    state: raw.fields['System.State'] ?? 'Unknown',
    assignee: assigneeRef
      ? { displayName: assigneeRef.displayName, uniqueName: assigneeRef.uniqueName, imageUrl: assigneeRef._links?.avatar?.href }
      : undefined,
    url: raw._links?.html?.href,
    description: raw.fields['System.Description'],
    acceptanceCriteria: raw.fields['Microsoft.VSTS.Common.AcceptanceCriteria'],
    priority: raw.fields['Microsoft.VSTS.Common.Priority'],
    tags,
    iteration: raw.fields['System.IterationPath'],
    area: raw.fields['System.AreaPath'],
    createdAt: raw.fields['System.CreatedDate'],
    updatedAt: raw.fields['System.ChangedDate'],
    storyPoints: raw.fields['Microsoft.VSTS.Scheduling.StoryPoints'],
    remainingWork: raw.fields['Microsoft.VSTS.Scheduling.RemainingWork'],
  }
}

function findDetailInJson(data: unknown, targetId: number): WorkItemDetail | null {
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>

  // Single work item: { id, fields }
  if ('id' in obj && 'fields' in obj && (obj as AdoRawWorkItem).id === targetId) {
    return mapDetail(obj as AdoRawWorkItem)
  }

  // List response: { value: [...] }
  if ('value' in obj && Array.isArray(obj.value)) {
    const match = (obj.value as AdoRawWorkItem[]).find((v) => v.id === targetId)
    if (match) return mapDetail(match)
  }

  // Array of items or MCP content parts
  if (Array.isArray(data)) {
    for (const entry of data as unknown[]) {
      if (!entry || typeof entry !== 'object') continue
      const e = entry as Record<string, unknown>
      if (e.type === 'text' && typeof e.text === 'string') {
        try { const r = findDetailInJson(JSON.parse(e.text), targetId); if (r) return r } catch { /* skip */ }
        continue
      }
      if ('id' in e && 'fields' in e && (e as AdoRawWorkItem).id === targetId) {
        return mapDetail(e as AdoRawWorkItem)
      }
    }
  }

  return null
}

/**
 * Extract full work item detail from the parts returned by a detail drawer
 * fetch. Looks in tool results first, then JSON code blocks in text parts.
 */
export function extractWorkItemDetail(parts: OcPartType[], targetId: number): WorkItemDetail | null {
  // Tool results
  for (const part of parts) {
    if (part.type !== 'tool' || part.state.status !== 'completed') continue
    try {
      const r = findDetailInJson(JSON.parse(part.state.output), targetId)
      if (r) return r
    } catch { /* skip */ }
  }

  // JSON in text parts (direct or inside code fences)
  for (const part of parts) {
    if (part.type !== 'text') continue
    const candidates: unknown[] = []
    try { candidates.push(JSON.parse(part.text.trim())) } catch { /* skip */ }
    const fence = /```(?:json)?\s*([\s\S]*?)```/g
    let m: RegExpExecArray | null
    while ((m = fence.exec(part.text)) !== null) {
      try { candidates.push(JSON.parse(m[1].trim())) } catch { /* skip */ }
    }
    for (const c of candidates) {
      const r = findDetailInJson(c, targetId)
      if (r) return r
    }
  }

  return null
}
