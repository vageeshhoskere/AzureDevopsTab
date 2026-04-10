import type { ChatMessage } from '../types/chat'
import type { WorkItem, WorkItemDetail } from '../types/workItem'

export const DEMO_WORK_ITEMS: WorkItem[] = [
  {
    id: 4821,
    type: 'Bug',
    title: 'Login fails on Safari 17',
    state: 'Active',
    assignee: { displayName: 'Priya S.', uniqueName: 'priya@example.com', imageUrl: '' },
  },
  {
    id: 4809,
    type: 'Bug',
    title: 'Dashboard chart flickers on resize',
    state: 'Active',
    assignee: { displayName: 'Marcus T.', uniqueName: 'marcus@example.com', imageUrl: '' },
  },
  {
    id: 4795,
    type: 'Bug',
    title: 'Export to CSV skips last row',
    state: 'In Progress',
    assignee: { displayName: 'Yuki N.', uniqueName: 'yuki@example.com', imageUrl: '' },
  },
  {
    id: 4788,
    type: 'Bug',
    title: 'Notification emails not sent on weekends',
    state: 'New',
    assignee: { displayName: 'Vageesh H.', uniqueName: 'vageesh@example.com', imageUrl: '' },
  },
]

const now = Date.now()

export const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sessionID: 'demo-session',
    role: 'user',
    parts: [
      {
        id: 'p1',
        type: 'text',
        text: 'Show me all active bugs in the current sprint',
      },
    ],
    workItems: [],
    createdAt: now - 10000,
  },
  {
    id: '2',
    sessionID: 'demo-session',
    role: 'assistant',
    parts: [
      {
        id: 'p2',
        type: 'tool',
        callID: 'call-1',
        tool: 'get_work_items',
        state: {
          status: 'completed',
          input: { sprint: 'Sprint 24', type: 'Bug', state: 'Active' },
          output: JSON.stringify({
            query: "SELECT * WHERE [System.WorkItemType] = 'Bug' AND [System.State] = 'Active'",
            count: 4,
            items: DEMO_WORK_ITEMS.map((item) => ({
              id: item.id,
              title: item.title,
              priority: item.id === 4821 ? 1 : item.id === 4809 ? 2 : 3,
            })),
          }),
          time: { start: now - 9500, end: now - 9200 },
          title: 'Retrieved 4 active bugs',
        },
      } as any,
      {
        id: 'p3',
        type: 'text',
        text: `Found **4 active bugs** in Sprint 24. Here's a breakdown — 1 critical issue needs immediate attention:

Bug #4821 is the highest priority — it's blocking users from logging in on Safari. Would you like me to pull the full details or check if there's a related PR?`,
      },
    ],
    workItems: DEMO_WORK_ITEMS,
    createdAt: now - 8000,
  },
  {
    id: '3',
    sessionID: 'demo-session',
    role: 'user',
    parts: [
      {
        id: 'p4',
        type: 'text',
        text: 'Yes, show me the full details for #4821',
      },
    ],
    workItems: [],
    createdAt: now - 5000,
  },
]

export const DEMO_WORK_ITEM_DETAILS: Record<number, WorkItemDetail> = {
  4821: {
    id: 4821,
    type: 'Bug',
    title: 'Login fails on Safari 17',
    state: 'Active',
    description: 'Users are unable to log in on Safari 17 browser. The authentication flow fails at the OAuth callback step.',
    acceptanceCriteria: 'Login works on Safari 17. OAuth callback is properly handled. Session is created successfully. User is redirected to dashboard.',
    assignee: { displayName: 'Priya S.', uniqueName: 'priya@example.com', imageUrl: '' },
    priority: 1,
    storyPoints: 5,
    tags: ['critical', 'frontend', 'authentication'],
    iteration: 'Sprint 24',
    area: 'Auth/Security',
    url: 'https://dev.azure.com/org/project/_workitems/edit/4821',
    remainingWork: 2,
    comments: [
      { id: 1, text: 'Looks like a User-Agent header mismatch. Started in Safari 17.2', author: { displayName: 'Dev Lead', uniqueName: 'dev@example.com' }, createdAt: new Date(now - 3600000).toISOString() },
      { id: 2, text: 'I found the issue - localStorage is disabled in Safari private mode', author: { displayName: 'Priya S.', uniqueName: 'priya@example.com' }, createdAt: new Date(now - 1800000).toISOString() },
    ],
    relations: [{ id: 4790, title: 'Add session storage fallback', type: 'Task' }],
  },
  4809: {
    id: 4809,
    type: 'Bug',
    title: 'Dashboard chart flickers on resize',
    state: 'Active',
    description: 'When resizing the dashboard, the charts flicker and briefly display old data before re-rendering.',
    acceptanceCriteria: 'Charts do not flicker on resize. Data is consistent during resize. Performance is not degraded.',
    assignee: { displayName: 'Marcus T.', uniqueName: 'marcus@example.com', imageUrl: '' },
    priority: 2,
    storyPoints: 3,
    tags: ['frontend', 'performance', 'charts'],
    iteration: 'Sprint 24',
    area: 'Dashboard',
    url: 'https://dev.azure.com/org/project/_workitems/edit/4809',
    remainingWork: 3,
    comments: [
      { id: 1, text: 'Issue is in the resize event handler - it re-queries too frequently', author: { displayName: 'Marcus T.', uniqueName: 'marcus@example.com' }, createdAt: new Date(now - 7200000).toISOString() },
    ],
    relations: [],
  },
  4795: {
    id: 4795,
    type: 'Bug',
    title: 'Export to CSV skips last row',
    state: 'In Progress',
    description: 'When exporting work items to CSV, the last row in the dataset is always omitted.',
    acceptanceCriteria: 'All rows are included in CSV export. CSV is properly formatted. Large exports (1000+ rows) work correctly.',
    assignee: { displayName: 'Yuki N.', uniqueName: 'yuki@example.com', imageUrl: '' },
    priority: 3,
    storyPoints: 2,
    tags: ['backend', 'export', 'data'],
    iteration: 'Sprint 24',
    area: 'Data Export',
    url: 'https://dev.azure.com/org/project/_workitems/edit/4795',
    remainingWork: 1,
    comments: [
      { id: 1, text: 'Found off-by-one error in pagination logic', author: { displayName: 'Yuki N.', uniqueName: 'yuki@example.com' }, createdAt: new Date(now - 5400000).toISOString() },
    ],
    relations: [{ id: 4750, title: 'Refactor export module', type: 'Task' }],
  },
  4788: {
    id: 4788,
    type: 'Bug',
    title: 'Notification emails not sent on weekends',
    state: 'New',
    description: 'Scheduled notification emails are not being sent if the schedule falls on a weekend.',
    acceptanceCriteria: 'Emails are sent on weekends. No timezone issues. Scheduled emails work for all days.',
    assignee: { displayName: 'Vageesh H.', uniqueName: 'vageesh@example.com', imageUrl: '' },
    priority: 3,
    storyPoints: 3,
    tags: ['backend', 'notifications', 'scheduling'],
    iteration: 'Sprint 24',
    area: 'Notifications',
    url: 'https://dev.azure.com/org/project/_workitems/edit/4788',
    comments: [
      { id: 1, text: 'Likely a cron job configuration issue', author: { displayName: 'Tech Lead', uniqueName: 'lead@example.com' }, createdAt: new Date(now - 10800000).toISOString() },
    ],
    relations: [],
  },
}
