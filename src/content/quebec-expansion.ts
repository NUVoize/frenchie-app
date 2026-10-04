import pack from "../../frenchie-v2/frenchie_quebec_content_expansion_v1/frenchie_quebec_content_expansion_v1/quebec_mode_content_expansion_v1.json";
export type QuebecItem = (typeof pack.items)[number];
export const quebecItems = pack.items.filter(
  (item) => item.activity_type !== "final_exam_spec",
);
export const quebecTracks = Array.from(
  new Set(quebecItems.map((item) => item.track)),
);
export const finalExamSpec = pack.items.find(
  (item) => item.activity_type === "final_exam_spec",
)!;
export const trackByCategory: Record<string, string> = {
  parle: "Québec parlé",
  expressions: "Expressions québécoises",
  sacres: "Sacres et intensité",
  standard: "Standard vs parlé",
  culture: "Culture comique et archives",
  archives: "Culture comique et archives",
};
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function searchQuebecItems(query: string, track = "") {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return quebecItems.filter(
    (i) =>
      (!track || i.track === track) &&
      words.every((w) =>
        normalize(
          [
            i.title,
            i.chapter,
            i.track,
            i.spoken_quebec,
            i.standard_french,
            i.prompt,
            i.tags.join(" "),
          ].join(" "),
        ).includes(w),
      ),
  );
}
// All provided media links are research candidates, not independently verified clips.
export function externalCandidate(item: QuebecItem) {
  try {
    const url = new URL(item.external_url);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
