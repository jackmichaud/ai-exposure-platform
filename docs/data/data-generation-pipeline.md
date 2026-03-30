# Data Generation Pipeline

## Purpose

Scale the dataset from the initial 19 hand-curated occupations to 50-100+ occupations with consistent scoring quality. Uses O*NET structural data as input and Claude as a scoring engine, with human review for quality assurance.

## Pipeline Overview

```
O*NET + BLS data → Structured input → Claude scoring → JSON output → Human review → occupations.json
```

## Step 1: Structural Data Collection

Pull occupation metadata programmatically from public sources:

| Field | Source | Method |
|-------|--------|--------|
| SOC code, title, description | O*NET (onetonline.org) | Web Services API or bulk CSV download |
| Task descriptions + importance | O*NET Task Statements | API by SOC code |
| Skills + importance ratings | O*NET Skills | API by SOC code |
| Median wage, employment count | BLS OES (bls.gov/oes) | Annual CSV download |
| Education level | O*NET Education/Training | API by SOC code |

**O*NET API**: Free, requires registration at `services.onetcenter.org`. Returns JSON. Rate limit: 3 req/sec.

**BLS data**: Download `oesm_nat.xlsx` from `bls.gov/oes/tables.htm`. Join on SOC code.

### Target industries for expansion

| Industry | Current | Target | Priority |
|----------|---------|--------|----------|
| Healthcare | 4 | 8-10 | Expand |
| Finance & Insurance | 4 | 8-10 | Expand |
| Technology | 4 | 8-10 | Expand |
| Education | 3 | 6-8 | Expand |
| Manufacturing | 4 | 8-10 | Expand |
| Legal | 0 | 4-6 | New |
| Transportation & Logistics | 0 | 4-6 | New |
| Creative & Media | 0 | 4-6 | New |

## Step 2: Claude Scoring

For each occupation, send O*NET task data to Claude with our rubric and receive scored output.

### Input format

```
Occupation: {title} ({socCode})
Industry: {industry}
Median wage: {wage}
Education: {education}

Tasks from O*NET (with importance/frequency ratings):
1. {task_description} — Importance: {1-5}, Frequency: {1-5}
2. ...

Skills from O*NET:
1. {skill_name} — Importance: {1-5}
2. ...
```

### Scoring prompt (system)

```
You are an expert labor economist scoring occupations for AI exposure using
a structured rubric. For each task, score 8 sub-dimensions (0-25 each).
Be consistent across occupations. Reference the rubric definitions exactly.

Output valid JSON matching the Occupation interface. Include justifications
for each sub-score as a separate "reasoning" field (stripped before production use).
```

The user prompt includes the full rubric tables from `indicator-definitions.md` and the worked example from `scoring-example.md` as a reference point for calibration.

### Output format

Claude returns a complete `Occupation` JSON object per our data model, plus a `_reasoning` field:

```json
{
  "id": "paralegal",
  "title": "Paralegal",
  "tasks": [{ "...all fields per data-model.md..." }],
  "exposureScore": { "...all fields..." },
  "_reasoning": {
    "task-legal-research": {
      "routineness": "Score 18: follows established search patterns but requires judgment on relevance..."
    }
  }
}
```

### Calibration

- Include 2-3 already-scored occupations (e.g., Registered Nurse, Software Developer) in the prompt as few-shot examples
- Run each occupation through Claude twice and flag any sub-score with >5 point divergence for human review
- Use `temperature: 0` for consistency

## Step 3: Human Review

### Review process

1. **Auto-pass**: Scores where both runs agree within 5 points on all sub-dimensions
2. **Flag for review**: Any sub-score divergence >5, any occupation where `netDisplacement` sign flips between runs, or any `confidence: "low"` output
3. **Cross-validate**: Compare `automationRisk` rankings against Felten et al. AIOE index and Eloundou et al. GPT exposure tiers (available by SOC code). Flag occupations that rank very differently.

### Academic cross-validation sources

| Dataset | Coverage | Available at |
|---------|----------|-------------|
| Felten AIOE index | 800+ occupations | Published paper supplementary data |
| Eloundou GPT exposure | 1,000+ occupations | arXiv:2303.10130 supplementary |
| Frey & Osborne probabilities | 702 occupations | Published paper appendix |

These are used for **validation only** — our scores use our own rubric, not theirs.

## Step 4: Integration

1. Merge reviewed JSON into `src/data/occupations.json`
2. Add new industries to `src/data/industries.json`
3. Pre-compute `similarOccupationIds` using the Jaccard algorithm (see `../features/occupation-profile.md`)
4. Run the dev server and verify heatmap, profiles, and filters

## Pipeline Script Location

Place in `scripts/generate-occupation-data.ts`. Not part of the production bundle.

## Cost Estimate

Per occupation: ~2,000 input tokens (task list + rubric) × 2 runs + ~3,000 output tokens × 2 runs = ~10,000 tokens total. At 100 occupations: ~1M tokens. Estimated cost: < $5 using Claude Sonnet.
