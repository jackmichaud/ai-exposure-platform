# Claude API Integration

## Model Selection

- **Debate responses**: Claude Sonnet — good balance of quality, speed, and cost for multi-turn debates
- **Synthesis/summary**: Claude Sonnet — same model for consistency
- Future option: upgrade to Opus for higher-stakes analysis

## SDK Setup

Use the official `@anthropic-ai/sdk` npm package:

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.VITE_CLAUDE_API_KEY,
});
```

## API Key Security

**Critical**: The API key must never be bundled in the client-side JavaScript.

### Local Dev: Vite Plugin Middleware

The `/api/debate` endpoint is served directly by the Vite dev server via a plugin in `vite.config.ts`. No separate process or Vercel account is required:

```
Client → /api/debate → Vite middleware (Node.js) → Claude API
```

1. Copy `.env.example` to `.env` and set `CLAUDE_API_KEY`
2. Run `npm run dev` — the debate endpoint is live at `http://localhost:5173/api/debate`

### Environment Variables

- `CLAUDE_API_KEY` — loaded by `vite.config.ts` via `loadEnv`; stays server-side only
- `.env` file for local development (added to `.gitignore`)

## Streaming

Use the SDK's streaming interface for real-time debate responses:

```typescript
const stream = await client.messages.stream({
  model: "claude-sonnet-4-6-20250514",
  max_tokens: 1024,
  system: personaSystemPrompt,
  messages: [{ role: "user", content: debatePrompt }],
});

for await (const event of stream) {
  // Append tokens to UI via DebateContext dispatch
}
```

## Rate Limits & Error Handling

- Implement exponential backoff for 429 (rate limit) responses
- Set reasonable `max_tokens` per persona turn (512-1024)
- Timeout after 30 seconds per turn
- Queue debate turns sequentially to avoid concurrent request limits

## Cost Budgeting

- Estimate ~4 personas × 3 rounds × ~800 tokens per turn = ~9,600 output tokens per debate
- Input tokens: system prompt + occupation context + prior turns ≈ 2,000-5,000 per call
- Budget accordingly for demo/production usage
