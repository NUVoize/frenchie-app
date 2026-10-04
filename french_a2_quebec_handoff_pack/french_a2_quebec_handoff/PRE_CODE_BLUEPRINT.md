# Pre-Code Blueprint, French A2 Québec Practice App

## 1) One-Paragraph App Definition
This app is for a learner taking an A2 CECR / Échelle québécoise 3-4 French class in Québec. It helps them practice basic French grammar, especially déterminants, through short chapters, mini-tests, mistake review, and simple explanations. Success means the learner understands why answers are wrong, improves weak categories, and feels more confident before class tests or exams.

## 2) Scope Control
### v1 Must-Haves
- Practice chapters by category.
- Mixed mini-test.
- Final mixed exam.
- Immediate feedback.
- French explanations first.
- Optional English explanation button.
- Mistake review.
- Progress by category.
- Easter egg reward layer.

### v1 Excluded
- Login.
- Backend.
- Teacher dashboard.
- AI correction.
- Speech recognition.
- Payments.

### v2+ Parking Lot
- Audio listening practice.
- Pronunciation practice.
- Short writing correction.
- AI-generated questions.
- Cloud sync.
- Printable worksheets.

### Non-Goals
- Not a full French course.
- Not official certification.
- Not a Duolingo clone.
- Not advanced French.

## 3) Users and Flows
### Personas
- Nervous learner preparing for an exam.
- Casual reviewer who wants 5-minute practice.
- Friend/tutor helping guide practice.

### Core Flows
1. Choose chapter, answer 10 questions, see result.
2. Complete mini-test, receive category breakdown.
3. Review mistakes, retry similar material.
4. Read rule, start practice from rule page.
5. Complete a perfect chapter, receive Easter egg.

### Edge Cases
- No answer selected.
- Same mistake repeated.
- Multiple answers seem possible.
- Vowel rule: l’, de l’, cet.
- Negative rule: pas de / pas d’.
- Masculine/feminine ambiguity.

## 4) Functional Requirements
1. The user can choose a chapter.
2. The user can take a mini-test.
3. The user can take a final mixed exam.
4. The user can answer multiple-choice questions.
5. The user can see immediate feedback.
6. The user can see French explanation first.
7. The user can request English explanation.
8. The app saves progress locally.
9. The app saves mistakes locally.
10. The user can review mistakes.
11. The app shows category scores.
12. The app triggers Easter egg rewards after completion events.

## 5) Non-Functional Requirements
- Fast load.
- Mobile-first.
- No personal data.
- Works without backend.
- Accessible buttons and readable text.
- Clear French UI.
- Cheap or free hosting.

## 6) Information Architecture
Screens:
- Accueil
- Pratique
- Quiz
- Résultats
- Mes erreurs
- Règles
- Paramètres

State:
- Current quiz in memory.
- Progress in localStorage.
- Mistakes in localStorage.
- Settings in localStorage.
- Question bank as static JSON.

## 7) Data Design
Entities:
- Category
- Chapter
- Question
- Explanation
- UserProgress
- MistakeRecord
- EasterEgg

Relationships:
- Category has many chapters.
- Chapter has many questions.
- Question has one explanation.
- UserProgress tracks category and chapter performance.
- MistakeRecord references a question.
- EasterEgg is triggered by quiz events.

## 8) System Architecture
Static React app loads JSON data, renders quiz screens, saves progress to localStorage, and hosts on Vercel/Netlify/GitHub Pages. No backend in v1.

Default architecture: static web app.

## 9) API Design
No API in v1.

Potential future endpoints:
- GET /questions
- GET /rules
- POST /attempts
- GET /progress/:userId

## 10) UI Plan
### Accueil
Start practice, mini-test, final exam, progress summary.

### Pratique
Category cards and chapter list.

### Quiz
Sentence, answer choices, validate button, explanation, next button.

### Résultats
Score, category breakdown, weak point, retry, review mistakes.

### Mes erreurs
List of missed questions with explanations.

### Règles
Simple grammar cards with examples.

### Paramètres
Reset progress, explanation preference, sound on/off.

## 11) Project Organization
Suggested folders:
- src/components
- src/pages
- src/data
- src/utils
- src/types
- src/styles

## 12) Testing Strategy
Unit test scoring, storage, question filtering, and reward triggers.
Integration test complete quiz flow and mistake review.
E2E test home to quiz to result.

## 13) Delivery Plan
1. Setup app shell.
2. Load question bank.
3. Build quiz engine.
4. Build progress and mistakes.
5. Build results.
6. Add rules.
7. Add Easter eggs.
8. Polish and deploy.

## 14) Risk Register
- Content mistakes, mitigate with manual review.
- Learner memorizes answers, add more questions later.
- Too much UI complexity, keep mobile-first and simple.
- Copyrighted audio risk, use replaceable local parody/original sounds.

## 15) Assumptions Log
- Class is A2 CECR / Échelle québécoise 3-4.
- Determiners are the main weakness.
- One-user app is enough.
- No backend needed.
- French-first is correct.
- English fallback helps when blocked.

## Pre-Code Gate
READY TO CODE
