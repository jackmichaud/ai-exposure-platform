import type { EducationLevel } from "./Occupation";

export interface FilterState {
  industry: string | null;
  wageRange: [number, number];
  educationLevel: string | null;
  timeline: "near-term" | "mid-term" | "long-term";
  sortBy: "exposure" | "wage" | "name";
}

export type FilterAction =
  | { type: "SET_INDUSTRY"; payload: string | null }
  | { type: "SET_WAGE_RANGE"; payload: [number, number] }
  | { type: "SET_EDUCATION"; payload: string | null }
  | { type: "SET_TIMELINE"; payload: "near-term" | "mid-term" | "long-term" }
  | { type: "SET_SORT"; payload: { sortBy: "exposure" | "wage" | "name"; sortOrder?: "asc" | "desc" } }
  | { type: "RESET" };

export interface FilterParams {
  industryId?: string | string[];
  wageRange?: [number, number];
  educationLevel?: EducationLevel;
  timeline?: "near-term" | "mid-term" | "long-term";
  sortBy?: "exposure" | "wage" | "name";
  sortOrder?: "asc" | "desc";
}

export interface FilterOptions {
  industries: { id: string; name: string }[];
  wageRange: { min: number; max: number };
  educationLevels: EducationLevel[];
}
