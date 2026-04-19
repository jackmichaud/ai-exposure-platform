import industriesData from "../data/industries.json";
import occupationsData from "../data/occupations.json";
import type {
  Industry,
  Occupation,
  EducationLevel,
  FilterParams,
  FilterOptions,
} from "../types";

const industries = industriesData as Industry[];
const occupations = occupationsData as Occupation[];

export function getIndustries(): Industry[] {
  return industries;
}

export function getOccupations(filters?: FilterParams): Occupation[] {
  let result = [...occupations];

  if (filters?.industryId !== undefined) {
    const ids = Array.isArray(filters.industryId)
      ? filters.industryId
      : [filters.industryId];
    result = result.filter((o) => ids.includes(o.industryId));
  }

  if (filters?.wageRange !== undefined) {
    const [min, max] = filters.wageRange;
    result = result.filter((o) => o.medianWage >= min && o.medianWage <= max);
  }

  if (filters?.educationLevel !== undefined) {
    result = result.filter((o) => o.educationLevel === filters.educationLevel);
  }

  if (filters?.timeline !== undefined) {
    result = result.filter(
      (o) => o.exposureScore.timeline === filters.timeline
    );
  }

  const sortBy = filters?.sortBy ?? "exposure";
  const sortOrder = filters?.sortOrder ?? (sortBy === "name" ? "asc" : "desc");
  const direction = sortOrder === "asc" ? 1 : -1;

  result.sort((a, b) => {
    if (sortBy === "exposure") {
      return direction * (a.exposureScore.overall - b.exposureScore.overall);
    }
    if (sortBy === "wage") {
      return direction * (a.medianWage - b.medianWage);
    }
    return direction * a.title.localeCompare(b.title);
  });

  return result;
}

export function getOccupation(id: string): Occupation | null {
  return occupations.find((o) => o.id === id) ?? null;
}

export function getSimilarOccupations(
  id: string,
  limit = 3
): Occupation[] {
  const source = getOccupation(id);
  if (!source) return [];

  const result: Occupation[] = [];

  for (const similarId of source.similarOccupationIds) {
    if (result.length >= limit) break;
    const occ = getOccupation(similarId);
    if (occ) result.push(occ);
  }

  // Fallback: fill remaining slots with same-industry occupations by closest exposure score
  if (result.length < limit) {
    const resultIds = new Set([id, ...result.map((o) => o.id)]);
    const fallbacks = occupations
      .filter((o) => o.industryId === source.industryId && !resultIds.has(o.id))
      .sort(
        (a, b) =>
          Math.abs(a.exposureScore.overall - source.exposureScore.overall) -
          Math.abs(b.exposureScore.overall - source.exposureScore.overall)
      );
    for (const occ of fallbacks) {
      if (result.length >= limit) break;
      result.push(occ);
    }
  }

  return result;
}

export function getFilterOptions(): FilterOptions {
  const wageValues = occupations.map((o) => o.medianWage);
  const educationOrder: EducationLevel[] = [
    "high-school",
    "associate",
    "bachelor",
    "master",
    "doctoral",
  ];
  const presentLevels = new Set(occupations.map((o) => o.educationLevel));

  return {
    industries: industries.map(({ id, name }) => ({ id, name })),
    wageRange: {
      min: Math.min(...wageValues),
      max: Math.max(...wageValues),
    },
    educationLevels: educationOrder.filter((l) => presentLevels.has(l)),
  };
}
