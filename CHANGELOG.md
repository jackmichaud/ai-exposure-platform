# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **O*NET-grounded occupation generation pipeline** (`scripts/generate-occupation.ts`)
  - Fetches real Work Activities, Work Context, task statements, and skills from the O*NET Web Services API for any SOC code
  - Passes structured O*NET importance scores to Claude as explicit anchors for all 8 sub-dimension scores (routineness, dataIntensity, physicalBottleneck, socialBottleneck, informationSynthesis, decisionSupport, creativeLeverage, productivityMultiplier)
  - Rollup formulas (automationRisk, augmentationPotential, overall, netDisplacement) are computed deterministically in the script — not by Claude — ensuring formula integrity
  - Outputs a reviewed JSON file to `scripts/output/` ready for insertion into `src/data/occupations.json`
  - Run: `npm run generate-occupation -- --soc <code> --industry <id> [--wage <number>]`
  - Requires `ONET_USERNAME`, `ONET_PASSWORD` (free at services.onetcenter.org), and `ANTHROPIC_API_KEY`
  - Added `tsx` devDependency for script execution
  - Updated `docs/data/data-generation-pipeline.md` to reflect the hybrid data approach

### Changed

- `vite.config.ts` — replaced `/api` proxy (required `vercel dev`) with a Vite plugin middleware that serves `/api/debate` directly from the dev server; `CLAUDE_API_KEY` is loaded via `loadEnv` so no separate process or Vercel account is needed to run the debate arena locally
- `docs/api/claude-integration.md` — updated API key / local dev section to document the new Vite middleware approach

### Added

- **Data Expansion — Defense & Environmental/Energy industries**
  - `src/data/industries.json` — added "Defense & National Security" and "Environmental & Energy" industries; updated Healthcare occupationCount from 4 → 6
  - `src/data/occupations.json` — 12 new occupations: Procurement Analyst, Naval Shipbuilder, Program Analyst, Defense Systems Engineer, Intelligence Analyst (Defense); Nuclear Engineer, Climate Data Scientist, Wildlife Conservation Biologist, Environmental Engineer, Renewable Energy Technician (Environmental & Energy); Pharmacist, Nurse Practitioner (Healthcare); full task-level sub-scores, skills, exposure scores, and cross-references

- **Phase 5 — Polish and Ship**
  - `src/components/ErrorBoundary.tsx` — React class-based error boundary; wraps all routes; shows inline error message + "Try again" reset + back-to-dashboard link; accepts optional `fallback` prop for custom fallback UI
  - `src/pages/NotFound.tsx` — 404 page with large monospace "404", descriptive message, and back-to-dashboard link
  - Updated `src/App.tsx` — `React.lazy` code-splitting for ResearchPage, DebateArena, OccupationProfile; `Suspense` boundary with spinner fallback; `ErrorBoundary` wrapping all routes; wildcard `path="*"` route pointing to NotFound
  - Updated `src/components/charts/AutomationGauge.tsx` — added `role="img"` and `aria-label` to SVG for screen reader accessibility

- **Phase 4 — Debate Engine**
  - `api/debate.ts` — Vercel Edge Function SSE proxy; streams Claude API responses as `data: { token }` events; CORS headers; graceful error forwarding
  - `.env.example` — documents server-side `CLAUDE_API_KEY` variable
  - `vite.config.ts` — added dev proxy: `/api` → `http://localhost:3000` for `vercel dev` compatibility
  - `src/api/claudeClient.ts` — `streamTurn()` async generator; POSTs to `/api/debate`, reads SSE stream, yields tokens; retry on 429 with exponential backoff (1s/2s/4s, max 3 attempts); 30s timeout per attempt via `AbortSignal.timeout`; respects caller `AbortSignal`
  - `src/context/DebateContext.tsx` — `DebateProvider` + `useDebateContext()` hook; reducer handles `START_DEBATE`, `SET_SPEAKER`, `APPEND_TOKEN`, `COMPLETE_TURN`, `SET_SUMMARY`, `SET_STATUS`, `SET_ERROR`; `APPEND_TOKEN` creates or updates the matching round entry
  - `src/agents/personas.ts` — `PERSONAS` array and `PERSONA_ORDER` with metadata (id, name, shortName, icon, Tailwind border/bg/text color classes) for all four debate personas
  - `src/agents/promptBuilder.ts` — `buildSystemPrompt()`, `buildRound1Prompt()`, `buildRound2Prompt()`, `buildRound3Prompt()`, `buildSynthesisPrompt()`, `formatPriorResponses()`; exact prompt text from `docs/agents/prompt-templates.md`
  - `src/agents/debateOrchestrator.ts` — `runDebate()` orchestrates 3 rounds × 4 personas sequentially; streams each turn via `streamTurn()`; dispatches all actions; parses synthesis with `parseSynthesis()` which extracts structured sections via regex
  - `src/components/PersonaPanel.tsx` — card with colored top border; typing indicator (3 animated dots) when speaker hasn't started; streaming cursor when text is flowing; rounds badge; scrollable response body
  - `src/components/DebateControls.tsx` — status-driven UI: idle shows occupation name + Start button; debating shows round progress bar + current speaker + Cancel; summarizing shows spinner; complete shows badge + New Debate; error shows message + Retry
  - `src/components/DebateSummaryPanel.tsx` — renders streaming synthesis during summarizing; full 6-section structured view when complete (Key Takeaways, Risk Assessment with color-coded badge, Recommendations, Projected Changes grid, Agreement/Disagreement lists)
  - `src/pages/DebateArena.tsx` — full replacement; occupation selector (grouped by industry) with summary card; pre-selects from `?occupation=` URL param; `AbortController` ref for cancellation; derives `currentRound` and per-persona response from reducer state; 2×2 `PersonaPanel` grid
  - Updated `src/App.tsx` — wrapped routes with `<DebateProvider>` inside `<FilterProvider>`

