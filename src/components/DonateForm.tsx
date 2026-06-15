import { useState } from 'react';
import {
  useAccount,
  useApi,
  useSendTransaction,
  type DetailedTxStatus,
} from '@luno-kit/react';
import type { DonationAsset } from '../lib/assets';
import { toPlanck } from '../lib/amount';
import { TxResult } from './TxResult';

const PROGRESS: Partial<Record<DetailedTxStatus, string>> = {
  broadcasting: 'Broadcasting…',
  inBlock: 'In block…',
  finalized: 'Finalizing…',
};

interface Props {
  asset: DonationAsset;
  /** True once the active chain matches the asset's chain and the API is ready. */
  ready: boolean;
}

export function DonateForm({ asset, ready }: Props) {
  const { account } = useAccount();
  const { api } = useApi();
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

  const canSend = ready && !!api && Number(amount) > 0 && !isPending;

  async function donate() {
    if (!api) return;
    reset();
    const planck = toPlanck(amount, asset.decimals);
    // Native token → balances pallet; Asset Hub stablecoins → assets pallet.
    const extrinsic =
      asset.kind === 'asset' && asset.assetId !== undefined
        ? api.tx.assets.transferKeepAlive(asset.assetId, asset.dest, planck)
        : api.tx.balances.transferKeepAlive(asset.dest, planck);
    try {
      await sendTransactionAsync({ extrinsic });
    } catch {
      // Rejection / failure is surfaced via the hook's `error` state in <TxResult>.
    }
  }

  const label = isPending
    ? (PROGRESS[detailedStatus] ?? 'Submitting…')
    : `Donate ${amount || ''} ${asset.symbol}`.replace(/\s+/g, ' ').trim();

  return (
    <>
      <div className="field">
        <span className="label">Amount ({asset.symbol})</span>
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
          {asset.presets.map((p) => (
            <button
              key={p}
              type="button"
              className={amount === p ? 'chip active' : 'chip'}
              disabled={isPending}
              onClick={() => setAmount(p)}
            >
              {p} {asset.symbol}
            </button>
          ))}
        </div>
      </div>

      <button className="primary" disabled={!canSend} onClick={donate}>
        {label}
      </button>

      <TxResult data={data} error={error} subscanTxBase={asset.subscanTxBase} />
    </>
  );
}
