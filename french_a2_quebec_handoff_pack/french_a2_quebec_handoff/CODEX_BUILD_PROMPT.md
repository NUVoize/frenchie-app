# Codex / Claude Build Prompt

You are building a simple French-first web app called `Français A2 Québec, Pratique 3-4`.

## Goal
Create a browser-based practice tutor for a learner in Québec taking an A2 CECR / Échelle québécoise 3-4 French class. The app must help the learner practice basic grammar, especially French déterminants, and understand mistakes.

## Tech Stack
Use:
- React
- TypeScript
- Vite
- CSS modules or simple CSS
- localStorage
- No backend
- No authentication

## Source Data
Use the provided file:
`french_a2_quebec_question_bank_v0_2_reviewed.json`

Treat it as static app data. Do not modify it at runtime.

## Language Requirements
The entire UI must be in French by default.
Every explanation should show the French explanation first.
Only show English help when the user clicks:
`Je ne comprends pas, explique en anglais`

Do not show English by default.

## Required Screens
1. Accueil
2. Choisir une pratique
3. Quiz
4. Résultats
5. Mes erreurs
6. Règles
7. Paramètres

## Navigation
Simple top or bottom navigation:
- Accueil
- Pratique
- Règles
- Erreurs
- Paramètres

## Quiz Modes
### Chapitre
- 10 questions
- One chapter or focused category
- Immediate feedback after each answer

### Mini-test
- 20 mixed questions
- Score by category

### Examen final
- 40 mixed questions
- Score by category
- Final summary

## Feedback Behavior
For every question:
- Show sentence with blank.
- Show multiple choice answers.
- User selects answer.
- User clicks `Valider`.
- Show correct/incorrect.
- Show correct answer.
- Show French explanation.
- Show button for English fallback.
- User clicks `Question suivante`.

## Progress
Store locally:
- attempts per category
- correct answers per category
- completed chapters
- mistakes
- seen Easter eggs
- settings

## Mistake Review
The user must be able to review previous mistakes, including:
- original sentence
- selected answer
- correct answer
- French explanation
- optional English explanation
- extra example

## Easter Egg Reward Engine
Create a separate reward system that listens to quiz completion events.

Events:
- chapter_completed
- chapter_perfect
- test_completed
- test_perfect
- category_completed
- category_mastered
- full_exam_completed
- full_exam_perfect
- comeback_win
- repeated_mistake

For v1, implement text messages and optional local audio file support. If no audio file exists, only show message and animation.

Suggested funny messages:
- `Chapitre terminé. Pas pire, pas pire.`
- `100 %. Là, monsieur commence à se prendre pour l’Office québécois de la langue française.`
- `Test terminé. Respire, champion.`
- `Parfait. On va bientôt te laisser corriger les menus de restaurant.`
- `Bon. On va respirer par le nez et recommencer doucement.`

## Component Suggestions
- `AppShell`
- `HomePage`
- `PracticePage`
- `QuizPage`
- `ResultsPage`
- `MistakesPage`
- `RulesPage`
- `SettingsPage`
- `QuestionCard`
- `AnswerChoice`
- `ExplanationBox`
- `ProgressSummary`
- `RewardToast`

## Utility Suggestions
- `loadQuestions()`
- `getQuestionsByCategory()`
- `getMixedQuestions(count)`
- `calculateScore()`
- `saveProgress()`
- `loadProgress()`
- `recordMistake()`
- `checkRewardTriggers()`

## UX Style
Simple, friendly, clean, not childish.
Use Québec-oriented examples, but keep the grammar standard.
No clutter.
Large buttons.
Mobile-first layout.

## Definition of Done
- The app runs locally with `npm install` and `npm run dev`.
- The question bank loads correctly.
- Chapter practice works.
- Mini-test works.
- Final exam works.
- French feedback appears first.
- English feedback appears only on click.
- Progress is saved in localStorage.
- Mistakes can be reviewed.
- Easter egg text rewards trigger after completion events.
- No backend is required.
