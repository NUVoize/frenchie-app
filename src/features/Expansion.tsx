import { useState } from "react";
import {
  activities,
  activityLabels,
  chapterFor,
  expansionChapters,
  normalizeAnswer,
  searchActivities,
} from "../content/expansion";
import {
  emptyActivity,
  loadExpansionProgress,
  saveActivity,
  expansionReview,
  expansionDrafts,
  type ActivityProgress,
} from "../expansion-progress";
import { Icon } from "../components/Visuals";
import { orderedChoices } from "../practice-utils";

export function ExpansionResume() {
  const [showAll, setShowAll] = useState(false);
  const drafts = expansionDrafts();
  return drafts.length ? (
    <article className="paper">
      <h2>Mes activités en pause</h2>
      {drafts.slice(0, showAll ? undefined : 5).map((a) => (
        <a className="chapterButton" key={a.id} href={`/activite/${a.id}`}>
          <span>
            <strong>{a.chapter}</strong>
            <small>
              {a.level} · {a.title} · Reprendre ma réponse
            </small>
          </span>
          <Icon name="arrow" />
        </a>
      ))}
      {drafts.length > 5 && (
        <button aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
          {showAll ? "Afficher moins" : `Voir les ${drafts.length} activités en pause`}
        </button>
      )}
    </article>
  ) : null;
}
export function ExpansionReview() {
  const items = expansionReview();
  const [level, setLevel] = useState("");
  const [limit, setLimit] = useState(20);
  const filtered = items.filter((a) => !level || a.level === level);
  return (
    <section className="page">
      <article className="paper">
        <h2>Revoir le parcours élargi</h2>
        <p>
          {items.length
            ? `${items.length} réponse${items.length === 1 ? "" : "s"} à revoir ou à comparer au modèle.`
            : "Aucune réponse à revoir dans les nouvelles activités."}
        </p>
        <p className="muted">
          Une formulation écrite différente du modèle peut aussi être correcte.
          Les textes libres ne sont pas notés automatiquement.
        </p>
        {items.length > 0 && (
          <>
            <div className="chips" role="group" aria-label="Niveau à revoir">
              {["", "A2", "A2+", "B1", "B1+", "B2"].map((value) => (
                <button key={value} className={level === value ? "active" : ""}
                  aria-pressed={level === value}
                  onClick={() => { setLevel(value); setLimit(20); }}>
                  {value || "Tous les niveaux"}
                </button>
              ))}
            </div>
            <p role="status">{filtered.length} activité{filtered.length > 1 ? "s" : ""} à revoir{level ? ` · ${level}` : ""}</p>
            {!filtered.length && <p>Aucune réponse à revoir à ce niveau.</p>}
          </>
        )}
        {filtered.slice(0, limit).map((a) => (
          <a className="chapterButton" href={`/activite/${a.id}`} key={a.id}>
            <span>
              <strong>{a.chapter}</strong>
              <small>
                {a.level} · {a.title}
              </small>
            </span>
            <Icon name="arrow" />
          </a>
        ))}
        {limit < filtered.length && (
          <button onClick={() => setLimit(limit + 20)}>Afficher 20 activités de plus</button>
        )}
      </article>
    </section>
  );
}

