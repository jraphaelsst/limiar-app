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

### Rationale — welcome screen without photography

1. **Pluralism (spec §2).** One realistic woman on the first screen defines who the user "should" look like (age, hair, body, ethnicity). A cut-paper figure lets more women see themselves in it.
2. **Provenance.** The mockup's woman is an AI-generated photo-realistic person. Shipping that as the brand's first impression raises authenticity questions; a commissioned collage avoids them and is licensable with a clear owner.
3. **Identity coherence (spec §18).** The approved direction is *analog collage*. A photo is the one element on the welcome screen that breaks that language.
4. **Cost of being wrong is low.** It's a swappable asset behind the `HeroCollage` component; if Mônica prefers a photo, nothing else changes.
