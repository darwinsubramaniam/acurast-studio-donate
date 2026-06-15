import { useApi, useChain } from '@luno-kit/react';
import { ConnectButton } from '@luno-kit/ui';
import { DONATION } from './lib/chains';
import { NetworkToggle } from './components/NetworkToggle';
import { DonateForm } from './components/DonateForm';
import { ManualFallback } from './components/ManualFallback';

export default function App() {
  const { chain } = useChain();
  const { isApiReady, apiError } = useApi();
  const meta = chain ? DONATION[chain.genesisHash] : undefined;

  return (
    <main className="app">
      <header className="hero">
        <h1>Support Acurast Studio</h1>
        <p>
          Send a non-custodial donation in ACU or DOT. Funds go straight from your wallet
          to the maintainer — this page holds no keys and never touches your funds.
        </p>
      </header>

      <div className="connectbar">
        <ConnectButton />
      </div>

      <NetworkToggle />

      <section className="card">
        <div className="conn-status">
          <span className={`dot ${apiError ? 'error' : isApiReady ? 'ready' : 'connecting'}`} aria-hidden="true" />
          {apiError
            ? `RPC error: ${apiError.message}`
            : isApiReady
              ? `Connected · ${chain?.nativeCurrency.symbol ?? ''}`
              : `Connecting to ${chain?.name ?? 'network'}…`}
        </div>

        <DonateForm />
      </section>

      {chain && meta && <ManualFallback dest={meta.dest} symbol={chain.nativeCurrency.symbol} />}

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
