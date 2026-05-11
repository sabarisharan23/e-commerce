"use client";

import { useState } from "react";
import { accountActivity, type AccountActivity } from "../account-data";
import type { AccountOrderApiDto } from "./account-order-history";

function ActivityIcon({ icon }: { icon: AccountActivity["icon"] }) {
  const wrapperClassName =
    icon === "delivery"
      ? "bg-[#edf4ff] text-[#3973e7]"
      : icon === "payment"
        ? "bg-[#ebfaf0] text-[#22b356]"
        : "bg-[#fff3ea] text-[#46713f]";

  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-full ${wrapperClassName}`}
    >
      {icon === "delivery" ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 stroke-current"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7h11v8H3Z" />
          <path d="M14 10h3l3 3v2h-6" />
          <circle cx="7.5" cy="18" r="1.5" />
          <circle cx="17.5" cy="18" r="1.5" />
        </svg>
      ) : icon === "payment" ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 stroke-current"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M7 12h4" />
          <path d="M15 12h2" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 stroke-current"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 3 2.8 5.6 6.2.9-4.5 4.4 1 6.1L12 17.2 6.5 20l1-6.1L3 9.5l6.2-.9L12 3Z" />
        </svg>
      )}
    </div>
  );
}

function formatActivityTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getOrderActivity(orders: AccountOrderApiDto[]): AccountActivity[] {
  if (orders.length === 0) {
    return [];
  }

  return orders.slice(0, 3).map((order) => {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      description: `${itemCount} item${itemCount === 1 ? "" : "s"} saved to your order history.`,
      icon: order.status === "PLACED" ? "delivery" : "payment",
      id: order.orderNumber,
      timestamp: formatActivityTime(order.createdAt),
      title: `Order #${order.orderNumber} ${order.status.toLowerCase()}`,
    };
  });
}

export function AccountActivityPanel({
  orders,
}: {
  orders?: AccountOrderApiDto[];
}) {
  const activities = orders ? getOrderActivity(orders) : accountActivity;
const [showAll, setShowAll] = useState(false);
  return (
    <>
      <section className="overflow-hidden rounded-[2rem] border border-[#edf1f6] bg-white shadow-[0_20px_60px_rgba(20,31,56,0.06)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#edf1f6] px-6 py-5 sm:px-7">
          <h2 className="text-[1.35rem] font-semibold tracking-tight text-[#1a2540]">
            Recent Activity
          </h2>
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="text-sm font-semibold text-[#487540] transition-colors hover:text-[#3b6235]"
          >
            View All
          </button>
        </div>

      <div>
        {activities.length === 0 ? (
          <div className="px-6 py-10 text-base font-semibold text-[#71829a] sm:px-7">
            No recent account activity yet.
          </div>
        ) : null}

        {activities.map((activity, index) => (
          <article
            key={activity.id}
            className={`flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7 ${
              index < activities.length - 1 ? "border-b border-[#edf1f6]" : ""
            }`}
          >
            <div className="flex gap-4">
              <ActivityIcon icon={activity.icon} />
              <div className="min-w-0">
                <h3 className="text-[1.15rem] font-semibold text-[#1a2540]">
                  {activity.title}
                </h3>
                <p className="mt-1 text-base leading-7 text-[#617089]">
                  {activity.description}
                </p>
              </div>
            </div>

              <p className="shrink-0 text-sm font-medium text-[#8794aa] sm:pl-4">
                {activity.timestamp}
              </p>
            </article>
          ))}
        </div>
      </section>

      {showAll ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8">
          <button
            type="button"
            aria-label="Close activity history"
            className="absolute inset-0"
            onClick={() => setShowAll(false)}
          />
          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf1f6] px-6 py-5">
              <h3 className="text-xl font-semibold text-[#1a2540]">Activity History</h3>
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="text-sm font-semibold text-[#487540]"
              >
                Close
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {accountActivity.map((activity, index) => (
                <article
                  key={`${activity.id}-modal`}
                  className={`flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between ${
                    index < accountActivity.length - 1 ? "border-b border-[#edf1f6]" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <ActivityIcon icon={activity.icon} />
                    <div className="min-w-0">
                      <h4 className="text-base font-semibold text-[#1a2540]">
                        {activity.title}
                      </h4>
                      <p className="mt-1 text-sm leading-7 text-[#617089] sm:text-base">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-[#8794aa] sm:pl-4">
                    {activity.timestamp}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
