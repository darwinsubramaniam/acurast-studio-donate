import { useMemo, useState } from 'react';
import { NETWORKS, type NetworkId } from './lib/config';
import { submitDonation, toPlanck, type TxProgress } from './lib/chain';
import { useApi } from './hooks/useApi';
import { useWallet } from './hooks/useWallet';
import { NetworkToggle } from './components/NetworkToggle';
import { ConnectButton } from './components/ConnectButton';
import { AccountPicker } from './components/AccountPicker';
import { AmountInput } from './components/AmountInput';
import { TxStatus } from './components/TxStatus';
import { ManualFallback } from './components/ManualFallback';

export default function App() {
  const [netId, setNetId] = useState<NetworkId>('ACU');
  const net = NETWORKS[netId];

  const api = useApi(net.rpc);
  const wallet = useWallet();

  const [account, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [progress, setProgress] = useState<TxProgress | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedAccount = account ?? wallet.accounts[0]?.address ?? null;
  const token = api.token || net.id;

  const canDonate = useMemo(
    () =>
      api.status === 'ready' &&
      wallet.status === 'connected' &&
      !!selectedAccount &&
      Number(amount) > 0 &&
      !submitting,
    [api.status, wallet.status, selectedAccount, amount, submitting],
  );

  function switchNetwork(id: NetworkId) {
    setNetId(id);
    setProgress(null);
    setAccount(null);
  }

  async function donate() {
    if (!api.api || !selectedAccount) return;
    setSubmitting(true);
    setProgress({ status: 'signing' });
    try {
      const planck = toPlanck(amount, api.decimals);
      await submitDonation(api.api, net.dest, planck, selectedAccount, setProgress);
    } catch (e) {
      setProgress({
        status: 'error',
        message: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="app">
      <header className="hero">
        <h1>Support Acurast Studio</h1>
        <p>
          Send a non-custodial donation in ACU or DOT. Funds go straight from your wallet
          to the maintainer — this page never holds or routes them.
        </p>
      </header>

      <NetworkToggle value={netId} onChange={switchNetwork} />

      <section className="card">
        <div className="conn-status">
          <span className={`dot ${api.status}`} aria-hidden="true" />
          {api.status === 'connecting' && `Connecting to ${net.label}…`}
          {api.status === 'ready' && `Connected · ${token}`}
          {api.status === 'error' && `RPC error: ${api.error ?? 'unavailable'}`}
        </div>

        {wallet.status !== 'connected' ? (
          <ConnectButton
            status={wallet.status}
            noExtension={wallet.noExtension}
            error={wallet.error}
            onConnect={wallet.connect}
          />
        ) : (
          <>
            <AccountPicker
              accounts={wallet.accounts}
              value={selectedAccount}
              prefix={net.ss58Prefix}
              onChange={setAccount}
            />
            <AmountInput value={amount} token={token} presets={net.presets} onChange={setAmount} />
            <button className="primary donate" disabled={!canDonate} onClick={donate}>
              {submitting ? 'Submitting…' : `Donate ${amount || ''} ${token}`.replace(/\s+/g, ' ').trim()}
            </button>
          </>
        )}

        <TxStatus progress={progress} subscanTxBase={net.subscanTxBase} />
      </section>

      <ManualFallback dest={net.dest} prefix={net.ss58Prefix} token={net.id} />

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
