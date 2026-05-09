"use client";

import { accountStats } from "../account-data";
import type { AccountOrderApiDto } from "./account-order-history";

export function AccountStatsGrid({ orders = [] }: { orders?: AccountOrderApiDto[] }) {
  const totalSpend = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingDeliveries = orders.filter((order) =>
    ["PLACED", "PROCESSING", "SHIPPED"].includes(order.status),
  ).length;
  const dynamicStats = accountStats.map((stat) => {
    if (stat.id === "orders") {
      return {
        ...stat,
        accent: orders.length === 1 ? "1 saved order" : `${orders.length} saved orders`,
        value: String(orders.length),
      };
    }

    if (stat.id === "points") {
      return {
        ...stat,
        accent: totalSpend > 0 ? "From purchases" : "Start earning",
        value: new Intl.NumberFormat("en-IN").format(Math.floor(totalSpend / 10)),
      };
    }

    return {
      ...stat,
      accent: pendingDeliveries > 0 ? "Being prepared" : "No active delivery",
      value: String(pendingDeliveries).padStart(2, "0"),
    };
  });

  return (
    <section className="grid gap-5 md:grid-cols-3">
      {dynamicStats.map((stat) => (
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
