# Frenchie v2 implementation handoff

Updated 2026-09-24. This records the actual implementation; the four original specifications remain the product direction. The user authorized building from those specifications and supplied visual references, with more content to follow.

## Review and resume improvements

The normal Révision page now includes missed answers from the expanded activities, alongside the original determiner review. Québec's carnet has an À revoir filter that combines with search and track selection. A pending retry remains in review until a correct answer is submitted, including after reload. Older saved answers are supported without migration. Free writing is excluded from automatic review; written answers that differ from the supplied model are explicitly described as comparisons rather than necessarily incorrect French.

The normal home and Québec library initially show five recent unfinished responses, with an expand/collapse button for all remaining drafts. Optional timestamps order these drafts; progress exports retain them. The latest Québec response controls review status independently of past successful answers, so retrying a previously mastered item incorrectly still schedules review.

Normal expanded review can be filtered by level and displays 20 items at a time. Québec cards explicitly say À revoir when a retry is needed, and an empty review list celebrates completion instead of suggesting a failed search. Selected filters use each mode's own color palette. Phone-width checks confirmed that level selection, its empty state, and Québec's cleared review state fit without horizontal overflow. All 24 regression tests and the production build pass; the existing bundle-size advisory remains a performance follow-up.

Choice order in both expansion packs now varies deterministically by item ID. It stays stable across reloads, preserves the supplied answer strings, and leaves source content untouched. The helper is `src/practice-utils.ts`.

Verification: 24 automated tests pass. Added coverage checks varied/stable answer positions, compatibility with older answers, review persistence through retries, and clearing review after success. Browser checks on the isolated local test origin verified wrong-answer → review → retry → reload → correct-answer → cleared-review in both modes, plus the normal home draft link. No browser warnings or errors were recorded during these flows.

## Québec expansion integrated

The user confirmed the French-language validation of the normal expansion. That language review is no longer an outstanding request for that pack; later additions can still receive their own review.

The nested `frenchie_quebec_content_expansion_v1/frenchie_quebec_content_expansion_v1/quebec_mode_content_expansion_v1.json` now supplies 127 Québec exercises and 10 cultural discovery cards. Its one `final_exam_spec` record is shown as future-bilan information, never treated as an answerable exercise. Original source files remain untouched.

`/quebec/carnet` provides text search and track filtering; `/quebec/fiche/:id` provides refreshable item routes. Tracks cover 52 spoken-French items, 30 expressions, 20 sacre/context items, 25 register checks and 10 cultural cards. The provided visual-dictation items use typed standard-French reformulation, not audio. Accents remain significant; apostrophe style and repeated whitespace are normalized. Other exercise types use their supplied choices. Responses, correction visibility, English help, completion and successful answers are saved separately in `frenchie_v2_quebec_pack`, including in export/import/reset. Older backups default this section to empty.

Culture cards show the supplied context, creator/source note, credit text and HTTPS external candidate link. They explicitly identify the links as unverified research candidates; some lead to explanatory articles rather than clips. No video is embedded or downloaded. The candidate research list is not presented as a verified cultural archive. The full final exam and archive-dependent belt ranks remain future work. Existing four-set starter belt progress remains intact; new track totals are shown alongside it and do not imply normal-French proficiency.

Implementation: `src/content/quebec-expansion.ts`, `src/quebec-pack-progress.ts`, `src/features/QuebecLibrary.tsx`. The existing Québec entry and category pages link to the new library. Search shows 20 results at a time. The original normal pack and the original Québec starter exercises remain available.

Checks after integration: 21 automated tests pass, including item/choice integrity, exclusion of the final specification, accent-insensitive search, HTTPS link filtering, Québec backup round-trip and isolation from normal scores. Browser verification covered transformation feedback and English help surviving reload, typed reformulation, and the cultural-credit card. The build succeeds with the previously noted large-bundle advisory.

## Content expansion integrated

The supplied `frenchie_normal_french_content_expansion_v2/normal_french_content_expansion_v2.json` is now imported directly as an additional pack. All 535 items retain their source IDs: A2 94, A2+ 138, B1 121, B1+ 106, B2 76. The original 150 determiner questions and Québec content remain unchanged.

The level tabs now show the new chapters with item lists, resume links and completion totals. `/activite/:id` supports direct links and refresh. Search includes level, module, chapter, title, tags, sentence, prompt and activity type; results are shown in batches of 20. The existing rule search remains specific to the original rules.

