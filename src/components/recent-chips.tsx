"use client";

interface RecentChipsProps {
  values: number[];
  currentValue: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}

export function RecentChips({
  values,
  currentValue,
  onChange,
  format,
}: RecentChipsProps) {
  // Don't render if no history or only the current value
  const filtered = values.filter((v) => v !== currentValue);
  if (filtered.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {filtered.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
        >
          {format ? format(value) : value}
        </button>
      ))}
    </div>
  );
}
