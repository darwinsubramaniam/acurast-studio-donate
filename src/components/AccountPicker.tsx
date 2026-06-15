import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { reencode, truncate } from '../lib/format';

interface Props {
  accounts: InjectedAccountWithMeta[];
  value: string | null;
  prefix: number;
  onChange: (address: string) => void;
}

export function AccountPicker({ accounts, value, prefix, onChange }: Props) {
  return (
    <label className="field">
      <span className="label">From account</span>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {accounts.map((a) => {
          const shown = truncate(reencode(a.address, prefix));
          return (
            <option key={a.address} value={a.address}>
              {a.meta.name ? `${a.meta.name} — ${shown}` : shown}
            </option>
          );
        })}
      </select>
    </label>
  );
}
