import { activities } from "./content/expansion";
import { readJson, writeJson } from "./storage";
export type ActivityProgress = {
  response: string;
  revealed: boolean;
  english: boolean;
  completed: boolean;
  correct: boolean | null;
  updatedAt?: string;
  needsReview?: boolean;
};
export type ExpansionProgress = Record<string, ActivityProgress>;
export const emptyActivity = (): ActivityProgress => ({
  response: "",
  revealed: false,
  english: false,
  completed: false,
  correct: null,
});
export function validExpansionProgress(
  value: unknown,
): value is ExpansionProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.entries(value).every(
    ([id, p]) =>
      activities.some((a) => a.id === id) &&
      p &&
      typeof p.response === "string" &&
      p.response.length <= 20000 &&
      (p.updatedAt === undefined ||
        (typeof p.updatedAt === "string" &&
          Number.isFinite(Date.parse(p.updatedAt)))) &&
      (p.needsReview === undefined || typeof p.needsReview === "boolean") &&
      ["revealed", "english", "completed"].every(
        (k) => typeof p[k] === "boolean",
      ) &&
      (p.correct === null || typeof p.correct === "boolean"),
  );
}
export function loadExpansionProgress(): ExpansionProgress {
  const raw = readJson<ExpansionProgress>("frenchie_v2_expansion", {});
  return validExpansionProgress(raw) ? raw : {};
}
export function saveActivity(id: string, value: ActivityProgress) {
  writeJson("frenchie_v2_expansion", {
    ...loadExpansionProgress(),
    [id]: { ...value, updatedAt: new Date().toISOString() },
  });
}
export function expansionReview(progress = loadExpansionProgress()) {
  return activities.filter(
    (a) =>
      a.activity_type !== "production_ecrite" &&
      (progress[a.id]?.needsReview ?? progress[a.id]?.correct === false),
  );
}
export function expansionDrafts(progress = loadExpansionProgress()) {
  return activities
    .filter((a) => progress[a.id]?.response && !progress[a.id]?.completed)
    .sort((a, b) =>
      (progress[b.id].updatedAt ?? "").localeCompare(
        progress[a.id].updatedAt ?? "",
      ),
    );
}
