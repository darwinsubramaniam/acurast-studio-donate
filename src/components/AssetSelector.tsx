import { ASSETS, type AssetKey } from '../lib/assets';

interface Props {
  selectedKey: AssetKey;
  onSelect: (key: AssetKey) => void;
  busy: boolean;
}

// Pick what to donate. DOT/USDT/USDC share Polkadot Asset Hub, so switching
// among them is instant; only ACU lives on a different chain.
export function AssetSelector({ selectedKey, onSelect, busy }: Props) {
  return (
    <div className="net-toggle" role="tablist" aria-label="Donation asset">
      {ASSETS.map((a) => {
        const active = selectedKey === a.key;
        return (
          <button
            key={a.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={active ? 'net-tab active' : 'net-tab'}
            disabled={busy}
            onClick={() => onSelect(a.key)}
          >
            {a.label}
          </button>
        );
      })}
    </div>
  );
}
