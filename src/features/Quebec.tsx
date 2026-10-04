import { categories, type CulturalReference } from "../content/quebec";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/Visuals";
import { readJson, writeJson } from "../storage";
import {
  beltRanks,
  practiceCategories,
  quebecExercises,
} from "../content/quebec-practice";
import { beltLevel, loadQuebecProgress } from "../quebec-progress";
import { QuebecPractice } from "./QuebecPractice";
import {
  QuebecLibrary,
  QuebecPackItem,
  QuebecPackStats,
} from "./QuebecLibrary";
const sectionPaths: Record<string, string> = {
  library: "/quebec/carnet",
  home: "/quebec",
  explore: "/quebec/categories",
  belt: "/quebec/ceinture",
  practice: "/quebec/pratiquer",
};
function readQuebecRoute() {
  if (location.pathname.startsWith("/quebec/fiche/"))
    return {
      section: "fiche",
      selected: location.pathname.slice("/quebec/fiche/".length),
    };
  if (location.pathname === "/quebec/carnet")
    return { section: "library", selected: null };
  const practice = location.pathname.split("/quebec/pratiquer/")[1];
  if (practice && practiceCategories.includes(practice))
    return { section: "practice", selected: practice };
  const id = location.pathname.split("/quebec/category/")[1];
  if (id && categories.some((c) => c.id === id))
    return { section: "explore", selected: id };
  return {
    section:
      Object.keys(sectionPaths).find(
        (key) => sectionPaths[key] === location.pathname,
      ) ?? "home",
    selected: null,
  };
}
export function Quebec({ exit }: { exit: () => void }) {
  const [section, setSection] = useState(() => readQuebecRoute().section);
  const [selected, setSelected] = useState<string | null>(
    () => readQuebecRoute().selected,
  );
  const [seen, setSeen] = useState(() =>
    readJson<string[]>("frenchie_v2_quebec", []),
  );
  const [progress, setProgress] = useState(loadQuebecProgress);
  const level = beltLevel(progress);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const back = () => {
      const route = readQuebecRoute();
      setSection(route.section);
      setSelected(route.selected);
    };
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [section, selected]);
  const item = categories.find((c) => c.id === selected);
  function go(nextSection: string, nextSelected: string | null = null) {
    setSection(nextSection);
    setSelected(nextSelected);
    const path = nextSelected
      ? `/quebec/${nextSection === "practice" ? "pratiquer" : "category"}/${nextSelected}`
      : sectionPaths[nextSection];
    if (path !== location.pathname) window.history.pushState({}, "", path);
  }
  function discover(id: string) {
    go("explore", id);
  }
  function markRead(id: string) {
    const next = [...new Set([...seen, id])];
    setSeen(next);
    writeJson("frenchie_v2_quebec", next);
  }
  return (
    <div className="quebecWorld">
      <header className="qcTopbar">
        <button onClick={exit}>
          <Icon name="back" /> Retour à l’école
        </button>
        <span className="mtlStamp">MTL ⚜ QC</span>
      </header>
      <main className="shell qcShell" id="main" ref={main} tabIndex={-1}>
        {section === "library" && (
          <QuebecLibrary
            category={
              new URLSearchParams(location.search).get("categorie") ?? undefined
            }
          />
        )}
        {section === "fiche" && selected && (
          <QuebecPackItem key={selected} id={selected} />
        )}
        {section === "home" && (
          <section className="page">
            <div className="qcHero">
              <img
                className="qcScene"
                src="/brand/quebec-hero.png"
                alt="Frenchie en lunettes de soleil devant le pont Jacques-Cartier"
              />
              <img
                src="/brand/quebec.png"
                alt="Frenchie Québec, logo graffiti Montréal et fleur-de-lis"
              />
              <span className="streetSticker">
                Même langue.
                <br />
                Autre vibe.
              </span>
            </div>
            <div className="tornPaper qcIntro">
              <p className="eyebrow">Bienvenue de l’autre côté</p>
              <h1>
                Prêt pour le français <em>québécois ?</em>
              </h1>
              <p className="handwritten">
                Ici, ce n’est pas l’examen.
                <br />
                C’est le vrai monde.
              </p>
            </div>
            <button
              className="beltCard"
              onClick={() => {
                go("belt");
              }}
            >
              <span>
                <strong>Ma ceinture fléchée</strong>
                <small>{beltRanks[level]}</small>
              </span>
              <span className="wovenBelt" aria-hidden="true" />
              <Icon name="arrow" />
            </button>
            <div className="qcCategories">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className="qcCategory"
                  onClick={() => discover(c.id)}
                >
                  <span className="qcSymbol" aria-hidden="true">
                    {c.icon}
                  </span>
                  <span>
                    <strong>{c.title}</strong>
                    <small>{c.subtitle}</small>
                  </span>
                  <Icon name="arrow" />
                </button>
              ))}
            </div>
            <button
              className="qcCta"
              onClick={() => {
                go("library");
              }}
            >
              J’ose entrer <Icon name="arrow" />
            </button>
            <p className="qcWarning">
              Pas recommandé pour les examens.
              <br />
              Fortement recommandé pour survivre au dépanneur.
            </p>
          </section>
        )}
        {section === "explore" && (
          <section className="page">
            {item ? (
              <>
                <button className="textButton" onClick={() => go("explore")}>
                  <Icon name="back" /> Toutes les découvertes
                </button>
                <article className="tornPaper qcDetail">
                  <span className="pill">{item.register}</span>
                  <h1>{item.title}</h1>
                  <a
                    className="qcCta activityNext"
                    href={`/quebec/carnet?categorie=${item.id}`}
                  >
                    Ouvrir le parcours complet →
                  </a>
                  {item.example ? (
                    <>
                      <p className="eyebrow">À l’oral</p>
                      <blockquote>{item.example}</blockquote>
                      <p className="eyebrow">En français standard</p>
                      <h2>{item.standard}</h2>
                    </>
                  ) : null}
                  <p>{item.note}</p>
                  {item.references?.map((reference) => (
                    <CultureCard
                      key={reference.external_url}
                      reference={reference}
                    />
                  ))}
                  {item.example && (
                    <>
                      <p className="registerWarning">
                        À reconnaître à l’oral · À éviter dans un examen
                      </p>
                      <button onClick={() => markRead(item.id)}>
                        {seen.includes(item.id) ? (
                          <>
                            <Icon name="check" /> Découverte lue
                          </>
                        ) : (
                          "J’ai compris la nuance"
                        )}
                      </button>
                      <p className="credit">
                        Exemple pédagogique issu du carnet Frenchie. Aucune
                        citation d’artiste ou d’émission.
                      </p>
                    </>
                  )}
                </article>
                {quebecExercises
                  .filter((q) => q.category === item.id)
                  .map((q) => (
                    <article className="tornPaper qcDetail" key={q.id}>
                      <span className="pill">{q.register}</span>
                      <h2>{q.phrase}</h2>
                      <p>{q.fr}</p>
                      <p className="credit">
                        Exemple original Frenchie ·{" "}
                        {q.examSafe
                          ? "Standard au Québec"
                          : "Comprendre le registre"}
                      </p>
                      <a
                        className="qcSource"
                        href={q.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {q.source.title} ↗
                      </a>
                    </article>
                  ))}
                {practiceCategories.includes(item.id) && (
                  <button
                    className="qcCta"
                    onClick={() => go("practice", item.id)}
                  >
                    Pratiquer ces nuances · 4 questions <Icon name="arrow" />
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="tornPaper">
                  <p className="eyebrow">Le carnet de rue</p>
                  <h1>On explore ?</h1>
                  <p>
                    Quelques premières expressions pour ouvrir l’oreille. La
                    collection grandira au fil des découvertes.
                  </p>
                </div>
                <div className="qcCategories">
                  {categories.map((c) => (
                    <button
                      className="qcCategory"
                      key={c.id}
                      onClick={() => discover(c.id)}
                    >
                      <span className="qcSymbol" aria-hidden="true">
                        {c.icon}
                      </span>
                      <span>
                        <strong>{c.title}</strong>
                        <small>
                          {c.example
                            ? "4 questions et leurs nuances"
                            : "À venir"}
                        </small>
                      </span>
                      <Icon name="arrow" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>
        )}
        {section === "belt" && (
          <section className="page">
            <QuebecPackStats />
            <article className="tornPaper">
              <p className="eyebrow">Ton parcours québécois</p>
              <h1>{beltRanks[level]}</h1>
              <div className="wovenBelt beltLarge" aria-hidden="true" />
              <p>
                {level === 0
                  ? "Chaque série réussie ajoute un fil à ta ceinture. On commence par ouvrir l’oreille."
                  : "Les nuances prennent leur place. Continue à tisser ta ceinture, une série à la fois."}
              </p>
              <p>
                <strong>{level} / 4 étapes de pratique gagnées</strong>
              </p>
              <p>
                Réussis au moins 3 questions sur 4 dans chaque série, dans
                l’ordre ci-dessous. Tu peux pratiquer librement ; ton meilleur
                score reste acquis.
              </p>
            </article>
            <div className="beltRanks">
              {beltRanks.map((rank, i) => (
                <div className="tornPaper rank" key={rank}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong>{rank}</strong>
                  <small>
                    {i <= level
                      ? "Acquis ✓"
                      : i <= 4
                        ? `${categories.find((c) => c.id === practiceCategories[i - 1])?.title} · ${progress[practiceCategories[i - 1]]?.best ?? 0} %`
                        : "Futurs chapitres culturels"}
                  </small>
                </div>
              ))}
            </div>
          </section>
        )}
        {section === "practice" &&
        selected &&
        practiceCategories.includes(selected) ? (
          <QuebecPractice
            key={selected}
            category={selected}
            leave={() => go("practice")}
            onComplete={() => setProgress(loadQuebecProgress())}
          />
        ) : (
          section === "practice" && (
            <section className="page">
              <article className="tornPaper">
                <p className="eyebrow">Le français hors des cahiers</p>
                <h1>Une nuance à la fois.</h1>
                <p>
                  Quatre séries courtes pour comprendre les mots, le sens et le
                  registre. Trois bonnes réponses sur quatre pour gagner chaque
                  fil de ta ceinture.
                </p>
              </article>
              <div className="qcCategories">
                {practiceCategories.map((id) => (
                  <button
                    className="qcCategory"
                    key={id}
                    onClick={() => go("practice", id)}
                  >
                    <span>
                      <strong>
                        {categories.find((c) => c.id === id)?.title}
                      </strong>
                      <small>
                        {progress[id]
                          ? `Meilleur score : ${progress[id].best} % · ${progress[id].attempts} séance(s)`
                          : "4 questions · environ 2 minutes"}
                      </small>
                    </span>
                    <Icon name="arrow" />
                  </button>
                ))}
              </div>
            </section>
          )
        )}
      </main>
      <nav className="bottomNav qcNav" aria-label="Navigation Québec">
        {[
          { id: "home", label: "Accueil", icon: "home" as const },
          { id: "library", label: "Explorer", icon: "search" as const },
          { id: "practice", label: "Pratiquer", icon: "pencil" as const },
          { id: "belt", label: "Progrès", icon: "star" as const },
        ].map((nav) => (
          <button
            key={nav.id}
            aria-current={section === nav.id ? "page" : undefined}
            className={section === nav.id ? "active" : ""}
            onClick={() => {
              go(nav.id);
              window.scrollTo(0, 0);
            }}
          >
            <Icon name={nav.icon} />
            <span>{nav.label}</span>
          </button>
        ))}
        <button onClick={exit}>
          <Icon name="back" />
          <span>L’école</span>
        </button>
      </nav>
    </div>
  );
}

function CultureCard({ reference }: { reference: CulturalReference }) {
  let safeUrl: string | null = null;
  try {
    const url = new URL(reference.external_url);
    if (url.protocol === "https:") safeUrl = url.href;
  } catch {
    /* Incomplete references remain readable without a link. */
  }
  return (
    <article className="cultureCard">
      <span className="pill">
        {reference.register} ·{" "}
        {reference.exam_safe ? "Compatible avec un examen" : "Hors examen"}
      </span>
      <h2>{reference.show_or_series}</h2>
      <p>
        {reference.creator_name} · {reference.original_year}
      </p>
      {reference.content_warning && (
        <p className="registerWarning">{reference.content_warning}</p>
      )}
      <p>{reference.context_summary_fr}</p>
      <h3>Pourquoi cette référence ?</h3>
      <p>{reference.why_it_matters_fr}</p>
      <p>{reference.language_note_fr}</p>
      {safeUrl && (
        <a
          className="externalLink"
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Voir chez {reference.publisher_or_channel} ↗
        </a>
      )}
      <p className="credit">
        {reference.credit_display_text}
        <br />
        {reference.source_credit}
        <br />
        {reference.rights_note}
      </p>
    </article>
  );
}
