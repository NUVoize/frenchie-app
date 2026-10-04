# Frenchie App, Normal Learning Side
## Content and Product Spec v1

## 1. Product Definition

Frenchie is a mobile-first French learning web app made for a learner in Québec who started around A2 CECR / Échelle québécoise 3-4 and is now progressing toward stronger functional French. The normal side of the app is the serious learning path: clean, friendly, structured, searchable, and focused on proper French for reading, writing, grammar, exam preparation, and daily communication.

This is not a commercial platform. It is a personal, fun, useful app for helping someone improve and feel proud while learning French.

---

## 2. Decisions

- The normal app is called **Frenchie**.
- The app is **100% French by default**.
- English explanations are hidden behind an explicit help action: **Explique en anglais**.
- The normal app teaches proper French first.
- The app should remain no-login and browser-local for progress tracking.
- The learner can jump between levels when ready.
- Content is searchable by topic, grammar point, activity type, level, and keywords.
- The app should feel like a fun school, not a corporate language app.
- The Québec cultural mode is separate and visually different.

---

## 3. Options

### Option A, fixed linear course

Pros:
- Easy to understand.
- Predictable path.

Cons:
- Too rigid.
- Learner cannot follow curiosity.

### Option B, searchable learning library with suggested path

Pros:
- Learner can search any topic.
- Still supports progression.
- Better long-term structure.

Cons:
- Requires better content schema.

### Default Pick

Use **Option B**.

---

## 4. Learning Levels

```txt
A2
  Foundation and survival French

A2+
  Control, confidence, common tenses, sentence structure

B1
  Daily communication, opinions, stories, messages, practical writing

B1+
  Stronger grammar, more natural sentences, nuance

B2 later
  Argumentation, register, workplace French, complex comprehension
```

---

## 5. Existing Content

### A2 Foundation, already created and reviewed

Existing reviewed question bank:

- 150 questions total
- 30 questions per category
- French-first explanations
- English fallback explanations
- Québec daily-life contexts

Categories:

1. Articles définis
2. Articles indéfinis
3. Articles partitifs
4. Possessifs
5. Démonstratifs

Question structure includes:

```txt
id
category
level
context
sentence
choices
correct_answer
explication_fr
explication_en
erreur_frequente
exemple_supplementaire
```

---

## 6. Expansion Content Already Prepared

### A2+ Grammar Survival Pack

A2+ pack contains:

- 250 new questions
- 10 chapters
- 25 questions per chapter
- French explanations
- English fallback explanations
- reviewed for prototype use

Chapters:

1. Présent des verbes fréquents
2. Passé composé
3. Imparfait de base
4. Passé composé ou imparfait
5. Futur proche
6. Négation
7. Prépositions de lieu
8. Questions
9. Pronoms compléments simples
10. Connecteurs simples

---

## 7. Future Normal Content Roadmap

### B1 Daily Communication Pack

Recommended chapters:

1. Se présenter clairement
2. Parler de son travail
3. Prendre un rendez-vous
4. Expliquer un problème
5. Donner son opinion
6. Lire un message simple
7. Écrire une réponse simple
8. Comprendre une consigne
9. Raconter un événement passé
10. Comparer deux options

Suggested activities:

- reading comprehension
- short writing
- correction exercise
- fill-in-the-blank
- mini-dialogue
- grammar recognition
- vocabulary-in-context

### B1+ Strong Grammar Pack

Recommended chapters:

1. Conditionnel présent
2. Subjonctif présent
3. Pronoms y et en
4. Pronoms relatifs qui / que / où
5. Discours indirect
6. Hypothèses avec si
7. Futur simple vs futur proche
8. Connecteurs d’argumentation
9. Registre familier vs standard
10. Phrases plus longues et naturelles

### B2 Later

Recommended modules:

- argumentation
- formal writing
- workplace French
- reading longer texts
- spoken comprehension
- idioms and register
- nuanced opinion
- advanced connectors

---

## 8. Activity Types

The app should support multiple activity types, not only multiple-choice quizzes.

### Rule Page

Purpose:
Explain one grammar or communication concept.

Includes:

- short rule
- examples
- common mistakes
- practice button
- English help button

