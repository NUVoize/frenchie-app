import { useEffect, useRef, useState } from "react";
import { categories } from "../content/quebec";
import { quebecExercises } from "../content/quebec-practice";
import { readJson, writeJson } from "../storage";
import { saveQuebecAttempt } from "../quebec-progress";

type Draft = {
  answers: string[];
  selected: string;
  validated: boolean;
  english: boolean;
};
export function QuebecPractice({
  category,
  leave,
  onComplete,
}: {
  category: string;
  leave: () => void;
  onComplete: () => void;
}) {
  const questions = quebecExercises.filter((q) => q.category === category);
  const [draft, setDraft] = useState<Draft>(() => {
    const saved = readJson<Record<string, Draft>>(
      "frenchie_v2_quebec_sessions",
      {},
    )[category];
    if (
      saved &&
      Array.isArray(saved.answers) &&
      saved.answers.length < questions.length &&
      saved.answers.every((a, i) => questions[i].choices.includes(a)) &&
      (saved.selected === "" ||
        questions[saved.answers.length].choices.includes(saved.selected))
    ) {
      return {
        answers: saved.answers,
        selected: saved.selected,
        validated: saved.validated === true && !!saved.selected,
        english: saved.english === true,
      };
    }
    return { answers: [], selected: "", validated: false, english: false };
  });
  const [result, setResult] = useState<string[] | null>(null);
  const finished = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const question = questions[draft.answers.length];
  function update(next: Draft) {
    setDraft(next);
    writeJson("frenchie_v2_quebec_sessions", {
      ...readJson("frenchie_v2_quebec_sessions", {}),
      [category]: next,
    });
  }
  useEffect(() => {
    heading.current?.focus();
  }, [draft.answers.length, result]);
  function next() {
    if (!draft.validated || finished.current) return;
    const answers = [...draft.answers, draft.selected];
    if (answers.length === questions.length) {
      finished.current = true;
      saveQuebecAttempt(category, answers);
      const sessions = readJson<Record<string, Draft>>(
        "frenchie_v2_quebec_sessions",
        {},
      );
      delete sessions[category];
      writeJson("frenchie_v2_quebec_sessions", sessions);
      setResult(answers);
      onComplete();
    } else update({ answers, selected: "", validated: false, english: false });
  }
  if (result) {
    const correct = result.filter((a, i) => a === questions[i].answer).length;
    return (
      <section className="page">
        <article className="tornPaper qcDetail">
          <p className="eyebrow">
            Série terminée · {categories.find((c) => c.id === category)?.title}
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {correct} / {questions.length} bien compris !
          </h1>
          <p>
            {correct >= 3
              ? "Ce fil est gagné ! Ton meilleur score est gardé."
              : "Encore quelques nuances à revoir. Trois bonnes réponses suffisent pour gagner ce fil."}
          </p>
          {questions
            .filter((q, i) => q.answer !== result[i])
            .map((q) => (
              <div className="qcCorrection" key={q.id}>
                <h2>{q.phrase}</h2>
                <strong>{q.answer}</strong>
                <p>{q.fr}</p>
              </div>
            ))}
          <button className="qcCta" onClick={leave}>
            Retour aux séries
          </button>
        </article>
      </section>
    );
  }
  return (
    <section className="page qcPractice">
      <div className="quizTop">
        <h1>
          Question {draft.answers.length + 1} / {questions.length}
        </h1>
        <button onClick={leave}>Faire une pause</button>
      </div>
      <article className="tornPaper qcDetail">
        <span className="pill">{question.register}</span>
        <blockquote>{question.phrase}</blockquote>
        <h2 ref={heading} tabIndex={-1}>
          {question.prompt}
        </h2>
        <div className="choices">
          {question.choices.map((choice) => (
            <button
              key={choice}
              className={`choice ${draft.selected === choice ? "selected" : ""} ${draft.validated && choice === question.answer ? "correct" : ""} ${draft.validated && draft.selected === choice && choice !== question.answer ? "wrong" : ""}`}
              aria-pressed={draft.selected === choice}
              disabled={draft.validated}
              onClick={() => update({ ...draft, selected: choice })}
            >
              {choice}
            </button>
          ))}
        </div>
        {!draft.validated ? (
          <button
            className="qcCta"
            disabled={!draft.selected}
            onClick={() => update({ ...draft, validated: true })}
          >
            Valider
          </button>
        ) : (
          <div className="qcFeedback" role="status">
            <h3>
              {draft.selected === question.answer
                ? "Bien compris !"
                : "La nuance à retenir"}
            </h3>
            <strong>{question.answer}</strong>
            <p>{question.fr}</p>
            <p className="registerWarning">
              {question.examSafe
                ? "Cette formulation convient à un écrit standard au Québec."
                : "Reconnais ce registre ; pour un écrit formel, privilégie une formulation neutre."}
            </p>
            {draft.english ? (
              <p lang="en">{question.en}</p>
            ) : (
              <button
                className="textButton"
                onClick={() => update({ ...draft, english: true })}
              >
                Explain in English
              </button>
            )}
            <a
              className="qcSource"
              href={question.source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {question.source.title} ↗
            </a>
            <button className="qcCta" onClick={next}>
              {draft.answers.length === questions.length - 1
                ? "Voir mon résultat"
                : "Question suivante"}
            </button>
          </div>
        )}
      </article>
      <p className="footnote">
        Ta place est gardée, même si tu fermes cette page.
      </p>
    </section>
  );
}
