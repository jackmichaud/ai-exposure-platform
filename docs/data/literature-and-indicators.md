# Literature and Indicators

## Purpose

This document maps our quantitative AI exposure indicators to the academic literature, defines how each is operationalized, and notes where we simplify or diverge from the source papers.

## Foundational Frameworks

### Acemoglu & Restrepo (2019, 2022) — Task-Based Framework

The theoretical backbone of our model. Decomposes AI's labor market impact into two opposing forces:

- **Displacement effect**: AI automates existing tasks, reducing labor demand
- **Reinstatement effect**: AI creates new tasks where humans have comparative advantage

Our platform visualizes this tension directly. The debate arena personas argue about the *balance* between these forces for a given occupation.

> Acemoglu, D. & Restrepo, P. (2019). "Automation and New Tasks." *AER*.
> Acemoglu, D. & Restrepo, P. (2022). "Tasks, Automation, and the Rise in U.S. Wage Inequality." *Econometrica*.

### Frey & Osborne (2017) — Automation Probability

The original occupation-level automation risk model. Scored 702 occupations on a 0-1 "computerizability" probability based on three engineering bottlenecks:

1. Perception and manipulation (physical tasks)
2. Creative intelligence
3. Social intelligence

We adopt their bottleneck concept but update it for the AI era (LLMs have partially dissolved the creative/social bottleneck).

> Frey, C.B. & Osborne, M.A. (2017). "The Future of Employment." *Technological Forecasting and Social Change*.

### Felten, Raj & Seamans (2018, 2023) — AIOE Index

The AI Occupational Exposure (AIOE) index links AI capability benchmarks (originally from EFF) to O\*NET ability requirements. Crucially, it measures *exposure* — not displacement — since exposure can be positive (augmentation) or negative (automation).

We adopt their key insight: exposure is not inherently bad. Our overall exposure score captures total AI relevance; the automation/augmentation split captures direction.

> Felten, E., Raj, M., & Seamans, R. (2023). "Occupational Heterogeneity in Exposure to Generative AI." *SSRN*.

### Eloundou et al. (2023) — GPT Exposure

Task-level analysis of LLM impact. Each task is scored by what percentage of worker time could be reduced (≥50%) by access to an LLM, with and without complementary tools. Key rubric:

| Label | Meaning |
|-------|---------|
| E0 | No exposure — LLM cannot reduce time by ≥50% |
| E1 | Direct exposure — LLM alone reduces time by ≥50% |
| E2 | Indirect exposure — LLM + tools reduces time by ≥50% |

We adapt this three-tier scheme into our task-level scoring (see Indicators below).

> Eloundou, T. et al. (2023). "GPTs are GPTs." *arXiv:2303.10130*.

### Autor, Levy & Murnane (2003) — Routine Task Intensity

The foundational "routinization hypothesis." Tasks are classified on two axes:

- **Routine vs. non-routine**
- **Cognitive vs. manual**

Routine tasks (both cognitive and manual) are most susceptible to automation. We use this as an input to our automation risk scoring.

> Autor, D., Levy, F., & Murnane, R. (2003). "The Skill Content of Recent Technological Change." *QJE*.

### Webb (2020) — Patent-Task Overlap

Measures AI exposure by computing text similarity between patent descriptions and O\*NET task descriptions. Captures where AI *innovation* is directed, rather than what is theoretically automatable.

We reference this approach for our timeline dimension — tasks with high patent overlap are likelier to face near-term disruption.

> Webb, M. (2020). "The Impact of Artificial Intelligence on the Labor Market." *Stanford working paper*.

For full operationalized definitions of each indicator (rubric tables, formulas, scoring ranges), see [indicator-definitions.md](indicator-definitions.md).

## Simplifications and Caveats

1. **We use expert-curated scores, not algorithmic derivation.** The papers above use NLP pipelines, patent data, or ML classifiers. For MVP, we apply their rubrics manually to a curated occupation set. This is transparent and editable but not scalable.
2. **Cross-occupation comparability is approximate.** Scores are calibrated within industries first, then normalized across the full set.
3. **Timeline estimates are speculative.** No model reliably predicts adoption speed. We present timelines as scenarios, not forecasts.
4. **Wage effects are directional, not precise.** We show ranges and categories, not point estimates.
