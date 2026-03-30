# State Management

## Approach

React Context + `useReducer` for global state. No external state library for MVP.

## Global State

Managed via `FilterContext` and `DebateContext`:

### FilterContext

Holds the current filter selections applied across the dashboard and charts.

```typescript
interface FilterState {
  industry: string | null;       // Selected industry filter
  wageRange: [number, number];   // Min/max wage range
  educationLevel: string | null; // Education level filter
  timeline: "near-term" | "mid-term" | "long-term"; // Adoption timeline
  sortBy: "exposure" | "wage" | "name"; // Sort order
}
```

### DebateContext

Holds the state for the Agent Debate Arena.

```typescript
interface DebateState {
  topic: string | null;          // Current debate topic/occupation
  status: "idle" | "debating" | "summarizing" | "complete" | "error";
  rounds: DebateRound[];        // Completed rounds
  currentSpeaker: PersonaId | null;
  summary: DebateSummary | null;
}
```

## Local State

Use `useState` for component-scoped state:

- Chart hover/tooltip state
- UI toggles (expanded panels, active tabs)
- Form input values before submission

## Action Types

### FilterAction

```typescript
type FilterAction =
  | { type: "SET_INDUSTRY"; payload: string | null }
  | { type: "SET_WAGE_RANGE"; payload: [number, number] }
  | { type: "SET_EDUCATION"; payload: string | null }
  | { type: "SET_TIMELINE"; payload: "near-term" | "mid-term" | "long-term" }
  | { type: "SET_SORT"; payload: { sortBy: "exposure" | "wage" | "name"; sortOrder?: "asc" | "desc" } }
  | { type: "RESET" };
```

### DebateAction

```typescript
type DebateAction =
  | { type: "START_DEBATE"; payload: { occupationId: string } }
  | { type: "SET_SPEAKER"; payload: PersonaId | null }
  | { type: "APPEND_TOKEN"; payload: { personaId: PersonaId; token: string } }
  | { type: "COMPLETE_TURN"; payload: { personaId: PersonaId; round: number } }
  | { type: "SET_SUMMARY"; payload: DebateSummary }
  | { type: "SET_STATUS"; payload: DebateState["status"] }
  | { type: "SET_ERROR"; payload: string };

type PersonaId = "optimist" | "realist" | "skeptic" | "worker-advocate";
```

## Initial State

```typescript
const INITIAL_FILTER_STATE: FilterState = {
  industry: null,
  wageRange: [0, 200000],
  educationLevel: null,
  timeline: "near-term",
  sortBy: "exposure",
};

const INITIAL_DEBATE_STATE: DebateState = {
  topic: null,
  status: "idle",
  rounds: [],
  currentSpeaker: null,
  summary: null,
};
```

## Reducers and Hooks

```typescript
function filterReducer(state: FilterState, action: FilterAction): FilterState;
function debateReducer(state: DebateState, action: DebateAction): DebateState;

// Custom hooks — components use these, never raw useContext
function useFilterContext(): { state: FilterState; dispatch: Dispatch<FilterAction> };
function useDebateContext(): { state: DebateState; dispatch: Dispatch<DebateAction> };
```

### Streaming dispatch example

```typescript
for await (const event of stream) {
  if (event.type === "content_block_delta") {
    dispatch({
      type: "APPEND_TOKEN",
      payload: { personaId: currentSpeaker, token: event.delta.text },
    });
  }
}
dispatch({ type: "COMPLETE_TURN", payload: { personaId: currentSpeaker, round: currentRound } });
```

## Patterns

- **Filter propagation**: Dashboard components subscribe to `FilterContext` and re-filter data on state change
- **Debate streaming**: `DebateContext` reducer appends streamed tokens to the current speaker's response
- **Derived data**: Compute filtered/sorted occupation lists in a `useMemo` hook, not in the reducer
- **URL sync**: Filters sync to URL query params via React Router so users can share links
