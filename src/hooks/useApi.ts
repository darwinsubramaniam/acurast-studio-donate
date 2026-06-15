import { useEffect, useState } from 'react';
import type { ApiPromise } from '@polkadot/api';
import { chainInfo, getApi } from '../lib/chain';

export interface ApiState {
  api: ApiPromise | null;
  status: 'connecting' | 'ready' | 'error';
  decimals: number;
  token: string;
  error?: string;
}

/** Connect (once per RPC) and expose the chain's decimals + token symbol. */
export function useApi(rpc: string): ApiState {
  const [state, setState] = useState<ApiState>({
    api: null,
    status: 'connecting',
    decimals: 12,
    token: '',
  });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: 'connecting' }));

    getApi(rpc)
      .then((api) => api.isReady)
      .then((api) => {
        if (cancelled) return;
        const { decimals, token } = chainInfo(api);
        setState({ api, status: 'ready', decimals, token });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setState({
          api: null,
          status: 'error',
          decimals: 12,
          token: '',
          error: e instanceof Error ? e.message : String(e),
        });
      });

    return () => {
      cancelled = true;
    };
  }, [rpc]);

  return state;
}
