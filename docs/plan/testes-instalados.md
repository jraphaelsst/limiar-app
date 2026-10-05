# Test installs (EAS) — for the Phase 0 validation (spec §23)

Testers need the app installed like any other app, not through Expo Go. This file is the path, and
what is done vs. waiting. Decisions: Decision Board `nnl-test-installs` (decided), `nnl-app-id` (open).

## State (2026-10-05)
- Done: `eas.json` (profiles `preview` = internal install link, `production` = store build);
  Expo project **@jraphaelsst/limiar-app** linked (`app.json` → `owner`, `extra.eas.projectId`);
  `expo-doctor` 21/21; `eas config --profile preview` resolves.
- **Blocked on the app ID** (`nnl-app-id`): `android.package` / `ios.bundleIdentifier` are not set, and
  are permanent once a store build ships. Nothing is built until João picks it.
- iPhone waits for an Apple Developer Program membership (US$99/yr). An Apple ID alone is not enough.

## Android test install (free) — once the app ID is chosen
1. Put the ID in `app.json`: `"android": { "package": "<id>", ... }` (and `"ios": { "bundleIdentifier": "<id>" }`).
2. `npx eas-cli build --platform android --profile preview` (cloud build, ~10–20 min, free tier queue).
   First run asks to generate an Android keystore: answer **yes** (EAS stores it; never commit it).
3. EAS prints a link and a QR. A tester opens it on Android → downloads the APK → allows
   "install from this source" once → installs. Same link works for everyone you send it to.
4. A new build = a new link. Testers install over the old one; their saved data stays.

## iPhone — after the Apple Developer membership
1. Enrol at developer.apple.com/programs (individual or organisation; organisation needs a D-U-N-S number).
2. `npx eas-cli build --platform ios --profile production` — logs in to Apple once (interactive, in your
   terminal: run it as `! npx eas-cli build ...` so the prompts reach you), creates certificates.
3. `npx eas-cli submit --platform ios` → the build appears in App Store Connect → TestFlight.
4. Add testers by email in TestFlight (internal: up to 100 people on your team; external: up to 10,000,
   after a light Apple review of the first build).

## Later: updates without a new install
`eas update` sends JS-only changes (content, copy, screens) to installed builds. Needs `expo-updates`
added and a `channel` per build profile; set it up together with the first real build, not before.
