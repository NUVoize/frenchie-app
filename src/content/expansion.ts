import raw from "../../frenchie-v2/frenchie_normal_french_content_expansion_v2/normal_french_content_expansion_v2.json";
export type ActivityItem = (typeof raw)[number];
export const activities: ActivityItem[] = raw;
export const activityLabels: Record<string, string> = {
  quiz: "Quiz",
  lecture: "Lecture",
  correction: "Correction",
  dictee_visuelle: "Dictée visuelle",
  production_ecrite: "Écriture",
};
export const normalizeAnswer = (value: string) =>
  value.normalize("NFC").replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
const searchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export const expansionChapters = Array.from(
  new Set(activities.map((a) => `${a.level}|${a.chapter}`)),
).map((key) => {
  const items = activities.filter((a) => `${a.level}|${a.chapter}` === key);
  return {
    key,
    level: items[0].level,
    title: items[0].chapter,
    module: items[0].module,
    items,
  };
});
export function searchActivities(query: string) {
  const words = searchText(query).split(/\s+/).filter(Boolean);
  return activities.filter((a) => {
    const index = searchText(
      [
        a.level,
        a.module,
        a.chapter,
        a.title,
        a.tags.join(" "),
        a.sentence,
        a.prompt,
        a.activity_type,
        activityLabels[a.activity_type],
      ].join(" "),
    );
    return words.every((word) => index.includes(word));
  });
}
export function chapterFor(item: ActivityItem) {
  return expansionChapters.find(
    (c) => c.level === item.level && c.title === item.chapter,
  )!;
}