### Multiple-Choice Quiz

Best for:

- grammar recognition
- verb forms
- determiners
- prepositions
- pronouns

### Fill-in-the-Blank

Best for:

- verb conjugation
- articles
- pronouns
- connectors

Needs support for accepted answers.

### Correction Exercise

User corrects a wrong sentence.

Example:

```txt
Incorrect: Je suis allé à la pharmacie hier, et j’achète du lait.
Correct: Je suis allé à la pharmacie hier, et j’ai acheté du lait.
```

### Reading Text

Short paragraph followed by comprehension and grammar questions.

### Dictée

Two possible versions:

1. Visual dictée: sentence appears briefly, then learner rewrites it.
2. Audio dictée: later, with recorded or generated audio.

### Mini Writing

Prompt-based short writing with checklist and model answer. AI correction can be added later, but not required now.

### Mini-Test

Mixed questions from a level, module, or chapter.

### Review Mode

Only questions and concepts previously missed.

---

## 9. Search Requirements

The search bar should search across:

- lesson title
- grammar topic
- level
- module
- chapter
- tags
- examples
- activity type
- mistakes
- text content

Example searches:

```txt
passé composé
imparfait
subjonctif présent
articles partitifs
pronoms y en
dictée
prépositions
écrire un courriel
```

Search result card format:

```txt
Passé composé
A2+ · Verbes essentiels · 5 min
Règle + exercices disponibles
```

---

## 10. Local Progress Tracking

No login. Store progress in the browser.

Recommended storage:

- IndexedDB for structured progress
- localStorage only for small preferences

Track:

- completed activities
- best score per activity
- attempts
- mistakes
- weak grammar tags
- streaks
- last practiced date
- unlocked levels
- English-help usage
- reviewed mistakes

Dashboard sections:

```txt
Vue d’ensemble
Par niveau
Mes points faibles
Mes erreurs
Badges
Statistiques simples
```

---

## 11. Main App Navigation

Mobile-first bottom navigation:

```txt
Accueil
Chercher
Pratiquer
Progrès
Révision
```

A small top-right icon opens Québec mode.

The Québec icon should use the Montréal / fleur-de-lis graphic, not a maple leaf.

---

## 12. Normal App Screen List

1. Splash / launch
2. Home
3. Search
4. Level map
5. Chapter page
6. Rule page
7. Quiz
8. Results
9. Progress dashboard
10. Mistake review
11. Settings
12. Québec mode entry transition

---

## 13. Normal App Microcopy

Correct answer:

```txt
Bien joué.
Exact.
Oui, c’est ça.
```

Wrong answer:

```txt
Pas tout à fait.
Presque.
Regardons ça doucement.
```

Search empty state:

```txt
Je n’ai rien trouvé pour ce mot.
Essaie: passé composé, articles, pronoms, dictée.
```

English fallback button:

```txt
Explique en anglais
```

Québec mode entry label:

```txt
Prêt pour le français québécois?
```

---

## 14. Data Schema Direction

Use content schema v2:

```txt
id
level
module
chapter
activity_type
title
instructions
content
questions
answers
explanations_fr
explanations_en
tags
difficulty
estimated_minutes
prerequisites
```

Legacy A2 questions can be imported and mapped into the v2 schema.

---

## 15. Normal Side Pre-Code Status

### Done

- Existing A2 content created.
- Existing A2 content reviewed.
- A2+ expansion content created.
- Curriculum map created.
- Content schema v2 created.
- Search spec created.
- Progress tracking spec created.
- Mobile-first UX direction defined.
- Visual references generated.

### Still Needed

- Confirm current codebase structure.
- Decide exact frontend stack if not already chosen.
- Import v2 content into app structure.
- Add searchable curriculum model.
- Add local progress dashboard.
- Add support for more activity types later.

---

## 16. Recommended Next Coding Step

Codex should first refactor or build the normal app foundation:

1. Design tokens and UI components
2. App shell and bottom nav
3. Content loader using schema v2
4. Search page
5. Level map
6. Chapter page
7. Quiz flow
8. Results page
9. Local progress tracking
10. Mistake review
11. Québec mode entry button only

Do not build the full Québec mode until the normal app shell is stable.
