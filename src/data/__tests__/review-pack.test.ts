/// <reference types="jest" />
/**
 * The review pack for Mônica (src/data/review-export.ts) is derived from the content files.
 * `npm run review:export` (REVIEW_EXPORT=1) writes it to tools/revisao/conteudo.json for the review
 * page; these checks make sure nothing she must review is left out and every verdict key is stable.
 */
import * as fs from 'fs';
import * as path from 'path';

import { activities } from '@/data/activities';
import { pairs, roleCards } from '@/data/games';
import { reflexoes } from '@/data/reflexoes';
import { hashTexto, pacoteDeRevisao } from '@/data/review-export';

const pacote = pacoteDeRevisao();
const itens = pacote.grupos.flatMap((g) => g.itens);

if (process.env.REVIEW_EXPORT === '1') {
  const arq = path.resolve(__dirname, '../../../tools/revisao/conteudo.json');
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  fs.writeFileSync(arq, `${JSON.stringify(pacote, null, 2)}\n`);
}

describe('review pack', () => {
  test('ids are unique (a verdict is stored under the id)', () => {
    expect(new Set(itens.map((i) => i.id)).size).toBe(itens.length);
  });

  test('every activity, reflection, pair and card awaiting review is in it', () => {
    const ids = new Set(itens.map((i) => i.id));
    const esperados = [
      ...activities.filter((a) => a.reviewStatus !== 'retirado').map((a) => a.activityId),
      ...reflexoes.filter((r) => r.reviewStatus !== 'retirado').map((r) => r.reflectionId),
      ...pairs.map((p) => `par:${p.id}`),
      ...roleCards.map((c) => `cartao:${c.id}`),
    ];
    expect(esperados.filter((id) => !ids.has(id))).toEqual([]);
  });

  test('every item has text to read', () => {
    for (const i of itens) {
      expect(i.titulo.trim()).not.toBe('');
      expect(i.campos.length).toBeGreaterThan(0);
    }
  });

  test('the hash follows the text: same text, same hash; one changed letter, another hash', () => {
    expect(pacoteDeRevisao()).toEqual(pacote);
    expect(hashTexto('Passos')).not.toBe(hashTexto('passos'));
    expect(hashTexto('')).toBe('811c9dc5');
  });
});
