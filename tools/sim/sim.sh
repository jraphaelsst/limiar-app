#!/usr/bin/env bash
# Drive the iOS Simulator for limiar-app without tapping: state is seeded straight into Expo Go's
# AsyncStorage, screens are reached by deep link, text size is set by simctl. See tools/sim/README.md.
set -euo pipefail

DEV="${SIM_DEVICE:-booted}"
PORT="${SIM_PORT:-8081}"
SLUG="@jraphaelsst/limiar-app"   # app.json owner/slug — Expo Go keys the storage folder by it
OUT="${SIM_OUT:-${TMPDIR:-/tmp}/limiar-sim}"
GO=host.exp.Exponent

storage_dir() {
  local d; d=$(xcrun simctl get_app_container "$DEV" "$GO" data)
  echo "$d/Documents/ExponentExperienceData/$SLUG/RCTAsyncLocalStorage"
}

# simctl openurl can block for a long time while Expo Go answers; never let it hang a run.
with_timeout() { perl -e 'alarm shift; exec @ARGV' "$@"; }

case "${1:-help}" in
  boot) # boot <device-name> — boots it (headless) and prints its UDID
    udid=$(xcrun simctl list devices available | grep -m1 "    $2 (" | grep -oE '[0-9A-F-]{36}')
    xcrun simctl boot "$udid" 2>/dev/null || true
    echo "$udid" ;;
  seed) # seed onboarded|fresh — writes (or clears) the app's on-device state, then restarts Expo Go
    dir=$(storage_dir); mkdir -p "$dir"
    xcrun simctl terminate "$DEV" "$GO" 2>/dev/null || true
    if [ "$2" = fresh ]; then rm -f "$dir"/*; else
      python3 - "$dir/manifest.json" <<'EOF'
import json, sys
prefs = {"onboardedAt": "2026-10-05T12:00:00.000Z", "adultConfirmed": True,
         "interests": ["aprender", "criar", "sair"], "availability": "15-30"}
json.dump({"limiar:v1:prefs": json.dumps(prefs)}, open(sys.argv[1], "w"))
EOF
    fi
    # The dev-menu onboarding sheet covers the app on first launch; mark it seen.
    xcrun simctl spawn "$DEV" defaults write "$GO" EXDevMenuIsOnboardingFinished -bool YES ;;
  open) # open <route> — e.g. open /sofa, open /atividade/act-0001/passos, open / (home)
    route="${2#/}"
    with_timeout 40 xcrun simctl openurl "$DEV" "exp://127.0.0.1:$PORT/--/$route" || echo "openurl timed out (usually fine: the app still navigates)" ;;
  text) # text <size> — iOS content size: large (default), extra-extra-extra-large, accessibility-extra-extra-extra-large (max)
    xcrun simctl ui "$DEV" content_size "$2" ;;
  shot) # shot <name> — saves $OUT/<name>.png
    mkdir -p "$OUT"; xcrun simctl io "$DEV" screenshot "$OUT/$2.png" >/dev/null 2>&1; echo "$OUT/$2.png" ;;
  sweep) # sweep [default|max|both] — every route below → $OUT/{default,max}-<route>.png (~2 min per size)
    routes=(/explorar /salvos /perfil /sofa /atividade/act-0001 /atividade/act-0001/passos /atividade/act-0001/concluida
      /atividades /mundo/quem-sou /mundo/nos-dois /jogos /jogos/ainda-gosto /jogos/isso-ainda-e-meu /reflexao
      /reflexao/filhos-adultos /preferencias /privacidade /ajuda /seguranca /sobre)
    case "${2:-both}" in default) sizes=(large) ;; max) sizes=(accessibility-extra-extra-extra-large) ;; *) sizes=(large accessibility-extra-extra-extra-large) ;; esac
    for size in "${sizes[@]}"; do
      label=default; [ "$size" = large ] || label=max
      "$0" text "$size"
      # A running app keeps its old layout after a text-size change (lines come out cut, not wrapped):
      # relaunch, and let the fresh launch land on Início (a deep link to "/" does not navigate).
      xcrun simctl terminate "$DEV" "$GO" 2>/dev/null || true
      with_timeout 40 xcrun simctl openurl "$DEV" "exp://127.0.0.1:$PORT" || true
      # Wait until the app has drawn: a loading/splash screen is a near-blank image (small PNG); a rendered
      # screen of this app is > 250 KB. Gives up after ~2 min and captures whatever is there.
      for _ in $(seq 1 40); do
        f=$("$0" shot "$label-inicio"); [ "$(stat -f%z "$f")" -gt 250000 ] && break; sleep 3
      done
      sleep 3; "$0" shot "$label-inicio" >/dev/null
      for r in "${routes[@]}"; do
        "$0" open "$r" >/dev/null; sleep 4; "$0" shot "$label-$(echo "${r#/}" | tr '/' '_')"
      done
    done
    "$0" text large ;;
  *) sed -n '2,4p' "$0"; grep -E '^  [a-z]+\) #' "$0" | sed 's/) #/ —/' ;;
esac
