import { useState } from "react";
import { CarnetImport } from "./CarnetImport";
import {
  ExpansionCatalog,
  ExpansionSearch,
  ExpansionProgressSummary,
  ExpansionResume,
} from "./Expansion";
import {
  lessons,
  levels,
  rules,
  searchLessons,
  type Lesson,
} from "../content/curriculum";
import {
  categoryLabels,
  chapters,
  getChapterQuestions,
} from "../data/questions";
import { Icon, Meter } from "../components/Visuals";
import {
  activitySummaries,
  createBackup,
  loadHistory,
  loadSeenRewards,
  recordEnglishHelp,
} from "../storage";
import type { QuizSession } from "../session";
import type { MistakeRecord, Screen, StoredProgress, Settings } from "../types";

type Navigate = (screen: Screen) => void;
export function Home({
  progress,
  mistakes,
  navigate,
  openLesson,
  miniTest,
  drafts,
  resume,
}: {
  progress: StoredProgress;
  mistakes: MistakeRecord[];
  navigate: Navigate;
  openLesson: (lesson: Lesson) => void;
  miniTest: () => void;
  drafts: QuizSession[];
  resume: (session: QuizSession) => void;
}) {
  const next =
    lessons.find((l) => !progress.completedChapters.includes(l.id)) ??
    lessons[0];
  const draft = drafts[0];
  const completed = lessons.filter((l) =>
    progress.completedChapters.includes(l.id),
  ).length;
  const actions = [
    {
      icon: "bolt" as const,
      title: "Révision rapide",
      text: mistakes.length
        ? `${mistakes.length} erreurs à revoir`
        : "Un petit rappel fait du bien",
      action: () => navigate("mistakes"),
      tone: "gold",
    },
    {
      icon: "target" as const,
      title: "Mini-test",
      text: "20 questions pour te tester",
      action: miniTest,
      tone: "red",
    },
    {
      icon: "search" as const,
      title: "Chercher une notion",
      text: "Un mot, une règle, un déclic",
      action: () => navigate("search"),
      tone: "blue",
    },
    {
      icon: "chart" as const,
      title: "Mon parcours",
      text: `${completed} / ${lessons.length} chapitres A2`,
      action: () => navigate("practice"),
      tone: "blue",
    },
  ];
  return (
    <section className="page homePage">
      <div className="homeHero">
        <div className="greeting">
          <p className="eyebrow">Un peu de français, chaque jour</p>
          <h1>
            Salut ! <span className="wave">👋</span>
          </h1>
          <h2>Prêt à pratiquer ?</h2>
          <p className="handwritten">
            Un petit pas aujourd’hui,
            <br />
            un grand progrès demain.
          </p>
        </div>
        <img
          className="heroMascot"
          src="/brand/normal-hero.png"
          alt="Frenchie, un orignal souriant avec sa casquette et son écharpe bleue et blanche"
          fetchPriority="high"
        />
      </div>
      <button
        className="continueCard"
        onClick={() => (draft ? resume(draft) : openLesson(next))}
      >
        <span className="tileIcon gold">
          <Icon name="book" />
        </span>
        <span className="continueText">
          <small>
            {draft
              ? "Continuer ma séance"
              : completed
                ? "On continue ?"
                : "On commence ?"}
          </small>
          <strong>{draft ? draft.quiz.title : next.module}</strong>
          <span>
            {draft
              ? `Question ${draft.index + 1} sur ${draft.quiz.questions.length} · Ta place est gardée`
              : `${next.title} · ${next.estimated_minutes} min`}
          </span>
          <Meter
            value={
              draft
                ? (draft.index / draft.quiz.questions.length) * 100
                : (completed / lessons.length) * 100
            }
            label={draft ? "Progression de la séance" : "Chapitres A2 terminés"}
          />
        </span>
        <span className="roundArrow">
          <Icon name="arrow" />
        </span>
      </button>
      {drafts.length > 1 && (
        <details className="pausedSessions">
          <summary>
            {drafts.length - 1} autre{drafts.length > 2 ? "s" : ""} séance
            {drafts.length > 2 ? "s" : ""} en pause
          </summary>
          {drafts.slice(1).map((saved) => (
            <button key={saved.id} onClick={() => resume(saved)}>
              <span>
                {saved.quiz.title}
                <small>
                  Question {saved.index + 1} / {saved.quiz.questions.length}
                </small>
              </span>
              <Icon name="arrow" />
            </button>
          ))}
        </details>
      )}
      <ExpansionResume />
      <div className="quickGrid">
        {actions.map((action) => (
          <button
            className="quickCard"
            key={action.title}
            onClick={action.action}
          >
            <span className={`tileIcon ${action.tone}`}>
              <Icon name={action.icon} />
            </span>
            <strong>{action.title}</strong>
            <span>{action.text}</span>
            <Icon name="arrow" className="cardArrow" />
          </button>
        ))}
      </div>
      <div className="quoteCard">
        <span aria-hidden="true">✦</span>
        <p>
          Apprendre aujourd’hui,
          <br />
          <strong>voyager demain !</strong>
        </p>
        <span aria-hidden="true">♡</span>
      </div>
      <p className="footnote">
        Ton rythme. Tes progrès. Ton petit coin de français.
      </p>
    </section>
  );
}
export function Curriculum({
  progress,
  openLesson,
  miniTest,
  finalTest,
}: {
  progress: StoredProgress;
  openLesson: (lesson: Lesson) => void;
  miniTest: () => void;
  finalTest: () => void;
}) {
  const [level, setLevel] = useState(() => {
    const requested = new URLSearchParams(location.search).get("niveau");
    return levels.some((l) => l.id === requested) ? requested! : "A2";
  });
  const selected = levels.find((l) => l.id === level)!;
  const summaries = activitySummaries();
  return (
    <section className="page">
      <div>
        <p className="eyebrow">De petites étapes, de grands progrès</p>
        <h1>Mon parcours</h1>
        <p>Choisis une notion et avance à ton rythme.</p>
      </div>
      <div className="levelTabs" aria-label="Niveaux">
        {levels.map((l) => (
          <button
            key={l.id}
            className={level === l.id ? "active" : ""}
            aria-pressed={level === l.id}
            onClick={() => setLevel(l.id)}
          >
            {l.id}
          </button>
        ))}
      </div>
      <article className="levelIntro">
        <span className="levelBadge">{level}</span>
        <div>
          <h2>{selected.title}</h2>
          <p>{selected.description}</p>
          <small>
            {level === "A2"
              ? `${progress.completedChapters.filter((id) => lessons.some((l) => l.id === id)).length} / ${lessons.length} chapitres terminés`
              : "Quiz, lecture, écriture et dictées visuelles"}
          </small>
        </div>
      </article>
      {level === "A2" ? (
        <>
          <div className="actions">
            <button className="primary" onClick={miniTest}>
              <Icon name="target" /> Mini-test · 20 questions
            </button>
            <button onClick={finalTest}>Bilan A2 · 40 questions</button>
          </div>
          <div className="categoryGrid">
            {Object.entries(categoryLabels).map(([id, title], index) => (
              <article className="categoryBlock" key={id}>
                <div className="categoryHeading">
                  <span className="numberBadge">0{index + 1}</span>
                  <h2>{title}</h2>
                </div>
                <div className="chapterList">
                  {lessons
                    .filter((l) => l.chapter.category === id)
                    .map((lesson) => (
                      <button
                        className="chapterButton"
                        key={lesson.id}
                        onClick={() => openLesson(lesson)}
                      >
                        <span>
                          <strong>{lesson.title}</strong>
                          <small>{lesson.chapter.subtitle}</small>
                          {summaries[lesson.id] && (
                            <small className="lessonScore">
                              Meilleur score : {summaries[lesson.id].best} % ·{" "}
                              {summaries[lesson.id].attempts} séance
                              {summaries[lesson.id].attempts > 1 ? "s" : ""}
                            </small>
                          )}
                        </span>
                        {progress.completedChapters.includes(lesson.id) ? (
                          <Icon name="check" className="completed" />
                        ) : (
                          <Icon name="arrow" />
                        )}
                      </button>
                    ))}
                </div>
              </article>
            ))}
          </div>
        </>
      ) : null}
      <ExpansionCatalog level={level} />
      {level === "B2" && (
        <p className="footnote">
          Premières activités B2 : ce parcours sera enrichi progressivement.
        </p>
      )}
    </section>
  );
}
export function Search({
  openLesson,
}: {
  openLesson: (lesson: Lesson) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tous");
  const results = searchLessons(query);
  return (
    <section className="page">
      <div>
        <p className="eyebrow">Suis ta curiosité</p>
        <h1>Que veux-tu pratiquer ?</h1>
      </div>
      <label className="searchBox">
        <Icon name="search" />
        <span className="srOnly">
          Chercher dans les leçons et les exercices
        </span>
        <input
          type="search"
          placeholder="Articles, possessifs, négation…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="chips" aria-label="Type de contenu">
        {["Tous", "Règles", "Exercices"].map((type) => (
          <button
            key={type}
            className={filter === type ? "active" : ""}
            aria-pressed={filter === type}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <p className="resultCount" role="status">
        {results.length} {filter === "Règles" ? "rappels" : "chapitres"} à
        explorer · A2
      </p>
      <div className="searchResults">
        {results.map((lesson) => (
          <button
            className="searchResult"
            key={lesson.id}
            onClick={() => openLesson(lesson)}
          >
            <span className="tileIcon blue">
              <Icon name={filter === "Exercices" ? "pencil" : "book"} />
            </span>
            <span>
              <strong>{lesson.title}</strong>
              <small>
                {lesson.level} · {lesson.module} · {lesson.estimated_minutes}{" "}
                min
              </small>
              <small>
                {filter === "Règles"
                  ? "Lire le rappel et les exemples"
                  : filter === "Exercices"
                    ? `${getChapterQuestions(lesson.chapter).length} questions avec explications`
                    : "Règle + exercices disponibles"}
              </small>
            </span>
            <Icon name="arrow" />
          </button>
        ))}
      </div>
      {filter !== "Règles" && <ExpansionSearch key={query} query={query} />}
      {!results.length && filter === "Règles" && (
        <div className="emptyState">
          <Icon name="search" />
          <h2>Pas encore dans le cahier.</h2>
          <p>
            Je n’ai rien trouvé pour ce mot. Essaie « articles », « possessifs »
            ou « négation ».
          </p>
          <p>De nouvelles notions arriveront au fil du parcours.</p>
          <button onClick={() => setQuery("")}>
            Voir les leçons disponibles
          </button>
        </div>
      )}
    </section>
  );
}
export function LessonPage({
  lesson,
  start,
  back,
}: {
  lesson: Lesson;
  start: () => void;
  back: () => void;
}) {
  const [english, setEnglish] = useState(false);
  const rule = rules[lesson.chapter.category];
  const summary = activitySummaries()[lesson.id];
  return (
    <section className="page">
      <button className="textButton backButton" onClick={back}>
        <Icon name="back" /> Mon parcours
      </button>
      <div>
        <p className="eyebrow">
          {lesson.level} · {lesson.module}
        </p>
        <h1>{lesson.title}</h1>
        <p>{lesson.chapter.subtitle}</p>
        {summary && (
          <p className="lessonScore">
            Ton meilleur score : {summary.best} % · {summary.attempts} séance
            {summary.attempts > 1 ? "s" : ""} terminée
            {summary.attempts > 1 ? "s" : ""}
          </p>
        )}
      </div>
      <aside className="chalkboard">
        <p className="eyebrow">
          <Icon name="book" /> La règle du jour
        </p>
        <h2>{rule.forms}</h2>
        <p>{rule.fr}</p>
        <div className="chalkExample">{rule.example}</div>
      </aside>
      <article className="paper">
        <span className="pill goldPill">Le petit piège</span>
        <p>{rule.mistake}</p>
        {english ? (
          <p className="english" lang="en">
            {rule.en}
          </p>
        ) : (
          <button
            onClick={() => {
              setEnglish(true);
              recordEnglishHelp();
            }}
          >
            Explique en anglais
          </button>
        )}
      </article>
      <button className="primary large" onClick={start}>
        À toi de jouer <Icon name="arrow" />
      </button>
      <p className="footnote">
        {getChapterQuestions(lesson.chapter).length} questions · Environ{" "}
        {lesson.estimated_minutes} minutes · Explications à chaque réponse
      </p>
    </section>
  );
}
export function Progress({
  progress,
  mistakes,
  navigate,
}: {
  progress: StoredProgress;
  mistakes: MistakeRecord[];
  navigate: Navigate;
}) {
  const history = loadHistory();
  const attempts = Object.values(progress.categories).reduce(
    (n, v) => n + v.attempts,
    0,
  );
  const correct = Object.values(progress.categories).reduce(
    (n, v) => n + v.correct,
    0,
  );
  const best = history.attempts.length
    ? Math.max(
        ...history.attempts.map((a) => Math.round((a.correct / a.total) * 100)),
      )
    : null;
  const weak = Object.entries(progress.categories)
    .filter(([, v]) => v.attempts > 0 && v.correct / v.attempts < 0.8)
    .sort(
      (a, b) => a[1].correct / a[1].attempts - b[1].correct / b[1].attempts,
    );
  const dates = new Set(
    history.attempts.map((a) => new Date(a.date).toLocaleDateString("fr-CA")),
  );
  const cursor = new Date();
  if (!dates.has(cursor.toLocaleDateString("fr-CA")))
    cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(cursor.toLocaleDateString("fr-CA"))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  const badges = [
    {
      earned: progress.completedChapters.length > 0,
      title: "Premier pas",
      text: "Un chapitre terminé",
      icon: "book" as const,
    },
    {
      earned: loadSeenRewards().includes("chapter_perfect"),
      title: "Sans faute",
      text: "Un chapitre à 100 %",
      icon: "star" as const,
    },
    {
      earned: progress.completedTests > 0,
      title: "Cap franchi",
      text: "Un test terminé",
      icon: "target" as const,
    },
  ];
  return (
    <section className="page">
      <div>
        <p className="eyebrow">Chaque petit effort compte</p>
        <h1>Mes progrès</h1>
      </div>
      <article className="levelIntro">
        <span className="levelBadge">A2</span>
        <div>
          <h2>Les bases solides</h2>
          <p>
            {progress.completedChapters.length} / {chapters.length} chapitres
            terminés
          </p>
          <Meter
            value={(progress.completedChapters.length / chapters.length) * 100}
            label="Progression A2"
          />
        </div>
      </article>
      <div className="statsGrid">
        <article className="paper">
          <Icon name="check" />
          <strong>
            {attempts ? `${Math.round((correct / attempts) * 100)} %` : "—"}
          </strong>
          <span>Réussite globale</span>
        </article>
        <article className="paper">
          <Icon name="star" />
          <strong>{best === null ? "—" : `${best} %`}</strong>
          <span>Meilleur score v2</span>
        </article>
        <article className="paper">
          <Icon name="bolt" />
          <strong>{streak}</strong>
          <span>Jours de suite</span>
        </article>
        <article className="paper">
          <Icon name="review" />
          <strong>{history.reviewed}</strong>
          <span>Erreurs corrigées</span>
        </article>
      </div>
      <ExpansionProgressSummary />
      <article className="paper">
        <h2>Mes points à renforcer</h2>
        {weak.length ? (
          <div className="chips">
            {weak.map(([id]) => (
              <button key={id} onClick={() => navigate("practice")}>
                {categoryLabels[id as keyof typeof categoryLabels]}
              </button>
            ))}
          </div>
        ) : (
          <p>
            {attempts
              ? "Tes bases se consolident. Continue comme ça !"
              : "Commence une séance pour découvrir tes points forts."}
          </p>
        )}
        <button
          className="primary"
          onClick={() => navigate(mistakes.length ? "mistakes" : "practice")}
        >
          {mistakes.length
            ? `Réviser mes ${mistakes.length} erreurs`
            : "Faire une petite pratique"}
          <Icon name="arrow" />
        </button>
      </article>
      <div>
        <h2>Mes petites victoires</h2>
        <div className="badges">
          {badges.map((badge) => (
            <article
              className={`badgeCard ${badge.earned ? "earned" : ""}`}
              key={badge.title}
            >
              <Icon name={badge.icon} />
              <strong>{badge.title}</strong>
              <small>{badge.earned ? "Débloqué !" : badge.text}</small>
            </article>
          ))}
        </div>
      </div>
      <article className="paper">
        <h2>Dans mon carnet</h2>
        <p>
          {attempts} réponses données · {progress.completedTests} tests terminés
        </p>
        <p>{history.englishHelp} aides en anglais demandées</p>
        <p className="muted">
          Les meilleurs scores et les jours de pratique sont suivis depuis la
          version 2. Tes progrès précédents sont conservés.
        </p>
      </article>
    </section>
  );
}
export function Preferences({
  settings,
  change,
  reset,
  restored,
}: {
  settings: Settings;
  change: (settings: Settings) => void;
  reset: () => void;
  restored: () => void;
}) {
  const [exported, setExported] = useState(false);
  function downloadCarnet() {
    const blob = new Blob([JSON.stringify(createBackup(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `frenchie-carnet-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setExported(true);
  }
  return (
    <section className="page">
      <div>
        <p className="eyebrow">À ta façon</p>
        <h1>Mon petit coin</h1>
      </div>
      <article className="paper">
        <h2>Les récompenses</h2>
        <label className="toggle">
          <span>Activer le bouton de lecture des sons</span>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) =>
              change({ ...settings, soundEnabled: e.target.checked })
            }
          />
        </label>
        <p className="muted">
          Les récompenses restent toujours visibles. Tu choisis quand les
          écouter.
        </p>
      </article>
      <article className="paper">
        <h2>Un coup de pouce, au besoin</h2>
        <p>
          Frenchie te parle en français. Dans les leçons et les corrections, «
          Explique en anglais » est là quand tu en as besoin.
        </p>
      </article>
      <article className="paper">
        <h2>Ton carnet reste ici</h2>
        <p>
          Tes progrès sont enregistrés dans ce navigateur, sans compte. Effacer
          les données du navigateur efface aussi ton carnet.
        </p>
        <button onClick={downloadCarnet}>
          <Icon name="review" /> Télécharger mon carnet
        </button>
        {exported && (
          <p role="status" className="muted">
            Téléchargement lancé. Garde ce fichier comme copie de tes progrès.
          </p>
        )}
        <CarnetImport refresh={restored} />
        <button
          className="danger"
          onClick={() => {
            if (
              window.confirm(
                "Effacer tous tes progrès, erreurs et récompenses ? Cette action est définitive.",
              )
            )
              reset();
          }}
        >
          Réinitialiser mes progrès
        </button>
      </article>
    </section>
  );
}