export function ExpansionCatalog({ level }: { level: string }) {
  const progress = loadExpansionProgress();
  return (
    <div className="categoryGrid">
      {expansionChapters
        .filter((c) => c.level === level)
        .map((c) => {
          const completed = c.items.filter(
            (a) => progress[a.id]?.completed,
          ).length;
          const next =
            c.items.find((a) => !progress[a.id]?.completed) ?? c.items[0];
          return (
            <article className="categoryBlock" key={c.key}>
              <div className="categoryHeading">
                <Icon name="book" />
                <h2>{c.title}</h2>
              </div>
              <p>
                {c.module} · {c.items.length} activités
              </p>
              <p className="lessonScore">
                {completed} / {c.items.length} terminées
              </p>
              <a className="chapterButton" href={`/activite/${next.id}`}>
                <span>
                  <strong>
                    {completed ? "Continuer ou revoir" : "Commencer"}
                  </strong>
                  <small>
                    {activityLabels[next.activity_type]} ·{" "}
                    {next.estimated_minutes} min
                  </small>
                </span>
                <Icon name="arrow" />
              </a>
              <details className="activityIndex">
                <summary>Toutes les activités</summary>
                {c.items.map((a, i) => (
                  <a href={`/activite/${a.id}`} key={a.id}>
                    {i + 1}. {a.title}
                    {progress[a.id]?.completed ? " ✓" : ""}
                  </a>
                ))}
              </details>
            </article>
          );
        })}
    </div>
  );
}
export function ExpansionSearch({ query }: { query: string }) {
  const matches = searchActivities(query);
  const [shown, setShown] = useState(20);
  return (
    <div className="searchResults">
      <p role="status">{matches.length} activités · A2 à B2</p>
      {matches.slice(0, shown).map((a) => (
        <a className="searchResult" href={`/activite/${a.id}`} key={a.id}>
          <span className="tileIcon blue">
            <Icon name="pencil" />
          </span>
          <span>
            <strong>{a.title}</strong>
            <small>
              {a.level} · {a.chapter} · {activityLabels[a.activity_type]}
            </small>
            <small>{a.prompt}</small>
          </span>
          <Icon name="arrow" />
        </a>
      ))}
      {shown < matches.length && (
        <button onClick={() => setShown(shown + 20)}>
          Afficher 20 activités de plus
        </button>
      )}
    </div>
  );
}
export function ExpansionProgressSummary() {
  const progress = loadExpansionProgress();
  return (
    <article className="paper">
      <h2>Mon parcours élargi</h2>
      {["A2", "A2+", "B1", "B1+", "B2"].map((level) => {
        const items = activities.filter((a) => a.level === level);
        return (
          <p key={level}>
            <strong>{level}</strong> ·{" "}
            {items.filter((a) => progress[a.id]?.completed).length} /{" "}
            {items.length} activités terminées
          </p>
        );
      })}
      <p className="muted">
        Les textes libres sont relus par toi, sans note automatique. Ces
        activités complètent les chapitres de déterminants.
      </p>
    </article>
  );
}
export function ExpansionActivity({ id }: { id: string }) {
  const item = activities.find((a) => a.id === id);
  const [state, setState] = useState(
    () => loadExpansionProgress()[id] ?? emptyActivity(),
  );
  const [hidden, setHidden] = useState(false);
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);
  if (!item)
    return (
      <section className="page paper">
        <h1>Activité introuvable</h1>
        <a href="/parcours">Retour au parcours</a>
      </section>
    );
  const chapter = chapterFor(item);
  const index = chapter.items.findIndex((a) => a.id === id);
  const next = chapter.items[index + 1];
  const choice = item.choices.length > 0;
  const writing = item.activity_type === "production_ecrite";
  const correction = item.activity_type === "correction";
  const dictation = item.activity_type === "dictee_visuelle";
  function update(change: Partial<ActivityProgress>) {
    const value = { ...state, ...change };
    setState(value);
    saveActivity(id, value);
  }
  function reveal() {
    const correct = writing
      ? null
      : choice
        ? state.response === item!.correct_answer
        : normalizeAnswer(state.response) ===
          normalizeAnswer(item!.correct_answer);
    update({
      revealed: true,
      correct,
      needsReview: !writing && correct === false,
      completed: choice || (!writing && correct === true),
    });
  }
  return (
    <section className="page">
      <a
        className="textButton"
        href={`/parcours?niveau=${encodeURIComponent(item.level)}`}
      >
        ← Mon parcours
      </a>
      <div>
        <p className="eyebrow">
          {item.level} · {item.module} · {activityLabels[item.activity_type]}
        </p>
        <h1>{item.chapter}</h1>
        <p>
          Activité {index + 1} / {chapter.items.length} ·{" "}
          {item.estimated_minutes} min
        </p>
      </div>
      <article className="questionCard expansionQuestion">
        <h2>{item.title}</h2>
        {item.sentence && (!dictation || !hidden || state.revealed) && (
          <blockquote
            className={item.activity_type === "lecture" ? "readingText" : ""}
          >
            {item.sentence}
          </blockquote>
        )}
        {dictation && !state.revealed && (
          <button onClick={() => setHidden(!hidden)}>
            {hidden
              ? "Revoir la phrase"
              : "Masquer la phrase pour essayer de mémoire"}
          </button>
        )}
        <p>{item.prompt}</p>
        {choice ? (
          <div className="choices">
            {orderedChoices(item.id, item.choices).map((answer) => (
              <button
                className={`choice ${state.response === answer ? "selected" : ""} ${state.revealed && answer === item.correct_answer ? "correct" : ""} ${state.revealed && state.response === answer && state.correct === false ? "wrong" : ""}`}
                key={answer}
                disabled={state.revealed}
                aria-pressed={state.response === answer}
                onClick={() => update({ response: answer })}
              >
                {answer}
              </button>
            ))}
          </div>
        ) : (
          <label className="writtenAnswer">
            {writing ? "Mon texte" : "Ma réponse"}
            <textarea
              rows={writing ? 7 : 3}
              maxLength={20000}
              value={state.response}
              disabled={state.revealed}
              onChange={(e) => update({ response: e.target.value })}
              spellCheck={false}
              autoComplete="off"
            />
          </label>
        )}
        {!state.revealed && (
          <button
            className="primary"
            disabled={!state.response.trim()}
            onClick={reveal}
          >
            {writing
              ? "Voir un modèle et me relire"
              : correction
                ? "Comparer avec la correction"
                : "Valider"}
          </button>
        )}
        {state.revealed && (
          <div className="expansionFeedback">
            <h3>
              {writing
                ? "Un exemple possible"
                : state.correct
                  ? "Bien joué !"
                  : choice
                    ? "La réponse à retenir"
                    : "Comparons les deux versions"}
            </h3>
            <strong>{item.correct_answer}</strong>
            <p>{item.explanation_fr}</p>
            {item.common_mistake_fr && (
              <p>Le petit piège : {item.common_mistake_fr}</p>
            )}
            {item.extra_example_fr && (
              <p>Autre exemple : {item.extra_example_fr}</p>
            )}
            {!choice && !writing && !state.correct && (
              <p>
                Ta réponse diffère du modèle. Vérifie les mots, les accents et
                la ponctuation.
                {correction &&
                  " Une autre formulation correcte est possible : compare aussi le sens."}
              </p>
            )}
            {state.english ? (
              <p className="english" lang="en">
                {item.explanation_en}
              </p>
            ) : (
              <button onClick={() => update({ english: true })}>
                Explique en anglais
              </button>
            )}
            {!choice && !state.completed && (
              <>
                <fieldset className="selfReview">
                  <legend>Ma relecture</legend>
                  {[
                    writing
                      ? "Mon texte répond à toute la consigne."
                      : "J’ai comparé ma réponse au modèle.",
                    "J’ai vérifié les accords, les accents et la ponctuation.",
                    writing
                      ? "Mon message est clair et son ton convient."
                      : "Je comprends la correction.",
                  ].map((label, i) => (
                    <label key={label}>
                      <input
                        type="checkbox"
                        checked={checks[i]}
                        onChange={(e) =>
                          setChecks(
                            checks.map((v, j) =>
                              i === j ? e.target.checked : v,
                            ),
                          )
                        }
                      />
                      {label}
                    </label>
                  ))}
                </fieldset>
                <button
                  className="primary"
                  disabled={!checks.every(Boolean)}
                  onClick={() => update({ completed: true })}
                >
                  J’ai terminé ma relecture
                </button>
              </>
            )}
            {state.completed && (
              <p role="status">
                Activité terminée ✓
                {writing ? " · Relue par toi, sans note automatique." : ""}
              </p>
            )}
            <button
              onClick={() => {
                update({
                  ...emptyActivity(),
                  needsReview: state.needsReview ?? state.correct === false,
                  response: choice ? "" : state.response,
                });
                setChecks([false, false, false]);
              }}
            >
              {choice ? "Réessayer" : "Modifier ma réponse"}
            </button>
          </div>
        )}
      </article>
      <div className="actions">
        {next ? (
          <a className="primary activityNext" href={`/activite/${next.id}`}>
            Activité suivante →
          </a>
        ) : (
          <a
            className="primary activityNext"
            href={`/parcours?niveau=${encodeURIComponent(item.level)}`}
          >
            Retour au parcours
          </a>
        )}
      </div>
      <p className="footnote">
        Ton texte et ta place restent dans ce navigateur.
        {dictation ? " Exercice visuel, sans enregistrement audio." : ""}
      </p>
    </section>
  );
}
