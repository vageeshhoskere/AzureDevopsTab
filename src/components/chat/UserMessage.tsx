import type { OcPartType } from '../../types/opencode'

interface UserMessageProps {
  parts: OcPartType[]
}

export function UserMessage({ parts }: UserMessageProps) {
  const text = parts
    .filter((p) => p.type === 'text')
    .map((p) => (p.type === 'text' ? p.text : ''))
    .join('')

  return (
    <div className="flex justify-end px-4 py-2">
      <div className="max-w-[75%] bg-ado-accent text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
        {text}
      </div>
    </div>
  )
}
