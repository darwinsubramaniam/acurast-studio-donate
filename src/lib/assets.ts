import { acurast, polkadotAssetHub } from './chains';

export type AssetKey = 'ACU' | 'DOT' | 'USDT' | 'USDC';

export interface DonationAsset {
  key: AssetKey;
  /** Tab label. */
  label: string;
  /** Token ticker shown next to amounts. */
  symbol: string;
  decimals: number;
  /** Chain to be active on (LunoKit chain id == genesisHash). */
  chainGenesisHash: string;
  chainName: string;
  /** native = balances pallet; asset = assets pallet (Asset Hub). */
  kind: 'native' | 'asset';
  /** assets-pallet id, required when kind === 'asset'. */
  assetId?: number;
  /** Destination address, encoded for the chain's SS58 prefix. */
  dest: string;
  subscanTxBase: string;
  /** Quick-pick amounts in whole tokens. */
  presets: string[];
}

const DEST_ACU = '5EqCVoSXfLwwEj7zxWvmCMvmiVXZSgeHTj5anpm4sAN6SgXp';
// Same key controls this account on Asset Hub (SS58 prefix 0), so DOT/USDC/USDT
// donations land in an account the maintainer holds.
const DEST_DOT = '13mVe8hbX8DQgG8Wv9ymLWkva7XD8zCRYDp4x7kRRFPcd4ei';

const ASSETHUB_SUBSCAN = 'https://assethub-polkadot.subscan.io/extrinsic/';

// USDt = asset 1984, USDC = asset 1337 on Polkadot Asset Hub (both 6 decimals),
// verified via assets.metadata over RPC.
export const ASSETS: DonationAsset[] = [
  {
    key: 'ACU', label: 'ACU', symbol: 'ACU', decimals: 12,
    chainGenesisHash: acurast.genesisHash, chainName: 'Acurast',
    kind: 'native', dest: DEST_ACU,
    subscanTxBase: 'https://acurast.subscan.io/extrinsic/', presets: ['10', '50', '100'],
  },
  {
    key: 'DOT', label: 'DOT', symbol: 'DOT', decimals: 10,
    chainGenesisHash: polkadotAssetHub.genesisHash, chainName: 'Polkadot Asset Hub',
    kind: 'native', dest: DEST_DOT,
    subscanTxBase: ASSETHUB_SUBSCAN, presets: ['1', '5', '10'],
  },
  {
    key: 'USDT', label: 'USDT', symbol: 'USDt', decimals: 6,
    chainGenesisHash: polkadotAssetHub.genesisHash, chainName: 'Polkadot Asset Hub',
    kind: 'asset', assetId: 1984, dest: DEST_DOT,
    subscanTxBase: ASSETHUB_SUBSCAN, presets: ['5', '20', '50'],
  },
  {
    key: 'USDC', label: 'USDC', symbol: 'USDC', decimals: 6,
    chainGenesisHash: polkadotAssetHub.genesisHash, chainName: 'Polkadot Asset Hub',
    kind: 'asset', assetId: 1337, dest: DEST_DOT,
    subscanTxBase: ASSETHUB_SUBSCAN, presets: ['5', '20', '50'],
  },
];

export const DEFAULT_ASSET_KEY: AssetKey = 'ACU';

export function assetByKey(key: string): DonationAsset {
  return ASSETS.find((a) => a.key === key) ?? ASSETS[0];
}
