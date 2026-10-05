# Mônica's review page

**Live page:** https://claude.ai/artifact/N5JbF5fuLJg1kbGKgBu54K (private; João shares it with Mônica as
**Editor**, by email — someone outside the organization can only read the page otherwise).

One card per item that waits on her review (spec §22): activities, guided reflections, game copy and the
safety texts. For each she approves, asks for a change (with a note) or retires it.

## How it fits together
- `conteudo.json` — **derived**, never edited: `npm run review:export` writes it from `src/data/review-export.ts`
  (which reads the content files themselves). Gitignored.
- `index.html` — the page. It reads `conteudo.json` and keeps verdicts in the artifact's database,
  collection `veredictos`, one document per item id: `{veredicto: aprovado|ajustar|retirar, nota, hash, titulo, em, por?, resposta?}`.
- A verdict counts only for the text it was given to (`hash`). When Claude changes an item, its hash
  changes and the card comes back as "Atualizado, confira".

## Applying her verdicts (Claude)
1. Read the decisions: `ArtifactData list` on the page URL, collection `veredictos`.
2. `aprovado` (hash matches the current pack) → set the item's `reviewStatus` to `revisado` and
   `reviewedBy` to `'Mônica Tangerino'` in the content file. `retirar` → `reviewStatus: 'retirado'` (never delete: ids are never reused).
   `ajustar` → apply the note, bump `version`.
3. Write back what was done in the verdict's `resposta` field (`ArtifactData update`, pinned with `if_version`),
   in one short pt-BR sentence. She sees it on the card.
4. Regenerate and republish: `npm run review:export`, copy `index.html` + `conteudo.json` to a scratch folder,
   publish to the same URL with the Artifact tool (`url` above), with `conteudo.json` in `files`.
