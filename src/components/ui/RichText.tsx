import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

const components: Components = {
  // ── Headings ──────────────────────────────────────────────────────────────
  h1: ({ children }) => (
    <h1 className="text-base font-semibold text-ado-text mt-5 mb-2 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-semibold text-ado-text mt-4 mb-2 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[11px] font-semibold text-ado-muted uppercase tracking-widest mt-4 mb-2 first:mt-0">
      {children}
    </h3>
  ),

  // ── Paragraph ─────────────────────────────────────────────────────────────
  p: ({ children }) => (
    <p className="text-sm text-ado-text leading-relaxed mb-2 last:mb-0">{children}</p>
  ),

  // ── Inline ────────────────────────────────────────────────────────────────
  strong: ({ children }) => (
    <strong className="font-semibold text-ado-text">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-ado-muted">{children}</em>
  ),
  code: ({ children }) => (
    <code className="text-xs font-mono bg-ado-surface2 text-ado-accent px-1.5 py-0.5 rounded">
      {children}
    </code>
  ),

  // ── Lists ─────────────────────────────────────────────────────────────────
  ul: ({ children }) => (
    <ul className="text-sm text-ado-text space-y-1 mb-2 pl-4 list-disc marker:text-ado-accent">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-sm text-ado-text space-y-1 mb-2 pl-4 list-decimal marker:text-ado-accent">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,

  // ── Table ─────────────────────────────────────────────────────────────────
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-lg border border-ado-border mb-3">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-ado-surface2">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-ado-border">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-ado-bg transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="text-left text-[11px] font-semibold text-ado-muted uppercase tracking-wider px-3 py-2 border-b border-ado-border">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-ado-text align-top">{children}</td>
  ),

  // ── Misc ──────────────────────────────────────────────────────────────────
  hr: () => <hr className="border-ado-border my-3" />,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-ado-accent pl-3 text-ado-muted italic my-2">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ado-accent hover:text-ado-accentHover underline underline-offset-2"
    >
      {children}
    </a>
  ),
}

interface RichTextProps {
  content: string
  className?: string
}

/**
 * Renders markdown (or inline HTML) content using the app's design tokens.
 * Handles ADO description fields (HTML) and AI-generated markdown equally.
 */
export function RichText({ content, className }: RichTextProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
