import { useEffect, useRef, useState } from "react";
import {
  getChapterQuestions,
  getMixedQuestions,
  loadQuestions,
} from "./data/questions";
import { lessons, type Lesson } from "./content/curriculum";
import {
  Home,
  Curriculum,
  Search,
  LessonPage,
  Progress,
  Preferences,
} from "./features/Learning";
import { QuizPage, ResultsPage, MistakesPage } from "./features/Quiz";
import { Quebec } from "./features/Quebec";
import { ExpansionActivity, ExpansionReview } from "./features/Expansion";
import { Icon, type IconName } from "./components/Visuals";
import { checkRewardTriggers } from "./rewards";
import {
  activityKey,
  clearSession,
  createSession,
  loadSessions,
  saveSession,
  type QuizSession,
} from "./session";
import {
  clearMistakes,
  loadMistakes,
  loadProgress,
  loadSettings,
  recordMistakes,
  recordAttempt,
  resetAllData,
  saveSettings,
  updateProgress,
} from "./storage";
import type { AnswerRecord, QuizConfig, Reward, Screen } from "./types";
const routes: Partial<Record<Screen, string>> = {
  home: "/",
  search: "/chercher",
  practice: "/parcours",
  progress: "/progres",
  mistakes: "/revision",
  settings: "/parametres",
  quebec: "/quebec",
  quiz: "/exercice",
};
function readRoute(): Screen {
  if (location.pathname.startsWith("/activite/")) return "expansion";
  if (
    location.pathname === "/quebec" ||
    location.pathname.startsWith("/quebec/")
  )
    return "quebec";
  if (location.pathname === "/exercice")
    return loadSessions().length ? "quiz" : "home";
  if (location.pathname.startsWith("/lecon/")) return "lesson";
  return (
    (Object.entries(routes).find(
      ([, path]) => path === location.pathname,
    )?.[0] as Screen) || "home"
  );
}
function routeLesson() {
  return (
    lessons.find((l) => `/lecon/${l.id}` === location.pathname) ?? lessons[0]
  );
}
const navigation: { screen: Screen; label: string; icon: IconName }[] = [
  { screen: "home", label: "Accueil", icon: "home" },
  { screen: "search", label: "Chercher", icon: "search" },
  { screen: "practice", label: "Pratiquer", icon: "pencil" },
  { screen: "progress", label: "Progrès", icon: "star" },
  { screen: "mistakes", label: "Révision", icon: "review" },
];
export default function App() {
  const [screen, setScreen] = useState<Screen>(readRoute);
  const [lesson, setLesson] = useState<Lesson>(routeLesson);
  const [drafts, setDrafts] = useState(loadSessions);
  const [session, setSession] = useState<QuizSession | null>(
    () => drafts[0] ?? null,
  );
  const [quiz, setQuiz] = useState<QuizConfig | null>(
    () => session?.quiz ?? null,
  );
  const [quizKey, setQuizKey] = useState(0);
  const [results, setResults] = useState<AnswerRecord[]>([]);
  const [progress, setProgress] = useState(loadProgress);
  const [mistakes, setMistakes] = useState(loadMistakes);
  const [settings, setSettings] = useState(loadSettings);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [storageError, setStorageError] = useState(false);
  const main = useRef<HTMLElement>(null);
  const finishing = useRef(false);
  useEffect(() => {
    const back = () => {
      const target = readRoute();
      if (target === "quiz") {
        const latest = loadSessions()[0];
        setSession(latest);
        setQuiz(latest.quiz);
        setQuizKey((n) => n + 1);
        finishing.current = false;
      }
      setScreen(target);
      setLesson(routeLesson());
    };
    const error = () => setStorageError(true);
    const sync = () => {
      setProgress(loadProgress());
      setMistakes(loadMistakes());
      setSettings(loadSettings());
      setDrafts(loadSessions());
    };
    window.addEventListener("popstate", back);
    window.addEventListener("frenchie-storage-error", error);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("popstate", back);
      window.removeEventListener("frenchie-storage-error", error);
      window.removeEventListener("storage", sync);
    };
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
    document.title =
      screen === "quebec"
        ? "Frenchie · Québec"
        : "Frenchie · Apprendre, pratiquer, progresser";
  }, [screen, lesson.id]);
  useEffect(() => {
    if (screen !== "quiz" || !storageError) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [screen, storageError]);
  function navigate(target: Screen, path = routes[target]) {
    setScreen(target);
    if (path && location.pathname !== path)
      window.history.pushState({}, "", path);
  }
  function openLesson(next: Lesson) {
    setLesson(next);
    navigate("lesson", `/lecon/${next.id}`);
  }
  function start(next: QuizConfig) {
    const existing = loadSessions().find(
      (s) => activityKey(s.quiz) === activityKey(next),
    );
    resume(existing ?? createSession(next));
  }
  function resume(next: QuizSession) {
    setDrafts(saveSession(next));
    setSession(next);
    setQuiz(next.quiz);
    setQuizKey((n) => n + 1);
    finishing.current = false;
    navigate("quiz");
  }
  const mini = () =>
    start({
      mode: "mini",
      title: "Mini-test A2",
      questions: getMixedQuestions(20),
    });
  const final = () =>
    start({
      mode: "final",
      title: "Bilan A2",
      questions: getMixedQuestions(40),
    });
  function review() {
    const ids = new Set(mistakes.map((m) => m.questionId));
    const questions = loadQuestions().filter((q) => ids.has(q.id));
    if (questions.length)
      start({ mode: "review", title: "Révision de mes erreurs", questions });
  }
  function finish(records: AnswerRecord[]) {
    if (!quiz || finishing.current) return;
    finishing.current = true;
    const updated = updateProgress(records, quiz.chapterId, quiz.mode);
    const nextMistakes = recordMistakes(records, quiz.mode === "review");
    recordAttempt(records, quiz.mode, quiz.chapterId ?? quiz.mode);
    setProgress(updated);
    setMistakes(nextMistakes);
    setResults(records);
    if (session) setDrafts(clearSession(session.id));
    setSession(null);
    setRewards(
      quiz.mode === "review"
        ? [
            {
              event: "comeback_win",
              message: "Un pas de plus. Chaque correction fait avancer !",
            },
          ]
        : checkRewardTriggers(quiz.mode, records, updated),
    );
    navigate("results");
  }
  if (screen === "quebec")
    return (
      <>
        <Quebec exit={() => navigate("home")} />
        {storageError && (
          <div className="storageNotice" role="alert">
            Le navigateur n’a pas pu enregistrer tes progrès.
          </div>
        )}
      </>
    );
  const active =
    screen === "lesson" ||
    screen === "quiz" ||
    screen === "results" ||
    screen === "expansion"
      ? "practice"
      : screen;
  return (
    <div className="app">
      <a className="skipLink" href="#main">
        Aller au contenu
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => navigate("home")}
          aria-label="Frenchie, accueil"
        >
          <span>
            Frenchie<span className="brandStar">✦</span>
          </span>
          <small>TON PETIT COIN DE FRANÇAIS</small>
        </button>
        <div className="headerActions">
          <button
            className="settingsButton"
            aria-label="Paramètres"
            onClick={() => navigate("settings")}
          >
            <Icon name="settings" />
          </button>
          <button
            className="quebecDoor"
            onClick={() => navigate("quebec")}
            aria-label="Prêt pour le français québécois ?"
          >
            <img src="/brand/quebec.png" alt="" />
            <span>Québec ?</span>
          </button>
        </div>
      </header>
      {storageError && (
        <p className="storageNotice" role="alert">
          Le navigateur n’a pas pu enregistrer tes progrès. Vérifie l’espace
          disponible ou les paramètres de stockage.
        </p>
      )}
      <main id="main" className="shell" ref={main} tabIndex={-1}>
        {screen === "home" && (
          <Home
            progress={progress}
            mistakes={mistakes}
            navigate={navigate}
            openLesson={openLesson}
            miniTest={mini}
            drafts={drafts}
            resume={resume}
          />
        )}
        {screen === "practice" && (
          <Curriculum
            progress={progress}
            openLesson={openLesson}
            miniTest={mini}
            finalTest={final}
          />
        )}
        {screen === "search" && <Search openLesson={openLesson} />}
        {screen === "expansion" && (
          <ExpansionActivity
            key={location.pathname}
            id={location.pathname.slice("/activite/".length)}
          />
        )}
        {screen === "lesson" && (
          <LessonPage
            key={lesson.id}
            lesson={lesson}
            back={() => navigate("practice")}
            start={() =>
              start({
                mode: "chapter",
                title: `${lesson.module} · ${lesson.title}`,
                chapterId: lesson.id,
                questions: getChapterQuestions(lesson.chapter),
              })
            }
          />
        )}
        {screen === "quiz" && quiz && session && (
          <QuizPage
            key={quizKey}
            quiz={quiz}
            session={session}
            onSave={(next) => {
              setSession(next);
              setDrafts(saveSession(next));
            }}
            onFinish={finish}
            onCancel={() => {
              navigate("home");
            }}
          />
        )}
        {screen === "results" && (
          <ResultsPage
            records={results}
            rewards={rewards}
            soundEnabled={settings.soundEnabled}
            onPractice={() => navigate("practice")}
            onMistakes={() => navigate("mistakes")}
            onRetry={() => {
              if (quiz) start(quiz);
            }}
          />
        )}
        {screen === "progress" && (
          <Progress
            progress={progress}
            mistakes={mistakes}
            navigate={navigate}
          />
        )}
        {screen === "mistakes" && (
          <MistakesPage
            mistakes={mistakes}
            onReview={review}
            onClear={() => {
              clearMistakes();
              setMistakes([]);
            }}
          />
        )}
        {screen === "mistakes" && <ExpansionReview />}
        {screen === "settings" && (
          <Preferences
            restored={() => {
              setProgress(loadProgress());
              setMistakes(loadMistakes());
              setSettings(loadSettings());
              setDrafts(loadSessions());
              setSession(null);
            }}
            settings={settings}
            change={(next) => {
              setSettings(next);
              saveSettings(next);
            }}
            reset={() => {
              resetAllData();
              setProgress(loadProgress());
              setMistakes([]);
              setSettings(loadSettings());
              setDrafts([]);
              setSession(null);
              navigate("home");
            }}
          />
        )}
      </main>
      <nav className="bottomNav" aria-label="Navigation principale">
        {navigation.map((item) => (
          <button
            key={item.screen}
            className={active === item.screen ? "active" : ""}
            aria-current={active === item.screen ? "page" : undefined}
            onClick={() => navigate(item.screen)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
