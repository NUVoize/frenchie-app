# Frenchie App, Québec Mode
## Separate Cultural Mode Spec v1

## 1. Product Definition

Québec Mode is a separate experience inside Frenchie. It is not the academic French path. It is a playful cultural doorway for discovering Montréal / Québec spoken French, expressions, sacres, comedy references, absurd archives, and memes. It helps the learner understand what people actually say in Montréal and Québec, while clearly showing what is informal, cultural, vulgar, or not appropriate for exams.

The tone is fun, proud, self-deprecating, urban, and affectionate. It should feel like skipping school after finishing class.

---

## 2. Decisions

- Québec Mode is separate from the normal Frenchie learning app.
- Entry point: a small icon in the normal app, top-right corner.
- Section title: **Prêt pour le français québécois?**
- Québec Mode has a different frontend, visual tone, and progression system.
- Use Montréal cues, not generic Canada cues.
- Do not use maple leaf visuals as the main identity.
- Use Montréal / Québec cues:
  - Jacques-Cartier bridge
  - fleur-de-lis
  - Montréal emblem-inspired shapes
  - street signs
  - dépanneur references
  - graffiti / sticker / wall texture
- External videos are linked, not hosted.
- Every cultural item must have credits and context.
- Meme/archive content will be built gradually over time.
- No hidden special final category is visible yet.

---

## 3. Options

### Option A, Québec Mode as just another category

Rejected. It would confuse the serious learning path.

### Option B, separate doorway and separate UX

Chosen. The learner enters a different experience.

---

## 4. Québec Mode Entry

Normal app top-right button:

```txt
Prêt pour le français québécois?
```

Landing copy:

```txt
Bienvenue dans le Québec parlé.

Ici, ce n’est pas l’examen.
C’est le vrai monde.

Tu vas apprendre à reconnaître les mots coupés, les expressions, les sacres, les jokes, les archives absurdes et les phrases que personne ne devrait écrire dans un devoir.
```

CTA:

```txt
J’ose entrer
```

Warning line:

```txt
Pas recommandé pour les examens.
Fortement recommandé pour survivre au dépanneur.
```

---

## 5. Québec Mode Category List

### 1. Québec parlé

Purpose:
Teach useful spoken Québec French.

Topics:

```txt
Je suis → chu / chus
Je vais → j’vas / m’a
Je m’en vais → j’m’en va
Il y a → y’a
Parce que → passque
Dépanneur → dep
Ben, là, tsé, genre
Phrase compressée
```

Example:

```txt
Français standard: Je m’en vais au dépanneur.
Québec parlé: J’m’en va au dep.
```

### 2. Expressions québécoises

Purpose:
Teach common everyday expressions.

Topics:

```txt
c’est plate
être tanné
avoir de la misère
pogner
capoter
niaiser
coudonc
pantoute
ça se peut-tu
ben voyons donc
```

### 3. Sacres et intensité

Purpose:
Explain sacres, origins, tone, register, and when not to use them.

Topics:

```txt
Pourquoi on sacre avec des mots d’église
tabarnak / tabarnouche / tabarouette
crisse / crime
câlice / calvaire
ostie / cibole
combiner les sacres
intonation: colère, surprise, admiration
quand ne pas les utiliser
```

Important register labels:

```txt
familier
très familier
vulgaire
sacre
à éviter
jamais dans un examen
```

### 4. Standard vs parlé

Purpose:
Teach the difference between real spoken language and exam-safe written French.

Prompt style:

```txt
Est-ce que tu peux écrire ça dans un examen?
```

Examples:

```txt
M’a aller au dep.
J’sais pas pantoute.
Y’a ben du monde icitte.
Chu tanné.
```

Each item should include:

```txt
Version orale québécoise
Version française standard
Registre
Utilisable dans un examen? oui / non / surtout pas
```

### 5. Culture comique québécoise

Purpose:
Introduce comedy groups, shows, creators, and references that shaped Québec humour and language.

Possible references to add over time:

```txt
RBO
Bleu Poudre
Le Cœur a ses raisons
La fin du monde est à sept heures
Sans limite
François Pérusse, possibly later as advanced content
```

Each item needs:

```txt
C’est quoi?
C’était quand?
Qui a créé ça?
Pourquoi c’est connu?
Pourquoi c’est drôle?
Quel élément de langue ou de culture on peut remarquer?
Crédit / source / lien externe
```

### 6. Archives et memes

Purpose:
Final regular category. Full absurdity, meme clips, old news segments, strange quotes, screenshots, and internet classics.

Framing:

```txt
Ici, on n’apprend pas le français d’examen.
On apprend à reconnaître quand le Québec produit un document historique sans le vouloir.
```

Each item should include context and credit.

### 7. Examen final de la Ceinture fléchée

Purpose:
Final mixed Québec Mode exam.

Suggested format:

- 50 questions total
- mixed from all visible Québec categories
- fun and educational
- no academic penalty

Sections:

