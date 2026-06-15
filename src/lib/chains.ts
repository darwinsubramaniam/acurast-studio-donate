import { polkadotAssetHub } from '@luno-kit/react/chains';
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

// All Polkadot-side donations — DOT, USDC and USDT — settle on Polkadot Asset Hub,
// never the relay chain. Asset Hub holds native DOT plus the USDC/USDT assets.
export { polkadotAssetHub };
