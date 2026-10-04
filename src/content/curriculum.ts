import {
  categoryLabels,
  chapters,
  getChapterQuestions,
} from "../data/questions";
import type { CategoryId, Chapter } from "../types";

export const rules: Record<
  CategoryId,
  { forms: string; fr: string; en: string; example: string; mistake: string }
> = {
  definis: {
    forms: "le · la · l’ · les",
    fr: "Un article défini désigne une personne ou une chose précise. Devant une voyelle ou un h muet, le et la deviennent l’. Au pluriel, on utilise les.",
    en: "Use a definite article for something specific. Le is masculine, la is feminine, l’ comes before a vowel or silent h, and les is plural.",
    example: "Le métro arrive. J’attends à l’entrée de la station.",
    mistake:
      "L’apostrophe remplace la voyelle : on écrit l’école, pas la école.",
  },
  indefinis: {
    forms: "un · une · des",
    fr: "Un article indéfini présente une personne ou une chose qui n’est pas encore précisée. Un accompagne un nom masculin, une un nom féminin, et des un nom pluriel.",
    en: "Use un or une to introduce a non-specific person or thing, like a or an in English. Des is the plural form.",
    example: "J’achète un cahier, une gomme et des crayons.",
    mistake:
      "Le genre dépend du nom : une personne, même s’il s’agit d’un homme.",
  },
  partitifs: {
    forms: "du · de la · de l’ · des",
    fr: "Pour une quantité non comptée, on utilise du, de la ou de l’. Après une négation avec ne… pas, on emploie généralement de ou d’.",
    en: "Partitive articles describe an unspecified amount: du pain, de la soupe, de l’eau. With ne… pas, they usually become de or d’.",
    example: "Je prends du café. Je ne prends pas de sucre.",
    mistake: "Après être, l’article reste : ce n’est pas du café.",
  },
  possessifs: {
    forms: "mon · ma · mes · notre · leurs…",
    fr: "Le déterminant possessif s’accorde avec le nom qui suit, et non avec la personne qui possède. Devant un nom féminin commençant par une voyelle ou un h muet, on utilise mon, ton ou son.",
    en: "The possessive agrees with the thing owned, not the owner's gender. Use mon amie, ton école or son histoire before a vowel or silent h.",
    example: "Elle cherche son sac et ses clés. Voici mon amie.",
    mistake: "Leur sac = un sac ; leurs sacs = plusieurs sacs.",
  },
  demonstratifs: {
    forms: "ce · cet · cette · ces",
    fr: "Pour montrer ou désigner : ce devant un nom masculin, cette devant un nom féminin, et ces au pluriel. Cet s’utilise devant un nom masculin commençant par une voyelle ou un h muet.",
    en: "Use ce for masculine nouns, cette for feminine nouns and ces for plural nouns. Cet replaces ce before a vowel or silent h.",
    example: "Ce quartier est calme. Cet appartement est lumineux.",
    mistake: "On écrit cette école : cet est réservé au masculin.",
  },
};

export type Lesson = {
  id: string;
  level: string;
  module: string;
  chapter: Chapter;
  activity_type: "multiple_choice";
  title: string;
  instructions: string;
  tags: string[];
  estimated_minutes: number;
  prerequisites: string[];
};
export const lessons: Lesson[] = chapters.map((chapter) => ({
  id: chapter.id,
  level: "A2",
  module: categoryLabels[chapter.category],
  chapter,
  activity_type: "multiple_choice",
  title: chapter.title,
  instructions: "Choisis le déterminant qui complète la phrase.",
  tags: [
    "grammaire",
    "déterminants",
    "règle",
    "exercice",
    chapter.category,
    chapter.subtitle,
  ],
  estimated_minutes: Math.max(
    2,
    Math.ceil(getChapterQuestions(chapter).length / 2),
  ),
  prerequisites: [],
}));
export const levels = [
  {
    id: "A2",
    title: "Les bases solides",
    description: "Articles et déterminants, une notion à la fois.",
    topics: [
      "Articles définis",
      "Articles indéfinis",
      "Articles partitifs",
      "Possessifs",
      "Démonstratifs",
    ],
  },
  {
    id: "A2+",
    title: "Contrôle et confiance",
    description: "Les verbes et les phrases du quotidien.",
    topics: [
      "Présent des verbes fréquents",
      "Passé composé",
      "Imparfait de base",
      "Passé composé ou imparfait",
      "Futur proche",
      "Négation",
      "Prépositions de lieu",
      "Questions",
      "Pronoms compléments simples",
      "Connecteurs simples",
    ],
  },
  {
    id: "B1",
    title: "Communiquer pour vrai",
    description: "Raconter, échanger et donner son opinion.",
    topics: [
      "Se présenter clairement",
      "Parler de son travail",
      "Prendre un rendez-vous",
      "Expliquer un problème",
      "Donner son opinion",
      "Lire un message",
      "Écrire une réponse",
      "Comprendre une consigne",
      "Raconter un événement",
      "Comparer deux options",
    ],
  },
  {
    id: "B1+",
    title: "Des phrases plus naturelles",
    description: "Préciser ses idées et trouver les bons mots.",
    topics: [
      "Conditionnel présent",
      "Subjonctif présent",
      "Pronoms y et en",
      "Pronoms relatifs",
      "Discours indirect",
      "Hypothèses avec si",
      "Futur simple",
      "Argumentation",
      "Registre familier et standard",
    ],
  },
  {
    id: "B2",
    title: "Nuance et aisance",
    description: "Un peu plus loin, à ton rythme.",
    topics: [
      "Argumentation",
      "Écriture formelle",
      "Français au travail",
      "Textes longs",
      "Compréhension orale",
    ],
  },
];
export function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ");
}
const searchIndex = new Map(
  lessons.map((lesson) => [
    lesson.id,
    normalize(
      [
        lesson.title,
        lesson.level,
        lesson.module,
        lesson.chapter.subtitle,
        ...lesson.tags,
        rules[lesson.chapter.category].fr,
        rules[lesson.chapter.category].example,
        ...getChapterQuestions(lesson.chapter).map(
          (q) =>
            `${q.context} ${q.sentence} ${q.explanation_fr} ${q.common_mistake_fr}`,
        ),
      ].join(" "),
    ),
  ]),
);
export function searchLessons(query: string) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return lessons.filter((lesson) =>
    words.every((word) => searchIndex.get(lesson.id)!.includes(word)),
  );
}
