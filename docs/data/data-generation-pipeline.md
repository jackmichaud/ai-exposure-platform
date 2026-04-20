# Data Generation Pipeline

## Purpose

Scale the dataset from the initial hand-curated occupations to 50-100+ occupations with
consistent, data-grounded scoring. Uses O*NET survey data as quantitative anchors and
Claude as the scoring engine, with rollup formulas computed deterministically in the script.

## Architecture

```
O*NET Web Services API → structured survey data
       ↓
scripts/generate-occupation.ts
       ↓ (Claude with O*NET anchors)
Task-level sub-scores (0–25 each) + metadata
       ↓ (deterministic formulas in script)
automationRisk, augmentationPotential, overall, netDisplacement per task
       ↓ (weighted average)
Occupation ExposureScore
       ↓
scripts/output/<soc>.json → human review → src/data/occupations.json
```

## What O*NET provides (real data)

Fetched via the O*NET Web Services REST API (free, requires registration):

| Field | O*NET Endpoint | Maps to sub-dimension |
|-------|---------------|----------------------|
| Work Activities importance (1–5) | `/details/work_activities` | All 8 sub-dimensions |
| Work Context importance (1–5) | `/details/work_context` | physicalBottleneck, socialBottleneck |
| Task statements (top 15) | `/details/tasks` | Task list basis |
| Skills importance (top 10) | `/details/skills` | Skills array |
| Occupation title + description | `/occupations/{soc}` | title, description |

O*NET API: `services.onetcenter.org` — register for free credentials.

## What Claude provides (judgment)

Claude receives the full O*NET data and must:
- Group O*NET task statements into 3–5 representative tasks
- Assign each of the 8 sub-dimension scores, **explicitly anchored to the O*NET importance values**
- Classify each task as E0/E1/E2 (Eloundou et al. exposure tiers)
- Estimate routineTaskIntensity, complementarityScore, timeline, wageEffect, confidence
- Suggest similarOccupationIds from the existing dataset

## What the script computes (deterministic)

These values are recomputed from Claude's sub-scores to ensure formula integrity:

```
automationRisk (task)    = routineness + dataIntensity + physicalBottleneck + socialBottleneck
augmentationPotential (task) = informationSynthesis + decisionSupport + creativeLeverage + productivityMultiplier

automationRisk (occupation)    = Σ(task.automationRisk × task.timeWeight) / Σ(timeWeight)
augmentationPotential (occupation) = Σ(task.augmentationPotential × task.timeWeight) / Σ(timeWeight)
overall          = max(automationRisk, augmentationPotential)
netDisplacement  = automationRisk − augmentationPotential
```

## Usage

```bash
# Register at services.onetcenter.org for O*NET credentials
export ONET_USERNAME=your_username
export ONET_PASSWORD=your_password
export ANTHROPIC_API_KEY=sk-ant-...

# Generate a single occupation
npm run generate-occupation -- --soc 29-1141 --industry healthcare

# With wage override (from BLS OES data)
npm run generate-occupation -- --soc 23-1011 --industry legal --wage 148030
```

Output is written to `scripts/output/<soc>.json`. Review, strip the `_reasoning` field,
then copy into `src/data/occupations.json`.

## Target industries for expansion

| Industry | Current | Target | Priority |
|----------|---------|--------|----------|
| Healthcare | 6 | 10–12 | Expand |
| Finance & Insurance | 4 | 8–10 | Expand |
| Technology | 4 | 8–10 | Expand |
| Education | 3 | 6–8 | Expand |
| Manufacturing | 5 | 8–10 | Expand |
| Legal | 0 | 4–6 | New |
| Transportation & Logistics | 0 | 4–6 | New |
| Creative & Media | 0 | 4–6 | New |

## Cross-validation sources

Compare generated scores against these published datasets as a sanity check:

| Dataset | Coverage | Use for |
|---------|----------|---------|
| Felten AIOE index | 800+ occupations | Overall exposure ranking |
| Eloundou GPT tiers | 1,000+ occupations | E0/E1/E2 tier assignment |
| Frey & Osborne probabilities | 702 occupations | Automation risk ranking |

Scores that diverge significantly from all three warrant human review.

## Cost estimate

Per occupation: ~3,000 input tokens (O*NET data + rubric) + ~2,000 output tokens ≈ 5,000 tokens.
At 100 occupations: ~500K tokens. Estimated cost: < $2 using Claude Sonnet.
