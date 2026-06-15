import { useState } from 'react';
import {
  useAccount,
  useApi,
  useSendTransaction,
  type DetailedTxStatus,
} from '@luno-kit/react';
import type { DonationAsset } from '../lib/assets';
import { toPlanck, formatPlanck, planckToInputValue, isPartialAmount } from '../lib/amount';
import { useAssetBalance } from '../hooks/useAssetBalance';
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
  const balance = useAssetBalance(asset);

  if (!account) {
    return <p className="muted">Connect a wallet above to donate — or scan / copy the address below.</p>;
  }

  // The amount the tx will actually carry — the single source of truth for both
  // the send guard and the extrinsic, so the button can't enable on input that
  // parses to zero (e.g. "0.0", or a sub-unit amount that truncates away).
  const planck = toPlanck(amount, asset.decimals);
  const canSend = ready && !!api && planck > 0n && !isPending;

  async function donate() {
    if (!api || planck <= 0n) return;
    reset();
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
        <div className="label-row">
          <span className="label">Amount ({asset.symbol})</span>
          {balance !== null && (
            <span className="balance-line">
              Balance: {formatPlanck(balance, asset.decimals)} {asset.symbol}
              {asset.kind === 'asset' && balance > 0n && (
                <button
                  type="button"
                  className="max-btn"
                  disabled={isPending}
                  onClick={() => setAmount(planckToInputValue(balance, asset.decimals))}
                >
                  Max
                </button>
              )}
            </span>
          )}
        </div>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.0"
          value={amount}
          disabled={isPending}
          // Filter at the source: reject any keystroke/paste that isn't a plain
          // decimal, so letters and exponent forms ("32e12") can't be entered.
          // type="number" was unsafe here — the browser admits "e"/"+"/"-".
          onChange={(e) => {
            if (isPartialAmount(e.target.value)) setAmount(e.target.value);
          }}
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
