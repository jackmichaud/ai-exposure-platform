# Charts — D3.js + React

## Visual Philosophy

Data visualizations should be information-dense but visually quiet. Principles:

- **Color encodes meaning** — risk, opportunity, direction — never decoration
- **Minimal gridlines** — use light `#E5E7EB` dashed lines; omit where axis labels suffice
- **No borders on bars** — fill only, with rounded corners (`rx="2"`)
- **Generous whitespace** — 32px margin around chart containers, 16px internal padding
- **Animations serve comprehension** — show change and draw attention, not flair
- **Tooltips provide precision** — the chart shows shape; the tooltip shows exact values

## Integration Pattern

D3 manages the SVG DOM inside a container ref. React owns everything outside.

```typescript
function HeatmapChart({ data, filters }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    const svg = d3.select(svgRef.current);
    // D3 rendering logic here
    // Clean up on unmount or data change
    return () => svg.selectAll("*").remove();
  }, [data, filters]);

  return <svg ref={svgRef} className="w-full" />;
}
```

## Responsive Sizing

Use a `ResizeObserver` hook to track container dimensions:

```typescript
function useContainerSize(ref: RefObject<HTMLElement>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}
```

## Chart Specifications

### Heatmap (Dashboard)

- **Data shape**: `{ occupationId, industryId, score, label }[]`
- **X-axis**: Industries (categorical)
- **Y-axis**: Occupations (categorical, sorted by score)
- **Color**: `d3.scaleSequential(d3.interpolateRdYlBu).domain([100, 0])`
- **Tooltip**: On hover, show occupation name, score, wage
- **Transitions**: 300ms ease on data change

### Automation Risk Gauge (Occupation Profile)

- **Type**: Semi-circle gauge / arc
- **Range**: 0-100
- **Color zones**: 0-30 green, 30-60 amber, 60-100 red
- **Needle**: Animated to current value

### Skill Impact Bar Chart (Occupation Profile)

- **Type**: Horizontal grouped bars
- **Groups**: Gained skills vs. displaced skills
- **Color**: Green for gained, red for displaced
- **Sort**: By relevance score

### Wage Effect Projection (Occupation Profile)

- **Type**: Arrow or slope chart
- **Shows**: Current wage → projected wage (with range)
- **Color**: Green for increase, red for decrease

## Accessibility

- All charts must have `role="img"` and an `aria-label` describing the data
- Tooltips must be keyboard-accessible (focusable cells)
- Use color-blind-safe palette (test with Sim Daltonism or similar)
- Provide a text summary or data table alternative for screen readers

## Tooltip Template

```html
<div class="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg pointer-events-none">
  <p class="font-semibold">{occupation}</p>
  <p class="text-gray-300 text-xs">{industry}</p>
  <div class="flex items-center gap-2 mt-1">
    <span class="inline-block w-2 h-2 rounded-full" style="background:{scoreColor}"></span>
    <span class="font-mono">{score}/100</span>
  </div>
  <p class="text-xs text-gray-400 mt-1">{wage} · {education}</p>
</div>
```

Position tooltips 8px above the cursor. Fade in 150ms, fade out 100ms.

## Legend Specifications

- **Position**: Top-right of chart container, horizontally aligned with chart title
- **Heatmap**: Gradient bar (120px wide, 12px tall) with min/max labels
- **Bar charts**: Categorical swatches (8px circles) with inline labels
- **Sizing**: `text-xs text-gray-500`, no border or background

## Animation Details

| Event | Duration | Easing | Notes |
|-------|----------|--------|-------|
| Chart entry | 400ms | `d3.easeCubicOut` | Fade from opacity 0 + scale from 0.95 |
| Data update | 300ms | `d3.easeQuadInOut` | Transition positions and colors |
| Hover highlight | 150ms | `ease-in-out` | Dim non-hovered elements to opacity 0.3 |
| Gauge needle | 800ms | `d3.easeElasticOut` | Animated sweep to target value |
| Tooltip appear | 150ms | `ease-out` | Fade in |
| Tooltip dismiss | 100ms | `ease-in` | Fade out |

## Component States

- **Loading**: Pulsing skeleton matching chart shape (`animate-pulse bg-gray-100 rounded-lg`), height matches expected chart
- **Error**: Centered message with retry button: `"Unable to load chart. [Retry]"`
- **Empty**: Light gray container with message: `"No data matches your filters. Try adjusting your selection."`

## Shared Utilities

Place in `src/components/charts/utils/`:
- `createColorScale(domain, scheme)` — consistent color scales
- `formatScore(score)` — display formatting for scores
- `createTooltip(container)` — reusable tooltip setup
