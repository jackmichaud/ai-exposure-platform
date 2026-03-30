# System Architecture Overview

## Application Type

Single-page application (SPA) — no backend server for MVP. All occupation data is bundled as static JSON. The Claude API is called client-side through a lightweight proxy (for API key security).

## Major Modules

```
┌─────────────────────────────────────────────────┐
│                   React SPA                      │
│                                                  │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Visualization│  │   Data   │  │   Debate   │ │
│  │    Layer     │  │  Layer   │  │   Engine   │ │
│  │  (D3.js)    │  │  (JSON)  │  │ (Claude API)│ │
│  └──────┬──────┘  └────┬─────┘  └─────┬──────┘ │
│         │              │               │         │
│  ┌──────┴──────────────┴───────────────┴──────┐ │
│  │            State Management                 │ │
│  │     (React Context + useReducer)            │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Visualization Layer

- Renders heatmaps, charts, and gauges using D3.js
- Receives filtered data from the data layer via state
- Handles user interactions (hover, click, filter changes)
- See `../ui/charts.md` for implementation patterns

## Data Layer

- Static JSON files bundled in `src/data/`
- Abstraction functions for filtering, sorting, and lookups
- See `../data/data-model.md` for entity definitions
- See `../api/data-api.md` for the access interface

## Debate Engine

- Orchestrates multi-persona debates via Claude API
- Manages streaming responses and turn sequencing
- Produces structured summaries with recommendations
- See `../agents/debate-protocol.md` for the debate flow
- See `../api/claude-integration.md` for API details

## Data Flow

### Dashboard Flow
1. User sets filters (industry, wage, education, timeline)
2. State updates trigger data layer to filter occupations
3. D3 heatmap re-renders with filtered data
4. User clicks an occupation cell → navigates to profile

### Debate Flow
1. User selects an occupation or scenario topic
2. Debate engine sends sequential prompts to Claude API
3. Each persona's response streams into the UI
4. After all rounds, a synthesis prompt generates the summary
