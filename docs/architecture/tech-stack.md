# Tech Stack

## React (via Vite)

- **Why Vite**: Fast HMR, modern ESM-based build, minimal config
- **React version**: 18+ (hooks-based, no class components)
- **Routing**: React Router v6 for page navigation (dashboard, profile, debate)
- **No SSR** for MVP — pure client-side rendering

## Tailwind CSS

- Utility-first CSS framework for rapid, consistent styling
- Configured via `tailwind.config.js` with custom theme tokens (see `../ui/design-system.md`)
- No separate CSS files unless absolutely necessary — prefer Tailwind classes
- Use `@apply` sparingly, only for highly reused component patterns

## D3.js

- **Why D3 over charting libraries**: We need custom heatmaps, non-standard visualizations, and fine-grained control over interactions and animations
- Used for: heatmap, gauges, bar charts, radar charts, task breakdown visuals
- Integrated with React via `useRef` + `useEffect` pattern (see `../ui/charts.md`)
- D3 owns the DOM inside its container; React owns everything outside

## Claude API

- **Model**: Claude Sonnet for debates (balance of quality and speed)
- **Streaming**: Server-sent events for real-time response display
- **SDK**: `@anthropic-ai/sdk` npm package
- **Security**: API key must never be in the client bundle — use a proxy endpoint or serverless function (see `../api/claude-integration.md`)

## Build & Tooling

- **Package manager**: npm
- **Linting**: ESLint with React plugin
- **Formatting**: Prettier
- **TypeScript**: Yes — all source files are `.ts` / `.tsx`
