import type { AnswerRecord, CategoryId } from "./types";

export function calculateScore(records: AnswerRecord[]) {
  const correct = records.filter((record) => record.isCorrect).length;
  return {
    correct,
    total: records.length,
    percent: records.length ? Math.round((correct / records.length) * 100) : 0,
  };
}

export function scoreByCategory(records: AnswerRecord[]) {
  const result: Partial<Record<CategoryId, { correct: number; total: number; percent: number }>> = {};
  records.forEach((record) => {
    const current = result[record.question.category] ?? { correct: 0, total: 0, percent: 0 };
    current.total += 1;
    if (record.isCorrect) current.correct += 1;
    current.percent = Math.round((current.correct / current.total) * 100);
    result[record.question.category] = current;
  });
  return result;
}
