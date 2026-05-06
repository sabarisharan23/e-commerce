"use client";

import { DashboardPanel } from "../../dashboard-shell";
import { type ProfileInformation } from "../settings-data";
import { SectionTitle } from "./settings-shared";

export function ProfileInformationSection({ data }: { data: ProfileInformation }) {
  return (
    <DashboardPanel className="overflow-hidden p-0">
      <SectionTitle title="Profile Information" />
      <div className="grid gap-6 px-6 py-6 xl:grid-cols-[120px_minmax(0,1fr)]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[#e2e8f0] bg-[#f7f8fc] text-[#94a3b8]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 9h8M8 13h5M8 17h4" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Profile Photo</p>
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Full Name</p>
              <input value={data.fullName} readOnly className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Email Address</p>
              <input value={data.email} readOnly className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none" />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_180px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Phone Number</p>
              <input value={data.phone} readOnly className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none" />
            </div>
            <div className="flex items-end justify-between gap-3">
              <p className="pb-3 text-sm text-[#9aa6ba]">{data.updatedLabel}</p>
              <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}

