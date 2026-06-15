import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { reencode } from '../lib/format';

interface Props {
  dest: string;
  prefix: number;
  token: string;
}

/** Always-available path: no wallet extension required — scan or copy the address. */
export function ManualFallback({ dest, prefix, token }: Props) {
  const addr = reencode(dest, prefix);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — user can still select the text */
    }
  };

  return (
    <details className="fallback">
      <summary>Prefer to send manually? Scan or copy the {token} address</summary>
      <div className="fallback-body">
        <div className="qr">
          <QRCodeSVG value={addr} size={148} marginSize={2} />
        </div>
        <div className="fallback-addr">
          <code>{addr}</code>
          <button type="button" onClick={copy}>
            {copied ? 'Copied!' : 'Copy address'}
          </button>
        </div>
      </div>
    </details>
  );
}
