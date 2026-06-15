import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { BN } from '@polkadot/util';
import type { DispatchError } from '@polkadot/types/interfaces';

// One ApiPromise per RPC endpoint, reused across renders (mirrors the
// acurast-studio extension's cached AcurastService connections).
const apiCache = new Map<string, Promise<ApiPromise>>();

export function getApi(rpc: string): Promise<ApiPromise> {
  let p = apiCache.get(rpc);
  if (!p) {
    p = ApiPromise.create({ provider: new WsProvider(rpc) });
    apiCache.set(rpc, p);
  }
  return p;
}

export function chainInfo(api: ApiPromise): { decimals: number; token: string } {
  return {
    decimals: api.registry.chainDecimals[0] ?? 12,
    token: api.registry.chainTokens[0] ?? '',
  };
}

/** Convert a human amount (e.g. "1.5") to planck given the chain's decimals. */
export function toPlanck(amount: string, decimals: number): BN {
  const trimmed = amount.trim();
  if (!trimmed || Number(trimmed) <= 0) return new BN(0);
  const [whole, fracRaw = ''] = trimmed.split('.');
  const frac = (fracRaw + '0'.repeat(decimals)).slice(0, decimals);
  const digits = ((whole || '0') + frac).replace(/^0+(?=\d)/, '');
  return new BN(digits || '0');
}

export type TxStage = 'signing' | 'broadcast' | 'inBlock' | 'finalized' | 'error';
export interface TxProgress {
  status: TxStage;
  txHash?: string;
  blockHash?: string;
  message?: string;
}

function decodeError(api: ApiPromise, dispatchError: DispatchError): string {
  if (dispatchError.isModule) {
    const decoded = api.registry.findMetaError(dispatchError.asModule);
    return `${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`.trim();
  }
  return dispatchError.toString();
}

/**
 * Build and submit a `balances.transferKeepAlive` to `dest`, signed by the
 * injected wallet for `fromAddress`. Resolves once the tx is in a block.
 */
export async function submitDonation(
  api: ApiPromise,
  dest: string,
  planck: BN,
  fromAddress: string,
  onProgress: (p: TxProgress) => void,
): Promise<void> {
  const injector = await web3FromAddress(fromAddress);
  const tx = api.tx.balances.transferKeepAlive(dest, planck);
  onProgress({ status: 'signing' });

  return new Promise<void>((resolve, reject) => {
    let unsub: (() => void) | undefined;
    tx.signAndSend(
      fromAddress,
      { signer: injector.signer },
      ({ status, dispatchError, txHash }) => {
        if (status.isBroadcast) {
          onProgress({ status: 'broadcast', txHash: txHash.toHex() });
        } else if (status.isInBlock) {
          if (dispatchError) {
            unsub?.();
            reject(new Error(decodeError(api, dispatchError)));
            return;
          }
          onProgress({
            status: 'inBlock',
            txHash: txHash.toHex(),
            blockHash: status.asInBlock.toHex(),
          });
          unsub?.();
          resolve();
        } else if (status.isInvalid || status.isDropped || status.isUsurped) {
          unsub?.();
          reject(new Error(`Transaction ${status.type.toLowerCase()}`));
        }
      },
    )
      .then((u) => {
        unsub = u;
      })
      .catch(reject);
  });
}
