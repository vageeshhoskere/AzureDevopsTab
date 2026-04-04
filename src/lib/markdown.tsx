import type { Components } from 'react-markdown'

/** Custom component overrides for react-markdown */
export const markdownComponents: Components = {
  // Open links in new tab
  a: ({ href, children, ...props }) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ado-accent hover:text-ado-accentLight underline"
      {...props}
    >
      {children}
    </a>
  ),
  // Style code blocks
  code: ({ className, children, ...props }) => {
    const isBlock = className?.startsWith('language-')
    if (isBlock) {
      return (
        <pre className="bg-ado-bg rounded-md p-4 overflow-x-auto my-3 text-sm font-mono border border-ado-border">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      )
    }
    return (
      <code
        className="bg-ado-bg px-1.5 py-0.5 rounded text-sm font-mono border border-ado-border text-ado-accent"
        {...props}
      >
        {children}
      </code>
    )
  },
  // Style blockquotes
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-ado-accent pl-4 my-3 text-ado-muted italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  // Style tables
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-3">
      <table
        className="min-w-full border-collapse text-sm border border-ado-border"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="bg-ado-surface2 border border-ado-border px-3 py-2 text-left text-ado-text font-semibold"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-ado-border px-3 py-2 text-ado-text" {...props}>
      {children}
    </td>
  ),
  // Headings
  h1: ({ children, ...props }) => (
    <h1 className="text-2xl font-bold text-ado-text mt-4 mb-2" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-xl font-semibold text-ado-text mt-4 mb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-lg font-semibold text-ado-text mt-3 mb-1" {...props}>
      {children}
    </h3>
  ),
  // Lists
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside space-y-1 my-2 text-ado-text" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside space-y-1 my-2 text-ado-text" {...props}>
      {children}
    </ol>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-2 text-ado-text leading-relaxed" {...props}>
      {children}
    </p>
  ),
}
