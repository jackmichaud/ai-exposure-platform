# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

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
