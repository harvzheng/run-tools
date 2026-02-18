"use client";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  id?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  id,
}: NumberInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-neutral-600 dark:text-neutral-400"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm tabular-nums outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-brand-500 dark:focus:ring-brand-500/20"
        />
        {unit && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
