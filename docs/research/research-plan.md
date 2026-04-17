# AI Exposure and Labor Market Outcomes: A Research Plan

**Jack Michaud** | April 2026

---

## 1. Introduction

The deployment of large language models (LLMs) since 2022 represents a qualitative break from prior automation waves. Unlike industrial robotics — which primarily displaced routine manual labor — generative AI targets cognitive, linguistic, and analytical tasks historically considered immune to automation. Frey & Osborne (2017) estimated 47% of U.S. occupations at high computerization risk, but their bottleneck framework predated LLMs. Eloundou et al. (2023) subsequently found that roughly 80% of U.S. workers have at least 10% of their tasks exposed to GPT-class assistance, with 19% exposed on more than half their tasks — a dramatic upward revision concentrated in white-collar work.

Despite high theoretical exposure, aggregate labor market data through 2025 shows limited disruption. Humlum & Vestergaard (2025) link ChatGPT adoption to Danish administrative records for 25,000 workers and find zero earnings or hours effects. This gap between measured exposure and observed outcomes is itself the central research puzzle: **exposure indices capture technical feasibility, not adoption speed or displacement magnitude**.

This plan proposes an empirical study that (1) compiles and cross-validates leading AI exposure indices across a common occupation set, (2) maps exposure to observed wage and employment outcomes using BLS data, and (3) examines heterogeneous effects by skill tier. Findings will serve as the empirical foundation for the AI Exposure Platform — an interactive visualization tool for occupational AI risk.

---

## 2. Theoretical Frameworks

### 2.1 Core Models

**Acemoglu & Restrepo (2022)** provide the theoretical backbone. In their task-based production framework, AI's net wage effect decomposes into two opposing forces:

$$\Delta w = \underbrace{-\frac{\partial Y}{\partial L} \cdot \Delta T_{\text{auto}}}_{\text{displacement}} + \underbrace{\frac{\partial Y}{\partial L_{\text{new}}}}_{\text{reinstatement}}$$

Displacement occurs when AI automates existing tasks; reinstatement occurs when AI creates new tasks where humans hold comparative advantage. The net outcome is empirically indeterminate — motivating the exposure-vs-outcome distinction above.

**Autor, Levy & Murnane (2003)** established the foundational routinization hypothesis. Routine task intensity (RTI) predicts susceptibility:

$$\text{RTI}_k = \ln(T_{R,k}) - \ln(T_{NR,k})$$

where $T_{R,k}$ and $T_{NR,k}$ are time shares of routine and non-routine tasks. High-RTI occupations (clerks, bookkeepers, data entry) are most vulnerable.

**Frey & Osborne (2017)** scored 702 occupations on a $P(\text{automatable}) \in [0,1]$ via a machine learning classifier trained on three engineering bottlenecks: perception/manipulation, creative intelligence, and social intelligence. Their threshold of $P > 0.70$ as "high risk" captures ~47% of US employment.

**Felten, Raj & Seamans (2023)** introduced the AI Occupational Exposure (AIOE) index, linking AI capability benchmarks to O\*NET ability requirements:

$$\text{AIOE}_o = \sum_{a} w_{o,a} \cdot \text{AIOE}_a$$

where $w_{o,a}$ is the importance weight of ability $a$ in occupation $o$. Crucially, AIOE measures *exposure* — not displacement — since augmentation and automation both count.

**Eloundou et al. (2023)** apply a three-tier rubric at the task level: E0 (no LLM exposure), E1 (LLM alone reduces task time ≥50%), E2 (LLM + complementary tools reduces task time ≥50%). Occupation scores aggregate task tiers weighted by time-on-task.

**Webb (2020)** measures AI exposure via text similarity between patent descriptions and O\*NET task statements:

$$\text{Exposure}_o = \sum_{t} \text{sim}(\text{patent\_text}, \text{task\_text}_t)$$

capturing where AI *innovation* is directed rather than what is theoretically automatable — a leading indicator for near-term disruption.

### 2.2 Emerging Frameworks

**Korinek & Suh (2023)** extend standard automation macroeconomics to AGI scenarios. In their model, wages follow:

$$w = \text{MPL}(K, L, A)$$

Under Tool AI, $A$ complements $L$ and wages rise. Under Strong AGI, $A \to \infty$ eliminates labor scarcity and wages collapse. This framework motivates the scenario-based framing used in the AI Exposure Platform's debate arena.

**Gupta & Kumar (2026)** introduce the Agentic Task Exposure (ATE) index, extending the A-R framework to autonomous AI agents that complete entire workflows:

$$\text{ATE}_o(r,\tau) = \sum_t w_{o,t} \cdot \text{CAP}(t) \cdot \text{COV}(t,o) \cdot V(t,r,\tau)$$

where $\text{COV}(t,o)$ penalizes tasks requiring physical presence, regulatory accountability, or exception handling — factors that limit agentic completion. $V(t,r,\tau)$ encodes regional adoption velocity.

**Massenkoff & McCrory (2026)** propose "observed exposure," combining theoretical LLM capability assessments with actual usage data from Claude conversations. Tasks are scored as:

$$\text{score}_t = \text{coverage}(t) \times [\text{auto}(t) + 0.5 \cdot \text{aug}(t)]$$

