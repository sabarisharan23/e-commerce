"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  orderManagementContent,
  orderManagementMetrics,
  orderManagementRows,
  orderManagementTabs,
} from "./orders-data";

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M4 20h16" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
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

function PrintIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 8V4h10v4" />
      <rect x="6" y="14" width="12" height="6" rx="2" />
      <rect x="4" y="8" width="16" height="8" rx="2" />
    </svg>
  );
}

function ArrowButton({ direction }: { direction: "left" | "right" }) {
  return (
    <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#94a3b8]">
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}

function statusClass(status: string) {
  if (status === "delivered") return "bg-[#dff7e9] text-[#2f7d40]";
  if (status === "shipped") return "bg-[#dfeaff] text-[#3568d4]";
  if (status === "pending") return "bg-[#eef2f7] text-[#64748b]";
  return "bg-[#ffe6ea] text-[#d53b3b]";
}

export function OrderManagementPage() {
  const [activeTab, setActiveTab] = useState("All Orders");

  const visibleRows = useMemo(() => {
    if (activeTab === "All Orders") return orderManagementRows;
    return orderManagementRows.filter(
      (row) => row.status.toLowerCase() === activeTab.toLowerCase(),
    );
  }, [activeTab]);

  return (
    <DashboardShell mobileTitle="Order Management">
      <div className="space-y-8">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[2.6rem] font-semibold tracking-tight text-[#17213d]">{orderManagementContent.heading}</h1>
            <p className="mt-2 text-[1.02rem] text-[#71829a]">{orderManagementContent.description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
              <DownloadIcon />
              <span>Export CSV</span>
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white">
              <PlusIcon />
              <span>Create Order</span>
            </button>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {orderManagementMetrics.map((card) => (
            <article key={card.id} className="rounded-[1.8rem] border border-[#e8edf4] bg-white px-6 py-5 shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7f8ea6]">{card.label}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[2.6rem] font-semibold tracking-tight text-[#17213d]">{card.value}</p>
                <span className={`inline-flex rounded-xl px-3 py-1 text-sm font-semibold ${card.tone === "green" ? "bg-[#eaf7ee] text-[#2f7d40]" : "bg-[#fff4da] text-[#d07a00]"}`}>{card.helper}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-8 border-b border-[#dbe3ee]">
            {orderManagementTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 pb-3 text-[1.02rem] font-medium transition-colors ${
                  activeTab === tab
                    ? "border-[#477640] text-[#477640]"
                    : "border-transparent text-[#64748b]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
            <CalendarIcon />
            <span>{orderManagementContent.dateRange}</span>
          </button>
        </section>

        <DashboardPanel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                  <th className="rounded-l-2xl px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Order Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="rounded-r-2xl px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id}>
                    <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] font-semibold text-[#477640]">{row.id}</td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#efeefe] text-sm font-semibold text-[#7c6bff]">{row.initials}</span>
                        <span className="text-[1.05rem] text-[#17213d]">{row.customer}</span>
                      </div>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] text-[#64748b]">{row.orderDate}</td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClass(row.status)}`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </span>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.05rem] font-semibold text-[#17213d]">{row.amount}</td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <div className="flex items-center justify-end gap-4 text-[#64748b]">
                        <Link href={`/dashboard/orders/${row.id.replace("#", "")}`} className="hover:text-[#477640]"><EyeIcon /></Link>
                        <button type="button" className="hover:text-[#477640]"><PrintIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-[#edf1f6] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-[#64748b]">Showing 1 to {visibleRows.length} of 24 orders</p>
            <div className="flex items-center gap-2">
              <ArrowButton direction="left" />
              <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#477640] bg-[#477640] px-3 text-sm font-semibold text-white">1</button>
              <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">2</button>
              <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">3</button>
              <ArrowButton direction="right" />
            </div>
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  );
}
