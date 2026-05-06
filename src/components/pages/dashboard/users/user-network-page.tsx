"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  userGrowthReport,
  userMetrics,
  userNetworkRows,
  userQuickActions,
  userRoleOptions,
  userStatusOptions,
  type UserListRow,
  type UserRole,
  type UserStatus,
} from "./users-data";

type ViewMode = "list" | "grid";

function GridViewIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" />
    </svg>
  );
}

function ListViewIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
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

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 20 4.2-1 9-9a2 2 0 0 0-2.8-2.8l-9 9L4 20Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 4h6" />
    </svg>
  );
}

function AddUserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 18c1.2-2.6 3.2-3.9 6-3.9 2.9 0 4.9 1.3 6.1 3.9" />
      <path d="M18 8v6M15 11h6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 18c1.2-2.6 3.2-3.9 6-3.9 2.9 0 4.9 1.3 6.1 3.9" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M16 14.5c2 .2 3.5 1.1 4.5 2.8" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 6 5v6c0 4.2 2.4 7.6 6 9 3.6-1.4 6-4.8 6-9V5l-6-2Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function StatusBlockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6" />
      <path d="m15 9-6 6" />
    </svg>
  );
}

function metricIcon(metricId: string) {
  if (metricId === "total") return <UsersIcon />;
  if (metricId === "active") return <AddUserIcon />;
  if (metricId === "verified") return <VerifiedIcon />;
  return <StatusBlockIcon />;
}

function metricTone(metricId: string) {
  if (metricId === "total") return "bg-[#efebff] text-[#5d54db]";
  if (metricId === "active") return "bg-[#ddfae5] text-[#16a34a]";
  if (metricId === "verified") return "bg-[#e5ebff] text-[#4f46e5]";
  return "bg-[#f2f4f8] text-[#64748b]";
}

function roleShortLabel(role: UserRole) {
  return role;
}

function statusLabel(status: UserStatus) {
  if (status === "active") return "Active";
  if (status === "inactive") return "Inactive";
  return "Suspended";
}

function statusClasses(status: UserStatus) {
  if (status === "active") return "bg-[#dcfce7] text-[#15803d]";
  if (status === "inactive") return "bg-[#eef2f7] text-[#7c8aa5]";
  return "bg-[#fee2e2] text-[#dc2626]";
}

function matchesUserFilters(
  row: UserListRow,
  query: string,
  role: string,
  status: string,
) {
  const queryText = query.trim().toLowerCase();
  const matchesQuery =
    queryText.length === 0 ||
    row.name.toLowerCase().includes(queryText) ||
    row.email.toLowerCase().includes(queryText) ||
    row.userCode.toLowerCase().includes(queryText);
  const matchesRole = role === "All Roles" || row.role === role;
  const matchesStatus =
    status === "All Status" || statusLabel(row.status).toLowerCase() === status.toLowerCase();

  return matchesQuery && matchesRole && matchesStatus;
}

function MetricCard({ metric }: { metric: (typeof userMetrics)[number] }) {
  return (
    <article className="rounded-[1.8rem] border border-[#e8edf4] bg-white px-6 py-5 shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
      <div className="flex items-start gap-4">
        <div className={`inline-flex rounded-2xl p-4 ${metricTone(metric.id)}`}>{metricIcon(metric.id)}</div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">{metric.label}</p>
          <p className="mt-2 text-[2.5rem] font-semibold tracking-tight text-[#17213d]">{metric.value}</p>
        </div>
      </div>
    </article>
  );
}

function UserAvatar({ row, size = "md" }: { row: UserListRow; size?: "md" | "lg" }) {
  const sizeClass = size === "lg" ? "h-20 w-20 text-2xl" : "h-10 w-10 text-sm";
  return (
    <span
      className={`inline-flex ${sizeClass} items-center justify-center rounded-full font-semibold text-white shadow-[0_12px_28px_rgba(20,31,56,0.15)]`}
      style={{ background: `linear-gradient(135deg, ${row.avatarFrom}, ${row.avatarTo})` }}
    >
      {row.initials}
    </span>
  );
}

