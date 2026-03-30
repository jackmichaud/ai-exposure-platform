# Project Structure

## Source Directory Layout

```
src/
├── components/          # Shared/reusable UI components
│   ├── charts/          # D3 chart wrapper components
│   ├── filters/         # Filter controls (dropdowns, sliders)
│   └── layout/          # Header, footer, sidebar, page shells
├── pages/               # Top-level route components
│   ├── Dashboard.tsx    # Heatmap overview page
│   ├── OccupationProfile.tsx
│   └── DebateArena.tsx
├── hooks/               # Custom React hooks
├── context/             # React Context providers and reducers
├── data/                # Static JSON data files
├── api/                 # Data access functions and Claude API client
├── agents/              # Persona definitions, prompt templates, debate logic
├── utils/               # Pure utility functions
├── types/               # Shared TypeScript type definitions
├── styles/              # Global styles, Tailwind config extensions
├── App.tsx              # Root component with routing
└── main.tsx             # Entry point
```

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `HeatmapChart.tsx` |
| Hooks | camelCase, `use` prefix | `useFilters.ts` |
| Utilities | camelCase | `formatScore.ts` |
| Types | PascalCase | `Occupation.ts` |
| Data files | kebab-case | `occupations.json` |
| Context | PascalCase, `Context` suffix | `FilterContext.tsx` |

## File Colocation

- Component + its types in the same file (unless types are shared)
- Tests next to source: `HeatmapChart.test.tsx` beside `HeatmapChart.tsx`
- Chart-specific utilities live in `components/charts/`

## Where to Put New Code

- **New page** → `src/pages/` + add route in `App.tsx`
- **New chart** → `src/components/charts/`
- **New filter control** → `src/components/filters/`
- **New data entity** → type in `src/types/`, data in `src/data/`, access function in `src/api/`
- **New persona** → `src/agents/`
- **New hook** → `src/hooks/`
