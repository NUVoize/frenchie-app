import { chapters, loadQuestions } from "./data/questions";
import { practiceCategories, quebecExercises } from "./content/quebec-practice";
import { createBackup } from "./storage";
import { validExpansionProgress } from "./expansion-progress";
import { validQuebecPack } from "./quebec-pack-progress";

export type Backup = ReturnType<typeof createBackup>;
const fields = {
  quebecPack: "frenchie_v2_quebec_pack",
  expansion: "frenchie_v2_expansion",
  progress: "fr_a2_progress",
  mistakes: "fr_a2_mistakes",
  settings: "fr_a2_settings",
  history: "frenchie_v2_history",
  rewards: "fr_a2_easter_eggs_seen",
  quebec: "frenchie_v2_quebec",
  sessions: "frenchie_v2_sessions",
  quebecProgress: "frenchie_v2_quebec_progress",
  quebecSessions: "frenchie_v2_quebec_sessions",
} as const;
function check(condition: unknown): asserts condition {
  if (!condition)
    throw new Error(
      "Ce carnet contient des données incomplètes ou incompatibles. Tes progrès actuels sont conservés.",
    );
}
function object(value: unknown): asserts value is Record<string, any> {
  check(value !== null && typeof value === "object" && !Array.isArray(value));
}
const count = (n: unknown): n is number =>
  typeof n === "number" && Number.isSafeInteger(n) && n >= 0;
const text = (s: unknown): s is string =>
  typeof s === "string" && s.length < 10000;
const date = (s: unknown) => text(s) && Number.isFinite(Date.parse(s));
const list = (v: unknown): v is any[] => Array.isArray(v) && v.length < 100000;

