# Indicator Definitions

Operationalized definitions for all AI exposure indicators. For the academic foundations behind each, see [literature-and-indicators.md](literature-and-indicators.md). For how scores roll up to occupations, see [scoring-methodology.md](scoring-methodology.md).

## 1. Automation Risk (0-100)

**Literature basis**: Frey & Osborne (bottlenecks), Autor et al. (routinization), Eloundou et al. (E0/E1/E2 rubric)

Each task is scored on four sub-dimensions, each 0-25:

| Sub-dimension | 0 (low risk) | 25 (high risk) | Source |
|---------------|--------------|-----------------|--------|
| Routineness | Novel judgment each time | Follows fixed procedure | Autor et al. |
| Data intensity | Sparse, qualitative inputs | Rich, structured data | Webb |
| Physical bottleneck | Requires dexterous presence | Fully digital | Frey & Osborne |
| Social bottleneck | Deep interpersonal trust | Minimal human interaction | Frey & Osborne |

`automation_risk = routineness + data_intensity + (25 - physical_bottleneck) + (25 - social_bottleneck)`

Inverted bottleneck scores: high bottleneck = hard to automate = low risk.

## 2. Augmentation Potential (0-100)

**Literature basis**: Felten et al. (AIOE as non-directional exposure), Acemoglu & Restrepo (new task creation)

Scored on four sub-dimensions, each 0-25:

| Sub-dimension | 0 (low potential) | 25 (high potential) | Rationale |
|---------------|--------------------|--------------------|-----------|
| Information synthesis | Simple lookups | Complex multi-source analysis | LLMs excel at synthesis |
| Decision support | No decisions / trivial | High-stakes, data-rich decisions | AI augments judgment |
| Creative leverage | No creative output | Ideation, drafting, design | Generative AI tools |
| Productivity multiplier | Fixed throughput | Throughput scales with tools | AI accelerates output |

## 3. Exposure Decomposition

**Literature basis**: Acemoglu & Restrepo task-based framework

```
overall_exposure = max(automation_risk, augmentation_potential)
net_displacement = automation_risk - augmentation_potential
```

| net_displacement | Interpretation |
|------------------|----------------|
| > +30 | **Displacement-dominant** — role shrinks |
| -30 to +30 | **Contested** — outcome depends on adoption path |
| < -30 | **Augmentation-dominant** — role enhanced |

## 4. Routine Task Intensity (RTI)

**Literature basis**: Autor, Levy & Murnane (2003)

```
RTI = ln(routine_cognitive + routine_manual) - ln(nonroutine_analytical + nonroutine_interpersonal)
```

Derived from task category tags. Higher RTI = more susceptible to automation.

## 5. Complementarity Score (0-100)

**Literature basis**: Felten et al. (exposure ≠ replacement), Acemoglu & Restrepo (reinstatement)

Measures how much the occupation benefits from *working with* AI. Factors:

- Does the role involve supervising/directing AI outputs?
- Does AI create new tasks within this role?
- Does the role require validating/auditing AI decisions?

High complementarity roles become *more* valuable as AI adoption increases.

## 6. Bottleneck Analysis

**Literature basis**: Frey & Osborne (engineering bottlenecks)

Identify the 1-3 tasks hardest to automate per occupation. These create a "floor" on human involvement. Stored as `bottleneckTaskIds` — references task IDs with the lowest automation risk scores.

## 7. Timeline Classification

**Literature basis**: Webb (patent-task overlap as proxy for near-term disruption)

| Timeline | Criteria |
|----------|----------|
| Near-term (1-3 yr) | AI tools already deployed commercially; high patent-task overlap |
| Mid-term (3-7 yr) | Research demonstrates capability; adoption needs infrastructure/regulatory change |
| Long-term (7+ yr) | Requires breakthroughs in robotics, reasoning, or regulation |

## 8. Wage Effect

**Literature basis**: Acemoglu & Restrepo (displacement vs. reinstatement), Autor (2024) on wage polarization

| Scenario | Projected effect |
|----------|-----------------|
| High automation + low augmentation | Negative (-10% to -50%) |
| High augmentation + low automation | Positive (+5% to +30%) |
| Both high (contested) | Polarized — high-skill premium, low-skill pressure |
| Both low | Minimal change |
