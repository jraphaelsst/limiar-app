# Design decisions log

Append-only. Each row: date · decision · who decided · source.

| Date | Decision | Decided by | Notes |
|---|---|---|---|
| 2026-10-03 | Stack: React Native + Expo (iOS, Android, web from one codebase) | João | after pros/cons comparison |
| 2026-10-03 | Start with spec Phase 0 (clickable prototype, local data, no AI/backend), screens 01–12 + 15–20 | João | AI chat (13–14) excluded |
| 2026-10-03 | Visual identity = **merge**: mockup colors (wine) + brand-folder fonts | João | logo SVGs from `nos-no-limiar/brand` **not** used |
| 2026-10-03 | Typography: **three families** — Cormorant Garamond (display) · Lora (body) · Inter (UI) | João | overrides the "single family" rule attributed to Mônica in the external DS draft |
| 2026-10-03 | Background: **spec off-white `#F3F0EA`** (surface `#FAF7F1`, sand `#D8CBB8`) | João | chosen over mockup cream `#EFE5D7` — see comparison page |
| 2026-10-03 | Logo: originals supplied by João (mark-only + full lockup); lockup source was rotated 90° and is corrected in the cut-out | João | sources in `brand-source/`, transparent PNGs in `assets/brand/`; vector SVG pending |
| 2026-10-03 | Welcome screen: **no photography** — the figure is rebuilt as cut-paper collage (silhouette, no realistic face); photography stays allowed on content screens | Claude, delegated by João (Mônica may override) | see rationale below |
| 2026-10-03 | Spec↔mockup conflicts C1–C12: **spec wins by default** (spec §0: its rules prevail until human review); the mockup keeps authority over look, layout and components | Claude, delegated by João (Mônica may override) | concrete effects: tab "Salvos" + bookmark, no like counts, Home leads with "O que combina com hoje?" / "Me tira do sofá", no "planos" CTA until monetization is decided, copy rewritten without presuming loss |
| 2026-10-03 | Icons: **Phosphor** (`phosphor-react-native`) — `light` weight by default, `fill` only for the active tab / selected state | Claude, delegated by João | only common set with a thin weight matching the logo stroke plus a filled weight |

| 2026-10-03 | Cormorant's high, offset accents (á é ê ó…) **accepted as brand character** — the logo's tagline shares the trait | João | seen on device (iPhone, Expo Go) |
| 2026-10-03 | Type scale **approved on device** ("perfectly sized") — no longer provisional | João | Perfil → Tipografia on iPhone |

| 2026-10-03 | Agents: **git is the source** (IsaIA-style packages in the NoctusAI agents product, `products/agents/packages/<key>/`); **Claude Code primary**, Agent Studio secondary; one build → both surfaces | João | contract: noctusai `products/agents/projects/agent-packages/CONTRACT.md` |
| 2026-10-03 | Agents: Studio's copy sees what Claude Code sees — package + project docs + source + Decision Board + learnings, **synced on every push** | João | CONTRACT §G/§H; board snapshot at `docs/design/decision-board.json` |
| 2026-10-03 | Agents are **read-only advisors**; learnings recorded automatically in the same commit; decisions via the living Decision Board | João | CLAUDE.md |

