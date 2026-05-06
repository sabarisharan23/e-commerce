"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  customerBenchmarks,
  customerInsight,
  customerMetrics,
  customerVolume,
  productCategoryShare,
  productInsight,
  productSummaryCards,
  reportsTabs,
  reportsToolbar,
  salesBars,
  salesMetrics,
  salesMilestone,
  topChannels,
  topCustomers,
  topPerformingProducts,
  type ChannelRow,
  type ReportTabId,
  type TopCustomer,
} from "./reports-data";

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
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

function RetentionIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 1 1 2.3 5.7" />
      <path d="M4 17v-5h5" />
    </svg>
  );
}

function SpendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M17 7.5c0-1.9-2.2-3.5-5-3.5s-5 1.6-5 3.5S9.2 11 12 11s5 1.6 5 3.5S14.8 18 12 18s-5-1.6-5-3.5" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 16 5-5 4 4 7-7" />
      <path d="M15 8h5v5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 8h10l1 11H6L7 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V6" />
      <path d="M10 20v-9" />
      <path d="M16 20V10" />
      <path d="M22 20V4" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10h14v9H5z" />
      <path d="M4 10 6 5h12l2 5" />
      <path d="M9 14h6" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 11 7.4-4.3" />
      <path d="m8.2 13 7.4 4.3" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function BulbIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8 14c-1.5-1.2-2.5-3.2-2.5-5.2A6.5 6.5 0 0 1 12 2.5a6.5 6.5 0 0 1 6.5 6.3c0 2.1-1 4.1-2.5 5.2-.7.6-1 1.1-1.2 2H9.2c-.2-.9-.5-1.4-1.2-2Z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14 4 6 6" />
      <path d="M5 19c2-4 5.5-8.8 11-14l3 3c-5.2 5.6-10 9.1-14 11l-1 1 1-1Z" />
      <path d="M9 15 5 11" />
    </svg>
  );
}

function metricIcon(icon: "users" | "retention" | "spend" | "trend" | "bag" | "chart") {
  if (icon === "users") return <UsersIcon />;
  if (icon === "retention") return <RetentionIcon />;
  if (icon === "spend") return <SpendIcon />;
  if (icon === "trend") return <TrendIcon />;
  if (icon === "bag") return <BagIcon />;
  return <ChartIcon />;
}

function channelIcon(icon: ChannelRow["icon"]) {
  if (icon === "web") return <GlobeIcon />;
  if (icon === "store") return <StoreIcon />;
  if (icon === "share") return <ShareIcon />;
  return <MailIcon />;
}

function customerToneClass(tone: TopCustomer["tone"]) {
  if (tone === "sage") return "bg-[#eef4eb] text-[#5f7a55]";
  if (tone === "indigo") return "bg-[#e8ecff] text-[#5b67e9]";
  return "bg-[#edf2f7] text-[#64748b]";
}

function topCustomerStatusClass(status: TopCustomer["status"]) {
  return status === "Premium"
    ? "bg-[#edf3ea] text-[#477640]"
    : "bg-[#eef2f7] text-[#64748b]";
}

function reportTabById(id: ReportTabId) {
  return reportsTabs.find((tab) => tab.id === id) ?? reportsTabs[0];
}

function Toolbar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
        <CalendarIcon />
        <span>{reportsToolbar.rangeLabel}</span>
      </button>
      <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
        <FilterIcon />
        <span>{reportsToolbar.filterLabel}</span>
      </button>
      <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white">
        <DownloadIcon />
        <span>{reportsToolbar.exportLabel}</span>
      </button>
    </div>
  );
}

