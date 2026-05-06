"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import { brandProfiles } from "./brands-data";

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 6 5v6c0 4.2 2.4 7.6 6 9 3.6-1.4 6-4.8 6-9V5l-6-2Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ContactIcon({ kind }: { kind: "person" | "mail" | "phone" | "pin" }) {
  const common = {
    "aria-hidden": "true",
    viewBox: "0 0 24 24",
    className: "h-5 w-5 stroke-current",
    fill: "none",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  if (kind === "person") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 19c1.4-3 3.7-4.5 7-4.5s5.6 1.5 7 4.5" />
      </svg>
    );
  }
  if (kind === "mail") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }
  if (kind === "phone") {
    return (
      <svg {...common}>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6.3 6.3l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 21s7-5.8 7-11a7 7 0 0 0-14 0c0 5.2 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function stockClass(tone: "in-stock" | "low-stock") {
  return tone === "low-stock"
    ? "bg-[#ffedd5] text-[#ea580c]"
    : "bg-[#dcfce7] text-[#16a34a]";
}

function Stars() {
  return (
    <span className="text-[#f7b500]">★★★★★</span>
  );
}

export function BrandDetailPage() {
  const params = useParams<{ brandId: string }>();
  const profile = brandProfiles.find((item) => item.slug === params.brandId) ?? brandProfiles[0];

  return (
    <DashboardShell mobileTitle="Brand Details">
      <div className="space-y-8">
        <section className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-5">
            <span className="inline-flex h-24 w-24 items-center justify-center rounded-[1.8rem] border border-[#dbe3ee] bg-[#111827] text-xl font-semibold text-white">
              MM
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[2.8rem] font-semibold tracking-tight text-[#17213d]">{profile.name}</h1>
                <span className="inline-flex rounded-full bg-[#edf3ea] px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#477640]">
                  {profile.status}
                </span>
              </div>
              <p className="mt-2 text-[1.15rem] text-[#64748b]">{profile.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon />
                  {profile.joinedLabel}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldIcon />
                  {profile.merchantLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#dbe3ee] bg-white px-5 text-base font-semibold text-[#334155]">
              Edit Profile
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white">
              Manage Inventory
            </button>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_228px_228px]">
          <DashboardPanel>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9aa6ba]">Total Revenue</p>
            <p className="mt-4 text-[3.4rem] font-semibold tracking-tight text-[#17213d]">{profile.totalRevenue}</p>
            <p className="mt-4 text-[1.05rem] font-semibold text-[#477640]">{profile.revenueDelta}</p>
          </DashboardPanel>
          <DashboardPanel>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9aa6ba]">Orders</p>
            <p className="mt-4 text-[3rem] font-semibold tracking-tight text-[#17213d]">{profile.orders}</p>
            <div className="mt-5 h-2 rounded-full bg-[#edf1f6]">
              <div className="h-2 rounded-full bg-[#477640]" style={{ width: `${profile.ordersProgress}%` }} />
            </div>
            <p className="mt-3 text-sm text-[#8b98ac]">75% of quarterly target</p>
          </DashboardPanel>
          <DashboardPanel>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9aa6ba]">Avg Rating</p>
            <div className="mt-4 flex items-center gap-3">
              <p className="text-[3rem] font-semibold tracking-tight text-[#17213d]">{profile.averageRating}</p>
              <Stars />
            </div>
            <p className="mt-3 text-sm text-[#8b98ac]">{profile.reviewCount}</p>
          </DashboardPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_300px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Product Catalog</h2>
              <button type="button" className="text-base font-semibold text-[#477640]">View All →</button>
            </div>
            <DashboardPanel className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                      <th className="rounded-l-2xl px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="rounded-r-2xl px-6 py-4">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.catalog.map((item) => (
                      <tr key={item.id}>
                        <td className="border-b border-[#edf1f6] px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-[#f7f8fc]">
                              <Image src={item.imageSrc} alt={item.name} fill sizes="48px" className="object-contain p-1.5" />
                            </div>
                            <span className="max-w-[240px] text-[1.05rem] font-medium text-[#17213d]">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.02rem] text-[#64748b]">{item.category}</td>
                        <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.15rem] font-semibold text-[#17213d]">{item.price}</td>
                        <td className="border-b border-[#edf1f6] px-6 py-5">
                          <span className={`inline-flex rounded-lg px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em] ${stockClass(item.stockTone)}`}>
                            {item.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardPanel>
          </div>

          <DashboardPanel>
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Merchant Profile</h2>
            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4eb] text-[#477640]">
                  <ContactIcon kind="person" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Primary Contact</p>
                  <p className="mt-2 text-[1.2rem] font-semibold text-[#17213d]">{profile.primaryContact}</p>
                  <p className="mt-1 text-[1.02rem] text-[#71829a]">{profile.contactRole}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4eb] text-[#477640]">
                  <ContactIcon kind="mail" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Email Address</p>
                  <p className="mt-2 text-[1.2rem] font-semibold text-[#17213d]">{profile.email}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4eb] text-[#477640]">
                  <ContactIcon kind="phone" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Phone</p>
                  <p className="mt-2 text-[1.2rem] font-semibold text-[#17213d]">{profile.phone}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4eb] text-[#477640]">
                  <ContactIcon kind="pin" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Headquarters</p>
                  <p className="mt-2 text-[1.2rem] font-semibold leading-8 text-[#17213d]">{profile.headquarters}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#edf1f6] pt-7">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Merchant Compliance</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {profile.compliance.map((badge) => (
                  <span key={badge} className="inline-flex rounded-lg bg-[#f3f5f9] px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <button type="button" className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[#477640] bg-white px-5 text-base font-semibold uppercase tracking-[0.08em] text-[#477640]">
              Send Secure Message
            </button>
          </DashboardPanel>
        </section>

        <DashboardPanel className="bg-[#f8faf8]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#477640]">{profile.note.eyebrow}</p>
          <p className="mt-7 max-w-[1080px] text-[1.9rem] italic leading-[1.7] text-[#17213d]">
            {profile.note.quote}
          </p>
          <div className="mt-10 flex items-center gap-4">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#477640] text-base font-semibold text-white">
              {profile.note.initials}
            </span>
            <div>
              <p className="text-[1.1rem] font-semibold text-[#17213d]">{profile.note.author}</p>
              <p className="text-[1.02rem] text-[#71829a]">{profile.note.role}</p>
            </div>
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  );
}

