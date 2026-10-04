# mobile-dev — learnings log

Append-only. Newest first. Each entry: date · kind · learning · evidence · status.
Kinds: `pitfall` (something broke) · `practice` (something that worked) · `decision` (a choice and why).
Status: `new` (not yet in knowledge/) → `absorbed` (folded into a knowledge file) → `promoted`
(published in a new agent version in the agents product).

| Date | Kind | Learning | Evidence | Status |
|---|---|---|---|---|
| 2026-10-03 | pitfall | A committed `src/types/expo-env.d.ts` is silently ignored by the template's `expo-env.d.ts` .gitignore rule — name committed type shims differently (e.g. `src/types/expo.d.ts`) and verify on a fresh clone | limiar-app fresh-clone tsc | new |
| 2026-10-03 | pitfall | A git worktree with a symlinked `node_modules` makes `expo export` exit 0 while building zero routes — use an APFS clone (`cp -cR`) or `npm ci` per worktree | limiar-app feat/prefs slice | new |
| 2026-10-03 | pitfall | `Share.share` outcomes differ per platform: iOS returns `dismissedAction` on cancel; Android **always** `sharedAction` (cannot detect cancel — don't claim "sent"); web (react-native-web) wraps `navigator.share`, resolves `undefined`, rejects `AbortError` on cancel and rejects outright where unsupported (most desktop browsers) — check `navigator.share` first and fall back to selectable text | limiar-app src/app/privacidade.tsx; node_modules/react-native-web/dist/exports/Share | new |
| 2026-10-03 | practice | One `usePreventRemove(cond, cb)` (import from `expo-router/react-navigation` — React Navigation is vendored inside expo-router 57) covers Android hardware back, iOS swipe (native-stack sets `preventNativeDismiss` and routes the cancelled dismiss to `cb`), the header/BackBar back and web; re-dispatching `data.action` passes the guard. Use for multi-step flows and unsaved-changes prompts (in-screen, not `Alert`) | limiar-app src/app/sofa.tsx, src/app/preferencias.tsx | new |
| 2026-10-03 | pitfall | A git worktree with `node_modules` as a **symlink** to the main checkout: `expo export --platform web` exits 0 but finds **zero routes** (no HTML, ~740 modules), and `tsc` fails in `phosphor-react-native` source unless the gitignored `expo-env.d.ts` is copied too. Use an APFS clone (`cp -cR <main>/node_modules .`, ~17 s, no extra disk) + copy `expo-env.d.ts`; check the export lists "Static routes" | limiar-app feat/prefs (2026-10-03) | new |
| 2026-10-03 | pitfall | `BackHandler` bound on mount keeps firing while another screen is pushed on top (stack screens stay mounted) and swallows that screen's back press; bind in-screen step-back with `useFocusEffect` | limiar-app src/state/use-step-back.ts (games) | new |
| 2026-10-03 | pitfall | A git worktree with a SYMLINKED `node_modules` breaks verification silently: `expo export` exits 0 but bundles no app routes (expo-router resolves its app root from the real path; no route HTML, bundle without screens) and `tsc` fails on phosphor sources. Use an APFS clone instead (`cp -cR <main>/node_modules <wt>/node_modules`, ~45 s, no extra disk) + copy `expo-env.d.ts` and run `expo start` once to generate `.expo/types` | limiar-app-wt/games session: export 1.1 MB without screens vs 18 route HTML files after the clone | new |
| 2026-10-03 | pitfall | Default Expo Router tab bar (49 pt) clips 12-pt labels; use 64 pt + bottom inset | limiar-app 6a89db7; knowledge: playbook/navigation-state | absorbed |
| 2026-10-03 | pitfall | Cormorant Garamond defaults to old-style figures ("192" ≈ "1g2"); force `lining-nums` | limiar-app 6a89db7; knowledge: playbook/ui-typography-icons | absorbed |
| 2026-10-03 | practice | Phosphor per-icon deep imports cut the web bundle 7.1 MB → 1.4 MB | limiar-app 6a89db7; knowledge: playbook/ui-typography-icons | absorbed |
| 2026-10-03 | pitfall | Stray `~/node_modules` (npm 5.1.0) broke create-expo-app and `expo install`, and silently fed old majors to other projects | session 2026-10-03; noc frontends reinstalled; knowledge: playbook/expo-project-setup | absorbed |
| 2026-10-03 | pitfall | Expo Go signed in but CLI not → project won't open; browser login must complete on the computer (localhost callback) | session 2026-10-03; knowledge: playbook/device-testing | absorbed |
| 2026-10-03 | pitfall | Headless Chrome min width ~500 px, plain static server breaks router URLs, fonts need ≥15 s budget | session 2026-10-03; knowledge: playbook/device-testing | absorbed |
| 2026-10-03 | practice | `Stack.Protected` guards for onboarding; help screens outside both guards | limiar-app 319c167; knowledge: playbook/navigation-state | absorbed |
| 2026-10-03 | practice | AsyncStorage: versioned keys + shape validation; invalid data is logged, removed, reset | limiar-app 319c167; knowledge: playbook/navigation-state | absorbed |
| 2026-10-03 | practice | Duration ranges must not repeat the unit ("30–90 min") — found only on device | limiar-app d327081 | new |
| 2026-10-03 | decision | Expo chosen for a React/TS web developer needing iOS+Android+web, offline, push, stores | limiar-app docs/design/decisions.md; knowledge: playbook/web-to-mobile | absorbed |
| 2026-10-03 | pitfall | `router.replace('/X')` used to "go back for another" stacks a fresh copy of X and loses its params/state; use `router.back()` | limiar-app src/app/atividade/[id].tsx:41 (live review); knowledge: skill review-mobile-screen | absorbed |
