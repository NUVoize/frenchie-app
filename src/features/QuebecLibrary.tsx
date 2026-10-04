import { useState } from "react";
import {
  externalCandidate,
  finalExamSpec,
  quebecItems,
  quebecTracks,
  searchQuebecItems,
  trackByCategory,
} from "../content/quebec-expansion";
import {
  emptyQuebecItem,
  loadQuebecPack,
  saveQuebecItem,
  quebecTrackStats,
  quebecReview,
  quebecDrafts,
  type QuebecItemState,
} from "../quebec-pack-progress";
import { orderedChoices } from "../practice-utils";
const normalize = (s: string) =>
  s.normalize("NFC").replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
export function QuebecLibrary({ category }: { category?: string }) {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState(trackByCategory[category ?? ""] ?? "");
  const [limit, setLimit] = useState(20);
  const [reviewOnly, setReviewOnly] = useState(false);
  const [showAllDrafts, setShowAllDrafts] = useState(false);
  const progress = loadQuebecPack();
  const reviewIds = new Set(quebecReview(progress).map((i) => i.id));
  const drafts = quebecDrafts(progress);
  const items = searchQuebecItems(query, track).filter(
    (i) => !reviewOnly || reviewIds.has(i.id),
  );
  return (
    <section className="page">
      <article className="tornPaper qcDetail">
        <p className="eyebrow">Le carnet québécois</p>
        <h1>On ouvre l’oreille.</h1>
        <p>127 exercices et 10 découvertes culturelles.</p>
        <label>
          Rechercher un mot ou une expression
          <input
            className="qcSearchInput"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(20);
            }}
            placeholder="Chu, dépanneur, tanné…"
          />
        </label>
        <label>
          Parcours
          <select
            className="qcSearchInput"
            value={track}
            onChange={(e) => {
              setTrack(e.target.value);
              setLimit(20);
            }}
          >
            <option value="">Tous les parcours</option>
            {quebecTracks.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </article>
      {!!drafts.length && (
        <article className="tornPaper qcDetail">
          <h2>Reprendre une réponse</h2>
          {drafts.slice(0, showAllDrafts ? undefined : 5).map((i) => (
            <a
              className="chapterButton"
              key={i.id}
              href={`/quebec/fiche/${i.id}`}
            >
              {i.title} →
            </a>
          ))}
          {drafts.length > 5 && (
            <button aria-expanded={showAllDrafts} onClick={() => setShowAllDrafts(!showAllDrafts)}>
              {showAllDrafts ? "Afficher moins" : `Voir les ${drafts.length} réponses en pause`}
            </button>
          )}
        </article>
      )}
      <div className="chips">
        <button
          className={!reviewOnly ? "active" : ""}
          aria-pressed={!reviewOnly}
          onClick={() => {
            setReviewOnly(false);
            setLimit(20);
          }}
        >
          Tout explorer
        </button>
        <button
          className={reviewOnly ? "active" : ""}
          aria-pressed={reviewOnly}
          onClick={() => {
            setReviewOnly(true);
            setLimit(20);
          }}
        >
          À revoir · {reviewIds.size}
        </button>
      </div>
      <p className="qcCount" role="status">
        {items.length} découverte{items.length > 1 ? "s" : ""}
      </p>
      <div className="qcCategories qcLibraryList">
        {items.slice(0, limit).map((i) => (
          <a className="qcCategory" href={`/quebec/fiche/${i.id}`} key={i.id}>
            <span>
              <strong>{i.title}</strong>
              <small>
                {i.track} ·{" "}
                {i.activity_type === "culture_card"
                  ? "Carte culturelle"
                  : i.activity_type === "visual_dictee"
                    ? "Reformulation écrite"
                    : "Exercice"}
                {reviewIds.has(i.id) ? " · À revoir" : progress[i.id]?.completed ? " · Terminé ✓" : ""}
              </small>
            </span>
            <span aria-hidden="true">→</span>
          </a>
        ))}
      </div>
      {!items.length && (
        <article className="tornPaper">
          <p>{reviewOnly && reviewIds.size === 0
            ? "Tout est revu pour le moment. Continue tes découvertes !"
            : "Aucun résultat. Essaie un autre mot ou un autre parcours."}</p>
        </article>
      )}
      {limit < items.length && (
        <button className="qcCta" onClick={() => setLimit(limit + 20)}>
          Afficher 20 découvertes de plus
        </button>
      )}
    </section>
  );
}
export function QuebecPackStats() {
  return (
    <article className="tornPaper qcDetail">
      <h2>Mon carnet élargi</h2>
      {quebecTrackStats().map((s) => (
        <p key={s.track}>
          <strong>{s.track}</strong>
          <br />
          {s.completed} / {s.total} terminés · {s.mastered} réponses trouvées
        </p>
      ))}
      <p>
        Ces parcours complètent les quatre séries d’initiation de ta ceinture.
        Tes rangs déjà gagnés restent acquis.
      </p>
      <details>
        <summary>Le futur bilan de la ceinture</summary>
        <p>{finalExamSpec.prompt}</p>
        <p>
          Le bilan de 50 questions sera ajouté lorsque les références
          culturelles et leurs questions seront finalisées.
        </p>
      </details>
    </article>
  );
}
export function QuebecPackItem({ id }: { id: string }) {
  const item = quebecItems.find((i) => i.id === id);
  const [state, setState] = useState(
    () => loadQuebecPack()[id] ?? emptyQuebecItem(),
  );
  if (!item)
    return (
      <article className="tornPaper">
        <h1>Fiche introuvable</h1>
        <a href="/quebec/carnet">Retour au carnet</a>
      </article>
    );
  const culture = item.activity_type === "culture_card";
  const written = item.activity_type === "visual_dictee";
  const next = quebecItems.filter((i) => i.track === item.track)[
    quebecItems
      .filter((i) => i.track === item.track)
      .findIndex((i) => i.id === id) + 1
  ];
  const url = externalCandidate(item);
  function update(change: Partial<QuebecItemState>) {
    const value = { ...state, ...change };
    setState(value);
    saveQuebecItem(id, value);
  }
  function validate() {
    const correct = written
      ? normalize(state.response) === normalize(item!.correct_answer)
      : state.response === item!.correct_answer;
    update({
      revealed: true,
      completed: true,
      mastered: state.mastered || correct,
      needsReview: !correct,
    });
  }
  return (
    <section className="page">
      <a className="qcBack" href="/quebec/carnet">
        ← Le carnet québécois
      </a>
      <article className="tornPaper qcDetail">
        <p className="eyebrow">
          {item.track} · {item.chapter}
        </p>
        <span className="pill">
          {item.register} · {item.exam_safe ? "Écrit standard" : "Hors examen"}
        </span>
        <h1>{item.title}</h1>
        {item.content_warning && (
          <p className="registerWarning">{item.content_warning}</p>
        )}
        {culture ? (
          <>
            <p>{item.context_summary_fr}</p>
            <p>{item.cultural_note_fr}</p>
            <p className="credit">
              {item.credit_display_text || "Crédits à compléter."}
            </p>
            <p className="registerWarning">
              Fiche de repérage : le lien et les crédits de l’extrait restent à
              vérifier. Le lien peut mener à une page de contexte plutôt qu’à
              une vidéo.
            </p>
            {url && (
              <a
                className="externalLink"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ouvrir la source proposée ↗
              </a>
            )}
            <p className="credit">
              Contenu chez sa source d’origine. Aucun extrait hébergé par
              Frenchie.
            </p>
            <button onClick={() => update({ completed: true })}>
              {state.completed
                ? "Carte lue ✓"
                : "Marquer cette carte comme lue"}
            </button>
          </>
        ) : (
          <>
            <p className="eyebrow">À l’oral</p>
            <blockquote>{item.spoken_quebec}</blockquote>
            {item.phonetic_hint && (
              <p>Repère de prononciation : {item.phonetic_hint}</p>
            )}
            <h2>{item.prompt}</h2>
            {written ? (
              <label className="writtenAnswer">
                Ma version standard
                <textarea
                  rows={3}
                  value={state.response}
                  disabled={state.revealed}
                  maxLength={20000}
                  spellCheck={false}
                  onChange={(e) => update({ response: e.target.value })}
                />
              </label>
            ) : (
              <div className="choices">
                {orderedChoices(item.id, item.choices).map((answer) => (
                  <button
                    className={`choice ${state.response === answer ? "selected" : ""} ${state.revealed && answer === item.correct_answer ? "correct" : ""} ${state.revealed && state.response === answer && answer !== item.correct_answer ? "wrong" : ""}`}
                    disabled={state.revealed}
                    aria-pressed={state.response === answer}
                    key={answer}
                    onClick={() => update({ response: answer })}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            )}
            {!state.revealed && (
              <button
                className="qcCta"
                disabled={!state.response.trim()}
                onClick={validate}
              >
                {written ? "Comparer les versions" : "Valider"}
              </button>
            )}
            {state.revealed && (
              <div className="qcFeedback">
                <h3>La nuance à retenir</h3>
                <strong>{item.correct_answer}</strong>
                <p>{item.explication_fr}</p>
                {item.standard_french && (
                  <p>Français standard : {item.standard_french}</p>
                )}
                {written &&
                  normalize(state.response) !==
                    normalize(item.correct_answer) && (
                    <p>
                      Ta version diffère du modèle. Compare le sens, les accents
                      et les accords ; d’autres formulations peuvent convenir.
                    </p>
                  )}
                <p>{item.usage_note_fr}</p>
                {state.english ? (
                  <p lang="en">{item.explication_en}</p>
                ) : (
                  <button onClick={() => update({ english: true })}>
                    Explique en anglais
                  </button>
                )}
                <p role="status">Exercice terminé ✓</p>
                <button
                  onClick={() =>
                    update({
                      ...emptyQuebecItem(),
                      mastered: state.mastered,
                      needsReview: state.needsReview ?? !state.mastered,
                      response: written ? state.response : "",
                    })
                  }
                >
                  {written ? "Modifier ma réponse" : "Réessayer"}
                </button>
              </div>
            )}
          </>
        )}
      </article>
      {next && (
        <a className="qcCta activityNext" href={`/quebec/fiche/${next.id}`}>
          Découverte suivante →
        </a>
      )}
      <p className="qcCount">Ta place reste dans ce navigateur.</p>
    </section>
  );
}
