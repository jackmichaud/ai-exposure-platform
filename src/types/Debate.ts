export type PersonaId = "optimist" | "realist" | "skeptic" | "worker-advocate";

export interface DebateRound {
  round: 1 | 2 | 3;
  responses: Partial<Record<PersonaId, string>>;
}

export interface DebateSummary {
  keyTakeaways: string[];
  riskAssessment: {
    level: "low" | "moderate" | "high" | "critical";
    explanation: string;
  };
  recommendationsForWorkers: string[];
  projectedChanges: {
    skills: string;
    wages: string;
    employment: string;
  };
  areasOfAgreement: string[];
  areasOfDisagreement: string[];
}

export interface DebateState {
  topic: string | null;
  status: "idle" | "debating" | "summarizing" | "complete" | "error";
  rounds: DebateRound[];
  currentSpeaker: PersonaId | null;
  summary: DebateSummary | null;
  errorMessage: string | null;
}

export type DebateAction =
  | { type: "START_DEBATE"; payload: { occupationId: string } }
  | { type: "SET_SPEAKER"; payload: PersonaId | null }
  | { type: "APPEND_TOKEN"; payload: { personaId: PersonaId; token: string; round: 1 | 2 | 3 } }
  | { type: "COMPLETE_TURN"; payload: { personaId: PersonaId; round: number } }
  | { type: "SET_SUMMARY"; payload: DebateSummary }
  | { type: "SET_STATUS"; payload: DebateState["status"] }
  | { type: "SET_ERROR"; payload: string };
