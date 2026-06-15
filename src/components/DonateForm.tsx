import { useState } from 'react';
import {
  useAccount,
  useApi,
  useChain,
  useSendTransaction,
  type DetailedTxStatus,
} from '@luno-kit/react';
import { DONATION } from '../lib/chains';
import { toPlanck } from '../lib/amount';
import { TxResult } from './TxResult';

const PROGRESS: Partial<Record<DetailedTxStatus, string>> = {
  broadcasting: 'Broadcasting…',
  inBlock: 'In block…',
  finalized: 'Finalizing…',
};

export function DonateForm() {
  const { account } = useAccount();
  const { api, isApiReady } = useApi();
  const { chain } = useChain();
  const {
    sendTransactionAsync,
    isPending,
    detailedStatus,
    data,
    error,
    reset,
  } = useSendTransaction({ waitFor: 'inBlock' });

  const [amount, setAmount] = useState('');

  if (!account) {
    return <p className="muted">Connect a wallet above to donate — or scan / copy the address below.</p>;
  }
  const meta = chain ? DONATION[chain.genesisHash] : undefined;
  if (!chain || !meta) {
    return <p className="muted">This chain isn’t set up for donations.</p>;
  }

  const symbol = chain.nativeCurrency.symbol;
  const decimals = chain.nativeCurrency.decimals;
  const canSend = isApiReady && !!api && Number(amount) > 0 && !isPending;

  async function donate() {
    if (!api || !meta) return;
    reset();
    try {
      await sendTransactionAsync({
        extrinsic: api.tx.balances.transferKeepAlive(meta.dest, toPlanck(amount, decimals)),
      });
    } catch {
      // Rejection / failure is surfaced via the hook's `error` state in <TxResult>.
    }
  }

  const label = isPending
    ? (PROGRESS[detailedStatus] ?? 'Submitting…')
    : `Donate ${amount || ''} ${symbol}`.replace(/\s+/g, ' ').trim();

  return (
    <>
      <div className="field">
        <span className="label">Amount ({symbol})</span>
        <input
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          disabled={isPending}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="presets">
          {meta.presets.map((p) => (
            <button
              key={p}
              type="button"
              className={amount === p ? 'chip active' : 'chip'}
              disabled={isPending}
              onClick={() => setAmount(p)}
            >
              {p} {symbol}
            </button>
          ))}
        </div>
      </div>

      <button className="primary" disabled={!canSend} onClick={donate}>
        {label}
      </button>

      <TxResult data={data} error={error} subscanTxBase={meta.subscanTxBase} />
    </>
  );
}
