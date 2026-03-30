# Adding a New Industry

Step-by-step guide for extending the platform with a new industry and its occupations.

## Step 1: Add the Industry

In `src/data/industries.json`, add a new entry:

```json
{
  "id": "retail",
  "name": "Retail",
  "description": "Brick-and-mortar and e-commerce retail operations",
  "occupationCount": 4
}
```

## Step 2: Add Occupations

In `src/data/occupations.json`, add occupation entries for the new industry. Every field below is required unless marked optional. See `../data/data-model.md` for type definitions.

```json
{
  "id": "cashier",
  "title": "Cashier",
  "industryId": "retail",
  "socCode": "41-2011",
  "medianWage": 29120,
  "educationLevel": "high-school",
  "description": "Operates cash registers and handles customer transactions",
  "tasks": [
    {
      "id": "process-transactions",
      "name": "Process transactions",
      "description": "Scan items, process payments, handle returns",
      "category": "cognitive",
      "timeWeight": 0.40,
      "llmExposureTier": "E2",
      "automationRisk": 85,
      "augmentationPotential": 30,
      "automationSubScores": {
        "routineness": 22, "dataIntensity": 20,
        "physicalBottleneck": 20, "socialBottleneck": 23
      },
      "augmentationSubScores": {
        "informationSynthesis": 5, "decisionSupport": 10,
        "creativeLeverage": 5, "productivityMultiplier": 10
      }
    }
  ],
  "skills": [
    { "id": "customer-service", "name": "Customer service", "impact": "displaced", "relevance": 70 },
    { "id": "pos-systems", "name": "POS systems", "impact": "transformed", "relevance": 85 }
  ],
  "exposureScore": {
    "overall": 82,
    "automationRisk": 82,
    "augmentationPotential": 35,
    "netDisplacement": 47,
    "complementarityScore": 20,
    "routineTaskIntensity": 1.8,
    "timeline": "near-term",
    "wageEffect": -15,
    "confidence": "high"
  },
  "bottleneckTaskIds": ["handle-complaints"],
  "similarOccupationIds": ["retail-salesperson"]
}
```

See `../data/data-model.md` for the full schema and `../data/scoring-methodology.md` for how to determine scores.

## Step 3: Verify

1. Start the dev server (`npm run dev`)
2. Check the dashboard — new industry should appear in the filter dropdown
3. Heatmap should display the new occupations
4. Click through to each occupation profile to verify data renders correctly

## Step 4: Update Documentation

1. Add the new industry and its occupations to `../data/occupations.md`
2. Update `occupationCount` in the industry entry to match
3. Update `CHANGELOG.md` with the addition

## Checklist

- [ ] Industry added to `industries.json`
- [ ] All occupations added to `occupations.json` with complete data
- [ ] Each occupation has 3+ tasks with scores
- [ ] Exposure scores follow the scoring methodology
- [ ] `similarOccupationIds` reference valid occupation IDs
- [ ] Dashboard renders correctly with new data
- [ ] Occupation profiles display properly
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
