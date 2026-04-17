# Economic Research Plan — Spec

## Purpose

Specifies the 2-page academic research plan deliverable. This plan is written before any code is built, submitted for approval, and then used as the spec for the Economic Research Page (`/research`). See [economic-research-page.md](../features/economic-research-page.md) for the web implementation.

## Research Question

> *How does AI exposure vary across occupations and wage tiers, and what are the expected labor market outcomes (employment, wages) for high-exposure roles in the current generative AI era?*

## Required Sections

### 1. Introduction (½ page)

- Motivation: GPT-era general-purpose AI differs from prior automation waves
- Prior work: Frey-Osborne predicted ~47% of US jobs at high risk; LLM-era evidence revises this upward for cognitive work
- Field is still in early innings — most empirical studies through 2025 find limited aggregate disruption but heterogeneous distributional effects

### 2. Theoretical Frameworks (~½ page)

#### 2a. Core Models (must include all six)

| Model | Core Equation | Key Implication |
|-------|--------------|-----------------|
| Acemoglu & Restrepo (2022) | Displacement: `−(∂Y/∂L)·ΔT_auto`; Reinstatement: `+(∂Y/∂L_new)` | Net wage depends on balance of displacement vs. reinstatement |
| Autor, Levy & Murnane (2003) | `RTI_k = ln(T_R,k) − ln(T_NR,k)` | Routine task intensity predicts susceptibility |
| Frey & Osborne (2017) | `P(auto)_i = f(perception, creativity, social)` | Bottleneck classification → 0–1 risk score |
| Felten, Raj & Seamans (2023) | `AIOE_o = Σ_a (w_{o,a} · AIOE_a)` | Ability-weighted occupational exposure index |
| Eloundou et al. (2023) | Task tier: `E0 ∣ E1 ∣ E2` by `ΔTime ≥ 50%` | GPT-specific task-level exposure |
| Webb (2020) | `Exposure_o = Σ_t sim(patent_text, task_text_t)` | Patent-task text similarity as directional signal |

#### 2b. Emerging Frameworks (include at least two)

| Model | Core Contribution | Key Formula |
|-------|------------------|-------------|
| Korinek & Suh (2023) | AGI scenario macromodel: wages rise under Tool AI, collapse under Strong AGI | `w = MPL(K, L, A)` — wage collapses as `A → ∞` and labor scarcity ends |
| Massenkoff & McCrory (2026) | "Observed exposure" — weights actual Claude usage over theoretical feasibility | `score_t = coverage(t) × [auto(t) + 0.5·aug(t)]` aggregated by task-time weights |
| Gupta & Kumar (2026) | Agentic Task Exposure (ATE) — extends A-R for autonomous workflow completion | `ATE_o = Σ w_{o,t}·CAP(t)·COV(t,o)·V(t,r,τ)` where COV penalizes non-digital tasks |
| Fenoaltea et al. (2024) | AI Startup Exposure (AISE) — grounds exposure in VC investment, not theory | LLM-scored Y Combinator startup-to-O*NET task substitutability |
| Chopra et al. (2025) | Iceberg Index — maps 13,000+ production AI tools to O*NET skill taxonomy | Surface Index (visible, 2.2% wage value) vs. Iceberg Index (full, 11.7% wage value ≈ $1.2T) |

### 3. Empirical Strategy (~½ page)

**Data Sources**

| Source | Variables | Access |
|--------|-----------|--------|
| O*NET 28.0+ | Task descriptions, ability requirements, task-importance weights | onetcenter.org/db_releases.html |
| BLS OES 2023 | Employment (FTE), median/mean wage by 6-digit SOC | bls.gov/oes |
| Felten et al. AIOE dataset | Ability-level AIOE scores | SSRN replication files |
| Frey-Osborne dataset | Computerizability probabilities (0–1) | Oxford Martin School |
| Massenkoff & McCrory (2026) | Observed exposure scores by occupation | Anthropic Economic Index |

**Method**

1. Compile five exposure indices per occupation: AIOE, Frey-Osborne, RTI, Observed (Massenkoff), ATE
2. Compute pairwise Pearson correlations — Budget Lab finding: indices agree on low-exposure but diverge on high-exposure roles
3. Merge with BLS wage/employment data by SOC
4. OLS specification: `log(wage_o) = α + β₁·AIOE_o + β₂·RTI_o + β₃·ATE_o + δ·X_o + ε_o`
   where X = education requirement, sector FE, employment size
5. Heterogeneous effects: interact exposure with skill tier (low/mid/high) per Marguerit (2025)

**Key Null Result to Acknowledge**: Humlum & Vestergaard (2025, Danish admin data, n=25,000) find zero earnings/hours effects through 2024 despite ChatGPT exposure; Johnston & Makridis (2025) find wage *gains* in exposed sectors for high-skill workers. Empirical effects have not yet matched theoretical exposure.

### 4. Expected Findings (~¼ page)

- High-wage cognitive roles: elevated AIOE but potentially augmentation-dominant (positive wage β)
- Middle-skill routine cognitive roles: highest RTI and ATE, displacement-dominant
- Polarization: U-shaped employment vs. exposure (hollowing of middle skill)
- Iceberg insight: geographic exposure concentrated in administrative/financial clusters, not just coastal tech hubs

### 5. Limitations

- Exposure measures technical feasibility, not actual adoption speed or displacement
- Cross-sectional analysis cannot establish causation
- Indices disagree most on high-exposure occupations (Budget Lab finding)
- Null empirical results through 2025 suggest theory leads reality by years

### 6. References

Cite all papers above in APA format. See [literature-and-indicators.md](../data/literature-and-indicators.md) for the original 6. New additions: Korinek & Suh (NBER w32255), Massenkoff & McCrory (Anthropic, 2026), Gupta & Kumar (arXiv 2604.00186), Fenoaltea et al. (arXiv 2412.04924), Chopra et al. (arXiv 2510.25137), Humlum & Vestergaard (NBER w33777).

## Approval Gate

Submit the completed 2-page plan for human review. Do not begin building the `/research` web page until approved.
