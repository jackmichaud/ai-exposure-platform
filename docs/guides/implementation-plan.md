# Implementation Plan — Phases 1-3

Step-by-step build order. Each task lists files to create, docs to read first, and acceptance criteria. Tasks within a phase are sequential; phases depend on previous phases.

> **Start here**: Complete **Phase 0** (economic research plan + approval) and **Phase 0b** (research web page) before beginning Phase 1. See [implementation-plan-phase0.md](implementation-plan-phase0.md).

For Phases 4-5, see [implementation-plan-part2.md](implementation-plan-part2.md).

## Phase 1: Foundation (Types + Data + Data API)

### 1.1 Project scaffolding

**Read first**: `architecture/tech-stack.md`, `guides/getting-started.md`

**Do**:
- `npm create vite@latest . -- --template react-ts`
- Install deps: `tailwindcss`, `d3`, `react-router-dom`, `@anthropic-ai/sdk`
- Configure `tailwind.config.js` with Inter font and custom colors from `ui/design-system.md`
- Create `.env` with `VITE_CLAUDE_API_KEY` placeholder
- Set up directory structure per `architecture/project-structure.md`

**Done when**: `npm run dev` serves an empty page with Tailwind working.

### 1.2 TypeScript type definitions

**Read first**: `data/data-model.md`, `architecture/state-management.md`

**Create**:
- `src/types/Industry.ts` — `Industry` interface
- `src/types/Occupation.ts` — `Occupation`, `Task`, `ExposureScore`, `Skill` interfaces
- `src/types/Debate.ts` — `DebateRound`, `DebateSummary`, `PersonaId` types
- `src/types/Filters.ts` — `FilterState`, `FilterAction`, `FilterParams`, `FilterOptions`
- `src/types/index.ts` — re-exports

**Done when**: All interfaces from `data-model.md` and `state-management.md` compile with no errors.

### 1.3 Static JSON data files

**Read first**: `data/occupations.md` (data table), `data/scoring-example.md`, `guides/adding-an-industry.md` (JSON template)

**Create**:
- `src/data/industries.json` — 5 industries
- `src/data/occupations.json` — all 19 occupations with full task/score/skill data

**Done when**: JSON files parse without error and match the TypeScript interfaces from 1.2.

### 1.4 Data access layer

**Read first**: `api/data-api.md`

**Create**:
- `src/api/dataApi.ts` — implement `getIndustries()`, `getOccupations(filters?)`, `getOccupation(id)`, `getSimilarOccupations(id, limit?)`, `getFilterOptions()`

**Done when**: Each function returns correct data. Filters narrow results. `getSimilarOccupations` uses Jaccard similarity (see `features/occupation-profile.md`).

---

## Phase 2: Static Pages (Layout + Dashboard + Profiles)

### 2.1 App shell and routing

**Read first**: `ui/responsive-layout.md`, `ui/design-system.md`

**Create**:
- `src/App.tsx` — React Router with routes: `/`, `/occupation/:id`, `/debate`
- `src/components/layout/Header.tsx` — top nav with logo, page links, mobile menu toggle
- `src/components/layout/Sidebar.tsx` — visible `lg+`, contains nav links
- `src/components/layout/PageShell.tsx` — wraps header + sidebar + main content area

**Done when**: Navigation between 3 empty pages works. Sidebar shows on desktop, collapses to hamburger on mobile. Minimalist styling per design system.

### 2.2 Dashboard page with heatmap

**Read first**: `features/dashboard-overview.md`, `ui/charts.md` (heatmap spec + visual philosophy)

**Create**:
- `src/pages/Dashboard.tsx` — page component
- `src/components/charts/HeatmapChart.tsx` — D3 heatmap (industry × occupation grid)
- `src/components/charts/utils/createColorScale.ts`
- `src/components/charts/utils/createTooltip.ts`
- `src/components/charts/utils/formatScore.ts`
- `src/hooks/useContainerSize.ts` — ResizeObserver hook from `charts.md`

**Done when**: Heatmap renders all 19 occupations across 5 industries. Color scale matches design system (RdYlBu reversed). Hover shows tooltip. Click navigates to occupation profile. Loading/empty states work.

### 2.3 Occupation profile page

**Read first**: `features/occupation-profile.md`, `ui/charts.md` (gauge, bar, wage projection specs)

**Create**:
- `src/pages/OccupationProfile.tsx` — header, charts, task breakdown, comparison panel
- `src/components/charts/AutomationGauge.tsx` — semi-circle gauge (0-100, color zones)
- `src/components/charts/SkillImpactBar.tsx` — horizontal grouped bars (gained vs displaced)
- `src/components/charts/WageProjection.tsx` — arrow/slope chart
- `src/components/OccupationComparison.tsx` — side-by-side similar occupations
- `src/components/TaskBreakdown.tsx` — sortable table/card list, color-coded rows

**Done when**: Profile loads for any occupation via URL. All 4 charts render correctly. Task breakdown sortable. Comparison panel shows 2-3 similar occupations. "Start a Debate" links to `/debate?occupation={id}`.

---

## Phase 3: Interactivity (Filters + Context + Responsive)

### 3.1 Filter context and controls

**Read first**: `architecture/state-management.md` (FilterAction types, reducer, hooks)

**Create**:
- `src/context/FilterContext.tsx` — provider with `useReducer`, `useFilterContext()` hook
- `src/components/filters/FilterBar.tsx` — industry dropdown, wage slider, education dropdown, timeline toggle
- Individual filter components: `IndustryFilter.tsx`, `WageRangeSlider.tsx`, `EducationFilter.tsx`, `TimelineToggle.tsx`

**Done when**: Filters update heatmap in real time. URL query param sync. Reset clears all. Sticky on desktop, collapsible on mobile.

### 3.2 Responsive layout polish

**Read first**: `ui/responsive-layout.md` (breakpoints, micro-interactions)

**Do**:
- Dashboard: heatmap → card list on mobile, horizontal scroll on tablet
- Profile: 2-column → single column, table → cards, comparison → accordion
- Apply micro-interaction timing from responsive-layout.md

**Done when**: All pages correct at sm/md/lg/xl. Transitions match timing spec. No layout breaks.

### 3.3 Chart animations and interactions

**Read first**: `ui/charts.md` (animation details table)

**Do**:
- Entry animations (fade + scale 400ms) on all charts
- Data update transitions (300ms) on filter change
- Hover dimming (non-hovered to 0.3 opacity)
- Gauge needle elastic animation (800ms)
- Keyboard-accessible tooltips per accessibility spec

**Done when**: Charts animate on load, update, and hover. Keyboard navigation works. Screen reader alternatives present.
