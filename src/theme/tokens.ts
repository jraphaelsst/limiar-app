/**
 * Nós no Limiar — design tokens (v0.1).
 *
 * Single source of truth for every visual value in the app. Components read
 * from here; no literal colors, sizes or font names anywhere else.
 * Rationale and provenance of each value: docs/design/visual-identity.md.
 */

/** Raw palette. Named for what the color IS, not where it is used. */
export const palette = {
  offWhite: '#F3F0EA', // spec §18 registered base
  paper: '#FAF7F1', // raised surface on off-white
  linen: '#ECE7DE', // neutral tile / pressed surface
  sand: '#D8CBB8', // spec §18 registered base
  rose: '#E9D9CF', // wine tint (mockup tile + badge)
  tan: '#E7DAC8', // warm tint (mockup tile)
  ink: '#222222', // spec §18 registered base
  stone: '#625A4F', // body text (mockup, measured)
  ash: '#6E665C', // captions, inactive nav — darkened from mockup #908A7F to reach 4.5:1
  charcoal: '#524A44', // dark chip (mockup, measured)
  wine: '#651B19', // primary — sampled from the approved mockup (spec §18 allows)
  wineDeep: '#4E1412', // pressed primary
  wineBright: '#88322F', // filled heart / emphasis icons (mockup, measured)
  sun: '#782B20', // ILLUSTRATION ONLY — collage circle; never for UI text or controls
  border: '#8E8172', // functional outline (inputs) — 3:1 on surfaces
  hairline: '#DDD4C6', // decorative divider — not a control boundary
  moss: '#36563E',
  brick: '#8B2420',
  ochre: '#73521D',
} as const;

/** Semantic roles. Components use THESE, never `palette` directly. */
export const color = {
  background: palette.offWhite,
  surface: palette.paper,
  surfaceSunken: palette.linen,
  surfaceAccent: palette.sand,
  tintWine: palette.rose,
  tintWarm: palette.tan,

  text: palette.ink,
  textBody: palette.stone,
  textSubtle: palette.ash,
  textOnPrimary: palette.offWhite,
  textOnAccent: palette.ink, // on sand: use ink, never stone (stone/sand = 4.25:1)

  primary: palette.wine,
  primaryPressed: palette.wineDeep,
  primarySoft: palette.rose,
  iconEmphasis: palette.wineBright,

  chipWine: palette.wine,
  chipCharcoal: palette.charcoal,
  chipSand: palette.sand,

  border: palette.border,
  divider: palette.hairline,
  focus: palette.wine,

  success: palette.moss,
  error: palette.brick,
  warning: palette.ochre,

  illustrationRed: palette.sun,
} as const;

/** 4-pt spacing scale. */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 8,
  tile: 12,
  card: 16,
  panel: 24,
  pill: 999,
} as const;

export const size = {
  gutter: 24,
  gutterCompact: 16, // below 360-pt width
  touchMin: 48,
  buttonHeight: 56,
  fieldHeight: 52,
  icon: 24,
  iconSmall: 20,
  categoryTile: 52,
  iconBadge: 44,
  tabBarContent: 64,
  readingMax: 640,
} as const;

/** Durations in ms. Always gate on the OS "reduce motion" setting. */
export const motion = {
  fast: 120,
  normal: 180,
  panel: 240,
} as const;

/** The only shadow in the system; optional, never a substitute for a border. */
export const elevation = {
  card: {
    shadowColor: palette.ink,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const;
