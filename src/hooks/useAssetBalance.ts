import { useEffect, useState } from 'react';
import { useAccount, useApi, useChain } from '@luno-kit/react';
import type { DonationAsset } from '../lib/assets';

/**
 * Live balance of the connected account for the selected asset, in planck (bigint),
 * or null when unavailable (not connected / wrong chain / loading).
 *
 * Native tokens (ACU, DOT) read `system.account().data.free`; Asset Hub stablecoins
 * (USDt/USDC) read `assets.account([assetId, address]).balance`.
 */
export function useAssetBalance(asset: DonationAsset): bigint | null {
  const { address } = useAccount();
  const { chain } = useChain();
  const { api, isApiReady } = useApi();
  const [planck, setPlanck] = useState<bigint | null>(null);

  const onChain = chain?.genesisHash === asset.chainGenesisHash;

  useEffect(() => {
    setPlanck(null);
    if (!api || !isApiReady || !address || !onChain) return;

    let active = true;
    let unsub: (() => void) | undefined;
    const set = (v: bigint) => { if (active) setPlanck(v); };

    // dedot query generics on the default client are loose; cast the subscriptions.
    const query = api.query as any;

    (async () => {
      if (asset.kind === 'asset' && asset.assetId !== undefined) {
        unsub = await query.assets.account([asset.assetId, address], (acc: any) => {
          set(acc ? BigInt(acc.balance.toString()) : 0n);
        });
      } else {
        unsub = await query.system.account(address, (info: any) => {
          set(BigInt(info.data.free.toString()));
        });
      }
    })().catch(() => { if (active) setPlanck(null); });

    return () => {
      active = false;
      unsub?.();
    };
  }, [api, isApiReady, address, onChain, asset.key, asset.assetId, asset.kind]);

  return planck;
}
