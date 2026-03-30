# Documentation Index

## Architecture

| Document | Description |
|----------|-------------|
| [architecture/overview.md](architecture/overview.md) | System architecture, modules, and data flow |
| [architecture/tech-stack.md](architecture/tech-stack.md) | Technology choices and rationale |
| [architecture/project-structure.md](architecture/project-structure.md) | Source directory layout and naming conventions |
| [architecture/state-management.md](architecture/state-management.md) | Client-side state approach and patterns |

## Features

| Document | Description |
|----------|-------------|
| [features/dashboard-overview.md](features/dashboard-overview.md) | Heatmap dashboard spec, filters, and interactions |
| [features/occupation-profile.md](features/occupation-profile.md) | Occupation detail view with charts and comparisons |
| [features/agent-debate-arena.md](features/agent-debate-arena.md) | AI debate feature, user flow, and streaming UI |

## Data

| Document | Description |
|----------|-------------|
| [data/data-model.md](data/data-model.md) | Core entities, fields, and relationships |
| [data/occupations.md](data/occupations.md) | Initial industries and occupations list |
| [data/scoring-methodology.md](data/scoring-methodology.md) | How AI exposure scores are calculated |
| [data/literature-and-indicators.md](data/literature-and-indicators.md) | Academic foundations and frameworks |
| [data/indicator-definitions.md](data/indicator-definitions.md) | Operationalized indicator rubrics and formulas |
| [data/scoring-example.md](data/scoring-example.md) | Worked scoring example (Registered Nurse) |
| [data/data-generation-pipeline.md](data/data-generation-pipeline.md) | Pipeline for scaling to 100+ occupations via O*NET + Claude |

## API

| Document | Description |
|----------|-------------|
| [api/claude-integration.md](api/claude-integration.md) | Claude API setup, streaming, and security |
| [api/data-api.md](api/data-api.md) | Data layer abstraction and access functions |

## Agents

| Document | Description |
|----------|-------------|
| [agents/personas.md](agents/personas.md) | Four AI persona definitions and guardrails |
| [agents/debate-protocol.md](agents/debate-protocol.md) | Debate structure, rounds, and orchestration |
| [agents/prompt-templates.md](agents/prompt-templates.md) | System, user, and synthesis prompt templates |

## UI

| Document | Description |
|----------|-------------|
| [ui/design-system.md](ui/design-system.md) | Colors, typography, spacing, component patterns |
| [ui/charts.md](ui/charts.md) | D3.js + React integration and chart specs |
| [ui/responsive-layout.md](ui/responsive-layout.md) | Breakpoints, layout grid, mobile adaptation |

## Guides

| Document | Description |
|----------|-------------|
| [guides/getting-started.md](guides/getting-started.md) | Dev setup, environment variables, running locally |
| [guides/adding-an-industry.md](guides/adding-an-industry.md) | How to add new industries and occupations |
| [guides/running-a-debate.md](guides/running-a-debate.md) | Running and interpreting agent debates |
| [guides/implementation-plan.md](guides/implementation-plan.md) | Build order Phases 1-3 (foundation, pages, interactivity) |
| [guides/implementation-plan-part2.md](guides/implementation-plan-part2.md) | Build order Phases 4-5 (debate engine, polish) |

## Quick Reference by Task

- **Adding a chart** → `ui/charts.md`, then the relevant feature spec
- **Modifying a persona** → `agents/personas.md` + `agents/prompt-templates.md`
- **Changing debate flow** → `agents/debate-protocol.md`
- **Adding data fields** → `data/data-model.md` + `data/occupations.md`
- **Adjusting scoring** → `data/scoring-methodology.md` + `data/indicator-definitions.md`
- **Scoring a new occupation** → `data/scoring-example.md` + `data/indicator-definitions.md`
- **Scaling the dataset** → `data/data-generation-pipeline.md`
- **Running a debate** → `guides/running-a-debate.md`
- **Adding an industry** → `guides/adding-an-industry.md`
