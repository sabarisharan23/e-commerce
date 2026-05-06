"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardShell } from "../dashboard-shell";
import { getUserProfile } from "./users-data";

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 stroke-current" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function UserBadgeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 18c1.2-2.6 3.2-3.9 6-3.9 2.9 0 4.9 1.3 6.1 3.9" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
      <path d="M4 7.5V16.5L12 21" />
      <path d="M20 7.5V16.5L12 21" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 16 5-5 4 4 7-7" />
      <path d="M15 8h5v5" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 16.5A3.5 3.5 0 0 0 18 10a5.5 5.5 0 0 0-10.5 1.7A3.8 3.8 0 0 0 8 19h10a3.5 3.5 0 0 0 2-2.5Z" />
      <path d="m12 10-2.5 3H12v3l2.5-3H12z" />
    </svg>
  );
}

function activityIcon(icon: "store" | "trend" | "cloud") {
  if (icon === "store") return <BoxIcon />;
  if (icon === "trend") return <TrendIcon />;
  return <CloudIcon />;
}

function badgeClass(tone: "purple" | "slate" | "green") {
  if (tone === "purple") return "bg-[#ece8ff] text-[#5b4fd8]";
  if (tone === "green") return "bg-[#eaf7ee] text-[#16a34a]";
  return "bg-[#eef2f7] text-[#64748b]";
}

export function UserActivityPage() {
  const params = useParams<{ userId: string }>();
  const profile = getUserProfile(params.userId);

  return (
    <DashboardShell mobileTitle="Recent Activity">
      <div className="space-y-8">
        <section>
          <Link href={`/dashboard/users/${profile.slug}`} className="inline-flex items-center gap-3 text-[#17213d]">
            <BackIcon />
            <h1 className="text-[2.8rem] font-semibold tracking-tight">Recent Activity</h1>
          </Link>
          <p className="mt-2 text-[1.05rem] text-[#71829a]">
            A timeline of significant system events and automated processes.
          </p>
        </section>

        <section className="space-y-6">
          {profile.activityTimeline.map((entry, index) => (
            <div key={entry.id} className="grid gap-4 md:grid-cols-[76px_minmax(0,1fr)]">
              <div className="relative flex justify-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-[#e7edf6] bg-white text-[#4f46e5] shadow-[0_16px_28px_rgba(20,31,56,0.05)]">
                  {activityIcon(entry.icon)}
                </span>
                {index < profile.activityTimeline.length - 1 ? (
                  <span className="absolute left-1/2 top-16 h-[132px] w-px -translate-x-1/2 bg-[#dfe6f0]" />
                ) : null}
              </div>

              <article className="rounded-[2rem] border border-[#e8edf4] bg-white px-6 py-6 shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">{entry.title}</h2>
                  <span className={`inline-flex rounded-xl px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em] ${badgeClass(entry.badgeTone)}`}>
                    {entry.badge}
                  </span>
                </div>
                <p className="mt-4 text-[1.08rem] leading-8 text-[#71829a]">{entry.description}</p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-medium text-[#94a3b8]">
                  <span className="inline-flex items-center gap-2">
                    <ClockIcon />
                    {entry.metaLeft}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <UserBadgeIcon />
                    {entry.metaRight}
                  </span>
                </div>
              </article>
            </div>
          ))}
        </section>

        <div className="flex justify-center">
          <button type="button" className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#dbe3ee] bg-white px-8 text-base font-semibold uppercase tracking-[0.06em] text-[#64748b]">
            View All History
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
