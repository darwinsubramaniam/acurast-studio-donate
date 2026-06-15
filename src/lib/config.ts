export type NetworkId = 'ACU' | 'DOT';

export interface NetworkConfig {
  id: NetworkId;
  label: string;
  /** WebSocket RPC the browser connects to directly (no backend). */
  rpc: string;
  /** Donation destination address, encoded for this chain's SS58 prefix. */
  dest: string;
  ss58Prefix: number;
  /** Subscan extrinsic URL base; append the tx hash. */
  subscanTxBase: string;
  /** Suggested donation amounts (whole tokens) shown as quick-pick chips. */
  presets: string[];
}

// Addresses mirror src/studio/webview/Home.svelte in the acurast-studio repo.
// ACU = Acurast/Substrate (SS58 prefix 42); DOT = Polkadot relay (SS58 prefix 0).
export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  ACU: {
    id: 'ACU',
    label: 'Acurast · ACU',
    rpc: 'wss://public-rpc.mainnet.acurast.com',
    dest: '5EqCVoSXfLwwEj7zxWvmCMvmiVXZSgeHTj5anpm4sAN6SgXp',
    ss58Prefix: 42,
    subscanTxBase: 'https://acurast.subscan.io/extrinsic/',
    presets: ['10', '50', '100'],
  },
  DOT: {
    id: 'DOT',
    label: 'Polkadot · DOT',
    rpc: 'wss://rpc.polkadot.io',
    dest: '13mVe8hbX8DQgG8Wv9ymLWkva7XD8zCRYDp4x7kRRFPcd4ei',
    ss58Prefix: 0,
    subscanTxBase: 'https://polkadot.subscan.io/extrinsic/',
    presets: ['1', '5', '10'],
  },
};

export const APP_NAME = 'Acurast Studio Donate';

export const WALLET_LINKS = [
  { name: 'Polkadot.js', url: 'https://polkadot.js.org/extension/' },
  { name: 'Talisman', url: 'https://talisman.xyz/' },
  { name: 'SubWallet', url: 'https://subwallet.app/' },
];
