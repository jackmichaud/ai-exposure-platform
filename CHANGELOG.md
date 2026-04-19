# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

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
