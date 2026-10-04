/// <reference types="jest" />
import { backGoesToPreviousStep, clampStep, isLastStep, nextStep, previousStep, stepLabel } from '@/lib/steps';

describe('step navigation (screen 08)', () => {
  test('progress in words', () => {
    expect(stepLabel(0, 4)).toBe('Passo 1 de 4');
    expect(stepLabel(3, 4)).toBe('Passo 4 de 4');
  });

  test('Próximo walks the steps, then ends on the last one', () => {
    expect(nextStep(0, 3)).toBe(1);
    expect(nextStep(1, 3)).toBe(2);
    expect(nextStep(2, 3)).toBe('done');
    expect(isLastStep(2, 3)).toBe(true);
    expect(isLastStep(1, 3)).toBe(false);
  });

  test('a single-step activity ends at once', () => {
    expect(nextStep(0, 1)).toBe('done');
  });

  test('previous step never goes below the first', () => {
    expect(previousStep(2)).toBe(1);
    expect(previousStep(0)).toBe(0);
  });

  test('back is a step back only after the first step; on the first it leaves the screen', () => {
    expect(backGoesToPreviousStep(0)).toBe(false);
    expect(backGoesToPreviousStep(1)).toBe(true);
  });

  test('clamp keeps an index inside the steps', () => {
    expect(clampStep(-1, 3)).toBe(0);
    expect(clampStep(9, 3)).toBe(2);
    expect(clampStep(1.7, 3)).toBe(1);
    expect(clampStep(5, 0)).toBe(0);
  });
});
