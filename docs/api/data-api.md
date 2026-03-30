# Data API

## MVP: Static JSON

For the initial version, all data is bundled as static JSON files imported directly into the app. No backend server required.

### Data Files

```
src/data/
├── industries.json      # Array of Industry objects
└── occupations.json     # Array of Occupation objects (tasks embedded)
```

## Access Layer

An abstraction layer provides a consistent interface so the data source can be swapped later (e.g., to a REST API or database).

### Functions

```typescript
// Get all industries
function getIndustries(): Industry[]

// Get occupations with optional filters
function getOccupations(filters?: FilterParams): Occupation[]

// Get a single occupation by ID
function getOccupation(id: string): Occupation | null

// Get similar occupations for comparison
function getSimilarOccupations(id: string, limit?: number): Occupation[]

// Get unique values for filter dropdowns
function getFilterOptions(): FilterOptions
```

### Filter Parameters

```typescript
interface FilterParams {
  industryId?: string | string[];
  wageRange?: [number, number];
  educationLevel?: EducationLevel;
  timeline?: "near-term" | "mid-term" | "long-term";
  sortBy?: "exposure" | "wage" | "name";
  sortOrder?: "asc" | "desc";
}
```

### Filter Options Response

```typescript
interface FilterOptions {
  industries: { id: string; name: string }[];
  wageRange: { min: number; max: number };
  educationLevels: EducationLevel[];
}
```

## Implementation Notes

- All filtering and sorting happens client-side (data is small for MVP)
- Functions are synchronous for static JSON, but typed as if async for future-proofing
- Place implementation in `src/api/dataApi.ts`

## Future Migration Path

When data grows beyond what's practical to bundle:
1. Replace JSON imports with `fetch()` calls to a REST API
2. Keep the same function signatures — only the internals change
3. Candidates: Supabase, Firebase, or a custom Express/Fastify backend
