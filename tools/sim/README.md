# Testing the app in the iOS Simulator — map and method

How an agent (or a person) walks every screen of the app on a simulated iPhone **without tapping**:
state is written straight into Expo Go's storage, screens are opened by deep link, the text size is set
by `simctl`, and each screen is captured as a screenshot. First run: 2026-10-05.

## What this covers, and what it does not
| Check | Simulator (this method) | Still needs a real phone |
|---|---|---|
| Every screen renders, nothing crashes | ✅ | |
| Largest text size: clipping, overlap, wrapping | ✅ `text accessibility-extra-extra-extra-large` | |
| Copy as she reads it, layout, colours | ✅ | sunlight / low brightness |
| VoiceOver: reading order, what is spoken, focus moves | ❌ (no screen reader output from `simctl`) | ✅ VoiceOver / TalkBack |
| Taps, multi-step flows (sofá → atividade → passos) | ❌ without a tap tool (see "Tapping" below) | ✅ |
| Android | ❌ (no emulator installed) | ✅ |

Static gates already cover part of the screen-reader side on every push: `src/lib/__tests__/accessibility.test.ts`
(roles, names, headings, hidden decorations, font scaling) and `src/app/__tests__/screen-voice.test.ts` (screen copy in the app voice).

## Method
Prerequisites: Xcode (with an iPhone simulator runtime), the dev server running on port 8081
(`npx expo start --lan`), and Expo Go installed on the simulator once (`npx expo start --ios` installs it; it may then
fail to open the project with "openurl … timed out" — harmless, Expo Go stays installed).

```bash
tools/sim/sim.sh boot "iPhone 17"          # headless boot; prints the UDID
tools/sim/sim.sh seed onboarded            # skip onboarding: writes prefs into Expo Go's AsyncStorage
tools/sim/sim.sh open /sofa                # any route from the map below
tools/sim/sim.sh text accessibility-extra-extra-extra-large   # max text; `text large` = default
tools/sim/sim.sh shot max-sofa             # → $SIM_OUT/max-sofa.png (default $TMPDIR/limiar-sim)
tools/sim/sim.sh seed fresh                # back to first launch (onboarding)
```
tools/sim/sim.sh sweep [default|max|both]  # every route → default-<route>.png / max-<route>.png (~2 min per size)

Then read each screenshot and **first check it shows the screen its name says**: a failed deep link leaves the
previous screen up, and a malformed one shows Expo Router's "Unmatched Route" page. Only then judge layout and copy.
Run loops inside `sim.sh` (bash), not in an ad-hoc `zsh -c` line: zsh does not split an unquoted `$list`, so a
`for r in $ROUTES` loop runs once with every route glued into one link (happened on the first run).

### Pitfalls found on the first run
- **Onboarding guards every route.** Without seeded prefs every deep link lands on the welcome screen
  (`Stack.Protected` in `src/app/_layout.tsx`). `seed onboarded` writes `limiar:v1:prefs` to
  `<Expo Go data>/Documents/ExponentExperienceData/@jraphaelsst/limiar-app/RCTAsyncLocalStorage/manifest.json`
  (the folder is keyed by `owner/slug` in app.json; it moved when the project got an owner).
- **Expo Go's dev-menu sheet** covers the app on first launch: `defaults write host.exp.Exponent EXDevMenuIsOnboardingFinished -bool YES` (done by `seed`).
- **`simctl openurl` can block for a minute or more** while Expo Go answers; `sim.sh` gives it 40 s. The app still navigates.
- **The first launch after linking the Expo project** printed a one-off `ENOENT … development-code-signing-settings-2.json` in the dev server: two concurrent first requests; it does not recur.
- **No Simulator window** in this Xcode 27 install (`Simulator.app` absent): the device runs headless, which is all this method needs.
- **Relaunch after changing the text size.** A running app keeps its old layout: at max size lines come out
  cut off horizontally instead of wrapping, which looks like a severe bug and is not (verified 2026-10-05 by relaunching).
  `sweep` terminates Expo Go after each size change.
- **A deep link to `/` does not navigate** (Início stays whatever was on screen); `sweep` reaches Início by relaunching.
- Deep link shape: `exp://127.0.0.1:8081/--/<route>`.
- **Use the dev server that is already running (8081).** A second Metro on 8082 (`CI=1`, to preview a branch) made
  `openurl` time out on most links and left Expo Go on "Opening project…" (2026-10-05). To preview a branch, serve it
  from the main checkout instead, or merge and sweep.
- **When even `simctl launch host.exp.Exponent` hangs**, the simulator service is wedged (happened right after the
  8082 attempt; `killall com.apple.CoreSimulator.CoreSimulatorService` + reboot did not clear it). Fall back to the
  phone and note it; next session try `xcrun simctl erase <udid>` (wipes Expo Go: reinstall with `npx expo start --ios`).
