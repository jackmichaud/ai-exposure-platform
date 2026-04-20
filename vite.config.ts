import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import Anthropic from '@anthropic-ai/sdk'
import type { IncomingMessage, ServerResponse } from 'node:http'

function debateApiPlugin(apiKey: string) {
  return {
    name: 'debate-api',
    configureServer(server: { middlewares: { use: (path: string, handler: (req: IncomingMessage, res: ServerResponse) => void) => void } }) {
      server.middlewares.use('/api/debate', (req: IncomingMessage, res: ServerResponse) => {
        const cors = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        }

        if (req.method === 'OPTIONS') {
          res.writeHead(204, cors)
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.writeHead(405)
          res.end('Method not allowed')
          return
        }

        if (!apiKey) {
          res.writeHead(500)
          res.end('CLAUDE_API_KEY not set in .env')
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          const { system, userPrompt, maxTokens = 1024 } = JSON.parse(body)

          res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', ...cors })

          const client = new Anthropic({ apiKey })
          try {
            const stream = client.messages.stream({
              model: 'claude-sonnet-4-6',
              max_tokens: maxTokens,
              system,
              messages: [{ role: 'user', content: userPrompt }],
            })
            for await (const event of stream) {
              if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                res.write(`data: ${JSON.stringify({ token: event.delta.text })}\n\n`)
              }
            }
            res.write('data: [DONE]\n\n')
          } catch (err) {
            res.write(`data: ${JSON.stringify({ error: String(err) })}\n\n`)
          } finally {
            res.end()
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), debateApiPlugin(env.CLAUDE_API_KEY)],
  }
})
