# Data Model

## Core Entities

### Industry

```typescript
interface Industry {
  id: string;                    // e.g., "healthcare"
  name: string;                  // e.g., "Healthcare"
  description: string;           // Brief industry description
  occupationCount: number;       // Number of occupations tracked
}
```

### Occupation

```typescript
interface Occupation {
  id: string;                    // e.g., "registered-nurse"
  title: string;                 // e.g., "Registered Nurse"
  industryId: string;            // FK to Industry
  socCode?: string;              // Standard Occupational Classification code
  medianWage: number;            // Annual median wage in USD
  educationLevel: EducationLevel;
  description: string;           // What this occupation does
  tasks: Task[];                 // Task-level breakdown
  skills: Skill[];               // Relevant skills with impact classification
  exposureScore: ExposureScore;  // Aggregate AI exposure metrics
  bottleneckTaskIds: string[];   // Task IDs hardest to automate (floor on human involvement)
  similarOccupationIds: string[]; // IDs of related occupations
}
```

### Task

```typescript
interface Task {
  id: string;
  name: string;                  // e.g., "Patient assessment"
  description: string;
  category: "cognitive" | "physical" | "interpersonal";
  timeWeight: number;            // Proportion of time spent (0-1), from O*NET or estimate
  llmExposureTier: "E0" | "E1" | "E2"; // Eloundou et al. exposure classification
  automationRisk: number;        // 0-100 (sum of 4 sub-dimensions)
  augmentationPotential: number; // 0-100 (sum of 4 sub-dimensions)
  automationSubScores: {
    routineness: number;         // 0-25
    dataIntensity: number;       // 0-25
    physicalBottleneck: number;  // 0-25 (inverted: high = easy to automate)
    socialBottleneck: number;    // 0-25 (inverted: high = easy to automate)
  };
  augmentationSubScores: {
    informationSynthesis: number;  // 0-25
    decisionSupport: number;       // 0-25
    creativeLeverage: number;      // 0-25
    productivityMultiplier: number; // 0-25
  };
}
```

### ExposureScore

```typescript
interface ExposureScore {
  overall: number;               // 0-100, max(automationRisk, augmentationPotential)
  automationRisk: number;        // 0-100, weighted avg of task scores
  augmentationPotential: number; // 0-100, weighted avg of task scores
  netDisplacement: number;       // -100 to +100, automationRisk - augmentationPotential
  complementarityScore: number;  // 0-100, benefit from working *with* AI
  routineTaskIntensity: number;  // RTI value, continuous
  timeline: "near-term" | "mid-term" | "long-term";
  wageEffect: number;            // Projected % change (-50 to +50)
  confidence: "low" | "medium" | "high";
}
```

### Skill

```typescript
interface Skill {
  id: string;
  name: string;                  // e.g., "Data analysis"
  impact: "gained" | "displaced" | "transformed";
  relevance: number;             // 0-100, how relevant to the occupation
}
```

## Enums

```typescript
type EducationLevel =
  | "high-school"
  | "associate"
  | "bachelor"
  | "master"
  | "doctoral";
```

## Relationships

- An **Industry** has many **Occupations**
- An **Occupation** has many **Tasks** and **Skills**
- An **Occupation** has one **ExposureScore** (derived from task scores)
- **Bottleneck tasks** are a subset of the occupation's tasks (lowest automation risk)
- **Similar occupations** is a many-to-many self-reference

## Storage Format

For MVP, all data is stored as static JSON in `src/data/`:
- `industries.json` — Array of Industry objects
- `occupations.json` — Array of Occupation objects (tasks, skills, and scores embedded)

See `../api/data-api.md` for the access layer.
See `scoring-methodology.md` and `literature-and-indicators.md` for how scores are derived.
