# Design System

## Minimalist Principles

1. **Every element earns its space** — remove anything that does not aid comprehension
2. **Whitespace is structural** — use spacing to separate and group, not borders or backgrounds
3. **Color is reserved for data and affordances** — never decorative
4. **Borders and shadows used sparingly** — prefer spacing to lines; use `shadow-sm` only on cards
5. **Typography hierarchy does the heavy lifting** — size and weight differences create visual structure without extra ornament

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Indigo 600 | `#4F46E5` | Primary actions, active states |
| Indigo 50 | `#EEF2FF` | Primary backgrounds, highlights |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Risk Red | `#DC2626` | High automation risk |
| Opportunity Blue | `#2563EB` | High augmentation potential |
| Caution Amber | `#D97706` | Medium/mixed exposure |
| Neutral Gray | `#6B7280` | Neutral scores, secondary text |
| Success Green | `#059669` | Positive wage effects, low risk |

### Heatmap Scale

Diverging color scale for the exposure heatmap:
- 0-30 (low risk): cool blues
- 30-60 (moderate): neutral yellows/grays
- 60-100 (high risk): warm reds

Use D3's `d3.interpolateRdYlBu` (reversed) or a custom scale.

## Typography

- **Font family**: Inter (sans-serif), with system font fallback stack
- **Headings**: font-semibold or font-bold
- **Body**: font-normal, text-gray-700
- **Mono** (scores, data): JetBrains Mono or system monospace

| Level | Tailwind class | Usage |
|-------|---------------|-------|
| H1 | `text-3xl font-bold` | Page titles |
| H2 | `text-2xl font-semibold` | Section headers |
| H3 | `text-lg font-semibold` | Card titles, subsections |
| Body | `text-base` | Default text |
| Small | `text-sm text-gray-500` | Captions, metadata |

## Spacing

Use Tailwind's default spacing scale. Consistent patterns:
- Page padding: `p-6` (desktop), `p-4` (mobile)
- Card padding: `p-4`
- Section gap: `gap-6`
- Element gap: `gap-2` or `gap-3`

## Component Patterns

### Cards

```html
<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
```

### Filter Bar

Horizontal bar at the top of the dashboard, `sticky top-0` with `bg-white/95 backdrop-blur`.

### Persona Panels (Debate Arena)

Each persona gets a bordered card with a colored top border matching their identity:
- Optimist: green top border
- Realist: blue top border
- Skeptic: amber top border
- Worker Advocate: indigo top border

### Buttons

- Primary: `bg-indigo-600 text-white hover:bg-indigo-700 rounded-md px-4 py-2`
- Secondary: `border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md px-4 py-2`

## Whitespace Guidelines

- Minimum **24px** (`gap-6`) between major page sections
- Chart containers: **32px** (`mb-8`) margin-bottom
- Cards: internal padding **16px** (`p-4`) minimum
- No element should touch the edge of its parent container

## Transitions & Animation

| Context | Tailwind classes | Notes |
|---------|-----------------|-------|
| Default transition | `transition-all duration-200 ease-in-out` | Buttons, links, interactive elements |
| Hover states | `duration-150` | Faster for snappy feel |
| Modal/panel open | `duration-300 ease-out` | Slide or fade in |
| Modal/panel dismiss | `duration-200 ease-in` | Slightly faster out |
| Staggered list entry | 50ms delay per item | For card lists and table rows |
| Page route change | None (instant) | No page transition animations |

## Interactive States

- **Focus**: `ring-2 ring-indigo-500 ring-offset-2` — visible keyboard focus ring on all interactive elements
- **Active/pressed**: `scale-[0.98] transition-transform` — subtle press feedback on buttons
- **Disabled**: `opacity-50 cursor-not-allowed pointer-events-none`
- **Loading**: `animate-pulse` on skeleton placeholders
