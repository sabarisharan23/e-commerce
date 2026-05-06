"use client";

import Image from "next/image";
import { useState } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  bundleDraft,
  existingBundles,
  offersTabs,
  offersToolbar,
  promoArchitectTip,
  promoAuditRows,
  promoConfiguration,
  promoKpis,
  promoPreview,
  seasonalHighlights,
  seasonalResource,
  seasonalRoadmap,
  seasonalTip,
  type OfferTabId,
  type SeasonalCampaign,
} from "./offers-data";

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

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 4h6" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <circle cx="8" cy="6" r="1.5" />
      <circle cx="8" cy="12" r="1.5" />
      <circle cx="8" cy="18" r="1.5" />
      <circle cx="16" cy="6" r="1.5" />
      <circle cx="16" cy="12" r="1.5" />
      <circle cx="16" cy="18" r="1.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M9 7V5h6v2" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8 14c-1.5-1.2-2.5-3.2-2.5-5.2A6.5 6.5 0 0 1 12 2.5a6.5 6.5 0 0 1 6.5 6.3c0 2.1-1 4.1-2.5 5.2-.7.6-1 1.1-1.2 2H9.2c-.2-.9-.5-1.4-1.2-2Z" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V11" />
      <path d="m7 11 5-7 5 7" />
      <path d="m5 15 7-8 7 8" />
    </svg>
  );
}

function SnowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M4.9 6l14.2 12M19.1 6 4.9 18M2 12h20" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function offerTab(id: OfferTabId) {
  return offersTabs.find((tab) => tab.id === id) ?? offersTabs[0];
}

function Toolbar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
        <CalendarIcon />
        <span>{offersToolbar.rangeLabel}</span>
      </button>
      <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
        <FilterIcon />
        <span>{offersToolbar.filterLabel}</span>
      </button>
      <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white">
        <DownloadIcon />
        <span>{offersToolbar.exportLabel}</span>
      </button>
    </div>
  );
}

function SeasonalIcon({ icon }: { icon: SeasonalCampaign["icon"] }) {
  if (icon === "sun") return <SunIcon />;
  if (icon === "snow") return <SnowIcon />;
  return <TreeIcon />;
}

