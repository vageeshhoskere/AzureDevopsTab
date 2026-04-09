import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import type { OcPartType } from '../../types/opencode'
import type { WorkItem } from '../../types/workItem'
import { ToolCallBlock } from './ToolCallBlock'
import { WorkItemCard } from '../workItem/WorkItemCard'
import { markdownComponents } from '../../lib/markdown.tsx'

interface AssistantMessageProps {
  parts: OcPartType[]
  workItems: WorkItem[]
  isStreaming?: boolean
}

export function AssistantMessage({ parts, workItems, isStreaming }: AssistantMessageProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-1.5">
      {/* AI avatar */}
      <div
        className="w-8 h-8 rounded-full gradient-avatar flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mt-0.5"
      >
        AI
      </div>

      <div className="flex-1 min-w-0 max-w-[85%]">
        {/* Message body with gradient left border */}
        <div className="ai-message-border pl-4 pr-3 py-1 rounded-r-xl">
          <p className="text-xs font-semibold text-ado-accent mb-1">WorkHub Assistant</p>

          {parts.map((part) => {
            if (part.type === 'text' && part.text) {
              return (
                <ReactMarkdown
                  key={part.id}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={markdownComponents}
                >
                  {part.text}
                </ReactMarkdown>
              )
            }
            if (part.type === 'tool') {
              return <ToolCallBlock key={part.id} part={part} />
            }
            if (part.type === 'reasoning' && part.text) {
              return (
                <details key={part.id} className="my-2">
                  <summary className="text-xs text-ado-muted cursor-pointer hover:text-ado-text select-none">
                    Reasoning
                  </summary>
                  <p className="mt-2 text-xs text-ado-muted italic leading-relaxed pl-3 border-l-2 border-ado-border">
                    {part.text}
                  </p>
                </details>
              )
            }
            return null
          })}

          {isStreaming && parts.length === 0 && (
            <span className="text-ado-muted text-sm">…</span>
          )}
        </div>

        {/* Work item cards */}
        {workItems.length > 0 && (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {workItems.map((item) => (
              <WorkItemCard key={item.id} workItem={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
