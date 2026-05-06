"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import { getUserOrder } from "./users-data";

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 stroke-current" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 6-6 6 6 6" />
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

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 17H6V7h9v10h-1" />
      <path d="M15 10h3l2 3v4h-1" />
      <circle cx="8" cy="17" r="2" />
      <circle cx="18" cy="17" r="2" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12 2.2 2.2 4.8-4.8" />
    </svg>
  );
}

function statusBadge(status: "In Transit" | "Delivered" | "Cancelled") {
  if (status === "In Transit") return "bg-[#477640] text-white";
  if (status === "Delivered") return "bg-[#e7eef8] text-[#64748b]";
  return "bg-[#fee2e2] text-[#dc2626]";
}

function timelineDot(state: "current" | "completed" | "upcoming") {
  if (state === "current") return "border-2 border-[#477640] bg-white";
  if (state === "completed") return "bg-[#477640]";
  return "bg-[#cbd5e1]";
}

export function UserOrderDetailPage() {
  const params = useParams<{ userId: string; orderId: string }>();
  const { profile, order } = getUserOrder(params.userId, params.orderId);

  return (
    <DashboardShell mobileTitle="Order Detail">
      <div className="space-y-8">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <Link href={`/dashboard/users/${profile.slug}`} className="inline-flex items-center gap-3 text-[#17213d]">
              <BackIcon />
              <h1 className="text-[2.8rem] font-semibold tracking-tight">Order Details</h1>
            </Link>
            <p className="mt-2 text-[1.05rem] text-[#71829a]">
              Detailed transaction history for <span className="font-semibold text-[#17213d]">{profile.name}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dbe3ee] bg-white px-5 text-base font-semibold text-[#334155]">
              <PrintIcon />
              <span>Print Invoice</span>
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white">
              <MailIcon />
              <span>Contact Customer</span>
            </button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[304px_minmax(0,1fr)]">
          <div className="space-y-6">
            <DashboardPanel className="overflow-hidden p-0">
              <div className="border-b border-[#edf1f6] px-5 py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fa0b8]">Purchase History</p>
              </div>
              <div className="divide-y divide-[#edf1f6]">
                {profile.orders.map((entry) => {
                  const active = entry.id === order.id;
                  return (
                    <Link
                      key={entry.id}
                      href={`/dashboard/users/${profile.slug}/orders/${entry.id}`}
                      className={`block px-5 py-5 transition-colors ${active ? "border-l-4 border-[#477640] bg-[#f8fafb]" : "hover:bg-[#fbfcff]"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[1.3rem] font-semibold tracking-tight text-[#17213d]">{entry.id.toUpperCase()}</p>
                          <p className="mt-2 text-sm text-[#8b98ac]">{entry.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${statusBadge(entry.status)}`}>
                            {entry.status}
                          </span>
                          <p className="mt-2 text-[1.2rem] font-semibold text-[#17213d]">{entry.amount}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </DashboardPanel>

            <DashboardPanel>
              <div className="flex items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef0ff] text-[#477640]">
                  <TruckIcon />
                </span>
                <div>
                  <h2 className="text-[1.6rem] font-semibold tracking-tight text-[#17213d]">Tracking Status</h2>
                  <p className="mt-1 text-[1.02rem] text-[#71829a]">{order.trackingCarrier}</p>
                </div>
              </div>

              <div className="mt-8 space-y-8">
                {order.trackingSteps.map((step, index) => (
                  <div key={step.id} className="grid grid-cols-[18px_minmax(0,1fr)] gap-4">
                    <div className="relative flex justify-center">
                      <span className={`mt-1 h-3.5 w-3.5 rounded-full ${timelineDot(step.state)}`} />
                      {index < order.trackingSteps.length - 1 ? (
                        <span className="absolute top-5 h-[72px] w-px bg-[#dbe4ef]" />
                      ) : null}
                    </div>
                    <div>
                      <p className={`text-[1.08rem] font-semibold ${step.state === "current" ? "text-[#477640]" : "text-[#17213d]"}`}>{step.title}</p>
                      <p className="mt-1 text-sm text-[#71829a]">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardPanel>
          </div>

          <div className="space-y-6">
            <DashboardPanel className="overflow-hidden p-0">
              <div className="flex flex-col gap-4 border-b border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Items in Order ({order.items.length})</h2>
                <span className="inline-flex rounded-full bg-[#eef2f7] px-4 py-2 text-sm font-semibold text-[#7c8aa5]">
                  {order.weight}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                      <th className="rounded-l-2xl px-6 py-4">Product</th>
                      <th className="px-6 py-4">Qty</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="rounded-r-2xl px-6 py-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="border-b border-[#edf1f6] px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-[#f7f8fc]">
                              <Image src={item.imageSrc} alt={item.product} fill sizes="48px" className="object-contain p-1.5" />
                            </div>
                            <span className="text-[1.08rem] font-medium text-[#17213d]">{item.product}</span>
                          </div>
                        </td>
                        <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] font-medium text-[#17213d]">{item.qty}</td>
                        <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] text-[#17213d]">{item.price}</td>
                        <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.1rem] font-semibold text-[#17213d]">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 px-6 py-6">
                <div className="flex items-center justify-between text-[1.05rem] text-[#64748b]">
                  <span>Subtotal</span>
                  <span>{order.subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-[1.05rem] text-[#64748b]">
                  <span>{order.shippingLabel}</span>
                  <span>{order.shippingAmount}</span>
                </div>
                <div className="flex items-center justify-between text-[1.05rem] text-[#64748b]">
                  <span>{order.taxLabel}</span>
                  <span>{order.taxAmount}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#edf1f6] pt-4">
                  <span className="text-[1.8rem] font-semibold tracking-tight text-[#17213d]">Total Amount</span>
                  <span className="text-[2.2rem] font-semibold tracking-tight text-[#477640]">{order.totalAmount}</span>
                </div>
              </div>
            </DashboardPanel>

            <div className="grid gap-6 lg:grid-cols-2">
              <DashboardPanel>
                <div className="flex items-center gap-3">
                  <CheckCircleIcon />
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fa0b8]">Billing Address</p>
                </div>
                <div className="mt-6">
                  <p className="text-[1.3rem] font-semibold text-[#17213d]">{order.billingName}</p>
                  <div className="mt-3 space-y-1 text-[1.02rem] leading-8 text-[#64748b]">
                    {order.billingAddress.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
                <div className="mt-6 border-t border-[#edf1f6] pt-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                  {order.paymentNote}
                </div>
              </DashboardPanel>

              <DashboardPanel>
                <div className="flex items-center gap-3">
                  <MailIcon />
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fa0b8]">Shipping Address</p>
                </div>
                <div className="mt-6">
                  <p className="text-[1.3rem] font-semibold text-[#17213d]">{order.shippingName}</p>
                  <div className="mt-3 space-y-1 text-[1.02rem] leading-8 text-[#64748b]">
                    {order.shippingAddress.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
                <div className="mt-6 border-t border-[#edf1f6] pt-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                  Contact: {order.shippingContact}
                </div>
              </DashboardPanel>
            </div>

            <DashboardPanel>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fa0b8]">Internal Staff Notes</p>

              <div className="mt-6 rounded-[1.5rem] border border-[#e2e8f0] bg-[#f8fafb] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-[1.08rem] font-semibold text-[#17213d]">{order.staffNoteAuthor}</p>
                  <p className="text-sm text-[#8b98ac]">{order.staffNoteTimestamp}</p>
                </div>
                <p className="mt-4 text-[1.02rem] leading-8 text-[#64748b]">{order.staffNote}</p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="Add a private note..."
                  className="h-12 flex-1 rounded-2xl border border-[#d7dfeb] bg-white px-4 text-base text-[#24304a] outline-none placeholder:text-[#94a3b8]"
                />
                <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white">
                  Post Note
                </button>
              </div>
            </DashboardPanel>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
