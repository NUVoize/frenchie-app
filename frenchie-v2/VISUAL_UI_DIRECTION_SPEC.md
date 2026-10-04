# Frenchie App Visual Direction
## Mobile-First UI and Brand Spec v1

## 1. Overall Visual Concept

Frenchie has two linked but visually distinct experiences.

1. **Normal Frenchie learning app**
   - fun school
   - warm classroom
   - clean learning cards
   - cheerful moose mascot
   - proper French

2. **Québec Mode**
   - skipping school
   - Montréal street energy
   - graffiti / stickers / wall texture
   - cultural discovery
   - spoken Québec French
   - not exam French

They share the same mascot and app family, but they should feel like two different worlds.

---

## 2. Core Visual Decisions

- Mobile-first design.
- Phone and tablet are the primary targets.
- Desktop can exist, but should not drive layout decisions.
- Use rounded cards, large buttons, big touch targets.
- Use the moose mascot as the main brand character.
- Use Montréal and Québec cues, not France and not generic Canada.
- Do not use maple leaf as the main Québec Mode identity.
- Replace Château Frontenac backgrounds with Montréal, especially Jacques-Cartier bridge.
- Top-right Québec button in the normal app should use the Montréal / fleur-de-lis graphic logo.

---

## 3. Normal App Visual Style

### Mood

```txt
fun school
friendly classroom
soft 3D
notebook and chalkboard
encouraging
clean but playful
```

### Main logo

Use the moose mascot with:

- Montreal Expos-style cap
- blue-and-white scarf
- chalkboard
- big friendly Frenchie lettering

### Background

Soft sky-blue to cream gradient.

Suggested CSS:

```css
background: linear-gradient(180deg, #DDEEFF 0%, #FFFDF7 45%, #FFF4DC 100%);
```

### Color Tokens

| Token | Color | Use |
|---|---:|---|
| `--blue-deep` | `#063B7A` | headings, outlines, nav icons |
| `--blue-main` | `#1677D2` | primary buttons, active states |
| `--blue-soft` | `#DDEEFF` | panels, highlights |
| `--cream` | `#FFF4DC` | cards, warm surfaces |
| `--paper` | `#FFFDF7` | content cards |
| `--chalk` | `#263238` | chalkboard panels |
| `--red-pop` | `#E7393F` | special CTAs, small accents |
| `--gold-star` | `#FFC857` | achievements |
| `--green-ok` | `#3CB371` | correct answers |
| `--orange-review` | `#FF9F43` | weak topics / review |

---

## 4. Québec Mode Visual Style

### Mood

```txt
skipping school
Montréal street
graffiti sticker
urban wall
old TV / archive
funny chaos
cultural initiation
```

### Required visual cues

- Jacques-Cartier bridge
- Montréal skyline / street signs
- Montréal emblem-inspired red shape
- blue fleur-de-lis
- MTL sticker/signage
- graffiti drips, spray texture, stickers
- ceinture fléchée progress object

### Avoid

- maple leaf as a primary motif
- generic Canada branding
- Paris / France cues
- Château Frontenac for this Montréal-focused app

### Québec Mode color direction

| Token | Color | Use |
|---|---:|---|
| `--qc-blue-deep` | `#061B4D` | dark graffiti background |
| `--qc-blue` | `#0057C8` | fleur-de-lis, buttons |
| `--qc-red` | `#E32227` | graffiti CTA, Montréal accent |
| `--qc-cream` | `#F7EAD2` | torn paper cards |
| `--qc-black` | `#111111` | outlines, graffiti shadows |
| `--qc-white` | `#FFFFFF` | text and sticker outlines |

---

## 5. Typography

Use Google-font-friendly options that Codex can implement easily.

### Normal App

| Role | Font | Reason |
|---|---|---|
| Display / titles | Baloo 2 | playful, round, school-like |
| Body | Nunito | readable, soft, friendly |
| Chalkboard | Patrick Hand | classroom chalk feeling |

### Québec Mode

| Role | Font | Reason |
|---|---|---|
| Graffiti / display | Bangers or Luckiest Guy | bold, comic, street energy |
| Body | Nunito | keeps readability |
| Notes / scribbles | Patrick Hand | handwritten sticker notes |

Fallback:

```css
font-family: "Nunito", system-ui, sans-serif;
```

---

## 6. Mobile Layout Rules

Target phone width:

```txt
390px
```

Main shell:

```txt
max-width: 480px
min-height: 100vh
margin: auto
padding: 16px
```

Tablet shell:

```txt
max-width: 720px
```

Touch target minimum:

```txt
48px height
```

Border radii:

```txt
cards: 24px
buttons: 999px or 18px
chips: 999px
```

---

## 7. Normal App Component Style

### Cards

- cream or paper background
- rounded 24px
- soft shadow
- dark blue text
- blue outline only when needed

### Buttons

Primary:

```txt
deep blue background
cream text
rounded pill
soft shadow
large touch target
```

Secondary:

```txt
cream background
deep blue border
deep blue text
```

Correct answer:

```txt
soft green background
green border
check icon
```

Wrong answer:

```txt
soft red background
red border
soft tone, not aggressive
```

### Chalkboard Card

Use for rules.

```txt
dark chalk background
wood frame optional
white handwritten text
yellow chalk highlight
```

