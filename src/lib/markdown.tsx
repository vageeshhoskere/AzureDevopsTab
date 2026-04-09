import type { Components } from 'react-markdown'

/** Custom component overrides for react-markdown */
export const markdownComponents: Components = {
  a: ({ href, children, ...props }) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ado-accent hover:text-ado-accentLight underline underline-offset-2"
      {...props}
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.startsWith('language-')
    if (isBlock) {
      return (
        <pre className="bg-ado-surface2 rounded-xl p-4 overflow-x-auto my-3 text-sm font-mono border border-ado-border">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      )
    }
    return (
      <code
        className="bg-ado-surface2 px-1.5 py-0.5 rounded text-sm font-mono border border-ado-border text-ado-accent"
        {...props}
      >
        {children}
      </code>
    )
  },
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-ado-accent/40 pl-4 my-3 text-ado-muted italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-3 rounded-xl border border-ado-border">
      <table className="min-w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="bg-ado-surface2 border-b border-ado-border px-3 py-2 text-left text-ado-text font-semibold text-xs uppercase tracking-wide"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-ado-border px-3 py-2 text-ado-text last:border-b-0" {...props}>
      {children}
    </td>
  ),
  h1: ({ children, ...props }) => (
    <h1 className="text-xl font-bold text-ado-text mt-4 mb-2" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-lg font-semibold text-ado-text mt-4 mb-2" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-base font-semibold text-ado-text mt-3 mb-1" {...props}>{children}</h3>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside space-y-1 my-2 text-ado-text" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside space-y-1 my-2 text-ado-text" {...props}>{children}</ol>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-2 text-ado-text leading-relaxed" {...props}>{children}</p>
  ),
}