/** Validate the complete file before touching browser data. Optional QC fields support early v2 exports. */
export function parseBackup(raw: string): Backup {
  if (raw.length > 5_000_000)
    throw new Error(
      "Ce fichier est trop volumineux pour un carnet Frenchie (5 Mo maximum).",
    );
  let b: Record<string, any>;
  try {
    const value: unknown = JSON.parse(raw);
    object(value);
    b = value;
  } catch {
    throw new Error(
      "Ce fichier n’est pas un carnet JSON lisible. Tes progrès actuels sont conservés.",
    );
  }
  if (b.app !== "Frenchie" || b.version !== 2)
    throw new Error("Choisis un carnet exporté par Frenchie version 2.");
  check(date(b.exportedAt));
  object(b.progress);
  object(b.progress.categories);
  for (const id of [
    "definis",
    "indefinis",
    "partitifs",
    "possessifs",
    "demonstratifs",
  ]) {
    const s = b.progress.categories[id];
    object(s);
    check(count(s.attempts) && count(s.correct) && s.correct <= s.attempts);
  }
  check(
    list(b.progress.completedChapters) &&
      b.progress.completedChapters.every((id: unknown) =>
        chapters.some((c) => c.id === id),
      ) &&
      count(b.progress.completedTests),
  );
  object(b.settings);
  check(
    typeof b.settings.soundEnabled === "boolean" &&
      typeof b.settings.showEnglishAfterClickOnly === "boolean",
  );
  object(b.history);
  check(
    count(b.history.englishHelp) &&
      count(b.history.reviewed) &&
      list(b.history.attempts),
  );
  for (const a of b.history.attempts) {
    object(a);
    check(
      text(a.id) &&
        text(a.activityId) &&
        ["chapter", "mini", "final", "review"].includes(a.mode) &&
        count(a.correct) &&
        count(a.total) &&
        a.total > 0 &&
        a.correct <= a.total &&
        date(a.date),
    );
  }
  check(list(b.rewards) && b.rewards.every(text));
  check(
    list(b.quebec) &&
      b.quebec.every((id: unknown) =>
        [
          "parle",
          "expressions",
          "sacres",
          "standard",
          "culture",
          "archives",
        ].includes(String(id)),
      ),
  );
  const questions = new Map(loadQuestions().map((q) => [q.id, q]));
  check(list(b.mistakes));
  for (const m of b.mistakes) {
    object(m);
    const q = questions.get(m.questionId);
    check(
      q &&
        m.category === q.category &&
        q.choices.includes(m.selectedAnswer) &&
        count(m.count) &&
        m.count > 0 &&
        date(m.lastSeen),
    );
    for (const key of [
      "id",
      "sentence",
      "correctAnswer",
      "explanationFr",
      "explanationEn",
      "commonMistakeFr",
      "extraExampleFr",
    ])
      check(text(m[key]));
  }
  check(list(b.sessions));
  const activities = new Set();
  for (const s of b.sessions) {
    object(s);
    check(
      text(s.id) &&
        text(s.title) &&
        date(s.updatedAt) &&
        ["chapter", "mini", "final", "review"].includes(s.mode),
    );
    if (s.mode === "chapter") check(chapters.some((c) => c.id === s.chapterId));
    const activity = s.mode === "chapter" ? s.chapterId : s.mode;
    check(!activities.has(activity));
    activities.add(activity);
    check(
      list(s.questionIds) &&
        s.questionIds.length > 0 &&
        s.questionIds.length <= 150 &&
        new Set(s.questionIds).size === s.questionIds.length &&
        s.questionIds.every((id: string) => questions.has(id)),
    );
    check(list(s.answers) && s.answers.length < s.questionIds.length);
    s.answers.forEach((a: unknown, i: number) => {
      object(a);
      check(
        a.questionId === s.questionIds[i] &&
          questions.get(s.questionIds[i])!.choices.includes(a.selectedAnswer),
      );
    });
    check(
      (s.selected === "" ||
        questions
          .get(s.questionIds[s.answers.length])!
          .choices.includes(s.selected)) &&
        typeof s.validated === "boolean" &&
        typeof s.showEnglish === "boolean" &&
        (!s.validated || s.selected !== ""),
    );
  }
  b.expansion ??= {};
  b.quebecPack ??= {};
  check(validQuebecPack(b.quebecPack));
  check(validExpansionProgress(b.expansion));
  b.quebecProgress ??= {};
  b.quebecSessions ??= {};
  object(b.quebecProgress);
  object(b.quebecSessions);
  for (const [id, value] of Object.entries(b.quebecProgress)) {
    object(value);
    check(
      practiceCategories.includes(id) &&
        count(value.best) &&
        value.best <= 100 &&
        count(value.attempts) &&
        value.attempts > 0,
    );
  }
  for (const [id, value] of Object.entries(b.quebecSessions)) {
    object(value);
    const qs = quebecExercises.filter((q) => q.category === id);
    check(
      qs.length &&
        list(value.answers) &&
        value.answers.length < qs.length &&
        value.answers.every((a: string, i: number) =>
          qs[i].choices.includes(a),
        ),
    );
    check(
      (value.selected === "" ||
        qs[value.answers.length].choices.includes(value.selected)) &&
        typeof value.validated === "boolean" &&
        typeof value.english === "boolean" &&
        (!value.validated || value.selected !== ""),
    );
  }
  // Select known app sections. Never accept storage key names from the file.
  return Object.fromEntries([
    ["app", "Frenchie"],
    ["version", 2],
    ["exportedAt", b.exportedAt],
    ...Object.keys(fields).map((key) => [key, b[key]]),
  ]) as Backup;
}

/** Store a recovery point first; roll back every changed key if a write fails. */
export function restoreBackup(backup: Backup): void {
  const validated = parseBackup(JSON.stringify(backup));
  const keys = [...Object.values(fields), "frenchie_v2_before_import"];
  const before = keys.map((key) => [key, localStorage.getItem(key)] as const);
  const written: string[] = [];
  try {
    localStorage.setItem(
      "frenchie_v2_before_import",
      JSON.stringify(createBackup()),
    );
    written.push("frenchie_v2_before_import");
    for (const [field, key] of Object.entries(fields)) {
      localStorage.setItem(
        key,
        JSON.stringify(validated[field as keyof Backup]),
      );
      written.push(key);
    }
  } catch {
    let restored = true;
    for (const key of written.reverse()) {
      const previous = before.find(([k]) => k === key)![1];
      try {
        if (previous === null) localStorage.removeItem(key);
        else localStorage.setItem(key, previous);
      } catch {
        restored = false;
      }
    }
    throw new Error(
      restored
        ? "Le navigateur n’a pas pu enregistrer ce carnet. Tes progrès actuels sont conservés."
        : "L’importation a été interrompue. Garde tes fichiers de sauvegarde et libère de l’espace avant de réessayer.",
    );
  }
}
export function recoveryBackup(): Backup | null {
  try {
    const raw = localStorage.getItem("frenchie_v2_before_import");
    return raw ? parseBackup(raw) : null;
  } catch {
    return null;
  }
}
