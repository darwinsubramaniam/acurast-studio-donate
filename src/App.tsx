import { useState } from 'react';
import { useApi, useChain, useSwitchChain } from '@luno-kit/react';
import { ConnectButton } from '@luno-kit/ui';
import { assetByKey, DEFAULT_ASSET_KEY, type AssetKey } from './lib/assets';
import { AssetSelector } from './components/AssetSelector';
import { DonateForm } from './components/DonateForm';
import { ManualFallback } from './components/ManualFallback';
import logoDark from './assets/acurast-logo-dark.svg';
import logoLight from './assets/acurast-logo-light.svg';

export default function App() {
  const [selectedKey, setSelectedKey] = useState<AssetKey>(DEFAULT_ASSET_KEY);
  const asset = assetByKey(selectedKey);

  const { chain } = useChain();
  const { isApiReady, apiError } = useApi();
  const { switchChainAsync, isPending: switching } = useSwitchChain();

  const onChain = chain?.genesisHash === asset.chainGenesisHash;
  const ready = onChain && isApiReady && !switching;

  async function selectAsset(key: AssetKey) {
    setSelectedKey(key);
    const next = assetByKey(key);
    // DOT/USDT/USDC share Asset Hub, so this only switches when crossing to/from ACU.
    if (chain?.genesisHash !== next.chainGenesisHash) {
      try {
        await switchChainAsync({ chainId: next.chainGenesisHash });
      } catch {
        /* surfaced via apiError / disabled donate button */
      }
    }
  }

  const status = apiError
    ? `RPC error: ${apiError.message}`
    : switching || !onChain
      ? `Switching to ${asset.chainName}…`
      : !isApiReady
        ? `Connecting to ${asset.chainName}…`
        : `Connected · ${asset.chainName}`;

  return (
    <main className="app">
      <header className="hero">
        <img className="brand brand-dark" src={logoDark} alt="Acurast" />
        <img className="brand brand-light" src={logoLight} alt="Acurast" />
        <h1>Support Acurast Studio</h1>
        <p>
          Send a non-custodial donation in ACU, DOT, or a stablecoin (USDC / USDT). Funds
          go straight from your wallet to the maintainer — this page holds no keys. DOT and
          stablecoins settle on Polkadot Asset Hub.
        </p>
      </header>

      <div className="connectbar">
        <ConnectButton />
      </div>

      <AssetSelector selectedKey={selectedKey} onSelect={selectAsset} busy={switching} />

      <section className="card">
        <div className="conn-status">
          <span
            className={`dot ${apiError ? 'error' : ready ? 'ready' : 'connecting'}`}
            aria-hidden="true"
          />
          {status}
        </div>

        <DonateForm asset={asset} ready={ready} />
      </section>

      <ManualFallback asset={asset} />

      <footer className="foot">
        <a href="https://github.com/darwinsubramaniam/acurast-studio" target="_blank" rel="noreferrer">
          Acurast Studio
        </a>
        {' · '}Non-custodial{' · '}
        <a
          href="https://github.com/darwinsubramaniam/acurast-studio-donate"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </footer>
    </main>
  );
}
