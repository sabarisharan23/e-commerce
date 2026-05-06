"use client";

import { DashboardPanel } from "../../dashboard-shell";
import { SectionTitle } from "./settings-shared";

export function StoreSettingsSection({
  storeName,
  gstNumber,
  address,
  supportEmail,
  supportPhone,
}: {
  storeName: string;
  gstNumber: string;
  address: string;
  supportEmail: string;
  supportPhone: string;
}) {
  return (
    <DashboardPanel className="overflow-hidden p-0">
      <SectionTitle title="Store Settings" />
      <div className="grid gap-6 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_120px]">
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Store Name</p>
              <input value={storeName} readOnly className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base outline-none" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">GST Number</p>
              <input value={gstNumber} readOnly className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base outline-none" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Address</p>
            <textarea value={address} readOnly rows={3} className="mt-2 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 py-3 text-base outline-none resize-none" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Support Email</p>
              <input value={supportEmail} readOnly className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base outline-none" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Support Phone</p>
              <input value={supportPhone} readOnly className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base outline-none" />
            </div>
          </div>
        </div>

        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d7e1ef] bg-[#fbfcff] px-3 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4eb] text-[#477640]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="5" width="14" height="14" rx="2" />
              <path d="M8 12h8M12 8v8" />
            </svg>
          </span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Store Logo Preview</p>
          <button type="button" className="mt-4 inline-flex rounded-xl bg-[#f3f4f8] px-4 py-2 text-sm font-semibold text-[#64748b]">
            Upload Logo
          </button>
        </div>
      </div>
    </DashboardPanel>
  );
}