| 2026-10-03 | Build order: finish Phase 0 in parallel — games A+B, preferences + export, hardware back, icon/splash, unit tests | Claude, delegated by João | Decision Board `nnl-next-build` |
| 2026-10-03 | Phone back gesture inside "Me tira do sofá" goes to the previous question (step > 0) | Claude, delegated by João | mobile-dev review; board `nnl-hardware-back` |
| 2026-10-03 | Games A and B follow the same back rule on every platform: back during rounds (after the first) = previous round; in game B, back with the reflection open closes it; first round / intro / result leave normally. One hook app-wide (`usePreviousStepOnBack`, on `usePreventRemove`) | Claude, delegated by João | mobile-dev review of b585cec; extends `nnl-hardware-back` |
| 2026-10-03 | Brand "avoid" word list adopted as an app copy rule (agent flags as *corrigir*) | Claude, delegated by João | brand KB VOZ/03; board `nnl-brand-lexicon` |
| 2026-10-03 | Primary buttons stay pills (approved mockup is the app's visual authority) | Claude, delegated by João | board `nnl-brand-pill` |
| 2026-10-03 | Errors keep brick `#8B2420` (wine means "act"; errors always paired with words) | Claude, delegated by João | board `nnl-brand-error-color` |
| 2026-10-03 | Mônica credited in-app as **author only** ("Conteúdo editorial de Mônica Tangerino, autora"); no clinical credential until legal review | Claude, delegated by João — Mônica may reopen | spec §1.5, §9; board `nnl-monica-credential` |
| 2026-10-03 | Mônica's thesis enters the app as **background only** (limiar, habitável, reconhecimento) — never suffering/clinical framing | Claude, delegated by João — Mônica may reopen | board `nnl-thesis-use` |
| 2026-10-04 | Safety triage = **on-device deterministic rules**, independent of any AI (spec §7.1, §25.8): normalize → mask idioms → versioned rule list (`src/safety/rules.ts`, `triagem-2026.10.04`). Result carries rule ids only, never text | Claude, delegated by João | rules are governed content (§22): every change bumps the version and runs the corpus; **needs clinical/editorial review of the rule list** |
| 2026-10-04 | Precedence **vermelho > violência > amarelo > verde**; self-harm + violence ⇒ vermelho with the `violencia` signal | Claude, delegated by João | spec §8 |
| 2026-10-04 | **A negation never makes a risk phrase verde**: right before a risk phrase it caps the rule at amarelo ("não quero morrer"); where the negation IS the risk ("não quero mais viver", "não queria acordar", "por que não me mato") the phrase is vermelho | Claude, delegated by João | spec §7.1 "rota mais segura", §8.2 |
| 2026-10-04 | Idioms are neutralised **minimally** (only the death/kill word is masked), so "morri de vergonha" is verde but an idiom never hides a risk phrase next to it | Claude, delegated by João | tests in `src/safety/__tests__/triage.test.ts` |
| 2026-10-04 | Safety net: a first-person death word in a construction no rule knows ("tenho medo de morrer") is **amarelo, never verde** | Claude, delegated by João | rule `rede.mencao-de-morte` |
| 2026-10-04 | **Safer-route choices, pending human review**: a person "vai me matar se…" and "vou matar [alguém]" ⇒ violência (even as everyday hyperbole); "queria sumir" (except explicit trips), "desistir de tudo", "cansada da vida", "carta de despedida", "não vou estar aqui amanhã", "penso na morte" ⇒ vermelho | Claude, delegated by João — **João/Mônica to confirm** | corpus `ROTA_MAIS_SEGURA`; Decision Board |
| 2026-10-04 | The triage is measured against **blind held-out sets** written by an agent that never saw the rules; set 1 caught only 32/100 vermelho at first contact, so rules are generalized by category and each blind set then joins the corpus | Claude, delegated by João | `src/safety/__tests__/corpus.ts` |


### Rationale — welcome screen without photography

1. **Pluralism (spec §2).** One realistic woman on the first screen defines who the user "should" look like (age, hair, body, ethnicity). A cut-paper figure lets more women see themselves in it.
2. **Provenance.** The mockup's woman is an AI-generated photo-realistic person. Shipping that as the brand's first impression raises authenticity questions; a commissioned collage avoids them and is licensable with a clear owner.
3. **Identity coherence (spec §18).** The approved direction is *analog collage*. A photo is the one element on the welcome screen that breaks that language.
4. **Cost of being wrong is low.** It's a swappable asset behind the `HeroCollage` component; if Mônica prefers a photo, nothing else changes.
