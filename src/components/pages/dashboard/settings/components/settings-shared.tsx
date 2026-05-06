"use client";

export function SectionTitle({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[1.7rem] font-semibold tracking-tight text-[#17213d]">{title}</h2>
      {right}
    </div>
  );
}

export function Toggle({
  enabled,
  onLabel = "Enabled",
  offLabel = "Disabled",
}: {
  enabled: boolean;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <span
      aria-label={enabled ? onLabel : offLabel}
      className={`relative inline-flex h-7 w-12 rounded-full transition-colors ${
        enabled ? "bg-[#477640]" : "bg-[#e2e8f0]"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </span>
  );
}

export function CheckCell({ checked }: { checked: boolean }) {
  if (!checked) {
    return <span className="inline-flex h-4 w-4 rounded-full border border-[#cbd5e1]" />;
  }

  return (
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#477640] text-[10px] font-bold text-white">
      ✓
    </span>
  );
}

