# Occupation Profile

## Purpose

Deep-dive view for a single occupation. Shows detailed AI exposure analysis with charts, task-level breakdowns, and comparisons to similar roles. Entry point for launching a debate about this occupation.

## Navigation

- Accessed from: heatmap cell click, direct URL (`/occupation/:id`), or search
- URL pattern: `/occupation/:occupationId`

## Page Sections

### Header

- Occupation title, industry, SOC code (if applicable)
- Median wage, typical education level
- Overall AI exposure score (large, prominent)

### Risk & Opportunity Charts

| Chart | Type | Description |
|-------|------|-------------|
| Automation Risk | Gauge/meter | 0-100 scale, color-coded |
| Augmentation Potential | Horizontal bar | How much AI can enhance the role |
| Skill Impact | Grouped bar chart | Skills gained vs. skills displaced |
| Wage Effect | Arrow/projection | Projected wage change over timeline |

See `../ui/charts.md` for chart implementation details.

### Task-Level Breakdown

- Table or card list of individual tasks within the occupation
- Each task shows: name, description, AI exposure score, automation vs. augmentation classification
- Sortable by exposure score
- Color-coded rows matching the heatmap scale

### Comparison Panel

- Side-by-side comparison with 2-3 similar occupations
- Metrics: overall exposure, wage, education, top affected tasks
- Visible by default on desktop; collapsed to accordion on mobile

### Similar Occupations Algorithm

`getSimilarOccupations(id, limit = 3)` uses pre-computed `similarOccupationIds` from the JSON. When computing those IDs:

1. **Jaccard similarity on skills**: For each candidate occupation, compute `|shared_skill_ids| / |union_skill_ids|`. Rank descending.
2. **Fallback**: If fewer than `limit` occupations have skill overlap > 0, fill remaining slots with same-industry occupations sorted by closest `exposureScore.overall` (absolute difference).
3. **Exclude self**: Never include the source occupation in its own similar list.

The `similarOccupationIds` field is pre-computed from this formula and stored in the JSON.

### Debate Launcher

- "Start a Debate" button that navigates to the Debate Arena pre-loaded with this occupation as the topic
- Brief preview of what the debate will cover

## Data Requirements

- `getOccupation(id)` → full occupation record with tasks
- `getSimilarOccupations(id)` → 2-3 related occupations for comparison

## Responsive Behavior

- Charts stack vertically on mobile
- Task table switches to card layout on small screens
- Comparison panel collapses to an accordion
