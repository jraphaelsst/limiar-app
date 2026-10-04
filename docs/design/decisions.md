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

| 2026-10-04 | Phase 1 runs **without accounts** (guest mode): everything personal stays on the device | Claude, delegated by João | spec §10.1 minimisation; `docs/plan/fase-1-mvp.md` D1 |
| 2026-10-04 | Saved text (reflections, post-activity phrases) lives **only on the device** in Phase 1 | Claude, delegated by João | removes sensitive text from any server; plan D2 |
| 2026-10-04 | AI backend = a **stateless public route inside the NoctusAI `agents` product** (seed Anthropic adapter, retrieval from a published knowledge collection), built against a Fake provider; **not live** until H1–H4 + the owner's public-surface decision. **No new `limiar` product** (it would fork the agents knowledge store) | Claude, delegated by João — revised after the `architect` review | plan §6; Agent Studio's session runtime still rejected as the engine |
| 2026-10-04 | Feedback §6 ("mais disso / menos disso / não combina comigo") is one enum per activity id (`limiar:v1:feedback`), editable and removable. Effect, deterministic: "não combina" excludes that activity only (never its category); "mais"/"menos" add ±1 to the activity's category; suggestions are the seeded shuffle, then a stable sort by category weight — "menos" moves a category to the end, never hides it. Applies to "Me tira do sofá" and Home "Para você hoje"; never read as anything about her | Claude, delegated by João | spec §6, §20 (personalização); `src/lib/recommend.ts` |
| 2026-10-04 | Screen 08 (step view) is its own route `atividade/[id]/passos`; "Bora" opens it from the card AND from the "Me tira do sofá" result. Back after the first step = previous step (same `usePreviousStepOnBack`); back on the first step leaves to what opened it. Progress in words ("Passo 2 de 4"), the variation shown on every step when the activity has one | Claude, delegated by João | spec §19, §4.4; extends `nnl-hardware-back` |
| 2026-10-04 | Spec §4.4 actions, the same on card, step view and sofa result: **Concluir** → screen 09 (from the step view it replaces it, so back lands on what opened the activity); **Guardar** = the bookmark (one `useBookmark` hook); **Outra ideia** → from the sofa, its next idea (one-shot flag, nothing recorded); elsewhere, opens "Me tira do sofá"; **Sair sem concluir** → back past the activity. "Outra" and "Sair" record nothing (spec §20: no penalty) | Claude, delegated by João | spec §4.3, §4.4, §20 |
| 2026-10-04 | Screen 09 is a stub: "Feito" + one neutral line + the §6 feedback + "Voltar ao início"; no score, streak, badge or celebration. The optional "guardar uma frase" (spec §4.4 "Depois") is NOT shown or announced — `AfterActivity` takes `children` as the seam for the slice that adds it after the safety layer | Claude, delegated by João | spec §4.4, §4.5, §15, §19 |
| 2026-10-04 | Activity variations are Mônica's content: the optional `variation` field stays empty for 14 of 15 seeds (only act-0003 has one); none invented. Priority for her: act-0007, act-0009, act-0012, act-0015 (kitchen / going out) | Claude, delegated by João — needs Mônica | spec §4.4, §17, §22 |
| 2026-10-04 | Feedback is listed in Preferências (spec §10.3 "ver o que está salvo") with remove-one / remove-all that apply at once, unlike the rest of that screen (which waits for "Salvar"); the section says so | Claude, delegated by João | spec §6, §10.3 |

### Rationale — welcome screen without photography

1. **Pluralism (spec §2).** One realistic woman on the first screen defines who the user "should" look like (age, hair, body, ethnicity). A cut-paper figure lets more women see themselves in it.
2. **Provenance.** The mockup's woman is an AI-generated photo-realistic person. Shipping that as the brand's first impression raises authenticity questions; a commissioned collage avoids them and is licensable with a clear owner.
3. **Identity coherence (spec §18).** The approved direction is *analog collage*. A photo is the one element on the welcome screen that breaks that language.
4. **Cost of being wrong is low.** It's a swappable asset behind the `HeroCollage` component; if Mônica prefers a photo, nothing else changes.
