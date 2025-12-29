// shared/helpers/scalar.theme.ts

const themes = [
  'alternate',
  'default',
  'moon',
  'purple',
  'solarized',
  'bluePlanet',
  'deepSpace',
  'saturn',
  'kepler',
  'elysiajs',
  'fastify',
  'mars',
  'laserwave',
  'none',
] as const;

export default themes;

export type ScalarTheme = (typeof themes)[number];
