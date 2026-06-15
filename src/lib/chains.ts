import { polkadot } from '@luno-kit/react/chains';
import type { Chain } from '@luno-kit/react/types';

// Acurast mainnet isn't a built-in LunoKit chain, so define it.
// genesisHash + properties were read from wss://public-rpc.mainnet.acurast.com
// (chain_getBlockHash[0] + system_properties): ss58 42, 12 decimals, ACU.
export const acurast: Chain = {
  genesisHash: '0x4b5f95eefedf0d0fb514339edc24d2d411310520f687b4146145bcedb99885b9',
  name: 'Acurast',
  nativeCurrency: { name: 'Acurast', symbol: 'ACU', decimals: 12 },
  rpcUrls: { webSocket: ['wss://public-rpc.mainnet.acurast.com'] },
  ss58Format: 42,
  blockExplorers: { default: { name: 'Subscan', url: 'https://acurast.subscan.io' } },
  testnet: false,
  chainIconUrl: '',
  subscan: { url: 'https://acurast.subscan.io', api: 'https://acurast.api.subscan.io' },
};

export { polkadot };

export interface DonationMeta {
  /** Destination address, encoded for this chain's SS58 prefix. */
  dest: string;
  /** Subscan extrinsic URL base; append the tx hash. */
  subscanTxBase: string;
  /** Quick-pick amounts in whole tokens. */
  presets: string[];
}

// Keyed by genesisHash — LunoKit's chain id (createConfig keys transports by it,
// and useChain()/switchChain() identify chains by genesisHash).
export const DONATION: Record<string, DonationMeta> = {
  [acurast.genesisHash]: {
    dest: '5EqCVoSXfLwwEj7zxWvmCMvmiVXZSgeHTj5anpm4sAN6SgXp',
    subscanTxBase: 'https://acurast.subscan.io/extrinsic/',
    presets: ['10', '50', '100'],
  },
  [polkadot.genesisHash]: {
    dest: '13mVe8hbX8DQgG8Wv9ymLWkva7XD8zCRYDp4x7kRRFPcd4ei',
    subscanTxBase: 'https://polkadot.subscan.io/extrinsic/',
    presets: ['1', '5', '10'],
  },
};
