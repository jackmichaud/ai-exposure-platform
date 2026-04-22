const MAX_RETRIES = 3
const RETRY_DELAYS_MS = [1000, 2000, 4000]
const DEFAULT_TIMEOUT_MS = 30_000

export async function* streamTurn(
  system: string,
  userPrompt: string,
  maxTokens: number,
  signal?: AbortSignal,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): AsyncGenerator<string> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (signal?.aborted) return

    const timeoutSignal = AbortSignal.timeout(timeoutMs)
    const combinedSignal = signal
      ? AbortSignal.any([signal, timeoutSignal])
      : timeoutSignal

    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, userPrompt, maxTokens }),
        signal: combinedSignal,
      })

      if (response.status === 429) {
        if (attempt < MAX_RETRIES - 1) {
          await sleep(RETRY_DELAYS_MS[attempt])
          continue
        }
        throw new Error('Rate limit exceeded after retries')
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          if (signal?.aborted) return

          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue

            const data = trimmed.slice(5).trim()
            if (data === '[DONE]') return

            try {
              const parsed = JSON.parse(data) as { token?: string; error?: string }
              if (parsed.error) throw new Error(parsed.error)
              if (parsed.token) yield parsed.token
            } catch (parseErr) {
              if (parseErr instanceof SyntaxError) continue
              throw parseErr
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      return
    } catch (err) {
      if (signal?.aborted) return

      const isTimeout = err instanceof Error && err.name === 'TimeoutError'
      const isAbort = err instanceof Error && err.name === 'AbortError'
      if (isAbort) return

      if (isTimeout || attempt >= MAX_RETRIES - 1) {
        throw err
      }

      await sleep(RETRY_DELAYS_MS[attempt])
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
