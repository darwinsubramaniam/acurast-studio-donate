import { createConfig } from '@luno-kit/react';
import {
  polkadotjsConnector,
  subwalletConnector,
  talismanConnector,
} from '@luno-kit/react/connectors';
import { QueryClient } from '@tanstack/react-query';
import { acurast, polkadot } from './lib/chains';

// Desktop browser-extension wallets only (per project scope — no WalletConnect/mobile).
export const config = createConfig({
  appName: 'Acurast Studio Donate',
  chains: [acurast, polkadot],
  connectors: [polkadotjsConnector(), subwalletConnector(), talismanConnector()],
});

export const queryClient = new QueryClient();
