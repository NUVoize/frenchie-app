const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
test("choice order is stable, preserves choices and spreads correct answers across positions", () => {
  const e = environment();
  const { orderedChoices } = e.load("src/practice-utils.ts");
  const { activities } = e.load("src/content/expansion.ts");
  const positions = new Set();
  for (const a of activities.filter((a) => a.choices.length)) {
    const result = orderedChoices(a.id, a.choices);
    assert.equal(
      JSON.stringify(result),
      JSON.stringify(orderedChoices(a.id, a.choices)),
    );
    assert.equal([...result].sort().join("|"), [...a.choices].sort().join("|"));
    positions.add(result.indexOf(a.correct_answer));
  }
  assert.equal(positions.size, 4);
});
test("normal expansion keeps a review pending through retry and clears it after correction", () => {
  const e = environment();
  const p = e.load("src/expansion-progress.ts");
  const id = "a2-present-review-001";
  p.saveActivity(id, {
    ...p.emptyActivity(),
    response: "habites",
    revealed: true,
    completed: true,
    correct: false,
  });
  assert.equal(p.expansionReview().length, 1);
  p.saveActivity(id, { ...p.emptyActivity(), needsReview: true });
  assert.equal(p.expansionReview().length, 1);
  p.saveActivity(id, {
    ...p.emptyActivity(),
    response: "habite",
    revealed: true,
    completed: true,
    correct: true,
    needsReview: false,
  });
  assert.equal(p.expansionReview().length, 0);
  p.saveActivity("b1-production-ecrite-001", {
    ...p.emptyActivity(),
    response: "Bonjour",
  });
  assert.equal(p.expansionDrafts()[0].id, "b1-production-ecrite-001");
  assert.equal(p.expansionReview().length, 0);
});
test("Québec review tracks the latest miss even after an earlier successful answer", () => {
  const e = environment();
  const p = e.load("src/quebec-pack-progress.ts");
  const id = "qc-parle-transformation-001";
  p.saveQuebecItem(id, {
    ...p.emptyQuebecItem(),
    response: "Je vais dormir.",
    mastered: true,
    revealed: true,
    completed: true,
    needsReview: true,
  });
  assert.equal(p.quebecReview().length, 1);
  p.saveQuebecItem(id, {
    ...p.emptyQuebecItem(),
    response: "Je suis fatigué.",
    mastered: true,
    needsReview: true,
  });
  assert.equal(p.quebecDrafts()[0].id, id);
  p.saveQuebecItem(id, {
    ...p.emptyQuebecItem(),
    response: "Je suis fatigué.",
    mastered: true,
    revealed: true,
    completed: true,
    needsReview: false,
  });
  assert.equal(p.quebecReview().length, 0);
});
test("Québec pack imports 127 exercises and 10 cards without treating the final specification as a quiz", () => {
  const e = environment();
  const c = e.load("src/content/quebec-expansion.ts");
  assert.equal(c.quebecItems.length, 137);
  assert.equal(new Set(c.quebecItems.map((i) => i.id)).size, 137);
  assert.equal(
    c.quebecItems.filter((i) => i.activity_type === "culture_card").length,
    10,
  );
  assert.ok(!c.quebecItems.some((i) => i.activity_type === "final_exam_spec"));
  for (const i of c.quebecItems) {
    assert.ok(i.choices.includes(i.correct_answer));
    assert.equal(new Set(i.choices).size, i.choices.length);
    assert.equal(typeof i.exam_safe, "boolean");
  }
  assert.ok(c.searchQuebecItems("depanneur").length);
  assert.equal(c.searchQuebecItems("", "Expressions québécoises").length, 30);
  assert.equal(
    c.externalCandidate({ external_url: "javascript:alert(1)" }),
    null,
  );
});
test("Québec pack answers survive backup restore and remain separate from normal scores", () => {
  const e = environment();
  const q = e.load("src/quebec-pack-progress.ts");
  const s = e.load("src/storage.ts");
  q.saveQuebecItem("qc-parle-transformation-001", {
    response: "Je suis fatigué.",
    revealed: true,
    english: false,
    completed: true,
    mastered: true,
  });
  const b = e.load("src/backup.ts");
  const saved = b.parseBackup(JSON.stringify(s.createBackup()));
  s.resetAllData();
  b.restoreBackup(saved);
  assert.equal(q.quebecTrackStats()[0].completed, 1);
  assert.equal(s.loadHistory().attempts.length, 0);
  assert.equal(
    Object.keys(e.load("src/expansion-progress.ts").loadExpansionProgress())
      .length,
    0,
  );
});
test("expansion preserves all 535 IDs, five levels and five usable exercise formats", () => {
  const e = environment();
  const { activities, expansionChapters } = e.load("src/content/expansion.ts");
  assert.equal(activities.length, 535);
  assert.equal(new Set(activities.map((a) => a.id)).size, 535);
  assert.equal(new Set(activities.map((a) => a.level)).size, 5);
  assert.equal(new Set(activities.map((a) => a.activity_type)).size, 5);
  assert.equal(
    expansionChapters.reduce((n, c) => n + c.items.length, 0),
    535,
  );
  for (const a of activities) {
    assert.ok(
      a.correct_answer && a.prompt && a.explanation_fr && a.explanation_en,
    );
    if (a.choices.length) {
      assert.ok(a.choices.includes(a.correct_answer));
      assert.equal(new Set(a.choices).size, a.choices.length);
    }
  }
  assert.equal(e.load("src/data/questions.ts").loadQuestions().length, 150);
});
test("expansion search covers prompts, levels and types while answer comparison preserves accents", () => {
  const e = environment();
  const c = e.load("src/content/expansion.ts");
  assert.ok(c.searchActivities("B1 reunion").length);
  assert.equal(c.searchActivities("production_ecrite").length, 40);
  assert.equal(
    c.normalizeAnswer("  J’ai   étudié. "),
    c.normalizeAnswer("J'ai étudié."),
  );
  assert.notEqual(c.normalizeAnswer("étudié"), c.normalizeAnswer("etudie"));
});
test("expansion drafts and self-reviewed writing survive backup round trips", () => {
  const e = environment();
  const p = e.load("src/expansion-progress.ts");
  const s = e.load("src/storage.ts");
  p.saveActivity("b1-production-ecrite-001", {
    response: "Bonjour, je confirme le rendez-vous.",
    revealed: true,
    english: false,
    completed: true,
    correct: null,
  });
  const b = e.load("src/backup.ts");
  const saved = b.parseBackup(JSON.stringify(s.createBackup()));
  s.resetAllData();
  assert.equal(Object.keys(p.loadExpansionProgress()).length, 0);
  b.restoreBackup(saved);
  assert.equal(
    p.loadExpansionProgress()["b1-production-ecrite-001"].correct,
    null,
  );
  assert.equal(
    p.loadExpansionProgress()["b1-production-ecrite-001"].completed,
    true,
  );
  assert.equal(s.loadProgress().completedChapters.length, 0);
});
test("early v2 backups import without Québec practice fields and retain a recovery point", () => {
  const e = environment();
  const s = e.load("src/storage.ts");
  const backup = s.createBackup();
  delete backup.quebecProgress;
  delete backup.quebecSessions;
  backup.progress.completedChapters = ["definis-le-la"];
  const api = e.load("src/backup.ts");
  const parsed = api.parseBackup(JSON.stringify(backup));
  assert.equal(Object.keys(parsed.quebecProgress).length, 0);
  e.storage.setItem("unrelated", "keep");
  api.restoreBackup(parsed);
  assert.equal(s.loadProgress().completedChapters.length, 1);
  const recovery = api.recoveryBackup();
  assert.equal(recovery.progress.completedChapters.length, 0);
  api.restoreBackup(recovery);
  assert.equal(s.loadProgress().completedChapters.length, 0);
  assert.equal(e.storage.getItem("unrelated"), "keep");
});
test("bad backup files fail before any browser data is changed", () => {
  const e = environment();
  const s = e.load("src/storage.ts");
  const api = e.load("src/backup.ts");
  e.storage.setItem("unrelated", "keep");
  for (const mutate of [
    (b) => (b.version = 99),
    (b) => (b.history.attempts = null),
    (b) => (b.progress.categories.definis.correct = 100),
    (b) => (b.quebecSessions = { parle: { answers: ["fake"] } }),
  ]) {
    const b = s.createBackup();
    mutate(b);
    assert.throws(() => api.parseBackup(JSON.stringify(b)));
  }
  assert.throws(() => api.parseBackup("not json"));
  assert.equal(e.data.size, 1);
});
test("backup import rolls back changed keys if storage runs out of space", () => {
  const e = environment();
  const s = e.load("src/storage.ts");
  const b = s.createBackup();
  b.progress.completedChapters = ["definis-le-la"];
  s.saveProgress(s.emptyProgress());
  const before = JSON.stringify([...e.data]);
  const original = e.storage.setItem;
  let failed = false;
  e.storage.setItem = (key, value) => {
    if (key === "fr_a2_settings" && !failed) {
      failed = true;
      throw new Error("quota");
    }
    original(key, value);
  };
  assert.throws(() => e.load("src/backup.ts").restoreBackup(b));
  assert.equal(JSON.stringify([...e.data]), before);
});
test("Québec exercises have unique IDs, valid choices and credited sources", () => {
  const e = environment();
  const { quebecExercises, practiceCategories } = e.load(
    "src/content/quebec-practice.ts",
  );
  assert.equal(new Set(quebecExercises.map((q) => q.id)).size, 16);
  for (const category of practiceCategories)
    assert.equal(
      quebecExercises.filter((q) => q.category === category).length,
      4,
    );
  for (const q of quebecExercises) {
    assert.equal(q.choices.filter((c) => c === q.answer).length, 1);
    assert.ok(q.fr && q.en && q.register);
    assert.equal(new URL(q.source.url).protocol, "https:");
  }
  assert.equal(
    quebecExercises.find((q) => q.id === "standard-depanneur").examSafe,
    true,
  );
});
test("Québec belt requires sequential passing scores and preserves best results", () => {
  const e = environment();
  const { quebecExercises } = e.load("src/content/quebec-practice.ts");
  const { saveQuebecAttempt, beltLevel } = e.load("src/quebec-progress.ts");
  const answers = (category) =>
    quebecExercises.filter((q) => q.category === category).map((q) => q.answer);
  assert.equal(
    beltLevel(saveQuebecAttempt("expressions", answers("expressions"))),
    0,
  );
  const first = answers("parle");
  first[0] = "Je cherche";
  let p = saveQuebecAttempt("parle", first);
  assert.equal(p.parle.best, 75);
  assert.equal(beltLevel(p), 2);
  const wrong = quebecExercises
    .filter((q) => q.category === "parle")
    .map((q) => q.choices.find((c) => c !== q.answer));
  p = saveQuebecAttempt("parle", wrong);
  assert.equal(p.parle.best, 75);
  assert.equal(p.parle.attempts, 2);
  assert.equal(saveQuebecAttempt("parle", []).parle.attempts, 2);
  assert.equal(e.load("src/storage.ts").loadHistory().attempts.length, 0);
});
test("Québec progress ignores corrupt values and participates in export and reset", () => {
  const e = environment();
  e.storage.setItem(
    "frenchie_v2_quebec_progress",
    JSON.stringify({
      parle: { best: 900, attempts: 1 },
      expressions: null,
      sacres: { best: 75, attempts: 1 },
    }),
  );
  const p = e.load("src/quebec-progress.ts").loadQuebecProgress();
  assert.equal(Object.keys(p).length, 1);
  const s = e.load("src/storage.ts");
  assert.equal(s.createBackup().quebecProgress.sacres.best, 75);
  e.storage.setItem("unrelated", "keep");
  e.storage.setItem("frenchie_v2_quebec_sessions", "{}");
  s.resetAllData();
  assert.equal(e.storage.getItem("frenchie_v2_quebec_progress"), null);
  assert.equal(e.storage.getItem("frenchie_v2_quebec_sessions"), null);
  assert.equal(e.storage.getItem("unrelated"), "keep");
});
const { webcrypto } = require("node:crypto");
function environment() {
  const data = new Map();
  const cache = new Map();
  const storage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
  const load = (filename) => {
    filename = path.resolve(filename);
    if (filename.endsWith(".json"))
      return JSON.parse(fs.readFileSync(filename, "utf8"));
    if (cache.has(filename)) return cache.get(filename);
    const js = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText;
    const exports = {};
    const context = {
      exports,
      require: (spec) =>
        load(
          path.resolve(
            path.dirname(filename),
            spec + (path.extname(spec) ? "" : ".ts"),
          ),
        ),
      localStorage: storage,
      crypto: webcrypto,
      console,
      Date,
      Event,
      window: { dispatchEvent() {} },
    };
    vm.runInNewContext(js, context, { filename });
    cache.set(filename, exports);
    return exports;
  };
  return { data, storage, load };
}
test("v1 progress and mistake arrays survive loading and later writes", () => {
  const e = environment();
  const q = e.load("src/data/questions.ts").loadQuestions()[0];
  e.storage.setItem(
    "fr_a2_progress",
    JSON.stringify({
      categories: { definis: { attempts: 7, correct: 5 } },
      completedChapters: ["definis-le-la"],
      completedTests: 2,
    }),
  );
  e.storage.setItem(
    "fr_a2_mistakes",
    JSON.stringify([
      { id: "old", questionId: q.id, category: q.category, count: 1 },
    ]),
  );
  e.storage.setItem(
    "fr_a2_easter_eggs_seen",
    JSON.stringify(["chapter_completed"]),
  );
  const s = e.load("src/storage.ts");
  const p = s.loadProgress();
  assert.equal(p.categories.definis.correct, 5);
  assert.equal(p.categories.partitifs.attempts, 0);
  assert.equal(p.completedTests, 2);
  assert.equal(s.loadMistakes().length, 1);
  assert.equal(s.loadSeenRewards().includes("chapter_completed"), true);
  s.updateProgress(
    [{ question: q, selectedAnswer: q.correct_answer, isCorrect: true }],
    undefined,
    "review",
  );
  assert.equal(s.loadProgress().completedTests, 2);
  assert.equal(s.loadProgress().categories.definis.correct, 6);
  assert.equal(
    s.recordMistakes(
      [{ question: q, selectedAnswer: q.correct_answer, isCorrect: true }],
      true,
    ).length,
    0,
  );
  assert.equal(s.loadHistory().reviewed, 1);
});
test("invalid local data safely falls back and valid arrays stay arrays", () => {
  const e = environment();
  const s = e.load("src/storage.ts");
  e.storage.setItem("fr_a2_mistakes", "{broken");
  e.storage.setItem(
    "fr_a2_progress",
    JSON.stringify({
      categories: null,
      completedChapters: null,
      completedTests: null,
    }),
  );
  assert.equal(s.loadMistakes().length, 0);
  assert.equal(s.loadProgress().completedTests, 0);
  e.storage.setItem("fr_a2_easter_eggs_seen", "{}");
  assert.equal(Array.isArray(s.loadSeenRewards()), true);
});
test("review corrects only its answered mistakes and records best-score evidence", () => {
  const e = environment();
  const s = e.load("src/storage.ts");
  const qs = e.load("src/data/questions.ts").loadQuestions();
  const wrong = qs
    .slice(0, 3)
    .map((question) => ({ question, selectedAnswer: "?", isCorrect: false }));
  s.recordMistakes(wrong);
  const correction = [
    { ...wrong[0], selectedAnswer: qs[0].correct_answer, isCorrect: true },
  ];
  s.recordMistakes(correction, true);
  assert.equal(s.loadMistakes().length, 2);
  s.recordAttempt(correction, "review", "review");
  assert.equal(s.loadHistory().attempts[0].correct, 1);
  assert.equal(s.loadHistory().attempts[0].total, 1);
});
test("all available chapters have unique, valid questions matching focused forms", () => {
  const e = environment();
  const q = e.load("src/data/questions.ts");
  assert.equal(q.loadQuestions().length, 150);
  for (const chapter of q.chapters) {
    const questions = q.getChapterQuestions(chapter);
    assert.ok(questions.length > 0 && questions.length <= 10, chapter.id);
    assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
    assert.ok(
      questions.every((q) => q.choices.includes(q.correct_answer)),
      chapter.id,
    );
  }
  assert.ok(
    q
      .getChapterQuestions(q.chapters[0])
      .every((q) => ["le", "la"].includes(q.correct_answer.toLowerCase())),
  );
  assert.equal(q.getMixedQuestions(20).length, 20);
  assert.equal(new Set(q.getMixedQuestions(40).map((q) => q.id)).size, 40);
});
test("search ignores accents and can find lesson examples and mistake explanations", () => {
  const e = environment();
  const c = e.load("src/content/curriculum.ts");
  assert.equal(
    c.searchLessons("définis").length,
    c.searchLessons("definis").length,
  );
  assert.ok(c.searchLessons("negation").length > 0);
  assert.ok(c.searchLessons("pharmacie").length > 0);
  assert.equal(c.searchLessons("zzzz-no-lesson").length, 0);
});
test("category badges require completion and never duplicate reward keys", () => {
  const e = environment();
  const s = e.load("src/storage.ts");
  const q = e.load("src/data/questions.ts");
  const r = e.load("src/rewards.ts");
  const records = q.getMixedQuestions(20).map((question) => ({
    question,
    selectedAnswer: question.correct_answer,
    isCorrect: true,
  }));
  const progress = s.emptyProgress();
  for (const stats of Object.values(progress.categories)) {
    stats.attempts = 20;
    stats.correct = 20;
  }
  assert.equal(
    r
      .checkRewardTriggers("mini", records, progress)
      .some((r) => r.event === "category_completed"),
    false,
  );
  progress.completedChapters = q.chapters.map((ch) => ch.id);
  const rewards = r.checkRewardTriggers("mini", records, progress);
  assert.equal(new Set(rewards.map((r) => r.event)).size, rewards.length);
  assert.ok(rewards.some((r) => r.event === "category_completed"));
});
test("unfinished sessions preserve answers, feedback and English help across a reload", () => {
  const e = environment();
  const q = e.load("src/data/questions.ts");
  const sessions = e.load("src/session.ts");
  const quiz = {
    mode: "chapter",
    title: "Le / la",
    chapterId: q.chapters[0].id,
    questions: q.getChapterQuestions(q.chapters[0]),
  };
  const draft = sessions.createSession(quiz);
  const first = quiz.questions[0];
  const second = quiz.questions[1];
  sessions.saveSession({
    ...draft,
    index: 1,
    records: [
      {
        question: first,
        selectedAnswer: first.correct_answer,
        isCorrect: true,
      },
    ],
    selected: second.correct_answer,
    validated: true,
    showEnglish: true,
  });
  const restored = sessions.loadSessions()[0];
  assert.equal(restored.index, 1);
  assert.equal(restored.records[0].isCorrect, true);
  assert.equal(restored.selected, second.correct_answer);
  assert.equal(restored.validated, true);
  assert.equal(restored.showEnglish, true);
  assert.equal(
    e.load("src/storage.ts").loadProgress().categories.definis.attempts,
    0,
  );
});
test("pausing another activity does not overwrite the first, and completion removes only its draft", () => {
  const e = environment();
  const q = e.load("src/data/questions.ts");
  const sessions = e.load("src/session.ts");
  const one = sessions.createSession({
    mode: "mini",
    title: "Mini-test",
    questions: q.getMixedQuestions(20),
  });
  const two = sessions.createSession({
    mode: "final",
    title: "Bilan",
    questions: q.getMixedQuestions(40),
  });
  sessions.saveSession(one);
  sessions.saveSession(two);
  assert.equal(sessions.loadSessions().length, 2);
  sessions.saveSession({
    ...one,
    selected: one.quiz.questions[0].correct_answer,
  });
  assert.equal(sessions.loadSessions().length, 2);
  sessions.clearSession(one.id);
  assert.equal(sessions.loadSessions().length, 1);
  assert.equal(sessions.loadSessions()[0].id, two.id);
});
test("invalid or obsolete saved questions cannot crash a resumed quiz", () => {
  const e = environment();
  const q = e.load("src/data/questions.ts");
  const sessions = e.load("src/session.ts");
  sessions.saveSession(
    sessions.createSession({
      mode: "mini",
      title: "Mini-test",
      questions: q.getMixedQuestions(20),
    }),
  );
  const raw = JSON.parse(e.storage.getItem("frenchie_v2_sessions"));
  raw[0].questionIds[0] = "removed-question";
  e.storage.setItem("frenchie_v2_sessions", JSON.stringify(raw));
  assert.equal(sessions.loadSessions().length, 0);
});
test("carnet export includes app data only and does not change progress", () => {
  const e = environment();
  const s = e.load("src/storage.ts");
  e.storage.setItem("unrelated-private-key", "not-in-export");
  s.recordEnglishHelp();
  const backup = s.createBackup();
  assert.equal(backup.app, "Frenchie");
  assert.equal(backup.version, 2);
  assert.equal(backup.history.englishHelp, 1);
  assert.equal(JSON.stringify(backup).includes("not-in-export"), false);
  assert.equal(s.loadHistory().englishHelp, 1);
});
