# Frenchie App
## Project Status and Pre-Code Gate

## 1. Current Project State

Frenchie has moved from a simple A2 exam practice app into a two-part mobile-first French learning app:

1. **Frenchie Normal Learning Side**
   - proper French
   - grammar, reading, writing, dictée, tests
   - searchable curriculum from A2 toward B2
   - browser-local progress tracking

2. **Québec Mode**
   - separate cultural side door
   - Montréal / Québec spoken French
   - expressions, sacres, comedy, memes, archive cards
   - ceinture fléchée progression system
   - visual-first rewards

The app remains a personal project, not a commercial product.

---

## 2. Decisions

- Use a **mobile-first web app**.
- Keep the app **no-login**.
- Store progress locally in the browser.
- Use French as the default and primary language.
- Keep English help hidden behind **Explique en anglais**.
- Use a searchable content structure.
- Split the app into two visual experiences:
  - clean school mode
  - Montréal graffiti Québec mode
- Use Montréal/Québec visual cues, not generic Canada or France cues.
- Avoid maple leaf as primary iconography.
- Use Jacques-Cartier bridge, not Château Frontenac, for Montréal-focused screens.
- Do not host external cultural videos, link to them and credit creators.

---

## 3. Options

### Option A, keep current app and add content only

Pros:
- fastest path
- least refactor

Cons:
- search/progress/curriculum structure will become messy
- Québec Mode will be harder to add cleanly

### Option B, refactor into content-driven app before adding more features

Pros:
- future-proof
- easier to add levels, dictées, texts, Québec content
- cleaner progress tracking

Cons:
- more initial work

### Default Pick

Use **Option B**.

---

## 4. Assets and Documents Already Created

### Existing content packs

- Reviewed A2 question bank, 150 questions
- A2+ Grammar Survival pack, 250 questions
- Curriculum Map v1
- Content Schema v2
- Search Spec v1
- Progress Tracking Spec v1
- Codex import prompt for expansion

### Visual references

- Frenchie logo with moose mascot
- Frenchie normal app mockups
- Québec Mode graffiti app mockup
- Montréal/fleur-de-lis logo reference
- Two-phone contrast reference

### New documents in this handoff

- `NORMAL_FRENCH_APP_CONTENT_SPEC.md`
- `QUEBEC_MODE_CONTENT_SPEC.md`
- `VISUAL_UI_DIRECTION_SPEC.md`
- `PROJECT_STATUS_AND_PRE_CODE_GATE.md`

---

## 5. What Is Ready

### Product Direction

Ready.

The app concept is clear and scoped.

### Content Direction

Ready for the normal app foundation.

The current A2 and A2+ content is enough to build the next version.

### Québec Mode Direction

Ready as a spec.

Not yet ready as full content, because the culture/meme section will be built slowly over time.

### Visual Direction

Ready enough for Codex to build a strong first UI.

### Architecture Direction

Ready.

Recommended stack:

```txt
React + Vite + TypeScript
Tailwind CSS or token-based CSS modules
IndexedDB via Dexie for progress
Static JSON content files
No backend for v1
```

---

## 6. What Still Needs To Be Done Before Coding

### Required before coding

1. Confirm the current repo state.
2. Confirm whether we are refactoring an existing app or starting a new clean build.
3. Put all content files and visual assets into one final Codex handoff folder.
4. Prepare a single Codex build prompt for this next phase.

### Useful but not blocking

1. Generate ceinture fléchée progress asset states.
2. Create first Québec Mode starter content pack.
3. Add exact external links and credits for cultural references.
4. Prepare more visual mockups for Québec category pages and item pages.

---

## 7. Recommended Build Phases

### Phase 1, Main App Refactor / Foundation

Goal:
Build the normal Frenchie app as a content-driven mobile-first app.

Tasks:

