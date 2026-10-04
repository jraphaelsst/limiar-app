# agents/

Consumed agent packages, pulled from the NoctusAI agents product. Each is a read-only advisor Claude Code can dispatch
(`.claude/agents/<key>.md` holds the compiled prompt; `agents/<key>/` holds skills, knowledge and learnings).

| Key | Language | Role |
|---|---|---|
| `mobile-dev` | en | Mobile (React Native + Expo) development advisor — general, reusable across apps |
| `nos-no-limiar` | pt-BR | Product guardian for Nós no Limiar — spec, safety, privacy, voice, visual identity |

## Layout in this repo (generated — do not edit by hand)
```
agents.lock.json                 pinned versions (key, versao, sha)
.claude/agents/<key>.md          compiled prompt + Claude Code adapter (what Claude Code loads)
agents/<key>/PACKAGE.json        build metadata (versao, sha, compiled_hash)
agents/<key>/skills/<nome>/      SKILL.md (+ references/)
agents/<key>/knowledge/<col>/    knowledge collections
agents/<key>/LEARNINGS.md        append-only, consumer-owned (merged with upstream on pull)
```

## Source of truth
`noctusai/products/agents/packages/<key>/` (IsaIA-style: sections · skills · knowledge · evals), contract
`noctusai/products/agents/projects/agent-packages/CONTRACT.md`. Update here with `noctus.dev.agent_pull`
(pinned in `agents.lock.json`); CI-style check: `noctus.dev.agent_package_build key=<key> check=<this repo>`.
Only `LEARNINGS.md` is edited here.

## Learning loop
When work in this repo discovers or decides something non-obvious, the same commit appends a row to the
relevant `LEARNINGS.md` (status `new`). Periodically, `new` rows are folded into `knowledge/`
(`absorbed`). Decisions that need a human go to the Decision Board.
