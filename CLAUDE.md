# limiar-app — Nós no Limiar

Expo (SDK 57) + Expo Router + TypeScript app. Source of truth for the product: `docs/spec/especificacao-mestre-v1.0.md`
(its safety, privacy and scope rules win any conflict until human review). Decisions: `docs/design/decisions.md`.
Visual values: `src/theme/` (never literal colours/sizes/fonts in components).

## Agents — consult them, and teach them
- **`nos-no-limiar`** (pt-BR, read-only): consult before shipping any user-facing text, screen, flow or activity.
- **`mobile-dev`** (en, read-only): consult on mobile setup, navigation, state, typography, accessibility, device issues.
- **Learning is part of done:** when a change discovers or decides something non-obvious, append a row to the
  matching `agents/<key>/LEARNINGS.md` **in the same commit** (format in `agents/README.md`).
- Decisions that need João or Mônica go to the Decision Board (https://claude.ai/artifact/HKV3ETARxcEojhpwGjsmTf),
  not into code as assumptions; once decided, record them in `docs/design/decisions.md`.
- Mônica reviews content on her review page (`tools/revisao/README.md`): verdicts live in its database;
  read them there and apply them to `src/data/*` — never mark content `revisado` without her verdict.

## Verify before claiming done
`npx tsc --noEmit` → `npx expo lint` → `npx jest` → `CI=1 npx expo export --platform web --output-dir <tmp> --clear` (always `--clear`: in a worktree sharing `node_modules`, Metro reuses another tree's cache and exits 0 with the wrong bundle) → device (Expo Go). Say which ran.
Simulator walk (every screen, default + max text, no tapping): `tools/sim/README.md` — it also holds the map of routes.
