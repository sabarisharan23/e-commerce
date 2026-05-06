"use client";

import Image from "next/image";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  inventoryDashboardContent,
  inventoryMetricCards,
  inventoryTrendBars,
  lowStockAlerts,
  warehouseActivities,
  warehouseSpread,
} from "./inventory-data";

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

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function StatusDot({ color }: { color: string }) {
  return <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />;
}

function InventoryMetricCard({ card }: { card: (typeof inventoryMetricCards)[number] }) {
  const badgeClass =
    card.tone === "green"
      ? "bg-[#eaf7ee] text-[#13a95f]"
      : card.tone === "red"
        ? "bg-[#fff0f0] text-[#ef4444]"
        : card.tone === "amber"
          ? "bg-[#fff5dc] text-[#e18b00]"
          : "bg-[#edf3ea] text-[#64748b]";

  const valueClass =
    card.tone === "red"
      ? "text-[#e53935]"
      : "text-[#17213d]";

  return (
    <article className="rounded-[1.8rem] border border-[#e8edf4] bg-white px-6 py-5 shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className={`inline-flex rounded-2xl p-3 ${card.tone === "green" ? "bg-[#eef5ff] text-[#3068ff]" : card.tone === "red" ? "bg-[#fff1f1] text-[#ff3b30]" : card.tone === "amber" ? "bg-[#fff7e8] text-[#ef8a00]" : "bg-[#edf3ea] text-[#477640]"}`}>
          <span className="block h-6 w-6 rounded-md border-2 border-current" />
        </div>
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {card.badge}
        </span>
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#7f8ea6]">
        {card.label}
      </p>
      <div className="mt-2 flex items-end gap-3">
        <p className={`text-[3rem] font-semibold tracking-tight ${valueClass}`}>{card.value}</p>
        {card.label === "Warehouse Capacity" ? (
          <span className="pb-2 text-xl font-medium text-[#e18b00]">{card.helper}</span>
        ) : null}
      </div>
      {card.label === "Warehouse Capacity" ? (
        <div className="mt-4 h-2 rounded-full bg-[#eef2f7]">
          <div className="h-2 rounded-full bg-[#477640]" style={{ width: "82%" }} />
        </div>
      ) : (
        <p className="mt-2 text-sm text-[#6f7d92]">{card.helper}</p>
      )}
    </article>
  );
}

function StockTrendChart() {
  return (
    <div className="flex h-[290px] items-end gap-6 px-4">
      {inventoryTrendBars.map((bar) => (
        <div key={bar.day} className="flex flex-1 flex-col items-center gap-4">
          <div className="flex h-full items-end gap-2">
            <div className="w-4 rounded-t-xl bg-[#d8dfd7]" style={{ height: `${bar.incoming}%` }} />
            <div className="w-4 rounded-t-xl bg-[#477640]" style={{ height: `${bar.outgoing}%` }} />
          </div>
          <span className="text-xs font-semibold uppercase text-[#94a3b8]">{bar.day}</span>
        </div>
      ))}
    </div>
  );
}

function WarehouseSpreadRing() {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const complete = 64;
  const offset = circumference * (1 - complete / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[220px] w-[220px] items-center justify-center">
        <svg viewBox="0 0 200 200" className="h-[220px] w-[220px] -rotate-90">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#eef2e6" strokeWidth="16" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#d9e2c7"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-[2.7rem] font-semibold tracking-tight text-[#17213d]">{warehouseSpread.total}</p>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#6f7d92]">Total Occupancy</p>
        </div>
      </div>

      <div className="mt-5 w-full space-y-3">
        {warehouseSpread.breakdown.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <StatusDot color={item.color} />
              <span className="text-[#17213d]">{item.name}</span>
            </div>
            <span className="font-semibold text-[#17213d]">{item.share}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InventoryDashboardPage() {
  return (
    <DashboardShell mobileTitle="Inventory">
      <div className="space-y-8">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[2.6rem] font-semibold tracking-tight text-[#17213d]">
              {inventoryDashboardContent.heading}
            </h1>
            <p className="mt-2 text-[1.02rem] text-[#71829a]">
              {inventoryDashboardContent.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
              <CalendarIcon />
              <span>{inventoryDashboardContent.dateRange}</span>
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
              <DownloadIcon />
              <span>Export CSV</span>
            </button>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {inventoryMetricCards.map((card) => (
            <InventoryMetricCard key={card.id} card={card} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_320px]">
          <DashboardPanel>
            <div className="flex flex-col gap-4 border-b border-[#edf1f6] pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Stock Trends</h2>
                <p className="mt-1 text-[1.02rem] text-[#71829a]">Weekly movements and replenishment cycles</p>
              </div>
              <div className="flex items-center gap-5 text-sm font-medium text-[#6f7d92]">
                <div className="flex items-center gap-2"><StatusDot color="#477640" /><span>Incoming</span></div>
                <div className="flex items-center gap-2"><StatusDot color="#cfd8d4" /><span>Outgoing</span></div>
              </div>
            </div>
            <div className="pt-6">
              <StockTrendChart />
            </div>
          </DashboardPanel>

          <DashboardPanel>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Low Stock Alerts</h2>
              <span className="inline-flex rounded-xl bg-[#fff2f2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#ef4444]">3 Priority</span>
            </div>
            <div className="mt-6 space-y-4">
              {lowStockAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-4 rounded-[1.5rem] bg-[#f8f8fb] p-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white">
                    <Image src={alert.imageSrc} alt={alert.name} fill sizes="64px" className="object-contain p-2" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xl font-medium text-[#17213d]">{alert.name}</p>
                    <p className="text-sm text-[#8b98ac]">SKU: {alert.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-semibold ${alert.severity === "critical" ? "text-[#ef4444]" : alert.severity === "warning" ? "text-[#ef8a00]" : "text-[#d08600]"}`}>{alert.units}</p>
                    <p className="text-sm font-medium uppercase tracking-[0.06em] text-[#6f7d92]">{alert.severity}</p>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[#477640] text-base font-semibold uppercase tracking-[0.08em] text-[#477640]">
              Process Replenishments
            </button>
          </DashboardPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_320px]">
          <DashboardPanel className="overflow-hidden">
            <div className="flex items-start justify-between gap-3 border-b border-[#edf1f6] pb-5">
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Recent Warehouse Activity</h2>
              <div className="flex items-center gap-3 text-[#94a3b8]">
                <span className="text-xl">⌁</span>
                <span className="text-xl">⋮</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                    <th className="rounded-l-2xl px-4 py-4">Product Details</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Inventory</th>
                    <th className="rounded-r-2xl px-4 py-4">Last Movement</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouseActivities.map((item) => (
                    <tr key={item.id}>
                      <td className="border-b border-[#edf1f6] px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#f7f8fc]">
                            <Image src={item.imageSrc} alt={item.name} fill sizes="56px" className="object-contain p-1.5" />
                          </div>
                          <div>
                            <p className="text-[1.02rem] font-semibold text-[#17213d]">{item.name}</p>
                            <p className="text-sm text-[#8b98ac]">{item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-[#edf1f6] px-4 py-5">
                        <span className="inline-flex rounded-xl bg-[#eef3f8] px-3 py-1 text-sm font-semibold text-[#6f7d92]">{item.category}</span>
                      </td>
                      <td className="border-b border-[#edf1f6] px-4 py-5">
                        <div className={`flex items-center gap-2 text-[1.02rem] font-medium ${item.status === "in-stock" ? "text-[#19a761]" : "text-[#ef8a00]"}`}>
                          <StatusDot color={item.status === "in-stock" ? "#22c55e" : "#f59e0b"} />
                          <span>{item.status === "in-stock" ? "In Stock" : "Low Stock"}</span>
                        </div>
                      </td>
                      <td className="border-b border-[#edf1f6] px-4 py-5">
                        <p className="text-[1.02rem] font-semibold text-[#17213d]">{item.inventory}</p>
                        <p className="text-sm text-[#8b98ac]">{item.locations}</p>
                      </td>
                      <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] text-[#6f7d92]">{item.movement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[#edf1f6] pt-5 text-center">
              <button type="button" className="text-sm font-semibold uppercase tracking-[0.12em] text-[#64748b]">View All Warehouse Logs</button>
            </div>
          </DashboardPanel>

          <DashboardPanel>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Warehouse Spread</h2>
                <p className="mt-1 text-[1.02rem] text-[#71829a]">Capacity utilization by region</p>
              </div>
              <button type="button" className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#477640] text-white shadow-[0_18px_34px_rgba(71,118,64,0.28)]">
                <PlusIcon />
              </button>
            </div>
            <div className="mt-3">
              <WarehouseSpreadRing />
            </div>
          </DashboardPanel>
        </section>
      </div>
    </DashboardShell>
  );
}
