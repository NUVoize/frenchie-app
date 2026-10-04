import { quebecItems, quebecTracks } from "./content/quebec-expansion";
import { readJson, writeJson } from "./storage";
export type QuebecItemState = {
  response: string;
  revealed: boolean;
  english: boolean;
  completed: boolean;
  mastered: boolean;
  updatedAt?: string;
  needsReview?: boolean;
};
export type QuebecPackProgress = Record<string, QuebecItemState>;
export const emptyQuebecItem = (): QuebecItemState => ({
  response: "",
  revealed: false,
  english: false,
  completed: false,
  mastered: false,
});
export function validQuebecPack(value: unknown): value is QuebecPackProgress {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.entries(value).every(
      ([id, s]) =>
        quebecItems.some((i) => i.id === id) &&
        s &&
        typeof s.response === "string" &&
        s.response.length <= 20000 &&
        (s.updatedAt === undefined ||
          (typeof s.updatedAt === "string" &&
            Number.isFinite(Date.parse(s.updatedAt)))) &&
        (s.needsReview === undefined || typeof s.needsReview === "boolean") &&
        ["revealed", "english", "completed", "mastered"].every(
          (k) => typeof s[k] === "boolean",
        ),
    )
  );
}
export function loadQuebecPack(): QuebecPackProgress {
  const value = readJson("frenchie_v2_quebec_pack", {});
  return validQuebecPack(value) ? value : {};
}
export function saveQuebecItem(id: string, state: QuebecItemState) {
  writeJson("frenchie_v2_quebec_pack", {
    ...loadQuebecPack(),
    [id]: { ...state, updatedAt: new Date().toISOString() },
  });
}
export function quebecReview(progress = loadQuebecPack()) {
  return quebecItems.filter(
    (i) =>
      i.activity_type !== "culture_card" &&
      (progress[i.id]?.needsReview ??
        (progress[i.id]?.revealed && !progress[i.id]?.mastered)),
  );
}
export function quebecDrafts(progress = loadQuebecPack()) {
  return quebecItems
    .filter((i) => progress[i.id]?.response && !progress[i.id]?.completed)
    .sort((a, b) =>
      (progress[b.id].updatedAt ?? "").localeCompare(
        progress[a.id].updatedAt ?? "",
      ),
    );
}
export function quebecTrackStats(progress = loadQuebecPack()) {
  return quebecTracks.map((track) => {
    const items = quebecItems.filter((i) => i.track === track);
    return {
      track,
      total: items.length,
      completed: items.filter((i) => progress[i.id]?.completed).length,
      mastered: items.filter((i) => progress[i.id]?.mastered).length,
    };
  });
}
