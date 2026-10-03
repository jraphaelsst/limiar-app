# Nós no Limiar — visual identity v0.1

> **Code source of truth:** `src/theme/` (tokens.ts · typography.ts · fonts.ts). This doc explains the
> values and the rules; if the two ever disagree, the code wins and this doc gets fixed.
> Decisions and who made them: [`decisions.md`](decisions.md). Mockup analysis: [`mockup-v0-decomposition.md`](mockup-v0-decomposition.md).

## 1. Character

Editorial, warm, adult. Off-white paper, near-black ink, wine used sparingly for actions, analog
torn-paper collage for imagery. It must never read as a hospital app, a children's app or generic
self-help (spec §18).

Three rules hold everything together:
1. **Wine means "act".** Primary buttons, the active tab, selected states. Not decoration.
2. **Serif speaks, sans operates.** Cormorant for what the brand says, Lora for what you read, Inter for what you tap.
3. **Imagery is collage, never UI.** Text, icons and controls are always native, never baked into a bitmap.

## 2. Logo

| Asset | File | Use |
|---|---|---|
| Lockup, dark ink | `assets/brand/logo-lockup.png` (1209×716) | default, on off-white / paper / sand |
| Lockup, light ink | `assets/brand/logo-lockup-light.png` | on wine or photography |
| Mark, dark / light | `assets/brand/logo-mark{,-light}.png` (1151×403) | compact headers, app icon base, favicon |
| Originals | `docs/design/brand-source/` | never edit; the lockup original is rotated 90° |

- Widths: **240 pt** on welcome, **176 pt** in headers (mockup proportions).
- Clear space: at least the height of the "N" of NÓS on every side; never less than 16 pt.
- Never retype the wordmark in a font, stretch, recolor outside ink/off-white, or add effects.
- Pending: vector SVG (trace once Homebrew `potrace` is available).

## 3. Color

### Palette

| Token (`palette.*`) | Hex | Origin |
|---|---|---|
| `offWhite` | `#F3F0EA` | spec §18 registered base — **app background** |
| `paper` | `#FAF7F1` | raised surfaces (cards, search, list rows, tab bar) |
| `linen` | `#ECE7DE` | neutral category tile, pressed surface |
| `sand` | `#D8CBB8` | spec §18 registered base — chips, featured-card ground |
| `rose` | `#E9D9CF` | wine tint — highlighted tile, icon/check badges |
| `tan` | `#E7DAC8` | warm tint — alternate highlighted tile |
| `ink` | `#222222` | spec §18 registered base — headlines, primary text |
| `stone` | `#625A4F` | body text (measured from mockup) |
| `ash` | `#6E665C` | captions, inactive nav (mockup `#908A7F` darkened for contrast) |
| `charcoal` | `#524A44` | dark chip |
| **`wine`** | **`#651B19`** | **primary**, sampled from the mockup CTAs (spec §18 allows sampling) |
| `wineDeep` | `#4E1412` | pressed primary |
| `wineBright` | `#88322F` | filled emphasis icons |
| `sun` | `#782B20` | **illustration only**, the collage circle |
| `border` | `#8E8172` | functional outline (inputs) |
| `hairline` | `#DDD4C6` | decorative divider |
| `moss` / `brick` / `ochre` | `#36563E` / `#8B2420` / `#73521D` | success / error / warning (not in the mockup) |

Components use the **semantic** names in `color.*` (e.g. `color.primary`, `color.textBody`), never `palette.*`.

### Contrast (WCAG 2.2, measured)

| Pair | Ratio | Verdict |
|---|---:|---|
| ink on off-white | 13.99 | ✅ any text |
| stone (body) on off-white / paper | 5.97 / 6.35 | ✅ body text |
| ash (caption, tab) on off-white / paper | 4.97 / 5.28 | ✅ small text |
| wine on off-white | 10.71 | ✅ |
| off-white on wine (button label) | 10.71 | ✅ |
| off-white on charcoal (chip) | 7.62 | ✅ |
| ink on rose | 11.58 | ✅ |
| border on paper | 3.55 | ✅ non-text UI (≥ 3:1) |
| **stone on sand** | **4.25** | ❌ **use ink on sand, never stone** |
| ash on sand | 3.54 | ❌ never |

### Rules
- One primary action per screen in wine. Secondary actions are paper pills or text links.
- `sun` red is for illustrations only. It is brighter than `wine`, and using both in UI makes the palette look accidental.
- Status colors always come with words and an icon, never color alone (spec §17).
- Light theme only for now. **Open:** dark mode (spec and mockup are silent).

