"use client";

import { DashboardPanel } from "../../dashboard-shell";
import { type PaymentMethodToggle } from "../settings-data";
import { SectionTitle, Toggle } from "./settings-shared";

export function PaymentMethodsSection({
  connectedLabel,
  toggles,
  gatewayName,
  gatewayKeyLabel,
  gatewayKey,
}: {
  connectedLabel: string;
  toggles: PaymentMethodToggle[];
  gatewayName: string;
  gatewayKeyLabel: string;
  gatewayKey: string;
}) {
  return (
    <DashboardPanel className="overflow-hidden p-0">
      <SectionTitle
        title="Payment Methods"
        right={
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#16a34a]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#16a34a]" />
            {connectedLabel}
          </span>
        }
      />

      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {toggles.map((toggle) => (
            <div key={toggle.id} className="flex items-center justify-between rounded-2xl bg-[#f7f8fc] px-4 py-4">
              <p className="text-[1rem] font-semibold text-[#17213d]">{toggle.label}</p>
              <Toggle enabled={toggle.enabled} />
            </div>
          ))}
        </div>

        <div className="rounded-[1.6rem] bg-[#101827] px-5 py-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9fb0c8]">{gatewayName}</p>
            <span className="inline-flex rounded-full bg-[#163b2b] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#34d399]">
              Live
            </span>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">{gatewayKeyLabel}</p>
          <div className="mt-2 flex items-center justify-between gap-4 rounded-xl bg-[#1b2638] px-4 py-3">
            <span className="truncate text-sm text-[#dbe3ee]">{gatewayKey}</span>
            <button type="button" className="text-sm font-semibold text-[#cbd5e1]">Copy</button>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}

