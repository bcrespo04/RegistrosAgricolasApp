interface ReadFieldProps {
  label: string;
  value: string;
  muted?: boolean;
}

export function ReadField({ label, value, muted = false }: ReadFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11.5px] font-medium text-stone-500">{label}</span>
      <div
        className={`rounded-lg px-3 py-2 text-[14px] font-bold ${
          muted
            ? "bg-stone-50 border border-dashed border-stone-300 text-stone-500"
            : "bg-stone-100 text-stone-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
