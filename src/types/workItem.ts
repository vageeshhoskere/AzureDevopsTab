export type WorkItemType = 'Bug' | 'Task' | 'User Story' | 'Epic' | 'Feature' | 'Issue' | string

export type WorkItemState =
  | 'New'
  | 'Active'
  | 'Resolved'
  | 'Closed'
  | 'Removed'
  | 'To Do'
  | 'In Progress'
  | 'Done'
  | string

export interface WorkItemPerson {
  displayName: string
  uniqueName?: string
  imageUrl?: string
}

export interface WorkItemRelation {
  id: number
  title: string
  type: string
  url?: string
}

export interface WorkItemComment {
  id: number
  text: string
  author: WorkItemPerson
  createdAt: string
}

/** Compact representation — used for inline cards in chat */
export interface WorkItem {
  id: number
  title: string
  type: WorkItemType
  state: WorkItemState
  assignee?: WorkItemPerson
  url?: string
}

/** Full representation — used in the detail drawer */
export interface WorkItemDetail extends WorkItem {
  description?: string
  acceptanceCriteria?: string
  priority?: number
  tags?: string[]
  iteration?: string
  area?: string
  createdAt?: string
  updatedAt?: string
  storyPoints?: number
  remainingWork?: number
  comments?: WorkItemComment[]
  relations?: WorkItemRelation[]
}
