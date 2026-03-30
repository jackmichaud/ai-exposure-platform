# Scoring Methodology

## Overview

AI exposure scores quantify how much an occupation's tasks may be affected by AI. Scores are expert-curated heuristic estimates grounded in published research — not predictions. See [literature-and-indicators.md](literature-and-indicators.md) for the full academic basis and detailed rubrics.

## Indicators

### Primary Indicators

| Indicator | Range | Derivation | Literature Basis |
|-----------|-------|------------|------------------|
| Automation Risk | 0-100 | Sum of 4 sub-dimensions (routineness, data intensity, physical bottleneck, social bottleneck) | Frey & Osborne; Autor et al. |
| Augmentation Potential | 0-100 | Sum of 4 sub-dimensions (info synthesis, decision support, creative leverage, productivity multiplier) | Felten et al.; Acemoglu & Restrepo |
| Overall Exposure | 0-100 | `max(automation_risk, augmentation_potential)` | Felten et al. (AIOE) |
| Net Displacement | -100 to +100 | `automation_risk - augmentation_potential` | Acemoglu & Restrepo task framework |

### Secondary Indicators

| Indicator | Range | Derivation |
|-----------|-------|------------|
| Routine Task Intensity (RTI) | continuous | Log ratio of routine to non-routine task scores |
| Complementarity Score | 0-100 | How much the role benefits from working *with* AI |
| Bottleneck Tasks | task IDs | Tasks with lowest automation risk, creating a floor on human involvement |

### Contextual Indicators

| Indicator | Range | Derivation |
|-----------|-------|------------|
| Timeline | near/mid/long-term | Based on commercial deployment status and patent-task overlap |
| Wage Effect | -50% to +50% | Directional estimate from displacement/augmentation balance |
| Confidence | low/medium/high | Data quality and agreement across rubric sub-dimensions |

## Task-Level Scoring

Each task is scored independently on **automation risk** and **augmentation potential** using the sub-dimension rubrics defined in [literature-and-indicators.md](literature-and-indicators.md). Each sub-dimension is scored 0-25.

Tasks are also tagged with a category (`cognitive`, `physical`, `interpersonal`) and an LLM exposure tier adapted from Eloundou et al.:

| Tier | Meaning |
|------|---------|
| E0 | No meaningful exposure — AI cannot reduce task time by ≥50% |
| E1 | Direct LLM exposure — LLM alone reduces task time by ≥50% |
| E2 | Tool-augmented exposure — LLM + specialized tools reduces time by ≥50% |

## Occupation-Level Rollup

```
occupation_score = Σ(task_score × task_weight) / Σ(task_weight)
```

Task weights reflect proportion of time spent (from O\*NET or expert estimate). Applied separately for automation risk and augmentation potential, then composed:

```
overall_exposure = max(automation_risk, augmentation_potential)
net_displacement = automation_risk - augmentation_potential
```

### Exposure Classification

| Net Displacement | Label | Implication |
|------------------|-------|-------------|
| > +30 | Displacement-dominant | Role likely shrinks; workers need transition plans |
| -30 to +30 | Contested | Outcome depends on adoption path; debatable |
| < -30 | Augmentation-dominant | Role likely enhanced; upskilling opportunity |

## Transparency

- Scores are illustrative for the MVP, applied manually via rubrics
- All sub-dimension scores are visible in the UI so users can see *why* a task scored high or low
- The methodology page is accessible from every occupation profile
- See [literature-and-indicators.md](literature-and-indicators.md) for caveats and simplifications
