export type EducationLevel =
  | "high-school"
  | "associate"
  | "bachelor"
  | "master"
  | "doctoral";

export interface Task {
  id: string;
  name: string;
  description: string;
  category: "cognitive" | "physical" | "interpersonal";
  timeWeight: number;
  llmExposureTier: "E0" | "E1" | "E2";
  automationRisk: number;
  augmentationPotential: number;
  automationSubScores: {
    routineness: number;
    dataIntensity: number;
    physicalBottleneck: number;
    socialBottleneck: number;
  };
  augmentationSubScores: {
    informationSynthesis: number;
    decisionSupport: number;
    creativeLeverage: number;
    productivityMultiplier: number;
  };
}

export interface ExposureScore {
  overall: number;
  automationRisk: number;
  augmentationPotential: number;
  netDisplacement: number;
  complementarityScore: number;
  routineTaskIntensity: number;
  timeline: "near-term" | "mid-term" | "long-term";
  wageEffect: number;
  confidence: "low" | "medium" | "high";
}

export interface Skill {
  id: string;
  name: string;
  impact: "gained" | "displaced" | "transformed";
  relevance: number;
}

export interface Occupation {
  id: string;
  title: string;
  industryId: string;
  socCode?: string;
  medianWage: number;
  educationLevel: EducationLevel;
  description: string;
  tasks: Task[];
  skills: Skill[];
  exposureScore: ExposureScore;
  bottleneckTaskIds: string[];
  similarOccupationIds: string[];
}
