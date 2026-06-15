import { describe, it, expect } from 'vitest';
import { ASSETS, DEFAULT_ASSET_KEY, assetByKey, type AssetKey } from './assets';

describe('assetByKey', () => {
  it('returns the matching asset for every defined key', () => {
    for (const a of ASSETS) {
      expect(assetByKey(a.key).key).toBe(a.key);
    }
  });

  it('falls back to the first asset for an unknown key', () => {
    expect(assetByKey('NOPE').key).toBe(ASSETS[0].key);
    expect(assetByKey('').key).toBe(ASSETS[0].key);
  });
});

describe('DEFAULT_ASSET_KEY', () => {
  it('points at an asset that actually exists', () => {
    expect(ASSETS.some((a) => a.key === DEFAULT_ASSET_KEY)).toBe(true);
  });
});

describe('ASSETS invariants', () => {
  it('has unique keys', () => {
    const keys = ASSETS.map((a) => a.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('uses the assets pallet (assetId) iff kind is "asset"', () => {
    for (const a of ASSETS) {
      if (a.kind === 'asset') {
        expect(typeof a.assetId).toBe('number');
      } else {
        expect(a.assetId).toBeUndefined();
      }
    }
  });

  it('pins the on-chain ids and decimals that route funds (wrong values = lost money)', () => {
    // These are the load-bearing constants — assert them explicitly, not via a loop.
    const byKey = (k: AssetKey) => assetByKey(k);
    expect(byKey('ACU')).toMatchObject({ kind: 'native', decimals: 12 });
    expect(byKey('DOT')).toMatchObject({ kind: 'native', decimals: 10 });
    expect(byKey('USDT')).toMatchObject({ kind: 'asset', assetId: 1984, decimals: 6 });
    expect(byKey('USDC')).toMatchObject({ kind: 'asset', assetId: 1337, decimals: 6 });
  });

  it('keeps DOT and the stablecoins on one chain, and ACU on another', () => {
    const acu = assetByKey('ACU').chainGenesisHash;
    const hub = assetByKey('DOT').chainGenesisHash;
    expect(acu).not.toBe(hub);
    expect(assetByKey('USDT').chainGenesisHash).toBe(hub);
    expect(assetByKey('USDC').chainGenesisHash).toBe(hub);
  });

  it('sends DOT and both stablecoins to the same Asset Hub account', () => {
    const dest = assetByKey('DOT').dest;
    expect(assetByKey('USDT').dest).toBe(dest);
    expect(assetByKey('USDC').dest).toBe(dest);
    // ACU lives on its own chain with its own address.
    expect(assetByKey('ACU').dest).not.toBe(dest);
  });

  it('has a non-empty dest and at least one valid preset for each asset', () => {
    for (const a of ASSETS) {
      expect(a.dest.length).toBeGreaterThan(0);
      expect(a.decimals).toBeGreaterThan(0);
      expect(a.presets.length).toBeGreaterThan(0);
      for (const p of a.presets) {
        expect(Number(p)).toBeGreaterThan(0);
      }
    }
  });
});
