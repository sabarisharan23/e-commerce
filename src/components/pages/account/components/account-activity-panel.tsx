"use client";

import { accountActivity, type AccountActivity } from "../account-data";

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

export function AccountActivityPanel() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#edf1f6] bg-white shadow-[0_20px_60px_rgba(20,31,56,0.06)]">
      <div className="flex items-center justify-between gap-4 border-b border-[#edf1f6] px-6 py-5 sm:px-7">
        <h2 className="text-[2rem] font-semibold tracking-tight text-[#1a2540]">
          Recent Activity
        </h2>
        <button
          type="button"
          className="text-base font-semibold text-[#487540] transition-colors hover:text-[#3b6235]"
        >
          View All
        </button>
      </div>

      <div>
        {accountActivity.map((activity, index) => (
          <article
            key={activity.id}
            className={`flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7 ${
              index < accountActivity.length - 1 ? "border-b border-[#edf1f6]" : ""
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
  );
}
