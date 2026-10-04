import { loadSeenRewards, saveSeenRewards } from "./storage";
import { chapters } from "./data/questions";
import type {
  AnswerRecord,
  QuizMode,
  Reward,
  RewardEvent,
  StoredProgress,
} from "./types";

const messages: Record<RewardEvent, string> = {
  chapter_completed: "Chapitre terminé. Un petit pas de plus !",
  chapter_perfect: "100 %. Tu peux être fier de toi !",
  test_completed: "Test terminé. Bravo pour ton effort !",
  test_perfect:
    "Parfait. On va bientôt te laisser corriger les menus de restaurant.",
  category_completed: "Catégorie complétée. Ça commence à rentrer.",
  category_mastered: "Maîtrise solide. Le déterminant tremble devant toi.",
  full_exam_completed: "Examen final terminé. Va boire de l’eau.",
  full_exam_perfect: "Examen parfait. On imprime un diplôme imaginaire.",
  comeback_win: "Belle remontée. On garde le calme et on continue.",
  repeated_mistake:
    "Cette notion mérite un autre regard. On la revoit ensemble ?",
};

export function checkRewardTriggers(
  mode: QuizMode,
  records: AnswerRecord[],
  progress: StoredProgress,
  hasRepeatedMistake = false,
): Reward[] {
  const seen = loadSeenRewards();
  const events: RewardEvent[] = [];
  const perfect = records.every((record) => record.isCorrect);

  if (mode === "chapter") events.push("chapter_completed");
  if (mode === "chapter" && perfect) events.push("chapter_perfect");
  if (mode === "mini") events.push("test_completed");
  if (mode === "mini" && perfect) events.push("test_perfect");
  if (mode === "final") events.push("full_exam_completed");
  if (mode === "final" && perfect) events.push("full_exam_perfect");
  if (hasRepeatedMistake) events.push("repeated_mistake");

  const touchedCategories = [
    ...new Set(records.map((record) => record.question.category)),
  ];
  touchedCategories.forEach((category) => {
    const stats = progress.categories[category];
    const complete = chapters
      .filter((chapter) => chapter.category === category)
      .every((chapter) => progress.completedChapters.includes(chapter.id));
    if (complete) events.push("category_completed");
    if (
      complete &&
      stats.attempts >= 20 &&
      stats.correct / stats.attempts >= 0.85
    )
      events.push("category_mastered");
  });

  const firstHalf = records.slice(0, Math.floor(records.length / 2));
  const secondHalf = records.slice(Math.floor(records.length / 2));
  if (
    firstHalf.length > 0 &&
    secondHalf.length > 0 &&
    accuracy(firstHalf) < 0.6 &&
    accuracy(secondHalf) >= 0.8
  ) {
    events.push("comeback_win");
  }

  const newEvents = [...new Set(events)].filter(
    (event) => !seen.includes(event),
  );
  saveSeenRewards([...new Set([...seen, ...newEvents])]);
  return newEvents.map((event) => ({ event, message: messages[event] }));
}

function accuracy(records: AnswerRecord[]): number {
  return records.filter((record) => record.isCorrect).length / records.length;
}
