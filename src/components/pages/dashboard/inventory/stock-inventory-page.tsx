"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  stockInventoryContent,
  stockInventoryRows,
  stockInventorySummary,
  type StockInventoryRow,
} from "./inventory-data";

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V6" />
      <path d="m8 10 4-4 4 4" />
      <path d="M6 18h12" />
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

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
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

function TuneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h8M16 6h4M10 6v6M4 18h4M12 18h8M14 18v-6" />
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

function statusPill(status: StockInventoryRow["status"]) {
  if (status === "in-stock") {
    return "bg-[#edf3ea] text-[#477640]";
  }
  if (status === "low-stock") {
    return "bg-[#fff4da] text-[#d07a00]";
  }
  return "bg-[#ffeaea] text-[#ef4444]";
}

function statusText(status: StockInventoryRow["status"]) {
  if (status === "in-stock") return "In Stock";
  if (status === "low-stock") return "Low Stock";
  return "Critical";
}

export function StockInventoryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("Stock Status");

  const filteredRows = useMemo(() => {
    return stockInventoryRows.filter((row) => {
      const matchesQuery =
        query.trim().length === 0 ||
        row.name.toLowerCase().includes(query.toLowerCase()) ||
        row.sku.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        category === "All Categories" || row.name.toLowerCase().includes(category.toLowerCase().split(" ")[0]);
      const matchesStatus =
        status === "Stock Status" ||
        statusText(row.status).toLowerCase() === status.toLowerCase();
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, query, status]);

  return (
    <DashboardShell mobileTitle="Stock Inventory">
      <div className="space-y-8">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[2.6rem] font-semibold tracking-tight text-[#17213d]">
              {stockInventoryContent.heading}
            </h1>
            <p className="mt-2 text-[1.02rem] text-[#71829a]">
              {stockInventoryContent.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
              <DownloadIcon />
              <span>Export</span>
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white">
              <UploadIcon />
              <span>Bulk Upload CSV/Excel</span>
            </button>
          </div>
        </section>

        <DashboardPanel>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_180px_160px_auto]">
            <label className="flex h-12 items-center gap-3 rounded-2xl bg-[#f5f7fc] px-4 text-[#94a3b8]">
              <SearchIcon />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search product name, SKU..."
                className="w-full bg-transparent text-base text-[#24304a] outline-none placeholder:text-[#94a3b8]"
              />
            </label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none">
              <option>All Categories</option>
              <option>Millet</option>
              <option>Mix</option>
              <option>Meal</option>
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-12 rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none">
              <option>Stock Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Critical</option>
            </select>
            <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#f3f5fb] px-5 text-[#64748b]">
              <FilterIcon />
            </button>
          </div>
        </DashboardPanel>

        <section className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <DashboardPanel className="border-dashed border-[#b7c7b5] bg-[#fbfdfb]">
            <div className="flex h-full min-h-[430px] flex-col items-center justify-center text-center">
              <div className="inline-flex rounded-full bg-white p-5 text-[#477640] shadow-[0_12px_24px_rgba(20,31,56,0.06)]">
                <UploadIcon />
              </div>
              <h2 className="mt-6 text-[2rem] font-semibold tracking-tight text-[#17213d]">Drag &amp; Drop Files</h2>
              <p className="mt-3 max-w-[220px] text-[1.02rem] text-[#71829a]">
                Upload .csv or .xlsx files to update inventory in bulk.
              </p>
              <button type="button" className="mt-8 text-lg font-semibold text-[#477640] underline underline-offset-4">
                Browse Files
              </button>
            </div>
          </DashboardPanel>

          <DashboardPanel className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                    <th className="rounded-l-2xl px-6 py-4">Product</th>
                    <th className="px-6 py-4">Available Qty</th>
                    <th className="px-6 py-4">Threshold</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="rounded-r-2xl px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id}>
                      <td className="border-b border-[#edf1f6] px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#f7f8fc]">
                            <Image src={row.imageSrc} alt={row.name} fill sizes="56px" className="object-cover" />
                          </div>
                          <div>
                            <p className="text-[1.05rem] font-semibold text-[#17213d]">{row.name}</p>
                            <p className="text-sm text-[#8b98ac]">SKU: {row.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.05rem] font-semibold text-[#17213d]">{row.availableQty}</td>
                      <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.05rem] text-[#64748b]">{row.threshold}</td>
                      <td className="border-b border-[#edf1f6] px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusPill(row.status)}`}>
                          {statusText(row.status)}
                        </span>
                      </td>
                      <td className="border-b border-[#edf1f6] px-6 py-5">
                        <div className="flex items-center justify-end gap-4 text-[#94a3b8]">
                          <button type="button" className="hover:text-[#477640]"><EditIcon /></button>
                          <button type="button" className="hover:text-[#477640]"><TuneIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-[#edf1f6] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-[#64748b]">{stockInventoryContent.tableCountText}</p>
              <div className="flex items-center gap-2">
                <ArrowButton direction="left" />
                <ArrowButton direction="right" />
              </div>
            </div>
          </DashboardPanel>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stockInventorySummary.map((item) => (
            <DashboardPanel key={item.id}>
              <div className="flex items-center gap-4">
                <div className={`inline-flex rounded-2xl p-4 ${item.tone === "green" ? "bg-[#eef4eb] text-[#477640]" : item.tone === "amber" ? "bg-[#fff5dc] text-[#e18b00]" : "bg-[#f4f6fb] text-[#b2bdcf]"}`}>
                  <span className="block h-7 w-7 rounded-md border-2 border-current" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">{item.label}</p>
                  <p className="mt-2 text-[2.2rem] font-semibold tracking-tight text-[#17213d]">{item.value}</p>
                </div>
              </div>
            </DashboardPanel>
          ))}
        </section>

        <button type="button" className="fixed bottom-6 right-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#477640] text-white shadow-[0_20px_40px_rgba(71,118,64,0.35)]">
          <PlusIcon />
        </button>
      </div>
    </DashboardShell>
  );
}
