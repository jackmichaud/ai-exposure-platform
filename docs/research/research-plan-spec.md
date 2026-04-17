# Economic Research Plan — Spec

## Purpose

Specifies the 2-page academic research plan deliverable. This plan is written before any code is built, submitted for approval, and then used as the spec for the Economic Research Page (`/research`). See [economic-research-page.md](../features/economic-research-page.md) for the web implementation.

## Research Question

> *How does AI exposure vary across occupations and wage tiers, and what are the expected labor market outcomes (employment, wages) for high-exposure roles in the current generative AI era?*

## Required Sections

### 1. Introduction (½ page)

- Motivation: GPT-era general-purpose AI differs from prior automation waves
- Prior work: Frey-Osborne predicted ~47% of US jobs at high risk; LLM-era evidence revises this upward for cognitive work
- Platform context: situate as empirical foundation for the AI Exposure Platform

### 2. Theoretical Frameworks (~½ page)

Cover each model with its core equation and key implication:

| Model | Core Equation | Key Implication |
|-------|--------------|-----------------|
| Acemoglu & Restrepo (2022) | Displacement effect = `−(∂Y/∂L) · ΔT_auto`; Reinstatement = `+(∂Y/∂L_new)` | Net wage impact depends on balance between forces |
| Autor, Levy & Murnane (2003) | `RTI_k = ln(T_R,k) − ln(T_NR,k)` | Routine task intensity predicts susceptibility |
| Frey & Osborne (2017) | `P(automatable)_i = f(perception, creativity, social)` | Bottleneck classification → 0-1 risk score |
| Felten, Raj & Seamans (2023) | `AIOE_o = Σ_a (w_{o,a} · AIOE_a)` | Ability-weighted occupational exposure index |
| Eloundou et al. (2023) | Task tier: `E0 ∣ E1 ∣ E2` by `ΔTime ≥ 50%` with/without tools | GPT-specific task-level exposure |
| Webb (2020) | `Exposure_o = Σ_t sim(patent_text, task_text_t)` | Patent-task text similarity as directional signal |

### 3. Empirical Strategy (~½ page)

**Data Sources**

| Source | Variables | Access |
|--------|-----------|--------|
| O\*NET 28.0 | Task descriptions, ability requirements, task importance weights | onetcenter.org/db_releases.html |
| BLS OES 2023 | Employment (FTE), median/mean wage by 6-digit SOC | bls.gov/oes |
| Felten et al. AIOE dataset | Ability-level AIOE scores | SSRN replication files |
| Frey-Osborne dataset | Occupation computerizability probabilities (0-1) | Oxford Martin School |

**Method**

1. Map occupations to exposure using two indices (AIOE, Frey-Osborne); compute Pearson correlation to assess agreement
2. Compute RTI for each occupation from O\*NET task-importance weights
3. Merge with BLS wage/employment data by SOC code
4. Run OLS: `log(wage_o) = α + β·AIOE_o + γ·RTI_o + δ·X_o + ε_o` where X includes education requirement, sector FE
5. Visualize: exposure distribution, wage-exposure scatter, model agreement matrix

### 4. Expected Findings (~¼ page)

- High-wage cognitive occupations (lawyers, physicians, analysts) will show elevated AIOE scores
- Middle-skill routine cognitive roles (clerks, bookkeepers) will show highest RTI + displacement risk
- Wage effects: augmentation-dominant occupations expected to show positive β; displacement-dominant negative
- Polarization pattern: U-shaped employment vs. exposure curve (hollowing out of middle skill)

### 5. Limitations

- Cross-sectional analysis cannot establish causation
- AIOE and Frey-Osborne are static indices; technology moves faster than updates
- LLM adoption rates vary by firm size, geography, and sector — not captured here

### 6. References

See [literature-and-indicators.md](../data/literature-and-indicators.md) for full citations (6 core papers).

## Approval Gate

Submit the completed 2-page plan for human review. Do not begin building the `/research` web page until approved.
