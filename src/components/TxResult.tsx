import type { TransactionReceipt } from '@luno-kit/react';

interface Props {
  data: TransactionReceipt | undefined;
  error: Error | null;
  subscanTxBase: string;
}

export function TxResult({ data, error, subscanTxBase }: Props) {
  if (error) {
    return (
      <div className="tx tx-error" role="status">
        <p className="tx-label">Transaction failed</p>
        <p className="tx-msg">{error.message || 'The wallet rejected or could not sign the transaction.'}</p>
      </div>
    );
  }

  if (!data) return null;

  if (data.status === 'success') {
    return (
      <div className="tx tx-success" role="status">
        <p className="tx-label">Donation included in a block 🎉 Thank you!</p>
        <a href={`${subscanTxBase}${data.transactionHash}`} target="_blank" rel="noreferrer">
          View on Subscan ↗
        </a>
      </div>
    );
  }

  return (
    <div className="tx tx-error" role="status">
      <p className="tx-label">Transaction failed</p>
      <p className="tx-msg">{data.errorMessage || 'The transaction did not succeed.'}</p>
    </div>
  );
}
