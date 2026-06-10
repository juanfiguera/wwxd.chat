/**
 * Soft tint of a color toward white. Used for avatar backgrounds and
 * accent-soft surfaces.
 *
 * pct = 0.16 produces the typical avatar backplate; 0.14 produces accent-soft.
 */
export function tintHex(hex: string, pct: number): string {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const m = (v: number) => Math.round(v + (255 - v) * (1 - pct));
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
}