- The tall, detached-looking accents in headings ("Nós", "você") are the Cormorant typeface's design, not an encoding
  problem (the source is NFC; checked) — a taste call, not a defect.

### Tapping (not set up)
`idb` (Facebook) would add taps, swipes and an accessibility-tree dump (`idb ui describe-all`, a good proxy for
what VoiceOver reads). Installing it means trusting the third-party Homebrew tap `facebook/fb`: João's call, not taken yet.

## Map of the app (routes → screen)
Reachable only after onboarding unless marked *always*.

| Route | Screen | Spec |
|---|---|---|
| `/boas-vindas`, `/boas-vindas/proposito`, `/interesses`, `/tempo` | Onboarding: brand → what it is / 18+ → interests (3–5 or none) → time. Only before onboarding | §4.1, screens 01–05 |
| `/` | Início: greeting, "Me tira do sofá", intentions | §4.2 |
| `/explorar` | The six worlds | §3.1 |
| `/salvos` | Saved activities and reflection cards | §4.6 |
| `/perfil` | Profile: preferences, privacy, about, erase all | §4.8 |
| `/sofa` (`?preset=criar\|aprender\|sair`) | "Me tira do sofá": ≤4 choices, then one idea at a time | §4.3 |
| `/atividade/<id>` · `/passos` · `/concluida` | Activity card · step by step · done + feedback (`act-0001`…`act-0060`) | §4.4 |
| `/atividades` | The whole deck ("Experimenta isso") | §3.1 |
| `/mundo/<id>` | One world: `quem-sou`, `filhos-adultos`, `tempo`, `nos-dois`, `mundo` (`experimenta` → `/atividades`) | §3.1, screen 10 |
| `/jogos` · `/jogos/ainda-gosto` · `/jogos/isso-ainda-e-meu` | Games hub · game A · game B | §4.5, screens 11–12 |
| `/reflexao` · `/reflexao/<tema>` | Reflection: pick a theme · cards (themes in `src/data/reflexoes.ts`) | §4.7, screens 13–14 |
| `/preferencias` | Change onboarding choices | screen 16 |
| `/privacidade` | Privacy: export, erase | §10 |
| `/ajuda` — *always* | Help and safety numbers | §8.1 |
| `/seguranca` (`?tipo=autolesao\|violencia\|ambos`) — *always* | High-risk screen | §8, screen 19 |
| `/sobre` — *always* | About | §9 |
| `/tipografia` | Dev-only type specimen | — |

On-device state (all in AsyncStorage, `src/state/storage.ts`): `limiar:v1:prefs` (onboarding done),
`:saved`, `:saved-reflections`, `:game-a-results`, `:feedback` — ids and enums only, never text.

## Findings — first sweep, 2026-10-05 (iPhone 17 simulator, iOS 27)
Screens verified against their names before judging. Default text size: the app is sound.

**At the largest text size (AX5), ranked by impact — fixed 2026-10-05 (decisions.md "Large text and simpler actions"):**
1. **Fixed bottom actions swallow the content.** Activity card and step-by-step (`/atividade/<id>`, `/passos`): the footer
   (Bora/Próximo + 2–3 links) takes half the screen and covers the title and the step text. Reflection cards
   (`/reflexao/<tema>`): the footer takes the whole screen. Fix: at large font scales, put the actions inside the scroll view.
2. **Headings grow without limit and break mid-word** ("Explor/ar", "Experi/menta", "Privaci/dade", "Preferê/ncias",
   "segura/nça"); the title alone fills the first screen. Fix: cap display/heading scaling (`maxFontSizeMultiplier` ≈ 1.5–2)
   — body text keeps scaling fully.
3. **Pill buttons clip wrapped labels** ("Quero pensar mais", "Voltar ao início": letters cut by the rounded ends); min-height + padding that grows.
4. **Buttons over text:** "Começar" covers the game intros (`/jogos/ainda-gosto`, `/jogos/isso-ainda-e-meu`); `concluida` button over its text.
5. **`/reflexao`:** the fixed "Se estiver difícil agora…" link becomes 4 lines and hides the theme list.
- The tab bar labels do not grow (by design in the tab layout) and never wrap: fine.

**At default size (copy / small):**
- Home greeting had "!" → fixed (`…aqui.`), and screen copy is now under the voice gate.
- `/jogos` is titled "Quem sou eu agora?", the same as the world `/mundo/quem-sou` — confusing now that worlds have their own screen.
- `/sobre` has two consecutive lines starting "Conteúdo editorial…".
- "Bora" / "Bora escolher": informal; a tone call for Mônica.
- Disabled "Salvar" on `/preferencias` is faint (disabled controls are WCAG-exempt; a clarity call).
