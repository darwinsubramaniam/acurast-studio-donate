import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { APP_NAME } from './config';

export class NoExtensionError extends Error {
  constructor() {
    super('No Polkadot-compatible wallet extension found.');
    this.name = 'NoExtensionError';
  }
}

/** Enable the injected wallet(s) and return the available accounts. */
export async function connectWallet(): Promise<InjectedAccountWithMeta[]> {
  const extensions = await web3Enable(APP_NAME);
  if (extensions.length === 0) throw new NoExtensionError();
  return web3Accounts();
}
