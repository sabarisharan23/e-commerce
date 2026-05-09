"use client";

import Image from "next/image";
import type { DashboardOrderDetail } from "@/server/orders/order-service";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  orderDetailContent,
  orderDetailItems,
  orderTimeline,
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

function PrintIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 8V4h10v4" />
      <rect x="6" y="14" width="12" height="6" rx="2" />
      <rect x="4" y="8" width="16" height="8" rx="2" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 20 4.2-1 9-9a2 2 0 0 0-2.8-2.8l-9 9L4 20Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6.3 6.3l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-5.8 7-11a7 7 0 0 0-14 0c0 5.2 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 19c8 0 13-5 14-14-9 1-14 6-14 14Z" />
      <path d="M5 19c2-4 5-7 10-10" />
    </svg>
  );
}

function TimelineIcon({ state }: { state: "done" | "current" | "pending" }) {
  if (state === "done") {
    return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#477640] text-sm font-bold text-white">✓</span>;
  }
  if (state === "current") {
    return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#477640] bg-white text-[#477640]">●</span>;
  }
  return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#edf1ec] text-[#c9d3c6]">•</span>;
}

export function OrderDetailPage({ detail }: { detail?: DashboardOrderDetail }) {
  const content = detail ?? orderDetailContent;
  const items = detail?.items ?? orderDetailItems;
  const timeline = detail?.timeline ?? orderTimeline;

  return (
    <DashboardShell mobileTitle="Order Detail">
      <div className="space-y-8">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[2.4rem] font-semibold tracking-tight text-[#17213d]">Order #{content.orderId}</h1>
              <span className="inline-flex rounded-lg bg-[#eaf7ee] px-3 py-1 text-sm font-semibold uppercase tracking-[0.04em] text-[#477640]">
                {content.status}
              </span>
            </div>
            <p className="mt-2 text-[1.02rem] text-[#71829a]">{content.description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dde5ef] bg-white px-5 text-base font-semibold text-[#24304a]">
              <DownloadIcon />
              <span>Export CSV</span>
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#334155] px-5 text-base font-semibold text-white">
              <PrintIcon />
              <span>Print Invoice</span>
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white">
              <PenIcon />
              <span>Update Status</span>
            </button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_320px]">
          <DashboardPanel>
            <div className="flex flex-col gap-4 border-b border-[#edf1f6] pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6f7d92]">Customer Profile</p>
                <h2 className="mt-4 text-[2.8rem] font-semibold tracking-tight text-[#17213d]">{content.customerName}</h2>
              </div>
              <span className="inline-flex rounded-full bg-[#ffe3b5] px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#8b6111]">
                {content.memberLabel}
              </span>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f5f1] text-[#6b715c]"><MailIcon /></span>
                <div>
                  <p className="text-[1.02rem] text-[#6f7d92]">Email Address</p>
                  <p className="mt-1 text-xl font-medium text-[#17213d]">{content.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f5f1] text-[#6b715c]"><PinIcon /></span>
                <div>
                  <p className="text-[1.02rem] text-[#6f7d92]">Shipping Address</p>
                  <p className="mt-1 text-xl font-medium leading-8 text-[#17213d]">{content.shippingAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f5f1] text-[#6b715c]"><PhoneIcon /></span>
                <div>
                  <p className="text-[1.02rem] text-[#6f7d92]">Phone Number</p>
                  <p className="mt-1 text-xl font-medium text-[#17213d]">{content.customerPhone}</p>
                </div>
              </div>
            </div>
          </DashboardPanel>

          <DashboardPanel className="bg-[#477640] text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d6e7d2]">Total Harvest Value</p>
            <p className="mt-5 text-[4rem] font-semibold tracking-tight">{content.harvestValue}</p>
            <p className="mt-3 text-[1.02rem] text-[#dce8d8]">{content.harvestChange}</p>
            <div className="mt-16">
              <div className="mb-2 flex items-center justify-between gap-3 text-[1.02rem] text-[#dce8d8]">
                <span>Fulfillment Progress</span>
                <span>{content.fulfillmentPercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#6b9464]">
                <div className="h-2 rounded-full bg-[#d8ead3]" style={{ width: `${content.fulfillmentPercent}%` }} />
              </div>
            </div>
          </DashboardPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_320px]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <LeafIcon />
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Ordered Millets</h2>
            </div>
            <DashboardPanel className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                      <th className="rounded-l-2xl px-4 py-4">Product Details</th>
                      <th className="px-4 py-4">Type</th>
                      <th className="px-4 py-4">Qty</th>
                      <th className="px-4 py-4">Unit Price</th>
                      <th className="rounded-r-2xl px-4 py-4">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="border-b border-[#edf1f6] px-4 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#f7f8fc]">
                              <Image src={item.imageSrc} alt={item.name} fill sizes="56px" className="object-contain p-1.5" />
                            </div>
                            <span className="text-[1.02rem] font-medium text-[#17213d]">{item.name}</span>
                          </div>
                        </td>
                        <td className="border-b border-[#edf1f6] px-4 py-5">
                          <span className="inline-flex rounded-full bg-[#edf3ea] px-3 py-1 text-sm font-semibold uppercase text-[#477640]">{item.type}</span>
                        </td>
                        <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] font-semibold text-[#17213d]">{item.qty}</td>
                        <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] text-[#17213d]">{item.unitPrice}</td>
                        <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] font-semibold text-[#17213d]">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 flex justify-end gap-8 border-t border-[#edf1f6] pt-5">
                <span className="text-[1.02rem] font-semibold uppercase tracking-[0.12em] text-[#6f7d92]">Subtotal</span>
                <span className="text-[2rem] font-semibold text-[#17213d]">{content.subtotal}</span>
              </div>
            </DashboardPanel>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-[#6b715c]">⟲</span>
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Order Timeline</h2>
            </div>
            <DashboardPanel>
              <div className="relative space-y-10 before:absolute before:left-[13px] before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-[#e1e7dd]">
                {timeline.map((step) => (
                  <div key={step.id} className="relative flex gap-5">
                    <div className="relative z-10"><TimelineIcon state={step.state} /></div>
                    <div className={step.state === "pending" ? "opacity-50" : ""}>
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6f7d92]">{step.timeLabel}</p>
                      <p className="mt-2 text-[1.6rem] font-medium text-[#17213d]">{step.title}</p>
                      {step.description ? (
                        <p className="mt-2 text-[1.02rem] leading-8 text-[#64748b]">{step.description}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </DashboardPanel>

            <DashboardPanel className="bg-[#f9faf7]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6f7d92]">Internal Curation Note</p>
              <p className="mt-5 text-[1.05rem] leading-9 text-[#64748b]">{content.note}</p>
            </DashboardPanel>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
