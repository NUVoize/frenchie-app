# French A2 Québec Practice App, Handoff Pack

## Project Goal
Build a simple French-first web app for a learner taking an A2 CECR / Échelle québécoise 3-4 French class in Québec. The app helps them practice basic grammar, especially déterminants, and understand mistakes through clear explanations.

## Core Product Definition
A small browser-based practice tutor for A2 Québec francisation level 3-4. The learner completes short chapters and mini-tests covering articles définis, indéfinis, partitifs, possessifs, and démonstratifs. The app is 100% French by default, with an optional button on each explanation to request an English explanation only when needed.

## v1 Decisions
- Platform: web app.
- Language: French-first, full UI in French.
- English: hidden fallback for explanations only.
- Backend: none for v1.
- Storage: localStorage.
- Data: static JSON question bank.
- Users: one learner, no login.
- Hosting: Vercel, Netlify, or GitHub Pages.
- Framework recommended: React + TypeScript + Vite.

## v1 Must-Haves
- Home screen.
- Chapter/category selection.
- Quiz screen.
- Results screen.
- Mistake review screen.
- Rules screen.
- Settings screen.
- Practice chapters by grammar topic.
- Mini-test mode.
- Final mixed exam mode.
- Local progress tracking.
- Easter egg reward system based on chapter/test completion.

## v1 Excluded
- Accounts.
- Backend database.
- Teacher dashboard.
- Payments.
- Speech recognition.
- AI correction.
- Mobile app store build.

## Question Bank Files
Use `french_a2_quebec_question_bank_v0_2_reviewed.json` as the source of truth for the prototype.

Also included:
- `french_a2_quebec_question_bank_v0_2_reviewed.md`, human-readable version.
- `french_a2_quebec_question_bank_v0_2_reviewed.csv`, spreadsheet-friendly version.
- `french_a2_quebec_question_bank_review_report_v0_2.md`, review notes.

## Core Grammar Categories
- Articles définis: le, la, l’, les.
- Articles indéfinis: un, une, des.
- Articles partitifs: du, de la, de l’, des, pas de, pas d’.
- Déterminants possessifs: mon, ma, mes, ton, ta, tes, son, sa, ses, notre, nos, votre, vos, leur, leurs.
- Déterminants démonstratifs: ce, cet, cette, ces.

## Quiz Modes
### Chapter Practice
- 10 questions.
- One focused subtopic.
- Immediate feedback after answer.
- Shows French explanation first.
- Button: `Je ne comprends pas, explique en anglais`.

### Mini-test
- 20 mixed questions.
- Covers unlocked or selected categories.
- Shows category breakdown.

### Final Mixed Exam
- 40 mixed questions.
- Covers all categories.
- Shows full report and mastery summary.

## Chapter Structure
### Définis
1. le / la
2. l’
3. les
4. révision mixte

### Indéfinis
1. un / une
2. des
3. singulier vs pluriel
4. révision mixte

### Partitifs
1. du / de la
2. de l’
3. des
4. négation, pas de / pas d’
5. révision mixte

### Possessifs
1. mon / ma / mes
2. ton / ta / tes
3. son / sa / ses
4. notre / nos, votre / vos
5. leur / leurs
6. révision mixte

### Démonstratifs
1. ce / cette
2. cet
3. ces
4. révision mixte

## Easter Egg System
Easter eggs are triggered by learning events, not by random clicks.

Events:
- `chapter_completed`
- `chapter_perfect`
- `test_completed`
- `test_perfect`
- `category_completed`
- `category_mastered`
- `full_exam_completed`
- `full_exam_perfect`
- `comeback_win`
- `repeated_mistake`

Reward examples:
- short sound
- funny message
- badge
- confetti animation

Copyright note: use original/parody sound recordings or replaceable local audio files. Avoid actual copyrighted TV clips in any public version.

## LocalStorage Data
Suggested keys:
- `fr_a2_progress`
- `fr_a2_mistakes`
- `fr_a2_settings`
- `fr_a2_easter_eggs_seen`

## Definition of Done
- User can start a chapter.
- User can answer questions.
- User sees French feedback immediately.
- User can request English explanation.
- User can complete mini-test.
- User can complete final exam.
- Progress is saved locally.
- Mistakes are reviewable.
- Easter eggs trigger after completion events.
- App works on mobile and desktop.