- **Phase 3 — FilterContext, Responsive Polish, Chart Animations**
  - `src/context/FilterContext.tsx` — NEW; `FilterProvider` + `useFilterContext()` hook; hydrates state from URL search params on mount; syncs back to URL only on `/` route; supports `industry`, `education`, `timeline`, `sortBy`, `wageMin`, `wageMax` params for shareable links
  - `src/components/filters/IndustryFilter.tsx` — NEW; pill-style industry toggle buttons reading from context; toggle off by re-clicking active pill
  - `src/components/filters/TimelineToggle.tsx` — NEW; near/mid/long-term toggle buttons with indigo active state; toggle off to null
  - `src/components/filters/EducationFilter.tsx` — NEW; styled `<select>` for education level; "All levels" option clears filter
  - `src/components/filters/WageRangeSlider.tsx` — NEW; dual range sliders (min/max) with `$Xk–$Yk` labels; dispatches on `mouseup`/`touchend` to avoid excessive re-renders
  - `src/components/filters/FilterBar.tsx` — NEW; composes all four filter components; shows result count with `(filtered)` when active; conditional Clear button
  - Updated `src/pages/Dashboard.tsx` — replaced all local `useState` filter logic with `useFilterContext()`; replaced inline filter bar with `<FilterBar />`; filtering/sorting driven by context state
  - Updated `src/App.tsx` — wrapped routes with `FilterProvider` (inside `BrowserRouter` for hook access)
  - Updated `src/components/OccupationComparison.tsx` — mobile accordion with `max-height` CSS transition (300ms ease); hidden by default on mobile, always visible on `lg+`; toggle button with animated chevron
  - Updated `src/components/charts/HeatmapChart.tsx` — entry animation (400ms, staggered 20ms per cell, capped at 400ms); hover dimming of non-hovered cells (150ms restore); keyboard accessibility (`tabIndex`, `role="button"`, `aria-label`, space/enter keydown); visually-hidden `<table>` for screen readers; `transition-all duration-150 hover:shadow-md` on mobile cards
  - Updated `src/components/charts/AutomationGauge.tsx` — needle elastic animation on mount/score change via `useRef` + D3 `easeElasticOut` (800ms); initial position at straight-up (score 50) transitioning to actual score
  - Updated `src/components/TaskBreakdown.tsx` — added `transition-all duration-150 hover:shadow-md` to mobile task cards

### Changed

- **Phase 2 — Static Pages**
  - `src/components/layout/Sidebar.tsx` — NEW; `hidden lg:flex` sidebar with NavLink active states
  - `src/components/charts/utils/createColorScale.ts` — D3 RdYlBu sequential scale (high=red, low=blue)
  - `src/components/charts/utils/formatScore.ts` — `formatScore`, `formatWage`, `formatWageShort`, `getTextColor`
  - `src/components/charts/utils/createTooltip.ts` — D3 tooltip factory
  - `src/components/charts/HeatmapChart.tsx` — D3 heatmap with per-industry columns, hover tooltip, click navigation, mobile card-list fallback
  - `src/components/charts/AutomationGauge.tsx` — semi-circle SVG gauge with D3 arc paths, colored zones, animated needle
  - `src/components/charts/SkillImpactBar.tsx` — grouped skill bars (gained/displaced/transformed), Tailwind-only
  - `src/components/charts/WageProjection.tsx` — current vs projected wage with directional arrow
  - `src/components/OccupationComparison.tsx` — similar occupation mini-cards linked to profiles
  - `src/components/TaskBreakdown.tsx` — sortable table (desktop) + card list (mobile) with risk color tinting
  - `src/pages/OccupationProfile.tsx` — full profile page: header with score badge, sub-scores grid, 2/3+1/3 layout, task breakdown, Start Debate CTA
  - Updated `src/App.tsx` — added `/occupation/:id` route
  - Updated `src/components/layout/Header.tsx` — added mobile hamburger with slide-in drawer
  - Updated `src/components/layout/PageShell.tsx` — flex layout with sidebar + main content
  - Updated `src/pages/Dashboard.tsx` — full heatmap dashboard with industry, timeline, and education filters

