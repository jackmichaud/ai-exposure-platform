# Scoring Example: Registered Nurse

Worked example applying the scoring methodology to a single occupation. Reference this when scoring new occupations. See [scoring-methodology.md](scoring-methodology.md) for formulas and [indicator-definitions.md](indicator-definitions.md) for rubric tables.

## Occupation Context

- **Title**: Registered Nurse
- **Industry**: Healthcare
- **SOC**: 29-1141
- **Median wage**: $86,070
- **Education**: Bachelor's degree

## Task-Level Scoring

### Task 1: Patient Assessment (timeWeight: 0.30, category: interpersonal)

| Automation Sub-dimension | Score | Justification |
|--------------------------|-------|---------------|
| Routineness | 8 | Follows protocols but requires clinical judgment per patient |
| Data intensity | 15 | Vitals, charts, labs — structured but interpretation needed |
| Physical bottleneck | 5 | Requires physical presence and hands-on examination |
| Social bottleneck | 3 | Deep patient trust and communication essential |

**Automation risk**: 8 + 15 + (25-5) + (25-3) = **65**

| Augmentation Sub-dimension | Score | Justification |
|----------------------------|-------|---------------|
| Information synthesis | 20 | AI can cross-reference symptoms, history, drug interactions |
| Decision support | 18 | Clinical decision support systems aid triage |
| Creative leverage | 5 | Limited creative component |
| Productivity multiplier | 12 | AI can pre-screen and prioritize patients |

**Augmentation potential**: **55**. **LLM tier**: E2 (AI + tools assist). **Bottleneck**: No (automation risk not lowest).

### Task 2: Direct Patient Care (timeWeight: 0.35, category: physical)

| Auto Sub | Score | | Aug Sub | Score |
|----------|-------|-|---------|-------|
| Routineness | 10 | | Info synthesis | 8 |
| Data intensity | 10 | | Decision support | 10 |
| Physical bottleneck | 2 | | Creative leverage | 3 |
| Social bottleneck | 3 | | Productivity mult. | 8 |

**Automation risk**: 10 + 10 + 23 + 22 = **65**. But physical bottleneck is very high (score 2 = hard to automate), so the inverted formula captures this correctly — wait, the formula inverts: (25-2)=23, meaning digital tasks are easier. Physical presence makes this *harder* to automate. Actual auto risk = 10 + 10 + (25-2) + (25-3) = **55** ← corrected.

**Augmentation potential**: 8 + 10 + 3 + 8 = **29**. **LLM tier**: E0. **Bottleneck**: Yes (lowest automation risk + physical presence required).

### Task 3: Documentation & Charting (timeWeight: 0.20, category: cognitive)

| Auto Sub | Score | | Aug Sub | Score |
|----------|-------|-|---------|-------|
| Routineness | 20 | | Info synthesis | 15 |
| Data intensity | 22 | | Decision support | 5 |
| Physical bottleneck | 23 | | Creative leverage | 10 |
| Social bottleneck | 22 | | Productivity mult. | 22 |

**Automation risk**: 20 + 22 + (25-23) + (25-22) = **47**. Wait — high physical bottleneck (23) means it's nearly fully digital, so (25-23) = 2 means low bottleneck resistance. Recalculating: the formula as written: `routineness + data_intensity + (25 - physical_bottleneck) + (25 - social_bottleneck)`. Physical bottleneck score of 23 = *easy to automate* (fully digital). So: 20 + 22 + (25-23) + (25-22) = 20 + 22 + 2 + 3 = **47**. Hmm, that seems low for a highly routine digital task. The inverted bottleneck scores pull it down. Note: the raw sub-scores (routineness=20, dataIntensity=22) correctly indicate high automation potential; the bottleneck inversion means *lack* of bottleneck contributes less.

Correcting: physical bottleneck sub-score in the interface is already inverted ("high = easy to automate" per data-model.md). So we use the raw values directly: 20 + 22 + 23 + 22 = **87**.

**Augmentation potential**: 15 + 5 + 10 + 22 = **52**. **LLM tier**: E1 (LLM directly assists charting). **Bottleneck**: No.

### Task 4: Patient Education (timeWeight: 0.15, category: interpersonal)

| Auto Sub | Score | | Aug Sub | Score |
|----------|-------|-|---------|-------|
| Routineness | 12 | | Info synthesis | 18 |
| Data intensity | 8 | | Decision support | 10 |
| Physical bottleneck | 8 | | Creative leverage | 15 |
| Social bottleneck | 3 | | Productivity mult. | 14 |

**Automation risk**: 12 + 8 + 8 + 3 = **31**. **Augmentation potential**: 18 + 10 + 15 + 14 = **57**. **LLM tier**: E2. **Bottleneck**: Yes (low automation, high interpersonal need).

## Occupation-Level Rollup

Weighted average (`score × timeWeight`):

| Task | Weight | Auto Risk | Aug Potential |
|------|--------|-----------|---------------|
| Patient Assessment | 0.30 | 65 | 55 |
| Direct Patient Care | 0.35 | 55 | 29 |
| Documentation | 0.20 | 87 | 52 |
| Patient Education | 0.15 | 31 | 57 |

**Automation Risk** = (65×0.30 + 55×0.35 + 87×0.20 + 31×0.15) = 19.5 + 19.25 + 17.4 + 4.65 = **60.8 ≈ 61**

**Augmentation Potential** = (55×0.30 + 29×0.35 + 52×0.20 + 57×0.15) = 16.5 + 10.15 + 10.4 + 8.55 = **45.6 ≈ 46**

## Resulting ExposureScore

```json
{
  "overall": 62,
  "automationRisk": 61,
  "augmentationPotential": 46,
  "netDisplacement": 15,
  "complementarityScore": 55,
  "routineTaskIntensity": -0.3,
  "timeline": "mid-term",
  "wageEffect": 5,
  "confidence": "medium"
}
```

- **Net displacement**: +15 → **Contested** (between -30 and +30)
- **Bottleneck tasks**: `["direct-patient-care", "patient-education"]` — these require physical presence and interpersonal trust, creating a floor on human involvement
- **Complementarity**: 55 — nurses increasingly supervise AI-generated care plans and validate AI triage suggestions
- **Timeline**: Mid-term — AI charting tools deployed now, but broader clinical decision support needs regulatory approval
