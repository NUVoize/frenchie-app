import rawQuestions from "../../french_a2_quebec_handoff_pack/french_a2_quebec_handoff/french_a2_quebec_question_bank_v0_2_reviewed.json";
import type { CategoryId, Chapter, Question } from "../types";

export const categoryLabels: Record<CategoryId, string> = {
  definis: "Articles définis",
  indefinis: "Articles indéfinis",
  partitifs: "Articles partitifs",
  possessifs: "Déterminants possessifs",
  demonstratifs: "Déterminants démonstratifs",
};

export const chapters: Chapter[] = [
  {
    id: "definis-le-la",
    category: "definis",
    title: "le / la",
    subtitle: "Masculin ou féminin singulier",
    offset: 0,
  },
  {
    id: "definis-l",
    category: "definis",
    title: "l’",
    subtitle: "Devant une voyelle",
    offset: 5,
  },
  {
    id: "definis-les",
    category: "definis",
    title: "les",
    subtitle: "Noms pluriels précis",
    offset: 10,
  },
  {
    id: "definis-mixte",
    category: "definis",
    title: "révision mixte",
    subtitle: "Tous les articles définis",
    offset: 20,
  },
  {
    id: "indefinis-un-une",
    category: "indefinis",
    title: "un / une",
    subtitle: "Singulier non précis",
    offset: 0,
  },
  {
    id: "indefinis-des",
    category: "indefinis",
    title: "des",
    subtitle: "Pluriel non précis",
    offset: 8,
  },
  {
    id: "indefinis-singulier-pluriel",
    category: "indefinis",
    title: "singulier vs pluriel",
    subtitle: "Choisir selon le nom",
    offset: 14,
  },
  {
    id: "indefinis-mixte",
    category: "indefinis",
    title: "révision mixte",
    subtitle: "Tous les indéfinis",
    offset: 20,
  },
  {
    id: "partitifs-du-de-la",
    category: "partitifs",
    title: "du / de la",
    subtitle: "Quantités non comptées",
    offset: 0,
  },
  {
    id: "partitifs-de-l",
    category: "partitifs",
    title: "de l’",
    subtitle: "Devant une voyelle",
    offset: 6,
  },
  {
    id: "partitifs-des",
    category: "partitifs",
    title: "des",
    subtitle: "Quantités au pluriel",
    offset: 12,
  },
  {
    id: "partitifs-negation",
    category: "partitifs",
    title: "pas de / pas d’",
    subtitle: "La négation des quantités",
    offset: 16,
  },
  {
    id: "partitifs-mixte",
    category: "partitifs",
    title: "révision mixte",
    subtitle: "Tous les partitifs",
    offset: 20,
  },
  {
    id: "possessifs-mon",
    category: "possessifs",
    title: "mon / ma / mes",
    subtitle: "Ce qui est à moi",
    offset: 0,
  },
  {
    id: "possessifs-ton",
    category: "possessifs",
    title: "ton / ta / tes",
    subtitle: "Ce qui est à toi",
    offset: 5,
  },
  {
    id: "possessifs-son",
    category: "possessifs",
    title: "son / sa / ses",
    subtitle: "Ce qui est à lui ou à elle",
    offset: 10,
  },
  {
    id: "possessifs-notre-votre",
    category: "possessifs",
    title: "notre / nos, votre / vos",
    subtitle: "Nous et vous",
    offset: 15,
  },
  {
    id: "possessifs-leur",
    category: "possessifs",
    title: "leur / leurs",
    subtitle: "Ce qui est à eux",
    offset: 20,
  },
  {
    id: "possessifs-mixte",
    category: "possessifs",
    title: "révision mixte",
    subtitle: "Tous les possessifs",
    offset: 20,
  },
  {
    id: "demonstratifs-ce-cette",
    category: "demonstratifs",
    title: "ce / cette",
    subtitle: "Montrer un nom singulier",
    offset: 0,
  },
  {
    id: "demonstratifs-cet",
    category: "demonstratifs",
    title: "cet",
    subtitle: "Masculin devant voyelle",
    offset: 8,
  },
  {
    id: "demonstratifs-ces",
    category: "demonstratifs",
    title: "ces",
    subtitle: "Montrer au pluriel",
    offset: 15,
  },
  {
    id: "demonstratifs-mixte",
    category: "demonstratifs",
    title: "révision mixte",
    subtitle: "Tous les démonstratifs",
    offset: 20,
  },
];

export function loadQuestions(): Question[] {
  return rawQuestions as Question[];
}

export function getQuestionsByCategory(category: CategoryId): Question[] {
  return loadQuestions().filter((question) => question.category === category);
}

export function getChapterQuestions(chapter: Chapter): Question[] {
  const categoryQuestions = getQuestionsByCategory(chapter.category);
  const focusedForms: Record<string, string[]> = {
    "definis-le-la": ["le", "la"],
    "definis-l": ["l’"],
    "definis-les": ["les"],
    "indefinis-un-une": ["un", "une"],
    "indefinis-des": ["des"],
    "partitifs-du-de-la": ["du", "de la"],
    "partitifs-de-l": ["de l’"],
    "partitifs-des": ["des"],
    "partitifs-negation": ["de", "d’"],
    "possessifs-mon": ["mon", "ma", "mes"],
    "possessifs-ton": ["ton", "ta", "tes"],
    "possessifs-son": ["son", "sa", "ses"],
    "possessifs-notre-votre": ["notre", "nos", "votre", "vos"],
    "possessifs-leur": ["leur", "leurs"],
    "demonstratifs-ce-cette": ["ce", "cette"],
    "demonstratifs-cet": ["cet"],
    "demonstratifs-ces": ["ces"],
  };
  const forms = focusedForms[chapter.id];
  if (forms)
    return categoryQuestions
      .filter((q) =>
        forms.includes(q.correct_answer.toLowerCase().replace(/'/g, "’")),
      )
      .slice(0, 10);
  const rotated = [
    ...categoryQuestions.slice(chapter.offset),
    ...categoryQuestions.slice(0, chapter.offset),
  ];
  return rotated.slice(0, 10);
}

export function getMixedQuestions(
  count: number,
  categories?: CategoryId[],
): Question[] {
  const source = categories?.length
    ? loadQuestions().filter((question) =>
        categories.includes(question.category),
      )
    : loadQuestions();
  return shuffle(source).slice(0, count);
}

export function shuffle<T>(items: T[]): T[] {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}
