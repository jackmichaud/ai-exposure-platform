# CLAUDE.md — Agent Instructions

## Project

AI Exposure Platform — an interactive web app that visualizes how occupations are exposed to AI disruption, featuring AI agent debates on realistic adoption scenarios across industries.

## Tech Stack

- **React** (via Vite) + **Tailwind CSS** for UI
- **D3.js** for data visualization (heatmaps, charts, gauges)
- **Claude API** for the Agent Debate Arena (streaming responses)
- **Static JSON** data layer for MVP (no backend)

## Documentation

All specs live in `docs/`. Read `docs/README.md` for a full index.

When working on a feature, read the relevant spec first:

| Task | Read |
|------|------|
| Dashboard / heatmap | `docs/features/dashboard-overview.md` |
| Occupation detail page | `docs/features/occupation-profile.md` |
| Agent debate arena | `docs/features/agent-debate-arena.md` |
| Data model or schemas | `docs/data/data-model.md` |
| Initial occupations/industries | `docs/data/occupations.md` |
| Scoring methodology | `docs/data/scoring-methodology.md` |
| Literature & academic foundations | `docs/data/literature-and-indicators.md` |
| Indicator rubrics & formulas | `docs/data/indicator-definitions.md` |
| Worked scoring example | `docs/data/scoring-example.md` |
| Data generation pipeline | `docs/data/data-generation-pipeline.md` |
| Claude API integration | `docs/api/claude-integration.md` |
| Data layer / fetching | `docs/api/data-api.md` |
| Agent personas | `docs/agents/personas.md` |
| Debate structure | `docs/agents/debate-protocol.md` |
| Prompt engineering | `docs/agents/prompt-templates.md` |
| UI patterns / design | `docs/ui/design-system.md` |
| Chart implementation | `docs/ui/charts.md` |
| Responsive layout | `docs/ui/responsive-layout.md` |

## Architecture References

- System overview: `docs/architecture/overview.md`
- Technology choices: `docs/architecture/tech-stack.md`
- Project directory layout: `docs/architecture/project-structure.md`
- State management: `docs/architecture/state-management.md`

## Guides

- Dev setup: `docs/guides/getting-started.md`
- Adding new industries/occupations: `docs/guides/adding-an-industry.md`
- Running and interpreting debates: `docs/guides/running-a-debate.md`
- Implementation plan (Phases 1-3): `docs/guides/implementation-plan.md`
- Implementation plan (Phases 4-5): `docs/guides/implementation-plan-part2.md`

## Rules

1. **Update `CHANGELOG.md`** for every user-visible change, bug fix, or new feature. Use [Keep a Changelog](https://keepachangelog.com/) format. *(Deployments stay auditable without reading diffs.)*
2. **Update relevant docs** when your changes alter behavior described in a spec. If you add a new component, chart, or data field, update the corresponding doc. *(Stale docs cause agents to build against outdated specs.)*
3. **Keep docs concise.** Each file should stay under 150 lines. If a doc grows beyond that, split it. *(Long files degrade LLM attention and make extraction harder.)*
4. **Follow project conventions** described in `docs/architecture/project-structure.md`.
5. **For new D3 charts**, follow patterns in `docs/ui/charts.md`.
6. **For prompt changes**, update `docs/agents/prompt-templates.md`.
7. **Do not commit API keys** or secrets. Use environment variables as described in `docs/api/claude-integration.md`.
8. **Read the relevant spec before implementing.** Do not infer behavior — check the doc first.

## Implementation Order

### Phase 1: Data + Static UI
1. Type definitions (`src/types/`)
2. Static JSON data files (`src/data/`)
3. Data access layer (`src/api/dataApi.ts`)
4. Dashboard page with heatmap
5. Occupation profile page with charts

### Phase 2: Interactivity
6. Filter context and controls
7. Responsive layout across breakpoints
8. Chart interactions (hover, tooltips, animations)

### Phase 3: Debate Engine
9. Claude API client and serverless proxy
10. Persona prompt construction
11. Debate orchestration and streaming UI
12. Synthesis generation and display