function UserListTable({ rows }: { rows: UserListRow[] }) {
  return (
    <DashboardPanel className="overflow-hidden">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
              <th className="rounded-l-2xl px-6 py-4">User ID</th>
              <th className="px-6 py-4">User Info</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="rounded-r-2xl px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] font-medium text-[#64748b]">{row.userCode}</td>
                <td className="border-b border-[#edf1f6] px-6 py-5">
                  <div className="flex items-center gap-4">
                    <UserAvatar row={row} />
                    <div>
                      <p className="text-[1.08rem] font-semibold text-[#17213d]">{row.name}</p>
                      <p className="text-sm text-[#8b98ac]">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] font-medium text-[#17213d]">{row.phone}</td>
                <td className="border-b border-[#edf1f6] px-6 py-5">
                  <p className="text-[1.02rem] font-medium text-[#17213d]">{row.joinedDate}</p>
                  <p className="text-sm text-[#8b98ac]">{row.joinedTime}</p>
                </td>
                <td className="border-b border-[#edf1f6] px-6 py-5">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClasses(row.status)}`}>
                    {statusLabel(row.status)}
                  </span>
                </td>
                <td className="border-b border-[#edf1f6] px-6 py-5">
                  <div className="flex items-center justify-end gap-4 text-[#94a3b8]">
                    <Link href={`/dashboard/users/${row.slug}`} className="transition-colors hover:text-[#477640]">
                      <EyeIcon />
                    </Link>
                    <button type="button" className="transition-colors hover:text-[#477640]">
                      <EditIcon />
                    </button>
                    <button type="button" className="transition-colors hover:text-[#dc2626]">
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {rows.map((row) => (
          <article key={row.id} className="rounded-[1.6rem] border border-[#edf1f6] p-4">
            <div className="flex items-start gap-3">
              <UserAvatar row={row} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold text-[#17213d]">{row.name}</p>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(row.status)}`}>
                    {statusLabel(row.status)}
                  </span>
                </div>
                <p className="mt-1 break-all text-sm text-[#8b98ac]">{row.email}</p>
                <p className="mt-1 text-sm text-[#64748b]">{row.userCode}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Contact</p>
                <p className="mt-1 text-sm font-medium text-[#17213d]">{row.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Role</p>
                <p className="mt-1 text-sm font-medium text-[#17213d]">{roleShortLabel(row.role)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Joined</p>
                <p className="mt-1 text-sm font-medium text-[#17213d]">{row.joinedDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Location</p>
                <p className="mt-1 text-sm font-medium text-[#17213d]">{row.location}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-3 text-[#94a3b8]">
              <Link href={`/dashboard/users/${row.slug}`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4eaf3] hover:text-[#477640]">
                <EyeIcon />
              </Link>
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4eaf3] hover:text-[#477640]">
                <EditIcon />
              </button>
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4eaf3] hover:text-[#dc2626]">
                <TrashIcon />
              </button>
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
  );
}

function RolePill({ role }: { role: UserRole }) {
  return (
    <span className="inline-flex rounded-full bg-[#f2f4f8] px-3 py-1 text-sm font-semibold text-[#64748b]">
      {role}
    </span>
  );
}

function UserGridCard({ row }: { row: UserListRow }) {
  return (
    <article className="rounded-[1.8rem] border border-[#e8edf4] bg-white shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
      <div
        className="h-28 rounded-t-[1.8rem]"
        style={{ background: `linear-gradient(135deg, ${row.cardFrom}, ${row.cardTo})` }}
      />
      <div className="px-6 pb-6">
        <div className="-mt-10 flex items-start justify-between gap-3">
          <UserAvatar row={row} size="lg" />
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${statusClasses(row.status)}`}>
            {statusLabel(row.status)}
          </span>
        </div>

        <h3 className="mt-5 text-[1.6rem] font-semibold tracking-tight text-[#17213d]">{row.name}</h3>
        <p className="mt-2 text-[1.02rem] text-[#71829a]">{row.email}</p>

        <div className="mt-4">
          <RolePill role={row.role} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-5 border-t border-[#edf1f6] pt-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Orders</p>
            <p className="mt-2 text-[1.8rem] font-semibold tracking-tight text-[#17213d]">{row.totalOrders}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Joined</p>
            <p className="mt-2 text-[1.1rem] font-semibold text-[#17213d]">{row.joinedDate}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#edf1f6] pt-5 text-[#94a3b8]">
          <span className="text-sm font-medium text-[#64748b]">{roleShortLabel(row.role)}</span>
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/users/${row.slug}`} className="transition-colors hover:text-[#477640]">
              <EyeIcon />
            </Link>
            <button type="button" className="transition-colors hover:text-[#477640]">
              <EditIcon />
            </button>
            <button type="button" className="transition-colors hover:text-[#dc2626]">
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function UserNetworkPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All Status");
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(
    () => userNetworkRows.filter((row) => matchesUserFilters(row, query, role, status)),
    [query, role, status],
  );

  return (
    <DashboardShell mobileTitle="Users">
      <div className="space-y-8">
        <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[2.8rem] font-semibold tracking-tight text-[#17213d]">User Network</h1>
            <p className="mt-2 text-[1.05rem] text-[#71829a]">
              Manage and monitor all platform members and their activity.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex rounded-2xl border border-[#dbe3ee] bg-white p-1 shadow-[0_10px_24px_rgba(20,31,56,0.05)]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  viewMode === "grid" ? "bg-[#eef4eb] text-[#477640]" : "text-[#64748b] hover:bg-[#f5f8fc]"
                }`}
              >
                <GridViewIcon />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  viewMode === "list" ? "bg-[#eef4eb] text-[#477640]" : "text-[#64748b] hover:bg-[#f5f8fc]"
                }`}
              >
                <ListViewIcon />
              </button>
            </div>

            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dbe3ee] bg-white px-5 text-base font-semibold text-[#334155]">
              <FilterIcon />
              <span>Filters</span>
            </button>

            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white">
              <AddUserIcon />
              <span>Add New User</span>
            </button>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {userMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </section>

        {viewMode === "list" ? (
          <>
            <DashboardPanel>
              <div className="grid gap-4 lg:grid-cols-[180px_160px_minmax(0,1fr)]">
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="h-12 rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
                >
                  {userRoleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-12 rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
                >
                  {userStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <label className="flex h-12 items-center gap-3 rounded-2xl bg-[#f5f7fc] px-4 text-[#94a3b8]">
                  <SearchIcon />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name or ID..."
                    className="w-full bg-transparent text-base text-[#24304a] outline-none placeholder:text-[#94a3b8]"
                  />
                </label>
              </div>
            </DashboardPanel>

            <UserListTable rows={filteredRows} />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_320px]">
              <DashboardPanel className="bg-[#477640] text-white">
                <h2 className="text-[2.4rem] font-semibold tracking-tight">{userGrowthReport.title}</h2>
                <p className="mt-6 max-w-[520px] text-[1.2rem] leading-9 text-[#e4efe1]">
                  {userGrowthReport.description}
                </p>
                <button type="button" className="mt-10 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-8 text-base font-semibold text-[#477640]">
                  View Analytics
                </button>
              </DashboardPanel>

              <DashboardPanel>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Quick Actions</p>
                <div className="mt-8 space-y-6">
                  {userQuickActions.map((action) => (
                    <div key={action}>
                      <p className="text-[1.15rem] font-semibold text-[#17213d]">{action}</p>
                      {action === "Generate tax reports" ? (
                        <p className="mt-1 text-sm text-[#94a3b8]">Last automated check: 14 mins ago</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </DashboardPanel>
            </section>
          </>
        ) : (
          <>
            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredRows.slice(0, 6).map((row) => (
                <UserGridCard key={row.id} row={row} />
              ))}

              <div className="flex min-h-[356px] flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-[#d7e1ef] bg-[#fbfcff] px-8 text-center shadow-[0_18px_40px_rgba(20,31,56,0.03)]">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl text-[#9fb0c8] shadow-[0_14px_30px_rgba(20,31,56,0.08)]">
                  +
                </span>
                <h3 className="mt-8 text-[2rem] font-semibold tracking-tight text-[#6c7b95]">Add New User</h3>
                <p className="mt-4 max-w-[220px] text-[1.02rem] leading-8 text-[#9aa6ba]">
                  Register a new administrator, merchant, or support agent.
                </p>
              </div>
            </section>

            <DashboardPanel>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[#64748b]">
                  Showing <span className="font-semibold text-[#17213d]">1-6</span> of{" "}
                  <span className="font-semibold text-[#17213d]">1,284</span> users
                </p>
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
          </>
        )}
      </div>
    </DashboardShell>
  );
}