---

## 8. Québec Mode Component Style

### Cards

- torn paper look
- sticker style
- thick black/blue outlines
- graffiti paint splashes
- slight rotation allowed on decorative labels
- still readable

### CTA Button

Main CTA:

```txt
red graffiti-style pill
white text
paint drips
large arrow
```

Example:

```txt
J’ose entrer
```

### Warning Label

```txt
Pas recommandé pour les examens.
Fortement recommandé pour la vraie vie.
```

Style:

- sticker / caution note
- small but visible

---

## 9. Screen Specs, Normal App

### Splash

- centered Frenchie logo
- subtitle:

```txt
Apprendre. Pratiquer. Progresser.
```

### Home

Header:

```txt
Salut ! 👋
Prêt à pratiquer ?
```

Top-right Québec mode icon.

Main card:

```txt
Continuer
Passé composé
12 min restantes
```

Grid cards:

```txt
Révision rapide
Mini-test
Chercher une notion
Mon parcours
```

Bottom quote:

```txt
Un petit pas aujourd’hui, un grand progrès demain.
```

### Quiz

- title and level
- chalkboard rule card
- exercise progress bar
- large answer buttons
- feedback panel
- bottom nav

### Results

- mascot celebration
- score
- category breakdown
- weak-topic recommendation
- buttons:

```txt
Continuer
Revoir mes erreurs
Refaire le test
```

### Search

Search prompt:

```txt
Que veux-tu pratiquer ?
```

Placeholder:

```txt
Ex: passé composé, imparfait, pronoms...
```

### Progress

- level card
- activities completed
- best score
- weak topics
- badges

---

## 10. Screen Specs, Québec Mode

### Québec Landing

Title:

```txt
Prêt pour le français québécois ?
```

Subtitle:

```txt
Ici, ce n’est pas l’examen.
C’est le vrai monde.
```

Top visuals:

- moose with sunglasses or mischievous attitude
- Jacques-Cartier bridge
- Montréal graffiti stickers
- Montréal/fleur-de-lis logo

Category cards:

```txt
Québec parlé
Expressions québécoises
Sacres et intensité
Standard vs parlé
Culture comique québécoise
Archives et memes
```

CTA:

```txt
J’ose entrer
```

### Québec Category Page

Each category should show:

- title
- short explanation
- progress toward ceinture fléchée
- list of items
- register warning where needed

### Québec Item Page

Every cultural/media item should show:

- title
- source/creator/show
- year or period
- external link
- credit
- context
- why it matters
- question/activity
- exam-safe status

---

## 11. Reference Assets Created

Use these as visual references in the project folder:

```txt
frenchie-app-logo.png
MTL-QC-logo.png
frenchie_s_colorful_montreal_french_app.png
french_lesson_in_montreal_with_frenchie_mascot.png
graffiti_québec_french_learning_app.png
a_clean_product_mockup_png_style_image_on_transpar.png
a_polished_promotional_style_ui_mockup_scene_two.png
```

Important note:

The generated mockups are references, not exact implementation files. Codex should reproduce the layout and style with HTML/CSS/components, not attempt to exactly copy image text.

---

## 12. Codex Frontend Instruction

Use this as the visual instruction for Codex:

```txt
Build Frenchie as a mobile-first playful Québec French learning web app. The normal app should feel like a fun school: soft blue and cream background, rounded paper cards, chalkboard rule panels, friendly moose mascot, large touch-friendly buttons, and French microcopy everywhere.

The Québec Mode should feel like a separate frontend: Montréal street/graffiti style, Jacques-Cartier bridge, Montréal/fleur-de-lis logo, ceinture fléchée progression, torn-paper cards, red graffiti CTA, and cultural discovery energy.

Do not use maple leaf visuals as the main Québec identity. Do not use France/Paris visual cues. Do not use Château Frontenac for the Montréal-focused visual direction.
```

---

## 13. Suggested Component List

```txt
src/components/ui/
  AppShell.tsx
  BottomNav.tsx
  Button.tsx
  Card.tsx
  ProgressBar.tsx
  Badge.tsx
  SearchInput.tsx
  AnswerChoice.tsx
  MascotHeader.tsx
  ChalkboardCard.tsx
  QuebecModeButton.tsx
  WarningSticker.tsx
  GraffitiCard.tsx
  BeltProgress.tsx
```

Feature folders:

```txt
src/features/home/
src/features/search/
src/features/curriculum/
src/features/quiz/
src/features/progress/
src/features/review/
src/features/quebec-mode/
```

---

## 14. Visual Pre-Code Status

### Done

- Main logo direction chosen.
- Moose mascot chosen.
- Montréal Expos-style cap direction chosen.
- Normal school mode mockups generated.
- Québec graffiti mode mockups generated.
- Jacques-Cartier bridge direction confirmed.
- Montréal/fleur-de-lis icon direction confirmed.
- Maple leaf avoidance confirmed.
- Mobile-first approach confirmed.

### Still Needed

- Final export of usable app assets.
- Crop / optimize logos for actual app use.
- Create SVG or simplified CSS-friendly icons where possible.
- Finalize exact font imports.
- Generate or design ceinture fléchée progress asset states.
- Produce UI implementation handoff for Codex.