Five formats work: 421 quiz items, 20 reading questions, 24 corrections, 30 visual dictations and 40 writing prompts. Choice-based activities show the supplied answer and explanation. Correction/dictation compare normalized spacing and apostrophes while preserving accents, case and punctuation. Nonmatching text is described as different from the model rather than universally incorrect; learners can use a re-reading checklist. Writing is self-reviewed using a model and checklist, with no automatic grade. Dictation can hide/reveal its phrase and has no audio. English explanations remain on demand.

`frenchie_v2_expansion` stores responses, feedback state, English visibility, completion and comparison result per activity. Export/import/reset include this key; older backups default it to an empty collection. Expanded progress is reported separately from legacy determiner scores so free writing does not inflate quiz percentages.

The source pack is starter material with template repetition. The user has confirmed its French-language validation. Integration checks are not a level certification. The B2 view explicitly describes its content as initial activities.

Verification after integration: 19 automated checks pass, including all IDs/types/answer choices, searchable metadata, accent-sensitive comparison, preservation of the original bank, and backup round-trip for self-reviewed writing. Browser checks verified writing draft recovery and completion, B1 return navigation, exact correction, hidden/revealed visual dictation, reading feedback and English help. The reading feedback page fits a 390px phone viewport with no horizontal overflow or console errors. The build succeeds; bundling all supplied content currently produces a large-chunk advisory (roughly 115 KB gzipped JavaScript), so deferred content loading remains a performance follow-up.

## Working now

- Normal app: illustrated home, A2 curriculum with 23 chapter entries, searchable lesson rules/examples, lessons with French explanations and optional English help, exercises, results, mistake review, badges, progress, and preferences.
- The reviewed bank supplies 150 A2 determiner questions. Focused chapters select questions by the forms they actually teach. Chapter counts reflect available questions; some chapters reuse relevant questions from the same bank. Mini-test: 20 questions. Bilan: 40.
- Separate paused normal-app sessions survive reloads, including answers, validation feedback, and English help. Starting a different activity preserves earlier drafts. Completing one removes only that draft.
- Québec mode has its own illustrated Montréal frontend, six discovery categories, register notes, cultural-credit card support, and distinct navigation.
- Four Québec practice sets contain 16 original questions: spoken forms, expressions, sacres/context, and standard versus spoken usage. French correction is immediate; English appears only on request. Each category preserves an unfinished session and best score independently.
- A score of at least 3/4 earns each Québec practice stage. Ceinture ranks advance through the four categories in order; completing later categories early preserves the score until earlier stages are earned. Reading an introduction does not award a practice rank. Future culture/archive ranks remain unavailable.
- Local progress export from settings includes normal and Québec data, preferences, rewards, and paused sessions. Import validates the full JSON before presenting a review; an explicit in-app action replaces current progress. Early v2 files without Québec practice fields are supported. The previous carnet is retained locally and can be reviewed and restored. Failed writes roll back changed keys when storage permits.
- Deep routes for lessons and Québec pages work locally; the SPA rewrite is included for future hosting.

## Visual direction

All six supplied reference images were inspected. Normal mode uses sky blue, cream, rounded cards, chalkboard teaching panels, and the scarf-wearing Frenchie mascot. Québec uses dark navy, red, cream paper, graffiti, the supplied Montréal/fleur-de-lis logo, and the Jacques-Cartier bridge. Fonts are served locally; license files accompany them.

Assets in `public/brand/`:

| File | Origin |
| --- | --- |
| `frenchie.png` | Supplied Frenchie logo, copied unchanged |
| `quebec.png` | Supplied MTL/QC logo, copied unchanged |
| `normal-hero.png` | Generated illustrated scene using the supplied normal-mode visual direction |
| `quebec-hero.png` | Generated illustrated scene using the supplied Québec visual direction |

The two hero scenes were produced with the built-in image generation tool, then inspected. Their design briefs were: a warm French-learning scene with the mascot on the right and clear space for home copy; and a Montréal street scene with a hoodie/sunglasses moose, bridge, and graffiti cues. These are brief summaries, not recovered verbatim generation prompts. Original generated files were returned in the local Codex generated-images directory. Raster assets remain relatively large PNGs; a future image-delivery optimization pass would help first-load performance.

## Content sources and adding material

Normal curriculum metadata and rule explanations: `src/content/curriculum.ts`. Original question selection: `src/data/questions.ts`, using the reviewed handoff JSON. The new pack adapter is `src/content/expansion.ts`, its screens are in `src/features/Expansion.tsx`, and its progress store is `src/expansion-progress.ts`. Higher levels now contain the starter activities described above; they are not complete level certifications.

