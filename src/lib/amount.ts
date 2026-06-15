/**
 * Convert a human amount string (e.g. "1.5") to integer planck as bigint,
 * given the chain's token decimals. Avoids float math so large/precise amounts
 * are exact (dedot extrinsics take bigint).
 */
export function toPlanck(amount: string, decimals: number): bigint {
  const t = amount.trim();
  if (!t || Number.isNaN(Number(t)) || Number(t) <= 0) return 0n;
  const [whole, frac = ''] = t.split('.');
  const fracPadded = (frac + '0'.repeat(decimals)).slice(0, decimals);
  return BigInt((whole || '0') + fracPadded);
}
