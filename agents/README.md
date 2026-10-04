# agents/

Consumed agent packages. Each package is a read-only advisor that Claude Code can dispatch
(`.claude/agents/<key>.md` is the thin wrapper; the package folder holds everything else).

| Key | Language | Role |
|---|---|---|
| `mobile-dev` | en | Mobile (React Native + Expo) development advisor — general, reusable across apps |
| `nos-no-limiar` | pt-BR | Product guardian for Nós no Limiar — spec, safety, privacy, voice, visual identity |

## Package layout (same for every agent; content language varies per agent)
```
agents/<key>/
  AGENT.md        definition: frontmatter (key, kind, language, version, status, role, owners) + instructions
  knowledge/      numbered topic files, read on demand
  LEARNINGS.md    append-only learnings log (newest first): date · kind · learning · evidence · status
```

## Status: moving to the agents product
Source of truth is now the NoctusAI agents product: `noctusai/products/agents/packages/<key>/` (v0.2.0,
IsaIA-style: sections · skills · knowledge · evals), contract
`noctusai/products/agents/projects/agent-packages/CONTRACT.md`. The files here are v0.1.0 (hand-written)
and will be **replaced by `noctus.dev.agent_pull`** output (pinned in `agents.lock.json`) as soon as the
build tool lands. Until then: don't edit `AGENT.md`/`knowledge/` here; keep appending to `LEARNINGS.md`.

## Learning loop (until the agents product takes over)
When work in this repo discovers or decides something non-obvious, the same commit appends a row to the
relevant `LEARNINGS.md` (status `new`). Periodically, `new` rows are folded into `knowledge/`
(`absorbed`). Decisions that need a human go to the Decision Board.
