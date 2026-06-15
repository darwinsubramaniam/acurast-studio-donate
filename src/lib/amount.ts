/**
 * Convert a human amount string (e.g. "1.5") to integer planck as bigint,
 * given the chain's token decimals. Avoids float math so large/precise amounts
 * are exact (dedot extrinsics take bigint).
 */
export function toPlanck(amount: string, decimals: number): bigint {
  const t = amount.trim();
  // Accept only plain decimal notation (e.g. "1", "1.5", ".5"). This rejects
  // exponent forms like "1e5" — which <input type="number"> permits but BigInt
  // cannot parse (it would throw) — along with signs, hex and other junk.
  if (!/^\d*\.?\d*$/.test(t) || Number.isNaN(Number(t)) || Number(t) <= 0) return 0n;
  const [whole, frac = ''] = t.split('.');
  const fracPadded = (frac + '0'.repeat(decimals)).slice(0, decimals);
  return BigInt((whole || '0') + fracPadded);
}

/** Split integer planck into whole + fractional (trailing zeros trimmed) parts. */
function splitPlanck(planck: bigint, decimals: number, maxFrac: number): [bigint, string] {
  const base = 10n ** BigInt(decimals);
  const v = planck < 0n ? -planck : planck;
  const whole = v / base;
  const frac = (v % base).toString().padStart(decimals, '0').slice(0, maxFrac).replace(/0+$/, '');
  return [whole, frac];
}

/** Human display of planck with thousands separators (e.g. "1,234.56"). */
export function formatPlanck(planck: bigint, decimals: number, maxFrac = 4): string {
  const [whole, frac] = splitPlanck(planck, decimals, maxFrac);
  const wholeStr = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (planck < 0n ? '-' : '') + wholeStr + (frac ? `.${frac}` : '');
}

/** Plain decimal string (no separators) suitable for a number input value. */
export function planckToInputValue(planck: bigint, decimals: number): string {
  const [whole, frac] = splitPlanck(planck, decimals, decimals);
  return whole.toString() + (frac ? `.${frac}` : '');
}
