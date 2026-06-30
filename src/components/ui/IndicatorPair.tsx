import { ReadField } from "./ReadField";

interface IndicatorPairProps {
  label: string;
  real: number;
  plan: number;
  decimals?: number;
}

export function IndicatorPair({ label, real, plan, decimals = 2 }: IndicatorPairProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <ReadField label={label} value={real.toFixed(decimals)} />
      <ReadField label={`${label} plan`} value={plan.toFixed(decimals)} muted />
    </div>
  );
}
