import { useCallback, useState } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { connectWallet, NoExtensionError } from '../lib/wallet';

export interface WalletState {
  accounts: InjectedAccountWithMeta[];
  status: 'idle' | 'connecting' | 'connected' | 'error';
  error?: string;
  noExtension: boolean;
}

export interface UseWallet extends WalletState {
  connect: () => Promise<void>;
}

export function useWallet(): UseWallet {
  const [state, setState] = useState<WalletState>({
    accounts: [],
    status: 'idle',
    noExtension: false,
  });

  const connect = useCallback(async () => {
    setState({ accounts: [], status: 'connecting', noExtension: false });
    try {
      const accounts = await connectWallet();
      setState({ accounts, status: 'connected', noExtension: false });
    } catch (e) {
      setState({
        accounts: [],
        status: 'error',
        noExtension: e instanceof NoExtensionError,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }, []);

  return { ...state, connect };
}
