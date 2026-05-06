"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  brandCategoryStats,
  brandDirectoryItems,
  brandFilterTabs,
  brandInventorySnapshot,
  type BrandCategoryStat,
  type BrandDirectoryItem,
} from "./brands-data";

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </svg>
  );
}

function GrainIcon({ icon }: { icon: BrandCategoryStat["icon"] | "plus" | "more" }) {
  const common = {
    "aria-hidden": "true",
    viewBox: "0 0 24 24",
    className: "h-5 w-5 stroke-current",
    fill: "none",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  if (icon === "leaf") {
    return (
      <svg {...common}>
        <path d="M5 14c4.5 0 7-2.6 7-7 0 4.4 2.5 7 7 7" />
        <path d="M12 7v10" />
      </svg>
    );
  }
  if (icon === "grain") {
    return (
      <svg {...common}>
        <path d="M12 4v16" />
        <path d="M9 7c0 1.4 1.3 2 3 2" />
        <path d="M15 9c0 1.4-1.3 2-3 2" />
        <path d="M9 13c0 1.4 1.3 2 3 2" />
        <path d="M15 15c0 1.4-1.3 2-3 2" />
      </svg>
    );
  }
  if (icon === "glass") {
    return (
      <svg {...common}>
        <path d="M7 4h10l-2 14H9L7 4Z" />
        <path d="M9 9h6" />
      </svg>
    );
  }
  if (icon === "root") {
    return (
      <svg {...common}>
        <path d="M12 4c-2.5 0-4.5 2-4.5 4.5S9.5 13 12 13s4.5-2 4.5-4.5S14.5 4 12 4Z" />
        <path d="M12 13v7M9 17l-2 3M15 17l2 3" />
      </svg>
    );
  }
  if (icon === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="5" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="19" r="1.4" />
    </svg>
  );
}

function badgeClass(tone: BrandDirectoryItem["badgeTone"]) {
  if (tone === "green") return "bg-[#dcfce7] text-[#16a34a]";
  if (tone === "orange") return "bg-[#ffedd5] text-[#ea580c]";
  return "bg-[#e8ecff] text-[#4f46e5]";
}

function growthClass(tone: BrandDirectoryItem["growthTone"]) {
  if (tone === "negative") return "text-[#ef4444]";
  if (tone === "neutral") return "text-[#64748b]";
  return "text-[#16a34a]";
}

function logoClass(tone: BrandDirectoryItem["logoTone"]) {
  if (tone === "dark") return "bg-[#111827] text-white";
  if (tone === "cream") return "bg-[#faf3dc] text-[#7c2d12]";
  if (tone === "teal") return "bg-[#0f2f36] text-[#93f6ff]";
  if (tone === "stone") return "bg-[#9ca3af] text-white";
  return "bg-white text-[#64748b]";
}

function inventoryStatusClass(status: (typeof brandInventorySnapshot)[number]["status"]) {
  if (status === "Low Stock") return "bg-[#fee2e2] text-[#ef4444]";
  if (status === "Regular") return "bg-[#eef2ff] text-[#4f46e5]";
  return "bg-[#dcfce7] text-[#16a34a]";
}

function matchesCategoryFilter(item: BrandDirectoryItem, activeTab: string) {
  return activeTab === "All Brands" || item.category === activeTab;
}

export function BrandsPage() {
  const [activeTab, setActiveTab] = useState<(typeof brandFilterTabs)[number]>("All Brands");

  const visibleBrands = useMemo(
    () => brandDirectoryItems.filter((item) => matchesCategoryFilter(item, activeTab)),
    [activeTab],
  );

  return (
    <DashboardShell mobileTitle="Brands">
      <div className="space-y-8">
        <section className="max-w-[820px]">
          <h1 className="text-[2.8rem] font-semibold tracking-tight text-[#17213d]">Brand Directory</h1>
          <p className="mt-2 text-[1.05rem] leading-8 text-[#71829a]">
            Manage and monitor your ecosystem of sovereign brands across all organic food
            categories. Track performance and inventory health in real-time.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {brandCategoryStats.map((stat) => (
            <DashboardPanel key={stat.id}>
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7f8ea6]">
                  {stat.label}
                </p>
                <span className="text-[#64748b]">
                  <GrainIcon icon={stat.icon} />
                </span>
              </div>
              <div className="mt-7 flex items-end gap-2">
                <p className="text-[3rem] font-semibold tracking-tight text-[#17213d]">{stat.value}</p>
                <p className="pb-2 text-[1.05rem] text-[#71829a]">Brands Active</p>
              </div>
            </DashboardPanel>
          ))}
        </section>

        <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            {brandFilterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`inline-flex h-12 items-center justify-center rounded-2xl border px-5 text-base font-semibold transition-colors ${
                  activeTab === tab
                    ? "border-[#477640] bg-[#477640] text-white"
                    : "border-[#dbe3ee] bg-white text-[#64748b]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dbe3ee] bg-white px-5 text-base font-semibold text-[#334155]">
              <FilterIcon />
              <span>More Filters</span>
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dbe3ee] bg-white px-5 text-base font-semibold text-[#334155]">
              <FilterIcon />
              <span>Sort by: Performance</span>
            </button>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {visibleBrands.map((brand) => (
            <DashboardPanel key={brand.id} className="overflow-hidden p-0">
              <div
                className="h-28"
                style={{ background: `linear-gradient(135deg, ${brand.cardFrom}, ${brand.cardTo})` }}
              />
              <div className="px-6 pb-6">
                <div className="-mt-9">
                  <span className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[#dbe3ee] text-sm font-semibold shadow-[0_12px_24px_rgba(20,31,56,0.08)] ${logoClass(brand.logoTone)}`}>
                    {brand.logoInitials}
                  </span>
                </div>

                <h2 className="mt-5 text-[1.8rem] font-semibold tracking-tight text-[#17213d]">
                  {brand.name}
                </h2>
                <p className="mt-2 text-[1.02rem] text-[#71829a]">{brand.category}</p>
                <span className={`mt-3 inline-flex rounded-lg px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em] ${badgeClass(brand.badgeTone)}`}>
                  {brand.badge}
                </span>

                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                      Total Products
                    </p>
                    <p className="mt-2 text-[2rem] font-semibold tracking-tight text-[#17213d]">
                      {brand.totalProducts}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                      Growth
                    </p>
                    <p className={`mt-2 text-[2rem] font-semibold tracking-tight ${growthClass(brand.growthTone)}`}>
                      {brand.growth}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/dashboard/brands/${brand.slug}`}
                  className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#f3f4f8] px-5 text-base font-semibold text-[#17213d]"
                >
                  View Details
                </Link>
              </div>
            </DashboardPanel>
          ))}

          <div className="flex min-h-[370px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#d7e1ef] bg-[#fbfcff] px-8 text-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#94a3b8] shadow-[0_14px_30px_rgba(20,31,56,0.08)]">
              <GrainIcon icon="plus" />
            </span>
            <h3 className="mt-8 text-[1.9rem] font-semibold tracking-tight text-[#17213d]">Onboard New Brand</h3>
            <p className="mt-3 max-w-[220px] text-[1.02rem] leading-8 text-[#8fa0b8]">
              Expand the directory and catalog
            </p>
          </div>
        </section>

        <DashboardPanel className="overflow-hidden p-0">
          <div className="flex flex-col gap-4 border-b border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Inventory Status Snapshot</h2>
            <button type="button" className="text-base font-semibold text-[#477640]">
              View All Inventory
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                  <th className="rounded-l-2xl px-6 py-4">Brand Name</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Pending Shipments</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="rounded-r-2xl px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {brandInventorySnapshot.map((row) => (
                  <tr key={row.id}>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f2937] text-white">
                          <GrainIcon icon={row.icon} />
                        </span>
                        <span className="text-[1.05rem] font-medium text-[#17213d]">{row.brandName}</span>
                      </div>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <div className="h-2 rounded-full bg-[#edf1f6]">
                        <div
                          className={`h-2 rounded-full ${
                            row.status === "Low Stock"
                              ? "bg-[#ef4444]"
                              : row.status === "Regular"
                                ? "bg-[#5f8457]"
                                : "bg-[#22c55e]"
                          }`}
                          style={{ width: `${row.stockProgress}%` }}
                        />
                      </div>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] text-[#17213d]">
                      {row.pendingShipments}
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${inventoryStatusClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5 text-[#94a3b8]">
                      <GrainIcon icon="more" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  );
}

