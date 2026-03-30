# Dashboard Overview — Heatmap

## Purpose

Landing page providing a bird's-eye view of AI exposure across occupations. Users scan the heatmap to identify high-risk or high-opportunity roles, then click into individual occupation profiles.

## Heatmap Specification

- **X-axis**: Industries (columns)
- **Y-axis**: Occupations within each industry (rows)
- **Cell color**: AI exposure score mapped to a diverging color scale
  - High automation risk → red/warm
  - High augmentation potential → blue/cool
  - Mixed/neutral → gray/yellow
- **Cell content**: Occupation name + exposure score on hover
- **Default sort**: By exposure score (highest first within each industry)

## Filter Controls

| Filter | Type | Options |
|--------|------|---------|
| Industry | Dropdown (multi-select) | All available industries |
| Wage range | Range slider | Min–max from data |
| Education level | Dropdown | High school, Associate, Bachelor, Master, Doctoral |
| Timeline | Toggle group | Near-term (1-3yr), Mid-term (3-7yr), Long-term (7+yr) |

Filters are managed via `FilterContext` (see `../architecture/state-management.md`).

## Interactions

- **Hover**: Tooltip with occupation name, exposure score, industry, median wage
- **Click cell**: Navigate to Occupation Profile page for that occupation
- **Filter change**: Heatmap re-renders with transition animation
- **Empty state**: Message shown when no occupations match current filters

## Data Requirements

From the data layer (see `../api/data-api.md`):
- `getOccupations(filters)` → filtered list of occupations with exposure scores
- `getIndustries()` → list of industries for filter dropdown

## Responsive Behavior

- **Desktop**: Full heatmap grid with all industries visible
- **Tablet**: Horizontal scroll for industries, sticky occupation labels
- **Mobile**: Switch to a ranked list view (cards) instead of heatmap grid