- `src/api/dataApi.ts` — Data access layer with `getIndustries()`, `getOccupations(filters?)`, `getOccupation(id)`, `getSimilarOccupations(id, limit)`, and `getFilterOptions()`; filtering by industry, wage range, education level, and timeline; sorting by exposure, wage, or name; similar occupations from pre-computed IDs with same-industry fallback

- `src/data/industries.json` — Static data for all 5 industries (Healthcare, Finance & Insurance, Technology, Education, Manufacturing) with id, name, description, and occupationCount
- `src/data/occupations.json` — Complete static dataset of 19 occupations across all 5 industries; each occupation includes 3–4 tasks with full automation/augmentation sub-scores (4×0–25 each), task time weights summing to 1.0, 4–5 skills with impact classification, a complete ExposureScore (overall, automationRisk, augmentationPotential, netDisplacement, complementarityScore, RTI, timeline, wageEffect, confidence), bottleneckTaskIds, and similarOccupationIds; all weighted averages and displacement direction classifications are mathematically verified

- `src/types/` — TypeScript type definitions for all core entities: `Industry`, `Occupation`, `Task`, `ExposureScore`, `Skill`, `EducationLevel`, `DebateRound`, `DebateSummary`, `DebateState`, `DebateAction`, `PersonaId`, `FilterState`, `FilterAction`, `FilterParams`, `FilterOptions`

- Initial project documentation structure (23 files across `docs/`)
- `CLAUDE.md` agent instruction file with doc routing and rules
- Project README with overview, features, and tech stack
- `docs/data/literature-and-indicators.md` — academic foundations mapping indicators to Acemoglu & Restrepo, Frey & Osborne, Felten et al., Eloundou et al., Autor et al., and Webb
- Exposure decomposition model (net displacement = automation risk - augmentation potential)
- New indicators: Routine Task Intensity (RTI), Complementarity Score, Bottleneck Analysis
- Task-level sub-dimension rubrics (4×25-point scales for automation risk and augmentation potential)
- LLM exposure tier classification (E0/E1/E2) adapted from Eloundou et al.

- `docs/data/indicator-definitions.md` — operationalized rubric tables and formulas (split from literature doc)
- `docs/data/scoring-example.md` — worked scoring example for Registered Nurse (all sub-dimensions, rollup, ExposureScore)
- `docs/guides/running-a-debate.md` — guide for picking debate topics, interpreting synthesis, and troubleshooting
- `docs/data/data-generation-pipeline.md` — pipeline spec for scaling to 100+ occupations via O*NET, BLS, and Claude-powered scoring with human review
- `docs/guides/implementation-plan.md` + `implementation-plan-part2.md` — detailed 5-phase build order with files, docs to read, and acceptance criteria per task
- Reducer action types (`FilterAction`, `DebateAction`) and custom hooks in `docs/architecture/state-management.md`
- Complete system prompts for all 4 personas (Realist, Skeptic, Worker Advocate) in `docs/agents/prompt-templates.md`
- Concrete initial data table (19 occupations with SOC codes, wages, exposure scores) in `docs/data/occupations.md`
- Similar occupations algorithm (Jaccard similarity on skills) in `docs/features/occupation-profile.md`
- Visual design philosophy and chart component states (loading, error, empty) in `docs/ui/charts.md`
- Minimalist UI principles, whitespace guidelines, and animation specs in `docs/ui/design-system.md`
- Micro-interaction timing table in `docs/ui/responsive-layout.md`
- Implementation order (3 phases) and rule rationale in `CLAUDE.md`

### Changed

- `docs/data/scoring-methodology.md` — tightened indicator definitions, linked to literature doc
- `docs/data/data-model.md` — added new fields: `netDisplacement`, `complementarityScore`, `routineTaskIntensity`, `bottleneckTaskIds`, `timeWeight`, `llmExposureTier`, automation/augmentation sub-scores
- `docs/data/literature-and-indicators.md` — split indicator definitions into separate file, now under 150-line limit
- `docs/guides/adding-an-industry.md` — expanded JSON example with all required fields (sub-scores, skills, bottleneckTaskIds)
- `docs/README.md` — added entries for 3 new files and new quick reference tasks
- `CLAUDE.md` — added 3 new doc routing entries, rule rationale annotations, implementation order
