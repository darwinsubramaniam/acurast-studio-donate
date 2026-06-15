import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { DonationAsset } from '../lib/assets';

interface Props {
  asset: DonationAsset;
}

/** Always-available path: no wallet extension required — scan or copy the address. */
export function ManualFallback({ asset }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asset.dest);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the address is still selectable */
    }
  };

  return (
    <details className="fallback">
      <summary>Prefer to send manually? Scan or copy the address</summary>
      <div className="fallback-body">
        <div className="qr">
          <QRCodeSVG value={asset.dest} size={148} marginSize={2} />
        </div>
        <div className="fallback-addr">
          <p className="fallback-note">
            Send <strong>{asset.symbol}</strong> on {asset.chainName} to:
          </p>
          <code>{asset.dest}</code>
          <button type="button" onClick={copy}>
            {copied ? 'Copied!' : 'Copy address'}
          </button>
        </div>
      </div>
    </details>
  );
}
