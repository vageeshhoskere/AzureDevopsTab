import { createOpencodeClient } from '@opencode-ai/sdk/client'

const getBase = () =>
  (import.meta.env.VITE_OPENCODE_API_URL as string | undefined) ?? 'http://localhost:4096'

export const client = createOpencodeClient({ baseUrl: getBase() })
