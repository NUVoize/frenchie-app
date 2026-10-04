# Codex Import Prompt, Frenchie Normal French Content Expansion v2

Use this folder to import more normal French learning content into the Frenchie app.

## Files

- `normal_french_content_expansion_v2.json`, source of truth for app import
- `normal_french_content_expansion_v2.csv`, spreadsheet-friendly version
- `normal_french_content_expansion_v2.md`, human-readable review version
- `NORMAL_FRENCH_CHAPTER_MAP_v2.md`, coverage summary
- `CONTENT_REVIEW_NOTES_v2.md`, limitations and review notes

## Goal

Add this content to the normal French side only. Do not mix it into Québec Mode.

The content covers A2, A2+, B1, B1+, and B2 starter material with quizzes, correction exercises, visual dictées, reading comprehension, and writing prompts.

## Rules

- Keep the interface French-first.
- Keep English explanations hidden behind `Explique en anglais`.
- Preserve previous A2 and A2+ content.
- Merge this as an additional content pack, not as a replacement.
- Ensure search indexes `level`, `module`, `chapter`, `title`, `tags`, `sentence`, `prompt`, and `activity_type`.
- Use local browser progress tracking.
- Do not add backend/login.

## Suggested import behavior

Treat each item as a generic `ActivityItem`. Multiple-choice items use `choices`. Correction and writing items use `correct_answer` as model answer. Dictée items use `sentence` as the phrase to reproduce.

Total items in this pack: 535.
