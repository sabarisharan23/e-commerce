"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  reviewDistribution,
  reviewMetrics,
  reviewProductOptions,
  reviewRows,
  reviewStatusOptions,
} from "./reviews-data";

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
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

function StarBadgeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="m12 2.8 2.7 5.4 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9L12 2.8Z" />
    </svg>
  );
}

function ReviewActions({ status }: { status: (typeof reviewRows)[number]["status"] }) {
  if (status === "Pending") {
    return (
      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" className="inline-flex h-10 items-center justify-center rounded-xl bg-[#477640] px-5 text-sm font-semibold text-white">
          Approve
        </button>
        <button type="button" className="inline-flex h-10 items-center justify-center rounded-xl bg-[#eef2f7] px-5 text-sm font-semibold text-[#64748b]">
          Reject
        </button>
      </div>
    );
  }

  if (status === "Spam") {
    return <div className="flex justify-end gap-4 text-[#94a3b8]"><span>🗑</span><span>⊘</span></div>;
  }

  return <div className="flex justify-end gap-4 text-[#94a3b8]"><span>↩</span><span>⋮</span></div>;
}

function statusClass(status: (typeof reviewRows)[number]["status"]) {
  if (status === "Pending") return "bg-[#fef3c7] text-[#d97706]";
  if (status === "Spam") return "bg-[#fee2e2] text-[#ef4444]";
  return "bg-[#dcfce7] text-[#16a34a]";
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-[#f7b500]">
      {"★".repeat(rating)}
      <span className="text-[#cbd5e1]">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function matchesReview(row: (typeof reviewRows)[number], query: string, product: string, status: string) {
  const q = query.trim().toLowerCase();
  const matchesQuery =
    q.length === 0 ||
    row.customerName.toLowerCase().includes(q) ||
    row.productName.toLowerCase().includes(q) ||
    row.content.toLowerCase().includes(q);
  const matchesProduct = product === "All Products" || row.productName === product;
  const matchesStatus = status === "Any Status" || row.status === status;
  return matchesQuery && matchesProduct && matchesStatus;
}

export function ReviewsPage() {
  const [query, setQuery] = useState("");
  const [product, setProduct] = useState<(typeof reviewProductOptions)[number]>("All Products");
  const [status, setStatus] = useState<(typeof reviewStatusOptions)[number]>("Any Status");

  const filteredRows = useMemo(
    () => reviewRows.filter((row) => matchesReview(row, query, product, status)),
    [product, query, status],
  );

  return (
    <DashboardShell mobileTitle="Reviews">
      <div className="space-y-8">
        <section className="max-w-[840px]">
          <h1 className="text-[2.8rem] font-semibold tracking-tight text-[#17213d]">Reviews Management</h1>
          <p className="mt-2 text-[1.05rem] text-[#71829a]">
            Audit, moderate, and analyze customer feedback across all product lines.
          </p>
        </section>

        <section className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)_220px]">
          <DashboardPanel>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">{reviewMetrics[0].label}</p>
              <span className="inline-flex rounded-xl bg-[#efebff] p-3 text-[#5b67e9]">
                <StarBadgeIcon />
              </span>
            </div>
            <div className="mt-8 flex items-end gap-3">
              <p className="text-[3rem] font-semibold tracking-tight text-[#17213d]">{reviewMetrics[0].value}</p>
              <span className="pb-3 text-sm font-semibold text-[#10b981]">+4.2%</span>
            </div>
            <p className="mt-3 text-[1.02rem] italic text-[#71829a]">{reviewMetrics[0].helper}</p>
          </DashboardPanel>

          <DashboardPanel>
            <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)]">
              <div className="border-b border-[#edf1f6] pb-5 md:border-b-0 md:border-r md:pb-0 md:pr-6">
                <p className="text-[3.2rem] font-semibold tracking-tight text-[#17213d]">{reviewMetrics[1].value}</p>
                <p className="mt-2 text-3xl text-[#f7b500]">★★★★★</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">{reviewMetrics[1].label}</p>
              </div>
              <div className="space-y-4">
                {reviewDistribution.map((row) => (
                  <div key={row.stars} className="grid grid-cols-[24px_minmax(0,1fr)_48px] items-center gap-4">
                    <span className="text-sm font-semibold text-[#17213d]">{row.stars}</span>
                    <div className="h-2 rounded-full bg-[#edf1f6]">
                      <div
                        className={`h-2 rounded-full ${row.stars === 1 ? "bg-[#ef4444]" : row.stars >= 4 ? "bg-[#477640]" : "bg-[#94a3b8]"}`}
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#64748b]">{row.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </DashboardPanel>

          <DashboardPanel className="bg-[#477640] text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#d8ead3]">{reviewMetrics[2].label}</p>
            <p className="mt-4 text-[3.2rem] font-semibold tracking-tight">{reviewMetrics[2].value}</p>
            <p className="mt-2 text-[1.02rem] text-[#d8ead3]">{reviewMetrics[2].helper}</p>
            <button type="button" className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white px-5 text-base font-semibold text-[#477640]">
              Review All Tasks
            </button>
          </DashboardPanel>
        </section>

        <DashboardPanel className="overflow-hidden p-0">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_170px_170px_160px]">
              <label className="flex h-12 items-center gap-3 rounded-2xl border border-[#dbe3ee] bg-white px-4 text-[#94a3b8]">
                <SearchIcon />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search customer, product or review text..."
                  className="w-full bg-transparent text-base text-[#24304a] outline-none placeholder:text-[#94a3b8]"
                />
              </label>
              <select
                value={product}
                onChange={(event) => setProduct(event.target.value as (typeof reviewProductOptions)[number])}
                className="h-12 rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none"
              >
                {reviewProductOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as (typeof reviewStatusOptions)[number])}
                className="h-12 rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none"
              >
                {reviewStatusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dbe3ee] bg-white px-5 text-base font-semibold text-[#64748b]">
                <FilterIcon />
                <span>More Filters</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                  <th className="rounded-l-2xl px-6 py-4">Product</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Review Content</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="rounded-r-2xl px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id}>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-[#f7f8fc]">
                          <Image src={row.productImageSrc} alt={row.productName} fill sizes="48px" className="object-contain p-1.5" />
                        </div>
                        <span className="text-[1.15rem] font-semibold text-[#477640]">{row.productName}</span>
                      </div>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <p className="text-[1.05rem] font-semibold text-[#17213d]">{row.customerName}</p>
                      <p className="mt-1 text-sm text-[#8b98ac]">{row.customerEmail}</p>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <p className="text-xl"><Stars rating={row.rating} /></p>
                      <p className="mt-1 text-sm text-[#8b98ac]">{row.date}</p>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <p className="max-w-[320px] text-[1.02rem] leading-8 text-[#17213d]">{row.content}</p>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <ReviewActions status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-[#64748b]">Showing 1-10 of 1,240 reviews</p>
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#94a3b8]">&lt;</button>
              <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#477640] bg-[#eef4eb] px-3 text-sm font-semibold text-[#477640]">1</button>
              <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">2</button>
              <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">3</button>
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#94a3b8]">&gt;</button>
            </div>
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  );
}