function SalesTab() {
  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-3">
        {salesMetrics.map((metric) => (
          <DashboardPanel key={metric.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">{metric.label}</p>
                <p className={`mt-6 text-[3.2rem] font-semibold tracking-tight ${metric.id === "revenue" ? "text-[#477640]" : "text-[#17213d]"}`}>
                  {metric.value}
                </p>
                <p className="mt-2 text-[1.02rem] text-[#71829a]">{metric.helper}</p>
              </div>
              <div className={`inline-flex rounded-2xl p-3 ${metric.id === "revenue" ? "bg-[#eaf7ee] text-[#16a34a]" : "bg-[#f7f8fc] text-[#9aa6ba]"}`}>
                {metricIcon(metric.icon)}
              </div>
            </div>

            {metric.badge ? (
              metric.id === "revenue" ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#eaf7ee] px-3 py-1 text-sm font-semibold text-[#16a34a]">
                  <TrendIcon />
                  <span>{metric.badge}</span>
                </div>
              ) : null
            ) : null}

            {typeof metric.progress === "number" ? (
              <div className="mt-6">
                <div className="h-2 rounded-full bg-[#edf1f6]">
                  <div className="h-2 rounded-full bg-[#477640]" style={{ width: `${metric.progress}%` }} />
                </div>
              </div>
            ) : null}
          </DashboardPanel>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_320px]">
        <DashboardPanel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Monthly Sales Volume</h2>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748b]">
              <span className="h-3.5 w-3.5 rounded bg-[#477640]" />
              <span>Gross Revenue</span>
            </div>
          </div>

          <div className="mt-8 rounded-[1.8rem] bg-white">
            <div className="flex gap-4">
              <div className="hidden w-14 flex-col justify-between py-4 text-sm font-semibold text-[#9aa6ba] sm:flex">
                <span>$30k</span>
                <span>$20k</span>
                <span>$10k</span>
                <span>$0</span>
              </div>
              <div className="flex min-h-[300px] flex-1 items-end gap-4 rounded-[1.6rem] bg-[#f8fafb] px-5 pb-8 pt-6">
                {salesBars.map((bar) => (
                  <div key={bar.month} className="flex flex-1 flex-col items-center gap-4">
                    <div className="flex h-[240px] w-full items-end justify-center rounded-t-2xl bg-[#f0f4ef]">
                      <div
                        className={`w-full max-w-[95px] rounded-t-2xl ${
                          bar.accent === "emerald"
                            ? "bg-[#24a148]"
                            : bar.accent === "green"
                              ? "bg-[#15a742]"
                              : bar.accent === "lime"
                                ? "bg-[#50b13a]"
                                : bar.accent === "forest"
                                  ? "bg-[#477640]"
                                  : "bg-[#dfe6df]"
                        }`}
                        style={{ height: `${bar.value * 10}px` }}
                      />
                    </div>
                    <span className="text-[1rem] font-semibold text-[#71829a]">{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardPanel>

        <DashboardPanel>
          <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Top Channels</h2>
          <div className="mt-8 space-y-6">
            {topChannels.map((channel) => (
              <div key={channel.id} className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4eb] text-[#477640]">
                  {channelIcon(channel.icon)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[1.2rem] font-semibold text-[#17213d]">{channel.name}</p>
                      <p className="mt-1 text-sm text-[#71829a]">{channel.share}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[1.2rem] font-semibold text-[#17213d]">{channel.revenue}</p>
                      <p className={`mt-1 text-sm font-semibold ${channel.deltaType === "positive" ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                        {channel.delta}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white">
            View Full Breakdown
          </button>
        </DashboardPanel>
      </section>

      <DashboardPanel className="overflow-hidden bg-[#477640] text-white">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-5">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-white/10 text-white">
              <RocketIcon />
            </span>
            <div>
              <h2 className="text-[2.4rem] font-semibold tracking-tight">{salesMilestone.title}</h2>
              <p className="mt-4 max-w-[720px] text-[1.08rem] leading-9 text-[#e4efe1]">{salesMilestone.description}</p>
              <button type="button" className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-base font-semibold text-[#477640]">
                {salesMilestone.actionLabel}
              </button>
            </div>
          </div>
          <div className="hidden h-32 w-32 rounded-full bg-white/8 lg:block" />
        </div>
      </DashboardPanel>
    </div>
  );
}

function ProductTab() {
  const categoryBackground = useMemo(() => {
    const stops: string[] = [];
    let current = 0;

    productCategoryShare.forEach((slice) => {
      const next = current + slice.value;
      stops.push(`${slice.color} ${current}% ${next}%`);
      current = next;
    });

    return `conic-gradient(${stops.join(", ")})`;
  }, []);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[304px_minmax(0,1fr)]">
        <DashboardPanel>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Category Share</h2>
            <span className="text-[#9aa6ba]">
              <InfoIcon />
            </span>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="relative flex h-52 w-52 items-center justify-center rounded-full" style={{ background: categoryBackground }}>
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white text-center">
                <p className="text-[3rem] font-semibold tracking-tight text-[#477640]">45%</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8fa0b8]">Millet Leading</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {productCategoryShare.map((slice) => (
              <div key={slice.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: slice.color }} />
                  <span className="text-[1.05rem] font-medium text-[#17213d]">{slice.label}</span>
                </div>
                <span className="text-[1.1rem] font-semibold text-[#17213d]">{slice.value}%</span>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel className="overflow-hidden p-0">
          <div className="flex flex-col gap-4 border-b border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Top Performing Products</h2>
            <button type="button" className="text-base font-semibold text-[#477640]">View All SKU</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                  <th className="rounded-l-2xl px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Units Sold</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="rounded-r-2xl px-6 py-4">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topPerformingProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#f7f8fc]">
                          <Image src={product.imageSrc} alt={product.name} fill sizes="56px" className="object-contain p-2" />
                        </div>
                        <span className="max-w-[220px] text-[1.08rem] font-semibold text-[#17213d]">{product.name}</span>
                      </div>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] text-[#64748b]">{product.category}</td>
                    <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.08rem] font-semibold text-[#17213d]">{product.unitsSold}</td>
                    <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.08rem] font-semibold text-[#477640]">{product.revenue}</td>
                    <td className="border-b border-[#edf1f6] px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${product.growthType === "positive" ? "bg-[#eaf7ee] text-[#16a34a]" : "bg-[#fee2e2] text-[#dc2626]"}`}>
                        {product.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardPanel>
      </section>

      <DashboardPanel className="overflow-hidden">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#477640]">
              <BulbIcon />
              <span>{productInsight.eyebrow}</span>
            </div>
            <h2 className="mt-5 text-[2.4rem] font-semibold tracking-tight text-[#17213d]">{productInsight.title}</h2>
            <p className="mt-5 max-w-[820px] text-[1.08rem] leading-9 text-[#64748b]">{productInsight.description}</p>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-[240px]">
            <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white">
              {productInsight.primaryAction}
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#f1f5f9] px-5 text-base font-semibold text-[#475569]">
              {productInsight.secondaryAction}
            </button>
          </div>
        </div>
      </DashboardPanel>

      <section className="grid gap-5 xl:grid-cols-3">
        {productSummaryCards.map((card) => (
          <DashboardPanel key={card.id} className={card.tone === "green" ? "bg-[#477640] text-white" : ""}>
            <p className={`text-sm font-semibold uppercase tracking-[0.12em] ${card.tone === "green" ? "text-[#d8ead3]" : "text-[#8fa0b8]"}`}>{card.label}</p>
            <p className={`mt-4 text-[3rem] font-semibold tracking-tight ${card.tone === "green" ? "text-white" : "text-[#17213d]"}`}>{card.value}</p>

            {"progress" in card && typeof card.progress === "number" ? (
              <div className="mt-7">
                <div className="h-2 rounded-full bg-[#edf1f6]">
                  <div className="h-2 rounded-full bg-[#477640]" style={{ width: `${card.progress}%` }} />
                </div>
                <p className="mt-3 text-right text-[1.02rem] font-medium text-[#71829a]">{card.helper}</p>
              </div>
            ) : null}

            {"stars" in card && typeof card.stars === "number" ? (
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-[3rem] font-semibold tracking-tight text-[#17213d]">{card.value}</span>
                  <span className="text-3xl text-[#f7b500]">★★★★★</span>
                </div>
                <p className="mt-4 text-[1.02rem] leading-8 text-[#71829a]">{card.helper}</p>
              </div>
            ) : null}

            {!("progress" in card) && !("stars" in card) ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-base font-semibold text-white">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/60">
                  ✓
                </span>
                <span>{card.helper}</span>
              </div>
            ) : null}
          </DashboardPanel>
        ))}
      </section>
    </div>
  );
}

function CustomerTab() {
  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-3">
        {customerMetrics.map((metric) => (
          <DashboardPanel key={metric.id}>
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex rounded-2xl bg-[#f7f8fc] p-3 text-[#477640]">
                {metricIcon(metric.icon)}
              </span>
              {metric.badge ? (
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${metric.id === "active-users" ? "bg-[#eaf7ee] text-[#16a34a]" : metric.id === "retention" ? "text-[#71829a]" : "text-[#16a34a]"}`}>
                  {metric.badge}
                </span>
              ) : null}
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">{metric.label}</p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <p className="text-[3rem] font-semibold tracking-tight text-[#17213d]">{metric.value}</p>
              {metric.id === "retention" ? <span className="pb-2 text-[1.05rem] text-[#71829a]">Avg. 62%</span> : null}
              {metric.id === "avg-spend" ? <span className="pb-2 text-[1.05rem] font-semibold text-[#477640]">{metric.helper}</span> : null}
            </div>

            {metric.miniBars ? (
              <div className="mt-8 flex h-16 items-end gap-2">
                {metric.miniBars.map((bar, index, bars) => (
                  <div
                    key={`${metric.id}-${index}`}
                    className={`flex-1 rounded-t-lg ${index === bars.length - 1 ? "bg-[#477640]" : "bg-[#d9e2d9]"}`}
                    style={{ height: `${bar}px` }}
                  />
                ))}
              </div>
            ) : null}

            {typeof metric.progress === "number" ? (
              <>
                <div className="mt-6 h-2 rounded-full bg-[#edf1f6]">
                  <div className="h-2 rounded-full bg-[#477640]" style={{ width: `${metric.progress}%` }} />
                </div>
                <p className="mt-5 text-[1.02rem] leading-8 text-[#71829a]">{metric.helper}</p>
              </>
            ) : null}

            {metric.insetStats ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {metric.insetStats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.4rem] bg-[#f7f8fc] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">{stat.label}</p>
                    <p className="mt-2 text-[1.6rem] font-semibold tracking-tight text-[#17213d]">{stat.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </DashboardPanel>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_300px]">
        <DashboardPanel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">New vs Returning</h2>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Volume Distribution by User Type</p>
            </div>
            <div className="flex items-center gap-5 text-sm font-semibold text-[#64748b]">
              <div className="inline-flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-[#5f8457]" />
                <span>Returning</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-[#c8d2ff]" />
                <span>New</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {customerVolume.map((week) => (
              <div key={week.week} className="flex flex-col items-center gap-4">
                <div className="flex h-[260px] w-full flex-col justify-end gap-1 rounded-t-2xl">
                  <div className="rounded-t-2xl bg-[#dbe2db]" style={{ height: `${week.newUsers * 2.6}px` }} />
                  <div className="rounded-t-2xl bg-[#5f8457]" style={{ height: `${week.returning * 2.6}px` }} />
                </div>
                <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#8fa0b8]">{week.week}</span>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <div className="space-y-6">
          <DashboardPanel className="bg-[#477640] text-white">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
              <BulbIcon />
            </span>
            <h2 className="mt-8 text-[2.2rem] font-semibold tracking-tight">{customerInsight.title}</h2>
            <p className="mt-5 text-[1.08rem] leading-9 text-[#e4efe1]">{customerInsight.description}</p>
            <button type="button" className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-base font-semibold text-[#477640]">
              {customerInsight.actionLabel}
            </button>
          </DashboardPanel>

          <DashboardPanel className="border-dashed">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8fa0b8]">{customerBenchmarks.title}</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-4 text-[1.2rem]">
                <span className="text-[#64748b]">{customerBenchmarks.quarter}</span>
                <span className="font-semibold text-[#17213d]">{customerBenchmarks.usersTarget}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-[1.2rem]">
                <span className="text-[#64748b]">Target Retention</span>
                <span className="font-semibold text-[#17213d]">{customerBenchmarks.retentionTarget}</span>
              </div>
            </div>
          </DashboardPanel>
        </div>
      </section>

      <DashboardPanel className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Top Customers</h2>
          <button type="button" className="text-base font-semibold uppercase tracking-[0.1em] text-[#477640]">View All Customers</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                <th className="rounded-l-2xl px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Order Count</th>
                <th className="rounded-r-2xl px-6 py-4 text-right">Total Spend</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${customerToneClass(customer.tone)}`}>
                        {customer.initials}
                      </span>
                      <span className="text-[1.08rem] font-semibold text-[#17213d]">{customer.name}</span>
                    </div>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <span className={`inline-flex rounded-xl px-3 py-1 text-sm font-semibold ${topCustomerStatusClass(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.08rem] font-medium text-[#64748b]">{customer.orderCount}</td>
                  <td className="border-b border-[#edf1f6] px-6 py-5 text-right text-[1.3rem] font-semibold text-[#17213d]">{customer.totalSpend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardPanel>
    </div>
  );
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTabId>("sales");
  const active = reportTabById(activeTab);

  return (
    <DashboardShell mobileTitle="Reports">
      <div className="space-y-8">
        <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap gap-8">
              {reportsTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-b-2 pb-3 text-[1.1rem] font-semibold transition-colors ${
                    tab.id === activeTab
                      ? "border-[#477640] text-[#477640]"
                      : "border-transparent text-[#71829a] hover:text-[#477640]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <h1 className="mt-10 text-[2.8rem] font-semibold tracking-tight text-[#17213d]">{active.heading}</h1>
            <p className="mt-2 text-[1.05rem] text-[#71829a]">{active.description}</p>
          </div>

          <Toolbar />
        </section>

        {activeTab === "sales" ? <SalesTab /> : null}
        {activeTab === "product" ? <ProductTab /> : null}
        {activeTab === "customer" ? <CustomerTab /> : null}
      </div>
    </DashboardShell>
  );
}
