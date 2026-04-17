# Economic Research Page — Spec

## Route

`/research`

## Purpose

A standalone deep-research page that presents the empirical findings from the [research plan](../research/research-plan-spec.md) with academic rigor and stunning D3 visualizations. Serves as the evidence layer underpinning occupation scores and debate premises throughout the platform.

## Layout

Two-section layout sharing the standard `PageShell`:

1. **Visual Overview** — above the fold; concise, chart-forward summary of key findings
2. **Full Report** — below the fold; detailed academic writeup with all data, methods, and implications

---

## Section 1: Visual Overview

### 1.1 Hero Stats Bar

Three top-line numbers (animated count-up on enter):
- Total occupations analyzed
- Average AIOE exposure score (platform dataset)
- % of occupations classified as displacement-dominant

### 1.2 Exposure Distribution Histogram

D3 histogram of AIOE scores across all occupations.
- X-axis: exposure score (0–100), Y-axis: count
- Color zones: green (augmentation) / amber (contested) / red (displacement)
- Hover tooltip: score range, count, example occupations

### 1.3 Wage × Exposure Scatter Plot

BLS median wage vs. AIOE score, one point per occupation.
- Color-encoded by industry
- Size-encoded by employment count
- Regression line overlay with confidence interval
- Click point → navigate to occupation profile

### 1.4 Model Agreement Matrix

Heatmap of pairwise correlations between exposure indices (AIOE, Frey-Osborne, RTI, E-score).
- Cells show Pearson r
- Strong agreement (|r| > 0.7) highlighted

### 1.5 Key Equations Panel

KaTeX-rendered equations for the 3 most important models, displayed as formula cards:
- Acemoglu-Restrepo net wage effect
- ALM routine task intensity
- Felten AIOE formula

---

## Section 2: Full Report

Structured as an academic paper rendered in-page. Expandable sections:

1. **Introduction** — motivation, research question, platform context
2. **Theoretical Framework** — each model with rendered equation, assumptions, pros/cons table
3. **Data & Methods** — sources table, OLS specification, variable definitions
4. **Findings** — regression table, key charts (linked to Section 1 charts)
5. **Limitations** — static indices, causality caveats, adoption heterogeneity
6. **References** — full APA citations

---

## Tech Notes

- **KaTeX** (`katex` npm package) for equation rendering — add to `package.json`
- All chart data loaded from `src/data/researchFindings.json` (pre-computed results)
- Charts follow D3 patterns from [charts.md](../ui/charts.md)
- Styling matches [design-system.md](../ui/design-system.md) — monochrome with color only for data encoding

## Navigation Integration

- Header nav includes "Research" link (next to Dashboard, Debate)
- Occupation profile pages link to this page: "See methodology →"
- This page links to occupation profiles: clicking a scatter point opens the profile

## Approval Dependency

This page may only be built after the 2-page research plan is approved. See [research-plan-spec.md](../research/research-plan-spec.md).
