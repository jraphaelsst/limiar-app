/// <reference types="jest" />
import { AVISO_AMARELO, decidir, tipoDoRisco } from '@/safety/gate';
import { triage } from '@/safety/triage';

import * as C from './corpus';

describe('decidir — the pure half of useSafetyGate', () => {
  test('vermelho blocks the flow and routes to /seguranca (autolesão)', () => {
    const d = decidir('quero morrer');
    expect(d).toMatchObject({ nivel: 'vermelho', podeSeguir: false, rota: { pathname: '/seguranca', params: { tipo: 'autolesao' } } });
  });

  test('violência blocks the flow and routes with tipo=violencia', () => {
    const d = decidir('ele disse que vai me matar');
    expect(d).toMatchObject({ nivel: 'violencia', podeSeguir: false, rota: { pathname: '/seguranca', params: { tipo: 'violencia' } } });
  });

  test('vermelho + violência routes with tipo=ambos (both sets of resources)', () => {
    expect(decidir('ele me bate e eu quero morrer').rota?.params.tipo).toBe('ambos');
  });

  test('amarelo continues (the caller shows AVISO_AMARELO)', () => {
    expect(decidir('não consigo sair da cama há semanas')).toMatchObject({ nivel: 'amarelo', podeSeguir: true, rota: null });
  });

  test('verde continues', () => {
    expect(decidir('não sei o que fazer domingo')).toMatchObject({ nivel: 'verde', podeSeguir: true, rota: null });
  });

  test('every corpus vermelho/violência phrase is blocked', () => {
    for (const p of [...C.VERMELHO, ...C.VERMELHO_CEGO_1, ...C.VERMELHO_CEGO_2, ...C.VIOLENCIA, ...C.VIOLENCIA_CEGO_1, ...C.VIOLENCIA_CEGO_2]) expect(decidir(p).podeSeguir).toBe(false);
  });

  test('tipoDoRisco is null below violência', () => {
    expect(tipoDoRisco(triage('tenho medo de morrer'))).toBeNull();
  });
});

describe('the text never leaves the gate', () => {
  test('nothing is written to the console while triaging the whole corpus', () => {
    const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((m) => jest.spyOn(console, m).mockImplementation(() => {}));
    try {
      for (const p of [...C.VERMELHO, ...C.VIOLENCIA, ...C.AMARELO, ...C.VERDE]) decidir(p);
      for (const s of spies) expect(s).not.toHaveBeenCalled();
    } finally {
      for (const s of spies) s.mockRestore();
    }
  });

  test('the decision does not echo the text', () => {
    const d = decidir('Quero morrer. Meu telefone é 11 98888-7777');
    expect(JSON.stringify(d)).not.toMatch(/98888|7777|quero morrer/i);
  });
});

describe('AVISO_AMARELO (spec §8 table: limit + human help, no diagnosis)', () => {
  test('states the limit and points to people and services', () => {
    expect(AVISO_AMARELO).toMatch(/não substitui/);
    expect(AVISO_AMARELO).toMatch(/188/);
    expect(AVISO_AMARELO).toMatch(/UBS|CAPS/);
  });

  test('no diagnosis, no prescriptive "você precisa/deve", no false intimacy', () => {
    expect(AVISO_AMARELO).not.toMatch(/depress|ansiedade|transtorno|diagn/i);
    expect(AVISO_AMARELO).not.toMatch(/você (precisa|deve)/i);
    expect(AVISO_AMARELO).not.toMatch(/estou aqui|conte comigo/i);
  });
});
