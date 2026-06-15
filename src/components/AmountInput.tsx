interface Props {
  value: string;
  token: string;
  presets: string[];
  onChange: (v: string) => void;
}

export function AmountInput({ value, token, presets, onChange }: Props) {
  return (
    <div className="field">
      <span className="label">Amount ({token || '—'})</span>
      <input
        type="number"
        min="0"
        step="any"
        inputMode="decimal"
        placeholder="0.0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="presets">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            className={value === p ? 'chip active' : 'chip'}
            onClick={() => onChange(p)}
          >
            {p} {token}
          </button>
        ))}
      </div>
    </div>
  );
}
