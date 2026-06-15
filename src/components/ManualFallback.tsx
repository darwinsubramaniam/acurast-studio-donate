import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  dest: string;
  symbol: string;
}

/** Always-available path: no wallet extension required — scan or copy the address. */
export function ManualFallback({ dest, symbol }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(dest);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the address is still selectable */
    }
  };

  return (
    <details className="fallback">
      <summary>Prefer to send manually? Scan or copy the {symbol} address</summary>
      <div className="fallback-body">
        <div className="qr">
          <QRCodeSVG value={dest} size={148} marginSize={2} />
        </div>
        <div className="fallback-addr">
          <code>{dest}</code>
          <button type="button" onClick={copy}>
            {copied ? 'Copied!' : 'Copy address'}
          </button>
        </div>
      </div>
    </details>
  );
}
