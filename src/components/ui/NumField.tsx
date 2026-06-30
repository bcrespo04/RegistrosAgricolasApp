interface NumFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  decimals?: number;
  suffix?: string;
}

export function NumField({ label, value, onChange, decimals = 0, suffix }: NumFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-stone-600 tracking-wide">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          step={decimals > 0 ? `0.${"0".repeat(decimals - 1)}1` : "1"}
          className="no-spinner w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-[17px] font-semibold text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}
