import { useEffect, useRef, useState } from "react";
import { categoryLabels } from "../data/questions";
import { calculateScore, scoreByCategory } from "../scoring";
import { recordEnglishHelp } from "../storage";
import type { AnswerRecord, MistakeRecord, QuizConfig, Reward } from "../types";
import { rules } from "../content/curriculum";
import { Icon } from "../components/Visuals";
import type { QuizSession } from "../session";
export function QuizPage({
  quiz,
  onFinish,
  onCancel,
  session,
  onSave,
}: {
  quiz: QuizConfig;
  onFinish: (records: AnswerRecord[]) => void;
  onCancel: () => void;
  session: QuizSession;
  onSave: (session: QuizSession) => void;
}) {
  const [index, setIndex] = useState(session.index);
  const [selected, setSelected] = useState(session.selected);
  const [validated, setValidated] = useState(session.validated);
  const [showEnglish, setShowEnglish] = useState(session.showEnglish);
  const [records, setRecords] = useState<AnswerRecord[]>(session.records);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const question = quiz.questions[index];
  const isCorrect = selected === question.correct_answer;
  function persist(changes: Partial<QuizSession>) {
    onSave({
      ...session,
      index,
      selected,
      validated,
      showEnglish,
      records,
      ...changes,
    });
  }
  useEffect(() => {
    if (index > 0) {
      questionHeading.current?.focus({ preventScroll: true });
      questionHeading.current?.scrollIntoView({ block: "start" });
    }
  }, [index]);

  function validate() {
    if (!selected || validated) return;
    setValidated(true);
    persist({ validated: true });
  }

  function next() {
    if (!validated) return;
    const record = { question, selectedAnswer: selected, isCorrect };
    const nextRecords = [...records, record];
    if (index === quiz.questions.length - 1) {
      onFinish(nextRecords);
      return;
    }
    setRecords(nextRecords);
    setIndex(index + 1);
    setSelected("");
    setValidated(false);
    setShowEnglish(false);
    persist({
      records: nextRecords,
      index: index + 1,
      selected: "",
      validated: false,
      showEnglish: false,
    });
  }

  return (
    <section className="page quizPage">
      <div className="quizTop">
        <div>
          <p className="eyebrow">{quiz.title}</p>
          <h1>
            Question {index + 1} / {quiz.questions.length}
          </h1>
        </div>
        <button onClick={onCancel}>Faire une pause</button>
      </div>
      {quiz.mode === "chapter" && (
        <aside className="chalkboard">
          <p className="eyebrow">Le petit rappel</p>
          <h2>{rules[question.category].forms}</h2>
          <p>{rules[question.category].fr}</p>
        </aside>
      )}
      <div className="meter">
        <span
          style={{ width: `${((index + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>
      <article className="questionCard">
        <p className="context">
          {categoryLabels[question.category]} · {question.context}
        </p>
        <p className="exerciseLabel">Choisis la bonne réponse.</p>
        <h2 ref={questionHeading} tabIndex={-1}>
          {question.sentence}
        </h2>
        <div className="choices">
          {question.choices.map((choice) => (
            <button
              key={choice}
              aria-pressed={selected === choice}
              disabled={validated}
              className={[
                "choice",
                selected === choice ? "selected" : "",
                validated && choice === question.correct_answer
                  ? "correct"
                  : "",
                validated &&
                selected === choice &&
                choice !== question.correct_answer
                  ? "wrong"
                  : "",
              ].join(" ")}
              onClick={() => {
                if (!validated) {
                  setSelected(choice);
                  persist({ selected: choice });
                }
              }}
            >
              {choice}
            </button>
          ))}
        </div>
        {!validated && (
          <button
            className="primary validate"
            disabled={!selected}
            onClick={validate}
          >
            Valider
          </button>
        )}
        {validated && (
          <ExplanationBox
            isCorrect={isCorrect}
            selectedAnswer={selected}
            correctAnswer={question.correct_answer}
            explanationFr={question.explanation_fr}
            explanationEn={question.explanation_en}
            commonMistakeFr={question.common_mistake_fr}
            extraExampleFr={question.extra_example_fr}
            showEnglish={showEnglish}
            onShowEnglish={() => {
              setShowEnglish(true);
              recordEnglishHelp();
              persist({ showEnglish: true });
            }}
            onNext={next}
            isLast={index === quiz.questions.length - 1}
          />
        )}
      </article>
      <p className="footnote">
        Ta place est gardée. Tu peux reprendre cette séance plus tard.
      </p>
    </section>
  );
}

function ExplanationBox(props: {
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanationFr: string;
  explanationEn: string;
  commonMistakeFr: string;
  extraExampleFr: string;
  showEnglish: boolean;
  onShowEnglish: () => void;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div className={`feedback ${props.isCorrect ? "ok" : "no"}`} role="status">
      <h3>
        {props.isCorrect
          ? "Bien joué !"
          : "Pas tout à fait. Regardons ensemble."}
      </h3>
      <p>
        Bonne réponse: <strong>{props.correctAnswer}</strong>
      </p>
      {!props.isCorrect && (
        <p>
          Ta réponse: <strong>{props.selectedAnswer}</strong>
        </p>
      )}
      <p>{props.explanationFr}</p>
      <p className="hint">{props.commonMistakeFr}</p>
      <p className="example">Exemple: {props.extraExampleFr}</p>
      {!props.showEnglish ? (
        <button onClick={props.onShowEnglish}>Explique en anglais</button>
      ) : (
        <p className="english" lang="en">
          {props.explanationEn}
        </p>
      )}
      <button className="primary" onClick={props.onNext}>
        {props.isLast ? "Voir les résultats" : "Question suivante"}
      </button>
    </div>
  );
}

export function ResultsPage({
  records,
  rewards,
  soundEnabled,
  onPractice,
  onMistakes,
  onRetry,
}: {
  records: AnswerRecord[];
  rewards: Reward[];
  soundEnabled: boolean;
  onPractice: () => void;
  onMistakes: () => void;
  onRetry: () => void;
}) {
  function replaySound() {
    const audio = new Audio("/reward.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => undefined);
  }

  const score = calculateScore(records);
  const byCategory = scoreByCategory(records);
  return (
    <section className="page">
      <img
        className="resultMascot"
        src="/brand/frenchie.png"
        alt="Frenchie, ton compagnon de pratique"
      />
      <p className="eyebrow">Séance terminée · Bravo pour ton effort !</p>
      <h1>
        {score.correct} / {score.total} · {score.percent} %
      </h1>
      {rewards.map((reward) => (
        <RewardToast reward={reward} key={reward.event} />
      ))}
      <div className="breakdown">
        {Object.entries(byCategory).map(([category, stats]) => (
          <div className="statRow" key={category}>
            <span>
              {categoryLabels[category as keyof typeof categoryLabels]}
            </span>
            <strong>
              {stats.correct}/{stats.total} · {stats.percent} %
            </strong>
          </div>
        ))}
      </div>
      <div className="actions">
        <button className="primary" onClick={onPractice}>
          Continuer la pratique
        </button>
        <button onClick={onMistakes}>Revoir mes erreurs</button>
        <button onClick={onRetry}>Refaire le test</button>
        {soundEnabled && (
          <button onClick={replaySound}>Écouter la récompense</button>
        )}
      </div>
    </section>
  );
}

export function MistakesPage({
  mistakes,
  onClear,
  onReview,
}: {
  mistakes: MistakeRecord[];
  onClear: () => void;
  onReview: () => void;
}) {
  const [openEnglish, setOpenEnglish] = useState<Record<string, boolean>>({});
  return (
    <section className="page">
      <div className="sectionHeader">
        <div>
          <p className="eyebrow">Un peu de pratique, beaucoup de progrès</p>
          <h1>Mes révisions</h1>
          <p>{mistakes.length} question{mistakes.length === 1 ? "" : "s"} de déterminants à revoir</p>
        </div>
        {mistakes.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Effacer la liste des erreurs à revoir ?"))
                onClear();
            }}
          >
            Effacer la liste
          </button>
        )}
      </div>
      {mistakes.length > 0 ? (
        <button className="primary" onClick={onReview}>
          <Icon name="bolt" /> Réviser mes erreurs
        </button>
      ) : (
        <div className="emptyState">
          <Icon name="star" />
          <h2>Aucun déterminant à revoir.</h2>
          <p>
            Les questions de déterminants qui te donnent du fil à retordre apparaîtront ici.
            Chaque erreur est une occasion d’apprendre.
          </p>
        </div>
      )}
      <div className="mistakeList">
        {mistakes.map((mistake) => (
          <article className="mistakeCard" key={mistake.id}>
            <p className="context">
              {categoryLabels[mistake.category]} · vu {mistake.count} fois
            </p>
            <h2>{mistake.sentence}</h2>
            <p>
              Ta réponse: <strong>{mistake.selectedAnswer}</strong>
            </p>
            <p>
              Bonne réponse: <strong>{mistake.correctAnswer}</strong>
            </p>
            <p>{mistake.explanationFr}</p>
            <p className="hint">{mistake.commonMistakeFr}</p>
            <p className="example">Exemple: {mistake.extraExampleFr}</p>
            {!openEnglish[mistake.id] ? (
              <button
                onClick={() => {
                  setOpenEnglish({ ...openEnglish, [mistake.id]: true });
                  recordEnglishHelp();
                }}
              >
                Explique en anglais
              </button>
            ) : (
              <p className="english" lang="en">
                {mistake.explanationEn}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function RewardToast({ reward }: { reward: Reward }) {
  return (
    <div className="reward" role="status">
      <span aria-hidden="true">✦</span>
      {reward.message}
    </div>
  );
}
