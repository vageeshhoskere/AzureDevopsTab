import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/oc-api': {
          target: env['VITE_OPENCODE_API_URL'] || 'http://localhost:4096',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/oc-api/, ''),
        },
      },
    },
  }
})
