import { WALLET_LINKS } from '../lib/config';
import type { WalletState } from '../hooks/useWallet';

interface Props {
  status: WalletState['status'];
  noExtension: boolean;
  error?: string;
  onConnect: () => void;
}

export function ConnectButton({ status, noExtension, error, onConnect }: Props) {
  return (
    <div className="connect">
      <button className="primary" onClick={onConnect} disabled={status === 'connecting'}>
        {status === 'connecting' ? 'Connecting…' : 'Connect wallet'}
      </button>

      {noExtension && (
        <p className="hint">
          No wallet extension found. Install one and reload:{' '}
          {WALLET_LINKS.map((w, i) => (
            <span key={w.name}>
              <a href={w.url} target="_blank" rel="noreferrer">
                {w.name}
              </a>
              {i < WALLET_LINKS.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      )}

      {status === 'error' && !noExtension && <p className="error">{error}</p>}
    </div>
  );
}
