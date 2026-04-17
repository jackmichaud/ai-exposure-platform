# Implementation Plan — Phase 0: Economic Research

Deep economic research and research web page. Must be completed and approved before Phases 1-5. See [implementation-plan.md](implementation-plan.md) for Phases 1-3 and [implementation-plan-part2.md](implementation-plan-part2.md) for Phases 4-5.

---

## Phase 0: Economic Research Plan

### 0.1 Deep literature research

**Read first**: `data/literature-and-indicators.md`, `research/research-plan-spec.md`

**Do**:
- Web search for the 6 core papers (Acemoglu-Restrepo, ALM, Frey-Osborne, Felten et al., Eloundou et al., Webb)
- Extract key equations, assumptions, pros/cons for each model
- Identify empirical data sources: O\*NET 28.0, BLS OES 2023, Felten AIOE dataset, Frey-Osborne dataset
- Note download/access paths for each dataset

**Done when**: All 6 models documented with equations. Data source access confirmed.

### 0.2 Compile 2-page research plan

**Read first**: `research/research-plan-spec.md` (required sections, equations, structure)

**Do**:
- Write the plan as a standalone Markdown document following the spec
- Sections: Introduction, Theoretical Frameworks (with equations), Empirical Strategy, Expected Findings, Limitations, References
- Render math using inline LaTeX notation (`$...$`)

**Output**: `docs/research/research-plan.md` — the 2-page deliverable for submission.

**Done when**: Document covers all 6 required sections. Equations match spec. References formatted APA. Fits ~2 pages printed.

### 0.3 Human approval gate

Present the completed plan for review. Do not proceed to Phase 0b until approved.

---

## Phase 0b: Economic Research Web Page

Depends on Phase 0.3 approval. Builds the `/research` route.

### 0b.1 Research data file

**Read first**: `features/economic-research-page.md`

**Create**:
- `src/data/researchFindings.json` — pre-computed results: occupation AIOE scores, BLS wages, RTI values, model correlation matrix, OLS coefficients

**Done when**: JSON parses without error. Contains all fields needed to power Section 1 charts.

### 0b.2 KaTeX integration

**Do**:
- `npm install katex`
- Add KaTeX CSS import to `src/main.tsx`
- Create `src/components/Equation.tsx` — wrapper that renders a LaTeX string via KaTeX

**Done when**: `<Equation tex="AIOE_o = \sum_a w_{o,a} \cdot AIOE_a" />` renders correctly in browser.

### 0b.3 Research page and components

**Read first**: `features/economic-research-page.md`, `ui/charts.md`, `ui/design-system.md`

**Create**:
- `src/pages/ResearchPage.tsx` — two-section layout (Visual Overview + Full Report)
- `src/components/charts/ExposureHistogram.tsx` — D3 histogram of AIOE scores
- `src/components/charts/WageScatterPlot.tsx` — wage × exposure scatter with regression line
- `src/components/charts/ModelAgreementMatrix.tsx` — pairwise correlation heatmap
- `src/components/EquationCard.tsx` — formula card using `Equation.tsx`
- `src/components/ResearchReport.tsx` — full academic report (expandable sections)

**Update**:
- `src/App.tsx` — add `/research` route
- `src/components/layout/Header.tsx` — add "Research" nav link

**Done when**: All Section 1 charts render with data. Full Report sections expand/collapse. Equations render via KaTeX. Navigation from occupation profiles works.
