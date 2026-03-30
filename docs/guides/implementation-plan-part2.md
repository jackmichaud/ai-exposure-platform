# Implementation Plan — Phases 4-5

Debate engine and final polish. Depends on Phases 1-3 being complete (see [implementation-plan.md](implementation-plan.md)).

## Phase 4: Debate Engine

### 4.1 Claude API client and proxy

**Read first**: `api/claude-integration.md`

**Create**:
- `src/api/claudeClient.ts` — wrapper around `@anthropic-ai/sdk` with streaming, retry logic (exponential backoff on 429), 30-second timeout per turn
- Serverless proxy function (e.g., `api/debate.ts` for Vercel/Netlify) that forwards requests to Claude API — API key never in client bundle

**Done when**: A test call to Claude returns a streamed response. Rate limit retry works. API key is server-side only.

### 4.2 Debate context and orchestration

**Read first**: `architecture/state-management.md` (DebateAction types), `agents/debate-protocol.md`

**Create**:
- `src/context/DebateContext.tsx` — provider with `useReducer`, `useDebateContext()` hook
- `src/agents/debateOrchestrator.ts` — runs the 4-step debate: Round 1 (opening) → Round 2 (rebuttal) → Round 3 (closing) → Synthesis. Sequential API calls per turn, streaming tokens into context.

**Done when**: Orchestrator runs a full 3-round + synthesis debate. State transitions: `idle` → `debating` → `summarizing` → `complete`. Error state on failure. Cancel aborts mid-debate.

### 4.3 Persona prompt construction

**Read first**: `agents/prompt-templates.md`, `agents/personas.md`

**Create**:
- `src/agents/promptBuilder.ts` — functions to construct system prompts (per persona) and user prompts (per round) with variable substitution (`{occupation}`, `{tasks}`, `{prior_responses}`, etc.)
- `src/agents/personas.ts` — persona metadata (id, name, icon, color)

**Done when**: `buildSystemPrompt("optimist")` returns the exact prompt from `prompt-templates.md`. `buildUserPrompt("round-1", occupationData)` correctly formats task data. `buildUserPrompt("round-2", occupationData, priorResponses)` includes all prior responses.

### 4.4 Debate arena UI

**Read first**: `features/agent-debate-arena.md`, `ui/design-system.md` (persona panels)

**Create**:
- `src/pages/DebateArena.tsx` — occupation selector, start button, 2x2 persona grid, summary panel
- `src/components/PersonaPanel.tsx` — streaming response with colored border, typing indicator, persona name/icon
- `src/components/DebateSummary.tsx` — structured summary (6 sections from debate-protocol.md)
- `src/components/DebateControls.tsx` — start/cancel buttons, round progress indicator

**Done when**: Full debate runs end-to-end: select occupation → start → watch 12 streaming turns → read synthesis. 2x2 on desktop, tabbed on mobile. Cancel works mid-debate. Error states show retry.

---

## Phase 5: Polish and Ship

### 5.1 Error boundaries and edge cases

**Do**:
- Add React error boundaries around chart and debate sections
- Handle missing occupation IDs (404 page)
- Handle empty filter results gracefully
- Test with slow network (throttle in DevTools)

**Done when**: No unhandled errors. Graceful fallbacks for all failure modes.

### 5.2 Accessibility audit

**Read first**: `ui/charts.md` (accessibility section)

**Do**:
- All charts have `role="img"` + `aria-label`
- Keyboard navigation through heatmap cells and filters
- Focus management on route changes
- Color contrast passes WCAG AA
- Test with VoiceOver or NVDA

**Done when**: All interactive elements keyboard-accessible. No contrast failures. Screen readers announce chart data.

### 5.3 Performance

**Do**:
- `useMemo` for filtered/sorted occupation lists
- Lazy-load debate arena page (`React.lazy`)
- Verify bundle size (`npm run build` + check output)

**Done when**: No unnecessary re-renders. Build output is reasonable size. Lazy routes load on demand.

### 5.4 Final review

**Do**:
- `npm run lint` and `npm run format` — zero errors
- Test all 3 pages at all breakpoints
- Run a full debate end-to-end
- Verify CHANGELOG is up to date

**Done when**: App is deployable. All pages work. Debates complete successfully. No console errors.
