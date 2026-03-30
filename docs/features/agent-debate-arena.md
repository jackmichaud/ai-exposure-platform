# Agent Debate Arena

## Purpose

AI-powered debate feature where three to four personas discuss the AI exposure implications of a selected occupation or industry scenario. Produces actionable summaries with recommendations for workers.

## User Flow

1. **Select topic** — User picks an occupation (from profile page) or a cross-cutting scenario (from a topic list)
2. **Start debate** — Click "Start Debate" to begin
3. **Watch debate** — Persona responses stream in, one at a time, in a panel-based layout
4. **Read summary** — After all rounds complete, a synthesis panel appears with key takeaways

## Debate Layout

Four-panel layout (one per persona), arranged in a 2x2 grid on desktop:

```
┌──────────────┬──────────────┐
│   Optimist   │   Realist    │
├──────────────┼──────────────┤
│   Skeptic    │   Worker     │
│              │   Advocate   │
└──────────────┴──────────────┘
```

- Each panel shows the persona name, icon, and their current/latest response
- Active speaker panel is highlighted during streaming
- Summary panel appears below the grid after debate completes

## Debate Rounds

See `../agents/debate-protocol.md` for detailed round structure.

1. **Opening statements** — Each persona gives their initial take (parallel display)
2. **Rebuttals** — Each persona responds to the others' points
3. **Closing statements** — Final positions and recommendations
4. **Synthesis** — System generates a combined summary (not a persona)

## Streaming UI

- Responses stream token-by-token into the active persona's panel
- Typing indicator while waiting for API response
- "Round N of M" progress indicator
- Cancel button to abort mid-debate

## Summary Output

The synthesis panel includes:
- **Key takeaways** — 3-5 bullet points of consensus and disagreement
- **Risk assessment** — Overall risk level with confidence
- **Recommendations** — Actionable advice for workers in this occupation
- **Projected changes** — Skills, wages, and employment dynamics forecast

## Error Handling

- API timeout → retry with backoff, show "Retrying..." message
- Rate limit → queue remaining turns, show estimated wait
- Network failure → offer to resume from last completed round
- Partial completion → display what was received, mark debate as incomplete

## Data Requirements

- Occupation data for the selected topic (passed from profile or selected from list)
- Claude API access (see `../api/claude-integration.md`)
- Persona definitions (see `../agents/personas.md`)
