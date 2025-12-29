export const toBooleanLoose = (raw: unknown): boolean | undefined => {
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'number') return raw === 1;
  if (typeof raw === 'string') {
    const v = raw.trim().toLowerCase();
    if (['1', 'true', 't', 'yes', 'y', 'on'].includes(v)) return true;
    if (['0', 'false', 'f', 'no', 'n', 'off'].includes(v)) return false;
  }
  return undefined;
};
