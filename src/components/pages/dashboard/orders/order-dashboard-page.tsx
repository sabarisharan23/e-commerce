"use client";

import type { DashboardOrderOverview } from "@/server/orders/order-service";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  orderDashboardContent,
  regionalDemand,
} from "./orders-data";

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M4 20h16" />
    </svg>
  );
}

function statusClass(status: string) {
  if (status === "delivered") return "bg-[#eaf7ee] text-[#2f7d40]";
  if (status === "processing") return "bg-[#fff4da] text-[#c77b00]";
  if (status === "shipped") return "bg-[#e8f1ff] text-[#3568d4]";
  if (status === "pending") return "bg-[#eef2f7] text-[#64748b]";
  return "bg-[#ffeaea] text-[#d53b3b]";
}

function MetricCard({ card }: { card: DashboardOrderOverview["metrics"][number] }) {
  const helperClass =
    card.tone === "green"
      ? "text-[#477640]"
      : card.tone === "amber"
        ? "text-[#d07a00]"
        : card.tone === "red"
          ? "text-[#ef4444]"
          : "text-[#64748b]";

  return (
    <article className="rounded-[1.8rem] border border-[#e8edf4] bg-white px-6 py-5 shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7f8ea6]">{card.label}</p>
      <p className="mt-3 text-[2.8rem] font-semibold tracking-tight text-[#17213d]">{card.value}</p>
      <p className={`mt-4 text-base font-medium ${helperClass}`}>{card.helper}</p>
    </article>
  );
}

function StatusBreakdownRing({
  breakdown,
  totalOrdersLabel,
}: {
  breakdown: DashboardOrderOverview["statusBreakdown"];
  totalOrdersLabel: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[240px] w-[240px] items-center justify-center">
        <div className="absolute h-[184px] w-[184px] rounded-full border-[24px] border-[#f5a000]" />
        <div className="absolute text-center">
          <p className="text-[3rem] font-semibold tracking-tight text-[#17213d]">{totalOrdersLabel}</p>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#6f7d92]">Total</p>
        </div>
      </div>
      <div className="mt-5 w-full space-y-4">
        {breakdown.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xl text-[#17213d]">
              <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
            <span className="text-xl font-semibold text-[#17213d]">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrderDashboardPage({ overview }: { overview: DashboardOrderOverview }) {
  return (
    <DashboardShell mobileTitle="Orders">
      <div className="space-y-8">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[2.6rem] font-semibold tracking-tight text-[#17213d]">{orderDashboardContent.heading}</h1>
            <p className="mt-2 text-[1.02rem] text-[#71829a]">{orderDashboardContent.description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
              <CalendarIcon />
              <span>{orderDashboardContent.dateRange}</span>
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
              <DownloadIcon />
              <span>Export CSV</span>
            </button>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {overview.metrics.map((card) => (
            <MetricCard key={card.id} card={card} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <DashboardPanel>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Status Breakdown</h2>
              <span className="text-2xl text-[#94a3b8]">⋯</span>
            </div>
            <div className="mt-6">
              <StatusBreakdownRing
                breakdown={overview.statusBreakdown}
                totalOrdersLabel={overview.totalOrdersLabel}
              />
            </div>
          </DashboardPanel>

          <DashboardPanel className="overflow-hidden">
            <div className="flex items-start justify-between gap-3 border-b border-[#edf1f6] pb-5">
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Recent Orders</h2>
              <button type="button" className="text-base font-semibold text-[#477640]">View all orders</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                    <th className="rounded-l-2xl px-4 py-4">Order ID</th>
                    <th className="px-4 py-4">Customer</th>
                    <th className="px-4 py-4">Product</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="rounded-r-2xl px-4 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recentRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-base font-semibold text-[#71829a]">
                        No customer orders have been placed yet.
                      </td>
                    </tr>
                  ) : null}
                  {overview.recentRows.map((row) => (
                    <tr key={row.id}>
                      <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] font-semibold text-[#17213d]">{row.id}</td>
                      <td className="border-b border-[#edf1f6] px-4 py-5">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#24304a] text-sm font-semibold text-[#64748b]">{row.initials}</span>
                          <span className="text-[1.02rem] text-[#17213d]">{row.customer}</span>
                        </div>
                      </td>
                      <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] text-[#6f7d92]">{row.product}</td>
                      <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] font-semibold text-[#17213d]">{row.amount}</td>
                      <td className="border-b border-[#edf1f6] px-4 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-[0.04em] ${statusClass(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)]">
          <DashboardPanel className="bg-[#477640] text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d6e7d2]">Inventory Intelligence</p>
            <h2 className="mt-5 text-[2.6rem] font-semibold tracking-tight">Low Stock Alerts</h2>
            <p className="mt-6 max-w-[440px] text-[1.2rem] leading-9 text-[#e4efe1]">
              Based on current velocity, 8 items will run out of stock in the next 48 hours. Consider reordering now.
            </p>
            <button type="button" className="mt-10 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-8 text-base font-semibold text-[#477640]">
              Optimize Inventory
            </button>
          </DashboardPanel>

          <DashboardPanel>
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Regional Demand</h2>
            <div className="mt-8 space-y-6">
              {regionalDemand.map((item) => (
                <div key={item.region}>
                  <div className="mb-3 flex items-center justify-between gap-3 text-[1.02rem] font-medium text-[#17213d]">
                    <span>{item.region}</span>
                    <span className="text-[#477640]">{item.percentage}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#eef2f7]">
                    <div className="h-2.5 rounded-full bg-[#477640]" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-[#71829a]">
              &quot;Expansion into the EU market has increased by 4% since the last reporting period.&quot;
            </p>
          </DashboardPanel>
        </section>
      </div>
    </DashboardShell>
  );
}