function SeasonalTab() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_304px]">
        <DashboardPanel>
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex rounded-xl bg-[#dcfce7] px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#16a34a]">
              {seasonalHighlights.active.badge}
            </span>
            <span className="text-[#cbd5e1]">
              <SparkleIcon />
            </span>
          </div>
          <h2 className="mt-8 text-[2rem] font-semibold tracking-tight text-[#17213d]">{seasonalHighlights.active.name}</h2>
          <p className="mt-2 text-[1.05rem] text-[#71829a]">{seasonalHighlights.active.timeline}</p>

          <div className="mt-10 space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-[#8fa0b8]">
                <span>Projected Impact</span>
                <span className="text-[#17213d]">{seasonalHighlights.active.projectedImpact}</span>
              </div>
              <div className="h-2 rounded-full bg-[#edf1f6]">
                <div className="h-2 rounded-full bg-[#cbd5e1]" style={{ width: "85%" }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-[#8fa0b8]">
                <span>Actual Revenue</span>
                <span className="text-[#477640]">{seasonalHighlights.active.actualRevenue}</span>
              </div>
              <div className="h-2 rounded-full bg-[#edf1f6]">
                <div className="h-2 rounded-full bg-[#477640]" style={{ width: "72%" }} />
              </div>
            </div>
          </div>
        </DashboardPanel>

        <DashboardPanel>
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex rounded-xl bg-[#e8ecff] px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#5b67e9]">
              {seasonalHighlights.upcoming.badge}
            </span>
            <span className="text-[#cbd5e1]">
              <ClockIcon />
            </span>
          </div>
          <h2 className="mt-8 text-[2rem] font-semibold tracking-tight text-[#17213d]">{seasonalHighlights.upcoming.name}</h2>
          <p className="mt-2 text-[1.05rem] text-[#71829a]">{seasonalHighlights.upcoming.timeline}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] bg-[#f7f8fc] px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">{seasonalHighlights.upcoming.statA?.label}</p>
              <p className="mt-2 text-[2.2rem] font-semibold tracking-tight text-[#17213d]">{seasonalHighlights.upcoming.statA?.value}</p>
            </div>
            <div className="rounded-[1.4rem] bg-[#f7f8fc] px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">{seasonalHighlights.upcoming.statB?.label}</p>
              <p className="mt-2 text-[2.2rem] font-semibold tracking-tight text-[#16a34a]">{seasonalHighlights.upcoming.statB?.value}</p>
            </div>
          </div>
        </DashboardPanel>

        <DashboardPanel>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4eb] text-[#477640]">
              <BriefcaseIcon />
            </span>
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Quick Draft</h2>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Campaign Title</p>
              <input type="text" placeholder="e.g. Autumn Equinox" className="mt-3 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none placeholder:text-[#9aa6ba]" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Start Date</p>
                <input type="text" value={seasonalHighlights.draft.startDate} readOnly className="mt-3 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">End Date</p>
                <input type="text" value={seasonalHighlights.draft.endDate} readOnly className="mt-3 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none" />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Primary Incentive</p>
              <div className="mt-3 flex h-12 items-center justify-between rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a]">
                <span>{seasonalHighlights.draft.incentive}</span>
                <span>⌄</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Target Audience</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {seasonalHighlights.draft.audiences.map((item, index) => (
                  <span
                    key={item}
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${index === 0 ? "bg-[#eef0ff] text-[#5b67e9]" : "bg-[#f1f5f9] text-[#64748b]"}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <button type="button" className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white">
              Save as Planning Draft
            </button>
          </div>
        </DashboardPanel>
      </section>

      <DashboardPanel className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Campaign Roadmap 2024</h2>
          <div className="inline-flex items-center gap-4 text-sm font-semibold text-[#64748b]">
            <span>&lt;</span>
            <span>Q3 - Q4</span>
            <span>&gt;</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                <th className="rounded-l-2xl px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4">Conversion Goal</th>
                <th className="rounded-r-2xl px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seasonalRoadmap.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${campaign.phase === "Happening Now" ? "bg-[#eef0ff] text-[#5b67e9]" : campaign.phase === "Planning" ? "bg-[#f5f8fc] text-[#64748b]" : "bg-[#eaf7ee] text-[#16a34a]"}`}>
                        <SeasonalIcon icon={campaign.icon} />
                      </span>
                      <span className="text-[1.08rem] font-semibold text-[#17213d]">{campaign.name}</span>
                    </div>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                      campaign.phase === "Happening Now"
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : campaign.phase === "Upcoming"
                          ? "bg-[#e8ecff] text-[#5b67e9]"
                          : "bg-[#eef2f7] text-[#64748b]"
                    }`}>
                      {campaign.phase}
                    </span>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] text-[#64748b]">{campaign.timeline}</td>
                  <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.2rem] font-semibold text-[#17213d]">{campaign.conversionGoal}</td>
                  <td className="border-b border-[#edf1f6] px-6 py-5 text-[#94a3b8]">⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardPanel>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
        <DashboardPanel className="overflow-hidden bg-[#477640] text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8ead3]">Campaign Tip</p>
          <p className="mt-6 max-w-[620px] text-[2.4rem] font-semibold leading-[1.35] tracking-tight">{seasonalTip.quote}</p>
          <button type="button" className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-white">
            <LightbulbIcon />
            <span>{seasonalTip.action}</span>
          </button>
        </DashboardPanel>

        <DashboardPanel>
          <div className="flex gap-5">
            <div className="relative h-36 w-36 overflow-hidden rounded-2xl bg-[#1f2f36]">
              <Image src="/home/newsletter/newsletter-bg.png" alt={seasonalResource.title} fill sizes="144px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Resource Center</p>
              <h3 className="mt-4 text-[2rem] font-semibold tracking-tight text-[#17213d]">{seasonalResource.title}</h3>
              <p className="mt-4 text-[1.02rem] leading-8 text-[#71829a]">{seasonalResource.description}</p>
              <button type="button" className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-[#477640]">
                <DownloadIcon />
                <span>{seasonalResource.cta}</span>
              </button>
            </div>
          </div>
        </DashboardPanel>
      </section>
    </div>
  );
}

function BundleTab() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_304px]">
        <DashboardPanel className="overflow-hidden p-0">
          <div className="flex flex-col gap-4 border-b border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Create New Bundle</h2>
            <span className="inline-flex rounded-xl bg-[#edf3ea] px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#477640]">Draft</span>
          </div>

          <div className="space-y-8 px-6 py-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Primary Product</p>
              <div className="mt-4 flex flex-col gap-4 rounded-[1.5rem] border border-[#dbe3ee] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f8fc] text-[#9aa6ba]">◩</span>
                  <div>
                    <p className="text-[1.2rem] font-semibold text-[#17213d]">{bundleDraft.primaryProduct.name}</p>
                    <p className="mt-1 text-sm text-[#71829a]">ID: {bundleDraft.primaryProduct.code} • Base Price: {bundleDraft.primaryProduct.basePrice}</p>
                  </div>
                </div>
                <button type="button" className="text-base font-semibold text-[#477640]">Change</button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Frequently Bought Together</p>
                <button type="button" className="inline-flex items-center gap-2 text-base font-semibold text-[#477640]">
                  <PlusIcon />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {bundleDraft.components.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-[1.4rem] border border-[#dbe3ee] px-4 py-4">
                    <span className="text-[#94a3b8]">
                      <GripIcon />
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f8fc] text-[#9aa6ba]">◩</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[1.15rem] font-medium text-[#17213d]">{item.name}</p>
                      <p className="mt-1 text-sm text-[#71829a]">{item.price}</p>
                    </div>
                    <button type="button" className="text-[#ef4444]">
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 border-t border-[#edf1f6] pt-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Bundle Discount (%)</p>
                <div className="mt-3 flex h-12 items-center rounded-2xl border border-[#dbe3ee] bg-white px-4">
                  <span className="flex-1 text-base font-semibold text-[#17213d]">{bundleDraft.discountPercent}</span>
                  <span className="text-[#9aa6ba]">%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Bundle Status</p>
                <div className="mt-3 flex h-12 items-center justify-between rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base font-semibold text-[#17213d]">
                  <span>{bundleDraft.bundleStatus}</span>
                  <span>⌄</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl px-6 text-base font-semibold text-[#475569]">
              Discard Draft
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#477640] px-8 text-base font-semibold text-white shadow-[0_16px_30px_rgba(91,83,214,0.18)]">
              Save
            </button>
          </div>
        </DashboardPanel>

        <div className="space-y-6">
          <DashboardPanel className="bg-[#477640] text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8ead3]">Live Configuration</p>
            <div className="mt-6 space-y-4 text-[1.15rem]">
              <div className="flex items-center justify-between gap-4 text-[#e4efe1]">
                <span>Combined Value</span>
                <span>{bundleDraft.liveConfiguration.combinedValue}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-[#ffb4b4]">
                <span>Bundle Discount (15%)</span>
                <span>{bundleDraft.liveConfiguration.bundleDiscount}</span>
              </div>
            </div>
            <div className="mt-5 border-t border-white/20 pt-5">
              <p className="text-[1.05rem] text-[#d8ead3]">Customer Price</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-[3rem] font-semibold tracking-tight text-white">{bundleDraft.liveConfiguration.customerPrice}</p>
                <span className="inline-flex rounded-xl bg-white/12 px-3 py-2 text-sm font-semibold text-[#d8ead3]">
                  {bundleDraft.liveConfiguration.savings}
                </span>
              </div>
            </div>
          </DashboardPanel>

          <DashboardPanel>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4eb] text-[#477640]">
                <SparkleIcon />
              </span>
              <h2 className="text-[1.9rem] font-semibold tracking-tight text-[#17213d]">Performance Estimate</h2>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.4rem] bg-[#f7f8fc] px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Expected Conversion Boost</p>
                <p className="mt-2 text-[2rem] font-semibold tracking-tight text-[#16a34a]">{bundleDraft.performanceEstimate.conversionBoost}</p>
              </div>
              <div className="rounded-[1.4rem] bg-[#f7f8fc] px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Projected Weekly Revenue</p>
                <p className="mt-2 text-[2rem] font-semibold tracking-tight text-[#17213d]">{bundleDraft.performanceEstimate.projectedWeeklyRevenue}</p>
              </div>
            </div>
            <button type="button" className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#f1f5f9] px-5 text-base font-semibold text-[#475569]">
              {bundleDraft.performanceEstimate.simulationButton}
            </button>
          </DashboardPanel>
        </div>
      </section>

      <DashboardPanel className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-[#edf1f6] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Existing Bundles</h2>
            <span className="inline-flex rounded-full border border-[#dbe3ee] px-3 py-1 text-sm font-semibold text-[#64748b]">All (24)</span>
            <span className="inline-flex rounded-full border border-[#c9d2ff] bg-[#eef4eb] px-3 py-1 text-sm font-semibold text-[#477640]">Active (18)</span>
          </div>
          <div className="inline-flex h-12 items-center justify-between gap-6 rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base font-semibold text-[#17213d]">
            <span>Sort by: Total Sales</span>
            <span>⌄</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                <th className="rounded-l-2xl px-6 py-4">Bundle Details</th>
                <th className="px-6 py-4">Components</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Total Sales</th>
                <th className="px-6 py-4">Status</th>
                <th className="rounded-r-2xl px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {existingBundles.map((bundle) => (
                <tr key={bundle.id}>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <p className="text-[1.15rem] font-semibold text-[#17213d]">{bundle.name}</p>
                    <p className="mt-1 text-sm text-[#71829a]">{bundle.code} • {bundle.createdLabel}</p>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <div className="flex items-center gap-2">
                      {bundle.components.map((part) => (
                        <span key={part} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d9e2f0] text-sm font-semibold text-[#475569]">
                          {part}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <span className="inline-flex rounded-xl bg-[#edf3ea] px-3 py-1 text-sm font-semibold text-[#477640]">{bundle.discount}</span>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <p className="text-[1.2rem] font-semibold text-[#17213d]">{bundle.totalSales}</p>
                    <p className="mt-1 text-sm text-[#71829a]">{bundle.unitsSold}</p>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <span className={`inline-flex items-center gap-2 text-sm font-semibold ${bundle.status === "Active" ? "text-[#16a34a]" : "text-[#d97706]"}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${bundle.status === "Active" ? "bg-[#16a34a]" : "bg-[#d97706]"}`} />
                      {bundle.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5 text-[#94a3b8]">⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-5 text-center">
          <button type="button" className="text-base font-semibold text-[#477640]">View All 24 Bundles</button>
        </div>
      </DashboardPanel>
    </div>
  );
}

function PromoTab() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_304px]">
        <DashboardPanel className="overflow-hidden p-0">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Configuration Engine</h2>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">New Campaign Entry</p>
          </div>

          <div className="grid gap-8 px-6 py-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Coupon Code</p>
                <input type="text" placeholder={promoConfiguration.couponCodePlaceholder} className="mt-3 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none placeholder:text-[#9aa6ba]" />
                <p className="mt-3 text-sm leading-7 text-[#8b98ac]">Unique alphanumeric string used by customers at checkout.</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Target Category</p>
                <div className="mt-3 flex h-12 items-center justify-between rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a]">
                  <span>{promoConfiguration.targetCategory}</span>
                  <span>⌄</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#8b98ac]">{promoConfiguration.categoryNote}</p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[280px_120px_140px]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Discount Type</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#477640] px-4 text-base font-semibold text-white shadow-[0_16px_28px_rgba(91,83,214,0.16)]">Percentage</button>
                  <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#477640] bg-[#f4f7f2] px-4 text-base font-semibold text-[#477640]">Flat Amount</button>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Value</p>
                <div className="mt-3 flex h-12 items-center rounded-2xl border border-[#dbe3ee] bg-white px-4">
                  <span className="flex-1 text-base text-[#64748b]">{promoConfiguration.value}</span>
                  <span className="text-[#9aa6ba]">%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Max Discount</p>
                <div className="mt-3 flex h-12 items-center rounded-2xl border border-[#dbe3ee] bg-white px-4">
                  <span className="flex-1 text-base text-[#64748b]">{promoConfiguration.maxDiscount}</span>
                  <span className="text-[#9aa6ba]">₹</span>
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Start Date</p>
                <div className="mt-3 flex h-12 items-center gap-3 rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#64748b]">
                  <CalendarIcon />
                  <span>{promoConfiguration.startDate}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">End Date</p>
                <div className="mt-3 flex h-12 items-center gap-3 rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#64748b]">
                  <CalendarIcon />
                  <span>{promoConfiguration.endDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl px-6 text-base font-semibold text-[#475569]">
              {promoConfiguration.secondaryButton}
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#477640] px-8 text-base font-semibold text-white shadow-[0_16px_30px_rgba(91,83,214,0.18)]">
              {promoConfiguration.primaryButton}
            </button>
          </div>
        </DashboardPanel>

        <div className="space-y-6">
          <DashboardPanel className="overflow-hidden bg-[#477640] p-0 text-white">
            <div className="relative h-52 w-full">
              <Image src={promoPreview.imageSrc} alt={promoPreview.title} fill sizes="(max-width:1280px) 100vw, 304px" className="object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1f2f20]/40 to-[#477640]" />
              <span className="absolute right-4 top-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                {promoPreview.badge}
              </span>
            </div>
            <div className="px-6 py-6">
              <h2 className="text-[2rem] font-semibold tracking-tight">{promoPreview.title}</h2>
              <p className="mt-2 text-[1.02rem] text-[#d8ead3]">{promoPreview.subtitle}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d8ead3]">Standard Price</p>
                  <p className="mt-2 text-[2rem] font-semibold line-through text-white/75">{promoPreview.standardPrice}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d8ead3]">With MILLET20 Applied</p>
                  <p className="mt-2 text-[2rem] font-semibold text-white">{promoPreview.discountedPrice}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                <span className="text-base font-semibold text-[#d8ead3]">{promoPreview.appliedLabel}</span>
                <span className="text-base font-semibold text-[#d8ead3]">{promoPreview.savedLabel}</span>
              </div>
            </div>
          </DashboardPanel>

          <DashboardPanel>
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex rounded-2xl bg-[#f1ebff] p-3 text-[#5b67e9]">
                <SparkleIcon />
              </span>
              <span className="text-sm font-semibold text-[#16a34a]">{promoKpis[0].accent}</span>
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">{promoKpis[0].label}</p>
            <p className="mt-2 text-[3rem] font-semibold tracking-tight text-[#17213d]">{promoKpis[0].value}</p>
            <p className="mt-4 text-[1.02rem] leading-8 text-[#71829a]">{promoKpis[0].helper}</p>
          </DashboardPanel>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
            {promoKpis.slice(1).map((item) => (
              <DashboardPanel key={item.id}>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">{item.label}</p>
                <p className={`mt-3 text-[2.4rem] font-semibold tracking-tight ${item.id === "margin" ? "text-[#17213d]" : "text-[#17213d]"}`}>{item.value}</p>
                <div className="mt-4 h-2 rounded-full bg-[#edf1f6]">
                  <div className={`h-2 rounded-full ${item.id === "margin" ? "bg-[#ef4444]" : "bg-[#477640]"}`} style={{ width: `${item.progress ?? 0}%` }} />
                </div>
              </DashboardPanel>
            ))}
          </div>

          <DashboardPanel className="bg-[#f7f9fc]">
            <div className="flex gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#9aa6ba]">
                <LightbulbIcon />
              </span>
              <div>
                <h3 className="text-[1.5rem] font-semibold tracking-tight text-[#17213d]">{promoArchitectTip.title}</h3>
                <p className="mt-3 text-[1.02rem] leading-8 text-[#71829a]">{promoArchitectTip.description}</p>
              </div>
            </div>
          </DashboardPanel>
        </div>
      </section>

      <DashboardPanel className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Existing Inventory</h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Performance Audit</p>
          </div>
          <div className="flex items-center gap-3 text-[#94a3b8]">
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white">
              <FilterIcon />
            </button>
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white">
              <DownloadIcon />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                <th className="rounded-l-2xl px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Impact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Redemptions</th>
                <th className="rounded-r-2xl px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoAuditRows.map((row) => (
                <tr key={row.id}>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <p className="text-[1.5rem] font-semibold tracking-tight text-[#477640]">{row.code}</p>
                    <p className="mt-2 text-sm text-[#8b98ac]">{row.note}</p>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <p className="text-[1.2rem] font-semibold text-[#17213d]">{row.impact}</p>
                    <p className="mt-1 text-sm text-[#8b98ac]">{row.cap}</p>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${row.status === "Active" ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#eef2f7] text-[#64748b]"}`}>
                      {row.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <p className="text-[1.2rem] font-semibold text-[#17213d]">{row.redemptions}</p>
                    <div className="mt-3 h-2 rounded-full bg-[#edf1f6]">
                      <div className="h-2 rounded-full bg-[#477640]" style={{ width: `${row.redemptionProgress}%` }} />
                    </div>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5 text-[#94a3b8]">
                    <div className="flex items-center gap-4">
                      <span>✎</span>
                      <span>🗑</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardPanel>
    </div>
  );
}

export function OffersPage() {
  const [activeTab, setActiveTab] = useState<OfferTabId>("promo");
  const active = offerTab(activeTab);

  return (
    <DashboardShell mobileTitle="Offers & Discounts">
      <div className="space-y-8">
        <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap gap-8">
              {offersTabs.map((tab) => (
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

        {activeTab === "promo" ? <PromoTab /> : null}
        {activeTab === "bundle" ? <BundleTab /> : null}
        {activeTab === "seasonal" ? <SeasonalTab /> : null}
      </div>
    </DashboardShell>
  );
}
