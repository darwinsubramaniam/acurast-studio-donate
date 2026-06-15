import { NETWORKS, type NetworkId } from '../lib/config';

interface Props {
  value: NetworkId;
  onChange: (id: NetworkId) => void;
}

export function NetworkToggle({ value, onChange }: Props) {
  return (
    <div className="net-toggle" role="tablist" aria-label="Donation network">
      {Object.values(NETWORKS).map((n) => (
        <button
          key={n.id}
          type="button"
          role="tab"
          aria-selected={value === n.id}
          className={value === n.id ? 'net-tab active' : 'net-tab'}
          onClick={() => onChange(n.id)}
        >
          {n.label}
        </button>
      ))}
    </div>
  );
}
