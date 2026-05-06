"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import { getUserProfile } from "./users-data";

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-5.8 7-11a7 7 0 0 0-14 0c0 5.2 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
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

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 8h10l1 11H6L7 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5h14v10H8l-3 3V5Z" />
      <path d="M9 9h6" />
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

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 9h10" />
      <path d="M7 13h6" />
      <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function iconForPreference(icon: "mail" | "message" | "bell") {
  if (icon === "mail") return <MailIcon />;
  if (icon === "message") return <MessageIcon />;
  return <BellIcon />;
}

function activityIcon(icon: "bag" | "review" | "shield") {
  if (icon === "bag") return <BagIcon />;
  if (icon === "review") return <ReviewIcon />;
  return <ShieldIcon />;
}

function activityTone(tone: "green" | "amber" | "blue") {
  if (tone === "green") return "bg-[#eaf7ee] text-[#477640]";
  if (tone === "amber") return "bg-[#fff3dc] text-[#c47a00]";
  return "bg-[#e8f0ff] text-[#4f46e5]";
}

export function UserProfilePage() {
  const params = useParams<{ userId: string }>();
  const profile = getUserProfile(params.userId);
  const peakBar =
    profile.spendingTrend.reduce((current, item) => (item.value > current.value ? item : current), profile.spendingTrend[0]);

  return (
    <DashboardShell mobileTitle="User Profile">
      <div className="space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-[#e8edf4] bg-white shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
          <div
            className="h-32"
            style={{ background: `linear-gradient(135deg, ${profile.bannerFrom}, ${profile.bannerTo})` }}
          />
          <div className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className="-mt-16 inline-flex h-32 w-32 items-center justify-center rounded-[1.8rem] border-4 border-white text-4xl font-semibold text-white shadow-[0_18px_32px_rgba(20,31,56,0.18)]"
                style={{ background: `linear-gradient(135deg, ${profile.avatarFrom}, ${profile.avatarTo})` }}
              >
                {profile.initials}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[2.5rem] font-semibold tracking-tight text-[#17213d]">{profile.name}</h1>
                  <span className="inline-flex rounded-full bg-[#eef0ff] px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#477640]">
                    {profile.memberLabel}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[1.05rem] text-[#71829a]">
                  <PinIcon />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.4rem] bg-[#f7f8fc] px-6 py-5 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Total Orders</p>
                <p className="mt-3 text-[2.2rem] font-semibold tracking-tight text-[#477640]">{profile.totalOrders}</p>
              </div>
              <div className="rounded-[1.4rem] bg-[#f7f8fc] px-6 py-5 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Total Spend</p>
                <p className="mt-3 text-[2.2rem] font-semibold tracking-tight text-[#477640]">{profile.totalSpend}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-6">
            <DashboardPanel>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fa0b8]">Personal Details</p>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4f6fb] text-[#94a3b8]">
                    <MailIcon />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Email Address</p>
                    <p className="mt-2 text-[1.1rem] font-semibold text-[#17213d]">{profile.email}</p>
                    <p className="mt-1 text-sm font-medium text-[#16a34a]">Verified</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4f6fb] text-[#94a3b8]">
                    <PhoneIcon />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Phone Number</p>
                    <p className="mt-2 text-[1.1rem] font-semibold text-[#17213d]">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4f6fb] text-[#94a3b8]">
                    <PinIcon />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Primary Address</p>
                    <div className="mt-2 space-y-1 text-[1.1rem] font-semibold leading-8 text-[#17213d]">
                      {profile.primaryAddress.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[#d7dfeb] bg-[#f8fafb] px-4 text-base font-semibold text-[#477640]">
                Manage Addresses
              </button>
            </DashboardPanel>

            <DashboardPanel className="bg-[#477640] text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7e7d1]">Loyalty Balance</p>
              <div className="mt-6 flex items-end gap-3">
                <p className="text-[3.2rem] font-semibold tracking-tight">{profile.loyaltyPoints}</p>
                <p className="pb-2 text-lg font-medium text-[#eaf4e6]">Points</p>
              </div>
              <p className="mt-6 text-[1.02rem] leading-8 text-[#e4efe1]">
                Next reward: {profile.nextReward}
                <br />
                {profile.rewardMessage}
              </p>
              <div className="mt-8 h-2 rounded-full bg-[#6b9464]">
                <div className="h-2 rounded-full bg-white" style={{ width: "92%" }} />
              </div>
            </DashboardPanel>

            <DashboardPanel>
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Security</h2>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[1.1rem] font-semibold text-[#17213d]">{profile.twoFactorLabel}</p>
                  <p className="mt-1 text-sm text-[#8b98ac]">Enabled via Authenticator App</p>
                </div>
                <span className={`relative inline-flex h-7 w-12 rounded-full ${profile.twoFactorEnabled ? "bg-[#b8d0b1]" : "bg-[#e5e7eb]"}`}>
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-[#477640] transition-all ${profile.twoFactorEnabled ? "left-6" : "left-1 bg-[#cbd5e1]"}`} />
                </span>
              </div>

              <div className="mt-6 border-t border-[#edf1f6] pt-5">
                <button type="button" className="flex w-full items-center justify-between py-3 text-left text-[1.02rem] font-medium text-[#64748b]">
                  <span>{profile.passwordLabel}</span>
                  <ChevronRightIcon />
                </button>
                <button type="button" className="flex w-full items-center justify-between py-3 text-left text-[1.02rem] font-medium text-[#64748b]">
                  <span>{profile.sessionsLabel}</span>
                  <ChevronRightIcon />
                </button>
              </div>
            </DashboardPanel>
          </div>

          <div className="space-y-6">
            <DashboardPanel>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Recent Activity</h2>
                <Link href={`/dashboard/users/${profile.slug}/activity`} className="text-base font-semibold uppercase tracking-[0.1em] text-[#477640]">
                  View All History
                </Link>
              </div>

              <div className="mt-8 grid gap-4 xl:grid-cols-2">
                {profile.recentActivityCards.map((card) => (
                  <article key={card.id} className="rounded-[1.6rem] bg-[#f8fafb] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${activityTone(card.tone)}`}>
                        {activityIcon(card.icon)}
                      </span>
                      <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">{card.date}</span>
                    </div>
                    <h3 className="mt-6 text-[1.55rem] font-semibold tracking-tight text-[#17213d]">{card.title}</h3>
                    <p className="mt-3 text-[1.02rem] leading-8 text-[#71829a]">{card.description}</p>
                  </article>
                ))}
              </div>

              <div className="mt-10">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fa0b8]">Spending Trend</p>

                <div className="mt-6 rounded-[1.8rem] bg-[#f8fafb] px-6 py-6">
                  <div className="flex min-h-[220px] items-end gap-6">
                    {profile.spendingTrend.map((bar) => (
                      <div key={bar.month} className="flex flex-1 flex-col items-center gap-4">
                        <div className="flex w-full items-end justify-center">
                          <div
                            className={`w-full max-w-[48px] rounded-t-2xl ${bar.highlight ? "bg-[#477640]" : "bg-[#a8bca2]"}`}
                            style={{ height: `${bar.value * 1.8}px` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold uppercase tracking-[0.1em] ${bar.highlight ? "text-[#477640]" : "text-[#9aa6ba]"}`}>
                          {bar.month}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_16px_30px_rgba(20,31,56,0.1)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">{peakBar.month} Peak</p>
                      <p className="mt-2 text-[1.8rem] font-semibold tracking-tight text-[#17213d]">Rs 2,450.00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 border-t border-[#edf1f6] pt-8 lg:flex-row lg:items-center lg:justify-between">
                <h3 className="text-[1.9rem] font-semibold tracking-tight text-[#17213d]">Order Timeline</h3>
                <Link href={`/dashboard/users/${profile.slug}/orders/${profile.orders[0].id}`} className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#f1f5f9] px-5 text-base font-semibold text-[#475569]">
                  View History
                </Link>
              </div>

              <div className="mt-6 space-y-6">
                {profile.orderTimeline.map((item, index) => (
                  <div key={item.id} className="grid gap-4 sm:grid-cols-[24px_minmax(0,1fr)_auto] sm:items-start">
                    <div className="relative flex justify-center pt-1">
                      <span className={`h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-[#477640]" : "bg-[#cbd5e1]"}`} />
                      {index < profile.orderTimeline.length - 1 ? (
                        <span className="absolute top-5 h-[72px] w-px bg-[#dbe4ef]" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-[1.2rem] font-semibold text-[#17213d]">{item.productName}</p>
                      <p className="mt-1 text-sm text-[#71829a]">
                        Order {item.orderId} - {item.detail}
                      </p>
                    </div>
                    <p className="text-[1.4rem] font-semibold tracking-tight text-[#17213d]">{item.amount}</p>
                  </div>
                ))}
              </div>
            </DashboardPanel>

            <DashboardPanel>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-[#f7f8fc] text-[#477640]">
                    <ShieldIcon />
                  </span>
                  <div>
                    <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">{profile.securityStatusTitle}</h2>
                    <p className="mt-3 max-w-[640px] text-[1.02rem] leading-8 text-[#71829a]">{profile.securityStatusDescription}</p>
                  </div>
                </div>
                <Link href={`/dashboard/users/${profile.slug}/audit-log`} className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#f1f5f9] px-5 text-base font-semibold text-[#475569]">
                  View Audit Log
                </Link>
              </div>
            </DashboardPanel>

            <DashboardPanel>
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Notification Preferences</h2>
              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {profile.notificationPreferences.map((item) => (
                  <article key={item.id} className="rounded-[1.5rem] border border-[#edf1f6] p-5">
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7f8fc] text-[#64748b]">
                        {iconForPreference(item.icon)}
                      </span>
                      <div>
                        <p className="text-[1.08rem] font-semibold text-[#17213d]">{item.label}</p>
                        <p className="mt-2 text-sm leading-7 text-[#8b98ac]">{item.description}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md border ${item.enabled ? "border-[#16a34a] bg-[#16a34a] text-white" : "border-[#cbd5e1] bg-white text-transparent"}`}>
                        <CheckIcon />
                      </span>
                      <span className="text-sm font-semibold text-[#64748b]">{item.enabled ? "Enabled" : "Disabled"}</span>
                    </div>
                  </article>
                ))}
              </div>
            </DashboardPanel>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
