// Add discoveries here; media stays with its original publisher.
export type CulturalReference = {
  creator_name: string;
  show_or_series: string;
  publisher_or_channel: string;
  original_year: string;
  external_url: string;
  source_credit: string;
  credit_display_text: string;
  rights_note: string;
  context_summary_fr: string;
  why_it_matters_fr: string;
  language_note_fr: string;
  register: string;
  exam_safe: boolean;
  content_warning: string;
};
export type QuebecCategory = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  example: string;
  standard: string;
  note: string;
  register: string;
  references?: CulturalReference[];
};
export const categories: QuebecCategory[] = [
  {
    id: "parle",
    icon: "⚜",
    title: "Québec parlé",
    subtitle: "Les mots prennent un raccourci",
    example: "J’m’en va au dep.",
    standard: "Je m’en vais au dépanneur.",
    note: "À l’oral, les mots se raccourcissent. Le but : reconnaître la phrase quand tu l’entends. Pour un devoir, garde la version standard.",
    register: "Très familier",
  },
  {
    id: "expressions",
    icon: "☏",
    title: "Expressions québécoises",
    subtitle: "Des classiques à reconnaître",
    example: "J’ai de la misère.",
    standard: "J’ai de la difficulté.",
    note: "Une expression à reconnaître dans une conversation du quotidien. Le contexte t’aide à comprendre ce qui est difficile pour la personne.",
    register: "Familier",
  },
  {
    id: "sacres",
    icon: "✹",
    title: "Sacres et intensité",
    subtitle: "Les mots, le ton, le contexte",
    example: "Tabarnak !",
    standard: "Une exclamation forte, dont le sens dépend du contexte.",
    note: "Un sacre peut exprimer la colère, la surprise ou l’admiration. Observe le ton et la situation. À éviter dans un examen, une entrevue ou une situation formelle.",
    register: "Vulgaire · sacre",
  },
  {
    id: "standard",
    icon: "⇄",
    title: "Standard vs parlé",
    subtitle: "Deux registres, une même langue",
    example: "J’sais pas pantoute.",
    standard: "Je ne sais pas du tout.",
    note: "En français écrit standard, conserve ne… pas et utilise du tout. Reconnaître une forme orale ne veut pas dire devoir l’employer partout.",
    register: "Très familier",
  },
  {
    id: "culture",
    icon: "☺",
    title: "Culture comique",
    subtitle: "Les artistes et leurs références",
    example: "",
    standard: "",
    note: "Les premières découvertes arrivent : chaque référence aura son contexte, le nom de ses créateurs et un lien vers la source.",
    register: "À découvrir bientôt",
  },
  {
    id: "archives",
    icon: "▣",
    title: "Archives et memes",
    subtitle: "Le petit musée des grandes jokes",
    example: "",
    standard: "",
    note: "Ce coin se remplira au fil des trouvailles. Les vidéos s’ouvriront chez leurs diffuseurs, avec les crédits et une explication de la référence.",
    register: "À découvrir bientôt",
  },
];