## 4. Typography

| Role | Family | Used for |
|---|---|---|
| Display | **Cormorant Garamond** 500 / 600 | headlines, greeting, section + card titles, button labels |
| Body | **Lora** 400 / 500 | paragraphs, descriptions, activity steps |
| UI | **Inter** 400 / 500 / 600 | search, labels, chips, tabs, captions, links |

All three are open-licensed (SIL OFL) and bundled through `@expo-google-fonts/*`, so the app works offline.

### Scale (pt, line height)

| Variant | Font | Size / LH | Example |
|---|---|---|---|
| `display` | Cormorant 500 | 38 / 42 | "Uma nova fase." |
| `h1` | Cormorant 500 | 34 / 38 | "Mais tempo para você" |
| `h2` | Cormorant 500 | 28 / 32 | "Olá, que bom ter você aqui!" |
| `h3` | Cormorant 500 | 23 / 28 | "Destaque da semana" |
| `cardTitle` | Cormorant 600 | 20 / 24 | "Como criar hábitos que fazem bem" |
| `button` | Cormorant 600 | 20 / 24 | "Começar agora →" |
| `body` | Lora 400 | 17 / 26 | descriptions |
| `bodySmall` | Lora 400 | 15 / 22 | card summaries |
| `label` / `link` | Inter 500 | 15 / 20 | "Já tenho uma conta", "Ver todos" |
| `input` | Inter 400 | 16 / 22 | search field |
| `caption` | Inter 400 | 14 / 20 | list subtitles, meta row |
| `chip` | Inter 600, uppercase, +0.8 tracking | 12 / 16 | "BEM-ESTAR" |
| `tabLabel` | Inter 500 | 12 / 16 | "Início" |

- Sizes scale with the OS text-size setting; never disable font scaling (spec §17).
- Cormorant has a small x-height, so its sizes are set ~15 % above a typical serif. Approved on an iPhone on 2026-10-03.
- **Numbers:** Cormorant defaults to old-style figures ("192" reads like "1g2"), so every Cormorant style forces lining figures (`fontVariant: ['lining-nums']`). Emergency numbers are set in Inter.
- **Accents:** Cormorant sets accents high and slightly right (á, ê, ó…). Accepted as brand character on 2026-10-03; the logo's tagline ("contemporânea") shares the trait.
- Uppercase only for chips and the logo. No justified text. Headlines left-aligned (the logo is the only centered element).

## 5. Space, shape, motion

| Group | Values |
|---|---|
| Spacing (`space.*`) | 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 |
| Gutter | 24 pt (16 pt below 360-pt width) |
| Rhythm | 32 between sections · 16 title→content · 12 between cards |
| Radius | 8 small · 12 tile · 16 card · 24 panel · pill buttons/chips/search |
| Sizes | touch ≥ 48 · button 56 · field 52 · icon 24 · category tile 52 · icon badge 44 |
| Elevation | one soft card shadow (ink 6 %, 16 blur, 4 offset), optional; surfaces separate mainly by fill |
| Motion | 120 feedback · 180 state · 240 panels; ease-out; off when the OS asks to reduce motion |

## 6. Iconography

- **Phosphor** (`phosphor-react-native`), 24 pt, `light` weight; `fill` weight only for the active tab / a selected state.
- Filled variant only for the **active** tab and for an explicitly selected state. The mockup's mix of outline and filled icons in one list (conflict C12) is not carried over.
- Saved items use **bookmark**, not heart (spec §18 "avoid excessive hearts"; mockup conflicts C1/C2).

## 7. Imagery — collage

- Ingredients: off-white paper, torn bands of sand / charcoal / gray / wine, one **sun circle** (`sun`), dried botanicals with low saturation, a woman seen from behind or in profile.
- Placements: welcome hero (top) · content hero (full-bleed, under the status bar) · featured card ground · corner bleed on list pages.
- Text never sits on busy collage. Use a paper area or an opaque control background.
- Collage layers must come as **separate production assets**. The mockup is a flattened reference.
- **Welcome screen: no photography** (decided 2026-10-03, see `decisions.md`). Photography is allowed on content screens.

## 8. Open items

| Item | Owner |
|---|---|
| Vector SVG of the logo | Claude (needs `potrace`) or the brand's original file |
| Collage assets, layered | designer / Mônica |
| Dark mode | João / Mônica |
| Spec↔mockup conflicts C1–C12 — spec wins by default; confirm with Mônica | João / Mônica |
