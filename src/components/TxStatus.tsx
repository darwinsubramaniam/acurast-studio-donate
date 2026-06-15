import type { TxProgress, TxStage } from '../lib/chain';

interface Props {
  progress: TxProgress | null;
  subscanTxBase: string;
}

const LABEL: Record<TxStage, string> = {
  signing: 'Waiting for signature in your wallet…',
  broadcast: 'Broadcasting transaction…',
  inBlock: 'Donation included in a block 🎉 Thank you!',
  finalized: 'Donation finalized 🎉 Thank you!',
  error: 'Transaction failed',
};

export function TxStatus({ progress, subscanTxBase }: Props) {
  if (!progress) return null;
  const done = progress.status === 'inBlock' || progress.status === 'finalized';

  return (
    <div className={`tx tx-${progress.status}`} role="status">
      <p className="tx-label">{LABEL[progress.status]}</p>
      {progress.message && <p className="tx-msg">{progress.message}</p>}
      {done && progress.txHash && (
        <a href={`${subscanTxBase}${progress.txHash}`} target="_blank" rel="noreferrer">
          View on Subscan ↗
        </a>
      )}
    </div>
  );
}
