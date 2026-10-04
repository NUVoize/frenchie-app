import type {
  AnswerRecord,
  CategoryId,
  MistakeRecord,
  Settings,
  StoredProgress,
  QuizMode,
} from "./types";

const progressKey = "fr_a2_progress";
const mistakesKey = "fr_a2_mistakes";
const settingsKey = "fr_a2_settings";
const rewardsKey = "fr_a2_easter_eggs_seen";
const historyKey = "frenchie_v2_history";
const categories: CategoryId[] = [
  "definis",
  "indefinis",
  "partitifs",
  "possessifs",
  "demonstratifs",
];
export type Attempt = {
  id: string;
  activityId: string;
  mode: QuizMode;
  correct: number;
  total: number;
  date: string;
};
export type LearningHistory = {
  attempts: Attempt[];
  englishHelp: number;
  reviewed: number;
};

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value: unknown = JSON.parse(raw);
    if (Array.isArray(fallback))
      return (Array.isArray(value) ? value : fallback) as T;
    return value && typeof value === "object" && !Array.isArray(value)
      ? { ...fallback, ...value }
      : fallback;
  } catch {
    return fallback;
  }
}
export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    window.dispatchEvent(new Event("frenchie-storage-error"));
  }
}
export function emptyProgress(): StoredProgress {
  return {
    categories: Object.fromEntries(
      categories.map((category) => [category, { attempts: 0, correct: 0 }]),
    ) as StoredProgress["categories"],
    completedChapters: [],
    completedTests: 0,
  };
}
export function loadProgress(): StoredProgress {
  const saved = readJson(progressKey, emptyProgress());
  const progress = emptyProgress();
  for (const category of categories) {
    const stats = saved.categories?.[category];
    if (
      stats &&
      Number.isFinite(stats.attempts) &&
      Number.isFinite(stats.correct)
    ) {
      progress.categories[category] = {
        attempts: Math.max(0, stats.attempts),
        correct: Math.min(
          Math.max(0, stats.correct),
          Math.max(0, stats.attempts),
        ),
      };
    }
  }
  progress.completedChapters = Array.isArray(saved.completedChapters)
    ? saved.completedChapters.filter((id) => typeof id === "string")
    : [];
  progress.completedTests = Number.isFinite(saved.completedTests)
    ? Math.max(0, saved.completedTests)
    : 0;
  return progress;
}
export function saveProgress(progress: StoredProgress) {
  writeJson(progressKey, progress);
}
export function updateProgress(
  records: AnswerRecord[],
  chapterId?: string,
  mode: QuizMode = chapterId ? "chapter" : "mini",
): StoredProgress {
  const progress = loadProgress();
  records.forEach((record) => {
    const stats = progress.categories[record.question.category];
    stats.attempts++;
    if (record.isCorrect) stats.correct++;
  });
  if (chapterId && !progress.completedChapters.includes(chapterId))
    progress.completedChapters.push(chapterId);
  if (mode === "mini" || mode === "final") progress.completedTests++;
  saveProgress(progress);
  return progress;
}
export function loadMistakes(): MistakeRecord[] {
  return readJson<MistakeRecord[]>(mistakesKey, []).filter(
    (item) =>
      item &&
      typeof item.questionId === "string" &&
      categories.includes(item.category),
  );
}
export function recordMistakes(
  records: AnswerRecord[],
  reviewing = false,
): MistakeRecord[] {
  const previous = loadMistakes();
  const corrected = new Set(
    reviewing
      ? records.filter((r) => r.isCorrect).map((r) => r.question.id)
      : [],
  );
  const mistakes = previous.filter((m) => !corrected.has(m.questionId));
  if (corrected.size) {
    const history = loadHistory();
    history.reviewed += previous.length - mistakes.length;
    writeJson(historyKey, history);
  }
  records
    .filter((record) => !record.isCorrect)
    .forEach((record) => {
      const existing = mistakes.find(
        (m) => m.questionId === record.question.id,
      );
      if (existing) {
        existing.selectedAnswer = record.selectedAnswer;
        existing.count++;
        existing.lastSeen = new Date().toISOString();
      } else
        mistakes.unshift({
          id: crypto.randomUUID(),
          questionId: record.question.id,
          sentence: record.question.sentence,
          category: record.question.category,
          selectedAnswer: record.selectedAnswer,
          correctAnswer: record.question.correct_answer,
          explanationFr: record.question.explanation_fr,
          explanationEn: record.question.explanation_en,
          commonMistakeFr: record.question.common_mistake_fr,
          extraExampleFr: record.question.extra_example_fr,
          count: 1,
          lastSeen: new Date().toISOString(),
        });
    });
  writeJson(mistakesKey, mistakes);
  return mistakes;
}
export function clearMistakes() {
  writeJson(mistakesKey, []);
}
export function loadSettings(): Settings {
  return readJson(settingsKey, {
    soundEnabled: false,
    showEnglishAfterClickOnly: true,
  });
}
export function saveSettings(settings: Settings) {
  writeJson(settingsKey, settings);
}
export function loadSeenRewards(): string[] {
  return readJson<string[]>(rewardsKey, []).filter(
    (item) => typeof item === "string",
  );
}
export function saveSeenRewards(events: string[]) {
  writeJson(rewardsKey, events);
}
export function loadHistory(): LearningHistory {
  const history = readJson<LearningHistory>(historyKey, {
    attempts: [],
    englishHelp: 0,
    reviewed: 0,
  });
  return {
    attempts: Array.isArray(history.attempts)
      ? history.attempts.filter(
          (a) =>
            a &&
            typeof a.id === "string" &&
            typeof a.date === "string" &&
            Number.isFinite(a.correct) &&
            Number.isFinite(a.total) &&
            a.total > 0,
        )
      : [],
    englishHelp: Number.isFinite(history.englishHelp) ? history.englishHelp : 0,
    reviewed: Number.isFinite(history.reviewed) ? history.reviewed : 0,
  };
}
export function recordAttempt(
  records: AnswerRecord[],
  mode: QuizMode,
  activityId: string,
) {
  const history = loadHistory();
  history.attempts.push({
    id: crypto.randomUUID(),
    activityId,
    mode,
    correct: records.filter((r) => r.isCorrect).length,
    total: records.length,
    date: new Date().toISOString(),
  });
  writeJson(historyKey, history);
}
export function recordEnglishHelp() {
  const history = loadHistory();
  history.englishHelp++;
  writeJson(historyKey, history);
}
export function activitySummaries(attempts = loadHistory().attempts) {
  const summaries: Record<
    string,
    { attempts: number; best: number; lastDate: string }
  > = {};
  for (const attempt of attempts) {
    const previous = summaries[attempt.activityId] ?? {
      attempts: 0,
      best: 0,
      lastDate: "",
    };
    summaries[attempt.activityId] = {
      attempts: previous.attempts + 1,
      best: Math.max(
        previous.best,
        Math.round((attempt.correct / attempt.total) * 100),
      ),
      lastDate:
        attempt.date > previous.lastDate ? attempt.date : previous.lastDate,
    };
  }
  return summaries;
}
export function createBackup() {
  return {
    app: "Frenchie",
    version: 2,
    exportedAt: new Date().toISOString(),
    progress: loadProgress(),
    mistakes: loadMistakes(),
    settings: loadSettings(),
    history: loadHistory(),
    rewards: loadSeenRewards(),
    quebec: readJson<string[]>("frenchie_v2_quebec", []),
    quebecProgress: readJson("frenchie_v2_quebec_progress", {}),
    quebecSessions: readJson("frenchie_v2_quebec_sessions", {}),
    sessions: readJson<unknown[]>("frenchie_v2_sessions", []),
    expansion: readJson("frenchie_v2_expansion", {}),
    quebecPack: readJson("frenchie_v2_quebec_pack", {}),
  };
}
export function resetAllData() {
  [
    progressKey,
    mistakesKey,
    settingsKey,
    rewardsKey,
    historyKey,
    "frenchie_v2_quebec",
    "frenchie_v2_quebec_progress",
    "frenchie_v2_quebec_sessions",
    "frenchie_v2_before_import",
    "frenchie_v2_expansion",
    "frenchie_v2_quebec_pack",
    "frenchie_v2_sessions",
  ].forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      window.dispatchEvent(new Event("frenchie-storage-error"));
    }
  });
}
