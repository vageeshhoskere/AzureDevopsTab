import type { OcPartType } from '../types/opencode'
import type { WorkItem, WorkItemDetail, WorkItemPerson, WorkItemType } from '../types/workItem'

// ─── ADO REST API shape (minimal) ─────────────────────────────────────────────

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

interface AdoListResponse {
  value: AdoRawWorkItem[]
  count?: number
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function mapPerson(ref: AdoPersonRef | undefined): WorkItemPerson | undefined {
  if (!ref) return undefined
  return {
    displayName: ref.displayName,
    uniqueName: ref.uniqueName,
    imageUrl: ref._links?.avatar?.href,
  }
}

function mapWorkItem(raw: AdoRawWorkItem): WorkItem {
  return {
    id: raw.id,
    title: raw.fields['System.Title'] ?? `Work Item #${raw.id}`,
    type: (raw.fields['System.WorkItemType'] ?? 'Task') as WorkItemType,
    state: raw.fields['System.State'] ?? 'Unknown',
    assignee: mapPerson(raw.fields['System.AssignedTo']),
    url: raw._links?.html?.href,
  }
}

function mapWorkItemDetail(raw: AdoRawWorkItem): WorkItemDetail {
  const base = mapWorkItem(raw)
  const tags = raw.fields['System.Tags']
    ? raw.fields['System.Tags'].split(';').map((t) => t.trim()).filter(Boolean)
    : undefined
  return {
    ...base,
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

// ─── Tool output parser ───────────────────────────────────────────────────────

function parseToolOutput(output: string): WorkItem[] {
  try {
    const data = JSON.parse(output) as unknown
    if (!data || typeof data !== 'object') return []

    // ADO list response: { value: [...] }
    if ('value' in data && Array.isArray((data as AdoListResponse).value)) {
      return (data as AdoListResponse).value.map(mapWorkItem)
    }

    // Single ADO work item: { id, fields }
    if ('id' in data && 'fields' in data) {
      return [mapWorkItem(data as AdoRawWorkItem)]
    }

    // MCP wrapper: { workItems: [...] }
    if ('workItems' in data && Array.isArray((data as { workItems: AdoRawWorkItem[] }).workItems)) {
      return (data as { workItems: AdoRawWorkItem[] }).workItems.map(mapWorkItem)
    }

    return []
  } catch {
    return []
  }
}

function parseToolOutputDetail(output: string, targetId: number): WorkItemDetail | null {
  try {
    const data = JSON.parse(output) as unknown
    if (!data || typeof data !== 'object') return null

    if ('id' in data && (data as AdoRawWorkItem).id === targetId) {
      return mapWorkItemDetail(data as AdoRawWorkItem)
    }

    if ('value' in data && Array.isArray((data as AdoListResponse).value)) {
      const match = (data as AdoListResponse).value.find((v) => v.id === targetId)
      return match ? mapWorkItemDetail(match) : null
    }
  } catch {
    // ignore
  }
  return null
}

// ─── Markdown table parser ────────────────────────────────────────────────────

const WORK_ITEM_TYPE_KEYWORDS = ['Bug', 'Task', 'User Story', 'Story', 'Epic', 'Feature', 'Issue']

function parseMarkdownTable(text: string): WorkItem[] {
  const items: WorkItem[] = []
  const lines = text.split('\n')

  // Find header row
  let headerIdx = -1
  let colMap: { id: number; title: number; type: number; state: number; assignee: number } | null =
    null

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim()
    if (!line.startsWith('|')) continue
    const cols = line
      .split('|')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean)

    const idIdx = cols.findIndex((c) => c === 'id' || c === '#' || c === 'work item id')
    const titleIdx = cols.findIndex((c) => c.includes('title') || c === 'name')
    const typeIdx = cols.findIndex((c) => c.includes('type') || c === 'kind')
    const stateIdx = cols.findIndex((c) => c === 'state' || c === 'status')
    const assigneeIdx = cols.findIndex((c) => c.includes('assign'))

    if (idIdx >= 0 && titleIdx >= 0) {
      headerIdx = i
      colMap = {
        id: idIdx,
        title: titleIdx,
        type: typeIdx >= 0 ? typeIdx : -1,
        state: stateIdx >= 0 ? stateIdx : -1,
        assignee: assigneeIdx >= 0 ? assigneeIdx : -1,
      }
      break
    }
  }

  if (headerIdx < 0 || !colMap) return items

  // Skip separator row (the --- row)
  const startRow = headerIdx + 2

  for (let i = startRow; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line.startsWith('|')) break
    const cols = line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean)

    const idRaw = cols[colMap.id] ?? ''
    const idNum = parseInt(idRaw.replace(/[^0-9]/g, ''), 10)
    if (isNaN(idNum)) continue

    const title = cols[colMap.title] ?? ''
    const type = colMap.type >= 0 ? (cols[colMap.type] ?? 'Task') : 'Task'
    const state = colMap.state >= 0 ? (cols[colMap.state] ?? 'Active') : 'Active'
    const assigneeRaw = colMap.assignee >= 0 ? cols[colMap.assignee] : undefined
    const assignee = assigneeRaw
      ? { displayName: assigneeRaw }
      : undefined

    items.push({ id: idNum, title, type, state, assignee })
  }

  return items
}

// ─── Inline #ID reference parser ─────────────────────────────────────────────

function parseInlineRefs(text: string): WorkItem[] {
  const items: WorkItem[] = []
  // Match sentences containing a work item type keyword AND a #NNNN ref
  const sentenceRegex = /[^.!?\n]*#(\d{3,6})[^.!?\n]*/gi
  let match: RegExpExecArray | null

  while ((match = sentenceRegex.exec(text)) !== null) {
    const sentence = match[0]
    const id = parseInt(match[1], 10)
    const typeFound = WORK_ITEM_TYPE_KEYWORDS.find((kw) =>
      sentence.toLowerCase().includes(kw.toLowerCase()),
    )
    if (!typeFound) continue

    // Extract a rough title: text immediately after #ID
    const afterId = sentence.slice(sentence.indexOf(`#${match[1]}`) + match[1].length + 1).trim()
    const title = afterId.split(/[,;]/)[0].trim() || `Work Item #${id}`

    items.push({ id, title, type: typeFound, state: 'Active' })
  }

  return items
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Extract work items from an array of message parts (compact form for chat cards). */
export function extractWorkItems(parts: OcPartType[]): WorkItem[] {
  const map = new Map<number, WorkItem>()

  // Pass 1: tool results (highest priority)
  for (const part of parts) {
    if (part.type === 'tool' && part.state.status === 'completed') {
      for (const item of parseToolOutput(part.state.output)) {
        map.set(item.id, item)
      }
    }
  }

  // Pass 2: markdown tables in text parts
  for (const part of parts) {
    if (part.type === 'text') {
      for (const item of parseMarkdownTable(part.text)) {
        if (!map.has(item.id)) map.set(item.id, item)
      }
    }
  }

  // Pass 3: inline #ID refs (fallback)
  for (const part of parts) {
    if (part.type === 'text') {
      for (const item of parseInlineRefs(part.text)) {
        if (!map.has(item.id)) map.set(item.id, item)
      }
    }
  }

  return Array.from(map.values())
}

/** Extract full work item detail from parts (used in detail drawer fetch). */
export function extractWorkItemDetail(
  parts: OcPartType[],
  targetId: number,
): WorkItemDetail | null {
  for (const part of parts) {
    if (part.type === 'tool' && part.state.status === 'completed') {
      const detail = parseToolOutputDetail(part.state.output, targetId)
      if (detail) return detail
    }
  }
  return null
}
