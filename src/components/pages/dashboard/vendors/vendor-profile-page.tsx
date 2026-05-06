"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import { vendorProfiles } from "./vendors-data";

function TrendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 16 5-5 4 4 7-7" />
      <path d="M15 8h5v5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
      <path d="m12 2.8 2.7 5.4 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9L12 2.8Z" />
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

function statusClass(stockState: "in-stock" | "out-of-stock") {
  return stockState === "in-stock" ? "text-[#10b981]" : "text-[#ef4444]";
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[#f7b500]">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className="text-sm">{index < Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export function VendorProfilePage() {
  const params = useParams<{ vendorId: string }>();
  const profile =
    vendorProfiles.find((item) => item.slug === params.vendorId) ?? vendorProfiles[0];

  return (
    <DashboardShell mobileTitle="Vendor Profile">
      <div className="space-y-8">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_320px]">
          <DashboardPanel className="overflow-hidden p-0">
            <div
              className="relative min-h-[196px] px-8 py-8 text-white"
              style={{
                background: `linear-gradient(135deg, ${profile.bannerFrom}, ${profile.bannerTo})`,
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_42%)]" />
              <div className="relative flex h-full flex-col justify-between lg:flex-row lg:items-center">
                <div className="flex items-center gap-6">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-[1.7rem] border-4 border-white/85 bg-[#1e3550] text-2xl font-semibold shadow-[0_18px_30px_rgba(0,0,0,0.2)]">
                    {profile.initials}
                  </div>
                  <div>
                    <h1 className="text-[2.1rem] font-semibold tracking-tight">{profile.name}</h1>
                    <p className="mt-2 max-w-[360px] text-[1.08rem] text-white/85">{profile.subtitle}</p>
                  </div>
                </div>

                <div className="mt-5 flex gap-3 lg:mt-0">
                  <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/45 bg-white/14 px-6 text-base font-semibold text-white backdrop-blur-sm">
                    Message Vendor
                  </button>
                  <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 px-8 py-6 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7f8ea6]">Location</p>
                <p className="mt-3 text-[1.1rem] font-medium text-[#17213d]">{profile.location}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7f8ea6]">Primary Category</p>
                <p className="mt-3 text-[1.1rem] font-medium text-[#17213d]">{profile.primaryCategory}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7f8ea6]">Vendor ID</p>
                <p className="mt-3 text-[1.1rem] font-medium text-[#477640]">{profile.vendorId}</p>
              </div>
            </div>
          </DashboardPanel>

          <div className="space-y-6">
            <DashboardPanel>
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex rounded-2xl bg-[#eef4eb] p-3 text-[#477640]">
                  <TrendIcon />
                </div>
                <span className="inline-flex rounded-full bg-[#eaf7ee] px-3 py-1 text-sm font-semibold text-[#16a34a]">
                  {profile.revenueDelta}
                </span>
              </div>
              <p className="mt-6 text-[3rem] font-semibold tracking-tight text-[#17213d]">{profile.lifetimeRevenue}</p>
              <p className="mt-2 text-[1.08rem] text-[#71829a]">Lifetime Gross Revenue</p>
            </DashboardPanel>

            <DashboardPanel>
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex rounded-2xl bg-[#eef4eb] p-3 text-[#477640]">
                  <StarIcon />
                </div>
                <span className="text-sm font-semibold text-[#71829a]">{profile.reviewCount}</span>
              </div>
              <p className="mt-6 text-[3rem] font-semibold tracking-tight text-[#17213d]">{profile.averageRating}</p>
              <p className="mt-2 text-[1.08rem] text-[#71829a]">Average Customer Rating</p>
            </DashboardPanel>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Return Rate", value: profile.returnRate },
            { label: "Active Products", value: profile.activeProducts },
            { label: "Fulfillment Speed", value: profile.fulfillmentSpeed },
            { label: "Support Ticket SLA", value: profile.supportSla },
          ].map((item) => (
            <DashboardPanel key={item.label}>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">{item.label}</p>
              <p className="mt-5 text-[2.3rem] font-semibold tracking-tight text-[#17213d]">{item.value}</p>
            </DashboardPanel>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_320px]">
          <DashboardPanel className="overflow-hidden">
            <div className="flex items-start justify-between gap-3 border-b border-[#edf1f6] pb-5">
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Recent Products</h2>
              <button type="button" className="text-base font-semibold text-[#4338ca]">View All Collection</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                    <th className="rounded-l-2xl px-4 py-4">Item Name</th>
                    <th className="px-4 py-4">Sales</th>
                    <th className="px-4 py-4">Stock</th>
                    <th className="rounded-r-2xl px-4 py-4">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.recentProducts.map((item) => (
                    <tr key={item.id}>
                      <td className="border-b border-[#edf1f6] px-4 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-[#f7f8fc]">
                            <Image src={item.imageSrc} alt={item.name} fill sizes="48px" className="object-contain p-1.5" />
                          </div>
                          <span className="text-[1.02rem] font-medium text-[#17213d]">{item.name}</span>
                        </div>
                      </td>
                      <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] font-semibold text-[#17213d]">{item.sales}</td>
                      <td className={`border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] font-medium ${statusClass(item.stockState)}`}>{item.stock}</td>
                      <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] font-semibold text-[#17213d]">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardPanel>

          <div className="space-y-6">
            <DashboardPanel>
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Contact Intelligence</h2>
              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f6fb] text-[#94a3b8]"><MailIcon /></span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Official Email</p>
                    <p className="mt-2 text-[1.08rem] font-medium text-[#17213d]">{profile.officialEmail}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f6fb] text-[#94a3b8]"><PhoneIcon /></span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Direct Line</p>
                    <p className="mt-2 text-[1.08rem] font-medium text-[#17213d]">{profile.directLine}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f6fb] text-[#94a3b8]"><PinIcon /></span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Warehouse Hub</p>
                    <p className="mt-2 text-[1.08rem] font-medium leading-8 text-[#17213d]">{profile.warehouseHub}</p>
                  </div>
                </div>
              </div>
              <button type="button" className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white">
                View Logistics Schedule
              </button>
            </DashboardPanel>

            <DashboardPanel>
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Latest Feedback</h2>
              <div className="mt-8 divide-y divide-[#edf1f6]">
                {profile.feedback.map((entry) => (
                  <div key={entry.id} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#eef3ff] text-sm font-semibold text-[#5b67e9]">
                          {entry.initials}
                        </span>
                        <span className="text-[1.05rem] font-semibold text-[#17213d]">{entry.name}</span>
                      </div>
                      <Stars rating={entry.rating} />
                    </div>
                    <p className="mt-4 text-[1.02rem] leading-8 text-[#64748b]">{entry.message}</p>
                  </div>
                ))}
              </div>
            </DashboardPanel>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