Québec category introductions and the complete `CulturalReference` shape: `src/content/quebec.ts`. Practice questions: `src/content/quebec-practice.ts`. Each original exercise has a stable ID, category, phrase, question, choices, exact answer, French/English notes, register, exam suitability, and language-reference link. Keep IDs stable once sessions exist. The current set size is four per category; changing it also requires updating the score threshold, copy, and regression checks.

Language references consulted for the Québec starter content:

- [Québec francisation: annotated spoken-French transcription](https://referencesfrancisation.immigration-quebec.gouv.qc.ca/moodle_ref/pluginfile.php/34516/mod_resource/content/1/N7_PO_S-03_films_Trans.pdf), for chu / je suis and pis / et. Exercises are original examples, not quoted film dialogue.
- Usito: [pantoute](https://usito.usherbrooke.ca/définitions/pantoute), [tanné](https://usito.usherbrooke.ca/définitions/tanné), [misère](https://usito.usherbrooke.ca/définitions/misère), [plate](https://usito.usherbrooke.ca/définitions/plate_2), and [dépanneur](https://usito.usherbrooke.ca/définitions/dépanneur).
- [Diane Vincent, Les sacres en français québécois, Usito](https://usito.usherbrooke.ca/articles/thématiques/vincent_1), for religious origins, expressive function, and vulgar register.

Québec vocabulary is not automatically informal or incorrect: the dépanneur exercise explicitly teaches its standard Québec usage. Sacres are taught for recognition and contextual understanding. No fixed universal ranking of their intensity is claimed.

For cultural items, supply the creator, title/show, publisher, year, original external link, attribution, rights note, French context, relevance, language note, register, exam suitability, and content warning. The UI links to HTTPS publishers and hosts no third-party media. Culture and archive collections remain unseeded until actual references are selected.

## Local data

Existing v1 keys are preserved: `fr_a2_progress`, `fr_a2_mistakes`, `fr_a2_settings`, `fr_a2_easter_eggs_seen`. V2 adds `frenchie_v2_history`, `frenchie_v2_sessions`, `frenchie_v2_quebec`, `frenchie_v2_quebec_progress`, and `frenchie_v2_quebec_sessions`. `frenchie_v2_before_import` retains the last pre-import carnet; reset removes it too. It is not nested inside exports.

Storage remains localStorage for this lightweight implementation, rather than the IndexedDB direction suggested in the spec. There is no server synchronization. JSON loading preserves arrays and handles malformed data defensively. Storage failures raise an app notice. Normal and Québec scores remain separate. Reset and export include all known Frenchie keys and ignore unrelated browser data.

The user-supplied Downloads backup dated 2026-09-13 was read and left unchanged: one completed chapter, three attempts, two paused tests. It came from the isolated test origin. Its import was verified on that test origin, followed by restoring the previous carnet and confirming the earned Québec rank returned. No file contents were sent to an external server.

## Verification

`npm run build` succeeds. `npm test` passes 16 checks covering legacy-data preservation, malformed data, mistake review, question selection, search normalization, badge thresholds, separate paused activities, export isolation, Québec content integrity, ordered ceinture progression, best-score retention, Québec reset/export participation, early-v2 backup import, recovery, invalid-file rejection, and rollback after a simulated quota failure.

Browser checks performed on an isolated local port include normal lesson completion, wrong-answer correction, English help, pause/reload/resume, several simultaneous drafts, search, progress, download, Québec direct routes, a 3/4 Québec completion, missed-answer recap, and persistent Premier fil rank after reload. New Québec pages were visually checked at 320px phone and 768px tablet widths. No horizontal overflow on the checked 320px pages; no browser errors or warnings were reported during the Québec check.

## Remaining phases

1. Review and deepen the supplied expansion, including accepted correction variants, authentic reading and broader B2 coverage.
2. Add broader Québec spoken forms and additional Québec exercise formats; Québec practice remains multiple choice.
3. Curate credited cultural discoveries and archives, then connect the remaining ceinture ranks to their practice.
4. Broaden backup compatibility when future content versions arrive; unknown obsolete question IDs currently cause import rejection rather than silently losing sessions.
5. Optimize image payloads and decide whether offline installation/service-worker support is wanted.
6. Deploy only when a hosting destination is chosen. No deployment, account integration, or backend was created.