```txt
Québec parlé: 10
Expressions: 10
Sacres et intensité: 8
Standard vs parlé: 8
Culture comique: 7
Archives et memes: 7
```

---

## 6. Ceinture fléchée Progression System

The Québec Mode progress system uses a ceinture fléchée metaphor, like martial arts belts or scout badges.

The learner slowly earns a bigger, richer, more complete ceinture fléchée.

Ranks:

### Rank 1, Ceinture nouée croche

Unlocked when entering Québec Mode.

```txt
Tu viens d’arriver. Tu souris, mais tu ne comprends pas encore pourquoi tout le monde dit “ben là”.
```

### Rank 2, Premier fil

Complete Québec parlé.

```txt
Tu comprends maintenant “chu”, “j’vas”, “y’a” et “m’a aller au dep”. C’est inquiétant, mais prometteur.
```

### Rank 3, Motif simple

Complete Expressions québécoises.

```txt
Tu peux entendre “c’est plate”, “j’ai de la misère” et “coudonc” sans paniquer.
```

### Rank 4, Motif rouge dangereux

Complete Sacres et intensité.

```txt
Tu sais reconnaître un sacre culturellement. Tu sais aussi pourquoi il ne faut pas tester ça dans une entrevue.
```

### Rank 5, Ceinture de survivant

Complete Standard vs parlé.

```txt
Tu peux traduire le Québec parlé en français d’examen. Gros pouvoir.
```

### Rank 6, Ceinture d’archive

Complete Culture comique québécoise.

```txt
Tu commences à comprendre pourquoi des gens citent encore des sketchs vieux de vingt ans.
```

### Rank 7, Ceinture fléchée complète

Complete Archives et memes.

```txt
Tu as vu assez de chaos pour être considéré fonctionnel en contexte québécois non supervisé.
```

### Final, Ceinture fléchée légendaire

Pass final mixed exam.

```txt
Félicitations. Tu peux maintenant entrer dans un dépanneur, entendre trois contractions, deux sacres et une référence obscure, puis répondre: “ouin, c’est ça.”
```

---

## 7. Visual Progression

The belt evolves visually:

```txt
Level 1: plain small belt icon
Level 2: one colored thread
Level 3: two or three woven threads
Level 4: visible arrow motif
Level 5: longer belt with fringe
Level 6: richer traditional pattern
Level 7: full ceremonial ceinture fléchée
Final: animated legendary version
```

---

## 8. Media and Credits

Videos are external links only.

Every cultural item must display:

```txt
creator_name
show_or_series
publisher_or_channel
original_year
external_url
source_credit
credit_display_text
rights_note
context_summary_fr
why_it_matters_fr
language_note_fr
register
exam_safe
content_warning
```

Default rights note:

```txt
Lien externe fourni pour découverte culturelle seulement. Le contenu appartient à ses créateurs, diffuseurs ou ayants droit.
```

For unknown or placeholder content:

```txt
Crédit à confirmer avant publication ou partage élargi.
```

---

## 9. Québec Content Schema Extension

Recommended fields:

```txt
id
section
track
chapter
activity_type
title
source_type
source_title
creator_or_show
external_url
media_path
transcript_excerpt
standard_french_version
spoken_quebec_version
phonetic_hint
literal_meaning
real_meaning
cultural_context
why_it_matters
language_note_fr
register
exam_safe
content_warning
prompt
choices
correct_answer
explication_fr
explication_en
difficulty_label
badge_trigger
tags
```

Activity types:

```txt
quebec_spoken
expression_match
standard_vs_spoken
sacre_intensity
culture_card
archive_card
meme_comprehension
final_exam_question
```

---

## 10. UX Rules

- Québec Mode should not depend on audio-only jokes.
- Every joke/reward needs a visible component.
- External media items need fallback text.
- Every clip/image/quote card should explain context.
- The app should not assume the learner understands why something is funny.
- The goal is cultural invitation, not mockery.
- Avoid generic Canada visuals.
- Avoid maple leaf as the main symbol.
- Prefer Montréal and Québec cues.

---

## 11. Québec Mode Navigation

Suggested routes:

```txt
/quebec
/quebec/categories
/quebec/category/:id
/quebec/item/:id
/quebec/ceinture
/quebec/examen-final
```

Bottom nav labels inside Québec mode can differ:

```txt
Accueil
Explorer
Pratiquer
Progrès
Autres
```

---

## 12. Pre-Code Status for Québec Mode

### Done

- Separate mode confirmed.
- Category structure confirmed.
- Montréal-first visual direction confirmed.
- Jacques-Cartier bridge direction confirmed.
- No maple leaf rule confirmed.
- External link / credit model confirmed.
- Ceinture fléchée progression confirmed.
- Final mixed exam idea confirmed.

### Still Needed

- Starter content pack for Québec Mode.
- Exact first set of external links.
- Exact credit data for known references.
- Placeholder items for archive/meme category.
- UI mockups for category page and item page.
- Codex import prompt for Québec Mode.
