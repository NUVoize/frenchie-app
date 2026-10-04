import { practiceCategories, quebecExercises } from "./content/quebec-practice";
import { readJson, writeJson } from "./storage";
export type QuebecProgress = Record<string, { best: number; attempts: number }>;
export function loadQuebecProgress(): QuebecProgress {
  const raw = readJson<QuebecProgress>("frenchie_v2_quebec_progress", {});
  const clean: QuebecProgress = {};
  for (const id of practiceCategories) {
    const value = raw[id];
    if (
      value &&
      Number.isInteger(value.best) &&
      value.best >= 0 &&
      value.best <= 100 &&
      Number.isInteger(value.attempts) &&
      value.attempts > 0
    )
      clean[id] = value;
  }
  return clean;
}
export function saveQuebecAttempt(
  category: string,
  answers: string[],
): QuebecProgress {
  const questions = quebecExercises.filter((q) => q.category === category);
  const progress = loadQuebecProgress();
  if (
    !questions.length ||
    answers.length !== questions.length ||
    answers.some((answer, i) => !questions[i].choices.includes(answer))
  )
    return progress;
  const score = Math.round(
    (100 * answers.filter((a, i) => a === questions[i].answer).length) /
      questions.length,
  );
  progress[category] = {
    best: Math.max(progress[category]?.best ?? 0, score),
    attempts: (progress[category]?.attempts ?? 0) + 1,
  };
  writeJson("frenchie_v2_quebec_progress", progress);
  return progress;
}
export function beltLevel(progress: QuebecProgress) {
  let level = 0;
  for (const id of practiceCategories) {
    if ((progress[id]?.best ?? 0) < 75) break;
    level++;
  }
  return level;
}