weighting fully automated uses at 1.0 and augmentative uses at 0.5, then aggregating by task-time weights. This is the first index grounded in real-world adoption rather than theoretical feasibility.

---

## 3. Empirical Strategy

### 3.1 Data

| Source | Variables | Notes |
|--------|-----------|-------|
| O\*NET 28.0 | Task descriptions, ability importance weights, task-time weights | ~1,000 occupations, 6-digit SOC |
| BLS OES 2023 | Median/mean wage, employment (FTE) | Matched by SOC code |
| Felten et al. AIOE dataset | Ability-level AIOE scores | SSRN replication files |
| Frey-Osborne dataset | Computerizability probability $P \in [0,1]$ | Oxford Martin School |
| Massenkoff & McCrory (2026) | Observed exposure scores | Anthropic Economic Index |

### 3.2 Analysis

**Step 1 — Index compilation.** Compute five exposure scores per occupation: AIOE, Frey-Osborne $P$, RTI, Eloundou E-score, and Observed Exposure. Harmonize to 6-digit SOC 2019 codes.

**Step 2 — Cross-index validation.** Compute pairwise Pearson correlations. Per Budget Lab (2025), indices correlate at $r = 0.7$–$0.9$ overall but diverge most for high-exposure cognitive occupations — a key heterogeneity to document.

**Step 3 — Wage regression.** Estimate via OLS:

$$\ln(\text{wage}_o) = \alpha + \beta_1 \cdot \text{AIOE}_o + \beta_2 \cdot \text{RTI}_o + \beta_3 \cdot \text{ATE}_o + \delta \cdot X_o + \varepsilon_o$$

where $X_o$ includes: median education requirement, industry fixed effects, log employment. Hypothesize $\beta_1 > 0$ (exposure correlates with high-wage cognitive work), $\beta_2 < 0$ (routine intensity correlates with lower wages), and heterogeneous $\beta_3$ by skill tier.

**Step 4 — Skill-tier heterogeneity.** Interact exposure indices with low/mid/high skill tier dummies, following Marguerit (2025). Expect positive wage effects for augmentation-dominant high-skill roles; negative for displacement-dominant middle-skill roles.

---

## 4. Expected Findings and Hypotheses

- **H1**: High-wage cognitive occupations (lawyers, analysts, software engineers) score in the top quartile of AIOE and Observed Exposure.
- **H2**: Middle-skill routine cognitive roles (clerks, bookkeepers, data entry) show highest RTI and ATE, placing them displacement-dominant.
- **H3**: OLS $\hat{\beta}_1 > 0$ — exposure positively correlated with current wages, consistent with augmentation-dominant composition of the sample.
- **H4**: Polarization pattern — U-shaped employment vs. exposure (hollowing of middle skill), consistent with ALM routinization hypothesis updated for LLMs.
- **H5 (null)**: No statistically significant aggregate wage or employment decline in cross-section, consistent with Humlum & Vestergaard (2025) — theoretical exposure leads realized disruption by multiple years.

---

## 5. Limitations

1. **Exposure ≠ displacement.** All indices measure technical feasibility; adoption timelines, firm behavior, and regulatory constraints determine realized outcomes.
2. **Cross-sectional identification.** OLS estimates correlation, not causation. IV strategy (e.g., leveraging international AI development variation per Marguerit 2025) left for future work.
3. **Index divergence on high-exposure roles.** Indices disagree most where it matters most. Composite scores (PCA-weighted per Budget Lab) reduce but do not eliminate this.
4. **Static measurement.** Frey-Osborne and AIOE are point-in-time snapshots; the Observed Exposure index (Massenkoff & McCrory) is uniquely dynamic but covers only Claude-mediated work.

---

## 6. References

Acemoglu, D. & Restrepo, P. (2022). Tasks, automation, and the rise in U.S. wage inequality. *Econometrica*, 90(5), 1973–2016.

Autor, D., Levy, F., & Murnane, R. (2003). The skill content of recent technological change. *Quarterly Journal of Economics*, 118(4), 1279–1333.

Budget Lab at Yale. (2025). *Labor market AI exposure: What do we know?* budgetlab.yale.edu.

Chopra, A. et al. (2025). The Iceberg Index: Measuring workforce exposure in the AI economy. *arXiv:2510.25137*.

Eloundou, T. et al. (2023). GPTs are GPTs: An early look at the labor market impact potential of large language models. *arXiv:2303.10130*.

Felten, E., Raj, M., & Seamans, R. (2023). Occupational heterogeneity in exposure to generative AI. *SSRN:4414065*.

Frey, C.B. & Osborne, M.A. (2017). The future of employment. *Technological Forecasting and Social Change*, 114, 254–280.

Gupta, R. & Kumar, S. (2026). Agentic AI and occupational displacement. *arXiv:2604.00186*.

Humlum, A. & Vestergaard, E. (2025). Large language models, small labor market effects. *NBER Working Paper 33777*.

Korinek, A. & Suh, D. (2023). Scenarios for the transition to AGI. *NBER Working Paper 32255*.

Marguerit, D. (2025). Augmenting or automating labor? *arXiv:2503.19159*.

Massenkoff, M. & McCrory, P. (2026). Labor market impacts of AI: A new measure and early evidence. Anthropic Economic Index.

Webb, M. (2020). The impact of artificial intelligence on the labor market. *Stanford Working Paper*.
