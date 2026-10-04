/**
 * "Outra ideia" pressed on top of "Me tira do sofá" (step view of a suggested activity):
 * the sofa screen underneath should show the NEXT idea when she lands back on it, not the
 * same one again. A one-shot flag — set by the screen she leaves, taken once by the sofa
 * screen on focus. Records nothing and survives nothing: "Outra" never penalises (spec §20).
 */
let requested = false;

export function requestAnotherIdea(): void {
  requested = true;
}

/** Returns whether another idea was requested, and clears the request. */
export function takeAnotherIdeaRequest(): boolean {
  const r = requested;
  requested = false;
  return r;
}
