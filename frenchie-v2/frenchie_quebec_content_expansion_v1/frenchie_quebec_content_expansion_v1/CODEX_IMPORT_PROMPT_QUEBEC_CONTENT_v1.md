# Codex Import Prompt, Québec Mode Content v1

Read this folder before implementing. Import `quebec_mode_content_expansion_v1.json` as the source of truth for the Québec Mode starter content.

Do not hardcode content into components. The app should render tracks, chapters, cards, quizzes, and cultural links from data.

Québec Mode must remain a separate route and UX from the normal French learning app. It is accessed through the special Montréal/Québec icon.

Rules:

- Use external links only for videos.
- Show credit/context fields on every cultural item.
- Do not host copyrighted clips by default.
- Mark `exam_safe: false` items clearly as not for exams.
- Keep all interface text in French.
- English explanations are shown only behind `Explique en anglais`.
- Keep progress separate from normal French progress.
- Use visual-first badge rewards for ceinture fléchée progression.

First phase:

1. Load Québec content JSON.
2. Add Québec Mode track list.
3. Add chapter/item rendering.
4. Add culture card display with credits and external link button.
5. Add basic quizzes for transformation, expression_match, exam_safe_check, visual_dictee.
6. Add ceinture fléchée progress placeholder.
