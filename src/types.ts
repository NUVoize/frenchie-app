export type CategoryId =
  "definis" | "indefinis" | "partitifs" | "possessifs" | "demonstratifs";

export type QuizMode = "chapter" | "mini" | "final" | "review";

export type Screen =
  | "home"
  | "search"
  | "practice"
  | "quiz"
  | "results"
  | "mistakes"
  | "rules"
  | "settings"
  | "progress"
  | "lesson"
  | "expansion"
  | "quebec";

export type Question = {
  id: string;
  category: CategoryId;
  niveau: string;
  context: string;
  sentence: string;
  choices: string[];
  correct_answer: string;
  explanation_fr: string;
  explanation_en: string;
  common_mistake_fr: string;
  extra_example_fr: string;
  difficulty: number;
};

export type Chapter = {
  id: string;
  category: CategoryId;
  title: string;
  subtitle: string;
  offset: number;
};

export type QuizConfig = {
  mode: QuizMode;
  title: string;
  questions: Question[];
  chapterId?: string;
};

export type AnswerRecord = {
  question: Question;
  selectedAnswer: string;
  isCorrect: boolean;
};

export type CategoryStats = {
  attempts: number;
  correct: number;
};

export type StoredProgress = {
  categories: Record<CategoryId, CategoryStats>;
  completedChapters: string[];
  completedTests: number;
};

export type MistakeRecord = {
  id: string;
  questionId: string;
  sentence: string;
  category: CategoryId;
  selectedAnswer: string;
  correctAnswer: string;
  explanationFr: string;
  explanationEn: string;
  commonMistakeFr: string;
  extraExampleFr: string;
  count: number;
  lastSeen: string;
};

export type Settings = {
  soundEnabled: boolean;
  showEnglishAfterClickOnly: boolean;
};

export type RewardEvent =
  | "chapter_completed"
  | "chapter_perfect"
  | "test_completed"
  | "test_perfect"
  | "category_completed"
  | "category_mastered"
  | "full_exam_completed"
  | "full_exam_perfect"
  | "comeback_win"
  | "repeated_mistake";

export type Reward = {
  event: RewardEvent;
  message: string;
};
