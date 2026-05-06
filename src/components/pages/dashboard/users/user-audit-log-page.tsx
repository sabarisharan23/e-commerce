"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import { getUserProfile } from "./users-data";

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 stroke-current" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M4 20h16" />
    </svg>
  );
}

function toneClass(tone: "green" | "blue" | "red" | "purple") {
  if (tone === "green") return "bg-[#eaf7ee] text-[#16a34a]";
  if (tone === "blue") return "bg-[#e7efff] text-[#2563eb]";
  if (tone === "red") return "bg-[#fee2e2] text-[#dc2626]";
  return "bg-[#f1e8ff] text-[#7c3aed]";
}

export function UserAuditLogPage() {
  const params = useParams<{ userId: string }>();
  const profile = getUserProfile(params.userId);

  return (
    <DashboardShell mobileTitle="Audit Log">
      <div className="space-y-8">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <Link href={`/dashboard/users/${profile.slug}`} className="inline-flex items-center gap-3 text-[#17213d]">
              <BackIcon />
              <h1 className="text-[2.8rem] font-semibold tracking-tight">Audit Log</h1>
            </Link>
            <p className="mt-2 text-[1.05rem] text-[#71829a]">
              Immutable record of all administrative actions taken within the vault.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dbe3ee] bg-white px-5 text-base font-semibold text-[#334155]">
              <FilterIcon />
              <span>Filter</span>
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dbe3ee] bg-white px-5 text-base font-semibold text-[#334155]">
              <DownloadIcon />
              <span>Export CSV</span>
            </button>
          </div>
        </section>

        <DashboardPanel className="overflow-hidden">
          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                  <th className="rounded-l-2xl px-6 py-4">User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="rounded-r-2xl px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {profile.auditLog.map((entry) => (
                  <tr key={entry.id}>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f2f4f8] text-sm font-semibold text-[#5d54db]">
                          {entry.userInitials}
                        </span>
                        <span className="text-[1.08rem] font-semibold text-[#17213d]">{entry.userName}</span>
                      </div>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <span className={`inline-flex rounded-xl px-3 py-1 text-sm font-semibold ${toneClass(entry.actionTone)}`}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] text-[#64748b]">{entry.module}</td>
                    <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] text-[#64748b]">{entry.ipAddress}</td>
                    <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] text-[#64748b]">{entry.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 lg:hidden">
            {profile.auditLog.map((entry) => (
              <article key={entry.id} className="rounded-[1.6rem] border border-[#edf1f6] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f4f8] text-sm font-semibold text-[#5d54db]">
                      {entry.userInitials}
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-[#17213d]">{entry.userName}</p>
                      <p className="text-sm text-[#64748b]">{entry.module}</p>
                    </div>
                  </div>
                  <span className={`inline-flex rounded-xl px-3 py-1 text-xs font-semibold ${toneClass(entry.actionTone)}`}>
                    {entry.action}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">IP Address</p>
                    <p className="mt-1 text-sm font-medium text-[#17213d]">{entry.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Timestamp</p>
                    <p className="mt-1 text-sm font-medium text-[#17213d]">{entry.timestamp}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-[#edf1f6] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-[#64748b]">Showing 1-10 of 1,284 users</p>
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#94a3b8]">&lt;</button>
              <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#477640] bg-[#477640] px-3 text-sm font-semibold text-white">1</button>
              <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">2</button>
              <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">3</button>
              <span className="px-1 text-[#94a3b8]">...</span>
              <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">128</button>
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#94a3b8]">&gt;</button>
            </div>
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  );
}