1. Set up design tokens.
2. Build mobile shell.
3. Build bottom navigation.
4. Build home screen.
5. Load A2 and A2+ content.
6. Build search.
7. Build level/chapter pages.
8. Build quiz engine.
9. Build results.
10. Build mistake review.
11. Build local progress tracking.
12. Add top-right Québec Mode entry icon, but not full mode yet.

### Phase 2, Québec Mode Shell

Goal:
Build the separate Québec Mode frontend and structure.

Tasks:

1. Add `/quebec` route.
2. Add graffiti/street visual theme.
3. Add category list.
4. Add ceinture fléchée progress component.
5. Add content card layout with credits.
6. Add external link support.
7. Add final exam placeholder.

### Phase 3, Québec Starter Content

Goal:
Add initial useful/funny Québec content.

Suggested content:

- Québec parlé, 20 items
- Expressions québécoises, 20 items
- Sacres et intensité, 15 items
- Standard vs parlé, 15 items
- Culture comique placeholder cards, 10 items
- Archives et memes placeholder cards, 5 to 10 items

### Phase 4, Visual Polish

Goal:
Make the app feel like the mockups.

Tasks:

1. Optimize mascot assets.
2. Add small animations.
3. Add card hover/tap feedback.
4. Add visual-first achievements.
5. Add optional sound replay where appropriate.
6. Improve tablet layout.

---

## 8. Risks

| Risk | Impact | Likelihood | Mitigation |
|---|---:|---:|---|
| Codex overbuilds backend/login | High | Medium | Explicitly forbid backend/login in prompt |
| UI becomes too close to generated mockup images but not usable | Medium | Medium | Build component design system, not image tracing |
| Québec Mode confuses exam French | High | Medium | Separate route, clear warnings, exam_safe labels |
| Copyright issues with clips/images | Medium | Medium | External links only, credit fields, no hosted clips |
| Local progress lost if browser data cleared | Low | Medium | Accept for v1, add export later if needed |
| Search becomes weak | Medium | Medium | Use tags, normalized keywords, content index |
| Generated visual assets are too detailed for UI | Medium | High | Use them as reference, create simplified icons/assets later |

---

## 9. Dependencies

### Needed from user

- Current codebase or repo.
- Confirmation of stack if already chosen.
- Final selected visual reference images.
- Any exact Québec links, credits, clips, quotes, or media to add later.

### Needed from Codex

- Repo inspection.
- Build plan.
- Implement UI shell.
- Import content schema.
- Run tests/build.
- Provide screenshots or local preview.

---

## 10. Codex Readiness Recommendation

Do not ask Codex to “make it pretty.”

Give Codex:

1. this status document
2. normal content spec
3. Québec Mode spec
4. visual direction spec
5. existing content packs
6. visual reference images
7. one exact build prompt

Codex should work in small commits or phases.

Recommended first Codex instruction:

```txt
Read the project handoff files first. Build or refactor the app into a mobile-first content-driven Frenchie learning app. Start with the normal learning side only. Use the visual direction spec as the design guide. Do not add backend, login, payment, AI correction, or hosted media. Add only the top-right Québec Mode entry button as a placeholder route for now.
```

---

# Pre-Code Gate

## Satisfied

- [x] App purpose is defined.
- [x] Primary user is defined.
- [x] Platform is defined: mobile-first web app.
- [x] Normal learning content exists.
- [x] A2 and A2+ content packs exist.
- [x] Searchable curriculum direction is defined.
- [x] Progress tracking direction is defined.
- [x] No-login architecture is defined.
- [x] Québec Mode direction is defined.
- [x] Visual direction is defined.
- [x] Main risks are identified.

## Missing

- [ ] Current repo state confirmed.
- [ ] Final Codex prompt for this new build phase created.
- [ ] Final handoff folder assembled with all content and visual assets.

## Status

**NOT READY TO CODE**

Missing exactly:

1. Current repo/codebase state.
2. Final Codex build prompt.
3. Final assembled handoff folder.
