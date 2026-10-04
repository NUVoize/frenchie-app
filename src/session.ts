import { chapters, loadQuestions } from "./data/questions";
import { readJson, writeJson } from "./storage";
import type { AnswerRecord, QuizConfig, QuizMode } from "./types";

const sessionKey = "frenchie_v2_sessions";
export type QuizSession = {
  id: string;
  quiz: QuizConfig;
  index: number;
  selected: string;
  validated: boolean;
  showEnglish: boolean;
  records: AnswerRecord[];
  updatedAt: string;
};
type StoredSession = {
  id: string;
  mode: QuizMode;
  title: string;
  chapterId?: string;
  questionIds: string[];
  answers: { questionId: string; selectedAnswer: string }[];
  selected: string;
  validated: boolean;
  showEnglish: boolean;
  updatedAt: string;
};
export function activityKey(quiz: QuizConfig) {
  return quiz.chapterId ? `chapter:${quiz.chapterId}` : quiz.mode;
}
export function createSession(quiz: QuizConfig): QuizSession {
  return {
    id: crypto.randomUUID(),
    quiz,
    index: 0,
    selected: "",
    validated: false,
    showEnglish: false,
    records: [],
    updatedAt: new Date().toISOString(),
  };
}
export function loadSessions(): QuizSession[] {
  const questions = new Map(loadQuestions().map((q) => [q.id, q]));
  const sessions: QuizSession[] = [];
  for (const stored of readJson<StoredSession[]>(sessionKey, [])) {
    if (
      !stored ||
      typeof stored.id !== "string" ||
      !["chapter", "mini", "final", "review"].includes(stored.mode) ||
      typeof stored.title !== "string" ||
      !Array.isArray(stored.questionIds) ||
      !Array.isArray(stored.answers) ||
      !Number.isFinite(Date.parse(stored.updatedAt))
    )
      continue;
    if (
      stored.mode === "chapter" &&
      !chapters.some((c) => c.id === stored.chapterId)
    )
      continue;
    if (
      !stored.questionIds.length ||
      stored.questionIds.length > 150 ||
      new Set(stored.questionIds).size !== stored.questionIds.length ||
      stored.questionIds.some((id) => !questions.has(id))
    )
      continue;
    const quizQuestions = stored.questionIds.map((id) => questions.get(id)!);
    if (stored.answers.length >= quizQuestions.length) continue;
    const records: AnswerRecord[] = [];
    for (let index = 0; index < stored.answers.length; index++) {
      const answer = stored.answers[index];
      const question = quizQuestions[index];
      if (
        !answer ||
        answer.questionId !== question.id ||
        !question.choices.includes(answer.selectedAnswer)
      )
        break;
      records.push({
        question,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: answer.selectedAnswer === question.correct_answer,
      });
    }
    if (records.length !== stored.answers.length) continue;
    const current = quizQuestions[records.length];
    const selected = current.choices.includes(stored.selected)
      ? stored.selected
      : "";
    const validated = Boolean(selected && stored.validated);
    sessions.push({
      id: stored.id,
      quiz: {
        mode: stored.mode,
        title: stored.title,
        questions: quizQuestions,
        chapterId: stored.mode === "chapter" ? stored.chapterId : undefined,
      },
      index: records.length,
      records,
      selected,
      validated,
      showEnglish: Boolean(validated && stored.showEnglish),
      updatedAt: stored.updatedAt,
    });
  }
  return sessions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function serialize(session: QuizSession): StoredSession {
  return {
    id: session.id,
    mode: session.quiz.mode,
    title: session.quiz.title,
    chapterId: session.quiz.chapterId,
    questionIds: session.quiz.questions.map((q) => q.id),
    answers: session.records.map((r) => ({
      questionId: r.question.id,
      selectedAnswer: r.selectedAnswer,
    })),
    selected: session.selected,
    validated: session.validated,
    showEnglish: session.showEnglish,
    updatedAt: session.updatedAt,
  };
}
export function saveSession(session: QuizSession): QuizSession[] {
  const remaining = loadSessions().filter(
    (s) => activityKey(s.quiz) !== activityKey(session.quiz),
  );
  const sessions = [
    { ...session, updatedAt: new Date().toISOString() },
    ...remaining,
  ];
  writeJson(sessionKey, sessions.map(serialize));
  return sessions;
}
export function clearSession(id: string): QuizSession[] {
  const sessions = loadSessions().filter((s) => s.id !== id);
  writeJson(sessionKey, sessions.map(serialize));
  return sessions;
}
