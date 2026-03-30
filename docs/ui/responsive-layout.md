# Responsive Layout

## Breakpoints

Using Tailwind's default breakpoints:

| Name | Min width | Typical device |
|------|-----------|----------------|
| `sm` | 640px | Large phone |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |

## Page Shell

```
┌──────────────────────────────────┐
│           Top Nav Bar            │
├──────────┬───────────────────────┤
│ Sidebar  │                       │
│ (lg+)    │     Main Content      │
│          │                       │
└──────────┴───────────────────────┘
```

- **Top nav**: Always visible, contains logo, page links, and mobile menu toggle
- **Sidebar**: Visible on `lg+` screens. Contains navigation links and filter controls on the dashboard page
- **Mobile**: Sidebar collapses into a hamburger menu or bottom navigation

## Dashboard Layout

### Desktop (lg+)

- Filter bar: horizontal, sticky below nav
- Heatmap: full width below filters, scrollable if needed

### Tablet (md)

- Filter bar: wraps to two rows if needed
- Heatmap: horizontal scroll with sticky row headers

### Mobile (< md)

- Filters: collapsible panel (tap to expand)
- Heatmap replaced by: ranked card list, one occupation per card
- Cards show: occupation name, industry tag, exposure score badge, wage

## Occupation Profile Layout

### Desktop

- Two-column layout: charts on the left (2/3), comparison panel on the right (1/3)
- Task breakdown: full-width table below

### Mobile

- Single column, sections stacked vertically
- Charts at full width
- Comparison panel: accordion, collapsed by default
- Task table: switches to card layout

## Debate Arena Layout

### Desktop

- 2x2 grid of persona panels (see `design-system.md`)
- Summary panel: full width below the grid

### Tablet

- 2x2 grid but smaller panels, scrollable responses

### Mobile

- Single column: persona panels stacked vertically
- Tab navigation to switch between personas (instead of showing all)
- Summary panel at bottom

## Chart Responsiveness

- Charts use `ResizeObserver` to adapt to container width (see `charts.md`)
- Minimum chart width: 300px — below that, show a simplified version or data table
- On very small screens, some charts may be replaced with numeric displays

## Micro-Interaction Timing

| Interaction | Duration | Details |
|-------------|----------|---------|
| Mobile menu open | 250ms | Slide from left + backdrop fade 200ms |
| Mobile menu close | 200ms | Reverse slide + backdrop fade |
| Filter panel expand/collapse | 200ms | Height transition with `overflow-hidden` |
| Accordion section expand | 300ms | Height transition; content fades in with 100ms delay |
| Tab switch (debate/mobile) | Instant | Content swaps immediately; underline indicator slides 200ms |
| Card hover (desktop only) | 150ms | `shadow-sm` → `shadow-md` elevation; no hover states on touch |
| Heatmap cell hover | Immediate | Tooltip appears per `charts.md` timing |
