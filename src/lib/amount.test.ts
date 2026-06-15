import { describe, it, expect } from 'vitest';
import { toPlanck, formatPlanck, planckToInputValue } from './amount';

describe('toPlanck', () => {
  it('converts whole amounts', () => {
    expect(toPlanck('1', 12)).toBe(1_000_000_000_000n);
    expect(toPlanck('100', 6)).toBe(100_000_000n);
  });

  it('converts fractional amounts exactly', () => {
    expect(toPlanck('1.5', 12)).toBe(1_500_000_000_000n);
    expect(toPlanck('0.000001', 6)).toBe(1n);
    expect(toPlanck('.5', 6)).toBe(500_000n);
  });

  it('truncates fractions longer than the asset decimals', () => {
    // 6 decimals: anything beyond the 6th fractional digit is dropped.
    expect(toPlanck('1.1234567', 6)).toBe(1_123_456n);
  });

  it('trims surrounding whitespace and leading zeros', () => {
    expect(toPlanck('  2.5  ', 6)).toBe(2_500_000n);
    expect(toPlanck('007', 6)).toBe(7_000_000n);
  });

  it('returns 0 for empty, zero or non-positive input', () => {
    expect(toPlanck('', 12)).toBe(0n);
    expect(toPlanck('0', 12)).toBe(0n);
    expect(toPlanck('0.0', 12)).toBe(0n);
    expect(toPlanck('.', 12)).toBe(0n);
  });

  it('rejects exponent notation instead of throwing', () => {
    // `<input type="number">` accepts "1e5"; BigInt would throw on it. The
    // guard must return 0n rather than letting the exception escape.
    expect(() => toPlanck('1e5', 12)).not.toThrow();
    expect(toPlanck('1e5', 12)).toBe(0n);
    expect(toPlanck('1E5', 12)).toBe(0n);
  });

  it('rejects signs, hex and other junk', () => {
    expect(toPlanck('-1', 12)).toBe(0n);
    expect(toPlanck('+1', 12)).toBe(0n);
    expect(toPlanck('0x10', 12)).toBe(0n);
    expect(toPlanck('1.2.3', 12)).toBe(0n);
    expect(toPlanck('abc', 12)).toBe(0n);
    expect(toPlanck('1,000', 12)).toBe(0n);
  });
});

describe('formatPlanck', () => {
  it('formats with thousands separators and trims trailing zeros', () => {
    expect(formatPlanck(1_234_560_000_000_000n, 12)).toBe('1,234.56');
    expect(formatPlanck(1_000_000_000_000n, 12)).toBe('1');
    expect(formatPlanck(0n, 12)).toBe('0');
  });

  it('caps the fractional digits at maxFrac (default 4)', () => {
    // 1.123456 with 6 decimals → fraction capped to 4 places.
    expect(formatPlanck(1_123_456n, 6)).toBe('1.1234');
    expect(formatPlanck(1_123_456n, 6, 2)).toBe('1.12');
  });

  it('handles negative values', () => {
    expect(formatPlanck(-1_500_000n, 6)).toBe('-1.5');
  });
});

describe('planckToInputValue', () => {
  it('round-trips through toPlanck', () => {
    const planck = toPlanck('1234.5678', 6);
    expect(planckToInputValue(planck, 6)).toBe('1234.5678');
  });

  it('emits a plain decimal with no separators', () => {
    expect(planckToInputValue(1_000_000_000_000n, 12)).toBe('1');
    expect(planckToInputValue(1_234_560_000_000n, 12)).toBe('1.23456');
  });
});
