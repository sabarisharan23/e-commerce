"use client";

import { accountStats } from "../account-data";

export function AccountStatsGrid() {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {accountStats.map((stat) => (
        <article
          key={stat.id}
          className="rounded-[1.75rem] border border-[#edf1f6] bg-white px-6 py-5 shadow-[0_18px_50px_rgba(20,31,56,0.05)]"
        >
          <p className="text-base font-medium text-[#70809a]">{stat.label}</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-[2.25rem] font-semibold leading-none tracking-tight text-[#1a2540]">
              {stat.value}
            </span>
            <span className={`pb-1 text-sm font-semibold ${stat.note}`}>
              {stat.accent}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}
