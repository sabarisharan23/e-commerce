"use client";

import { DashboardPanel } from "../../dashboard-shell";
import { type IntegrationCard } from "../settings-data";

function IntegrationIcon({ icon }: { icon: IntegrationCard["icon"] }) {
  const common = {
    "aria-hidden": "true",
    viewBox: "0 0 24 24",
    className: "h-5 w-5 stroke-current",
    fill: "none",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  if (icon === "stripe") {
    return (
      <svg {...common}>
        <path d="M7 7h10v10H7z" />
        <path d="M9 10h6M9 14h4" />
      </svg>
    );
  }
  if (icon === "shipping") {
    return (
      <svg {...common}>
        <path d="M4 8h10v8H4z" />
        <path d="M14 11h3l3 3v2h-6" />
        <circle cx="8" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M5 5h14v14H5z" />
      <path d="M9 15V9M12 15v-4M15 15V7" />
    </svg>
  );
}

export function ConnectedIntegrationsSection({
  cards,
}: {
  cards: IntegrationCard[];
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">Connected Integrations</h2>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <DashboardPanel key={card.id}>
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f8fc] text-[#64748b]">
                <IntegrationIcon icon={card.icon} />
              </span>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                card.status === "Connected"
                  ? "bg-[#dcfce7] text-[#16a34a]"
                  : "bg-[#eef2f7] text-[#94a3b8]"
              }`}>
                {card.status}
              </span>
            </div>
            <h3 className="mt-5 text-[1.4rem] font-semibold tracking-tight text-[#17213d]">{card.name}</h3>
            <p className="mt-3 min-h-[52px] text-[1.02rem] leading-7 text-[#71829a]">{card.description}</p>
            <button
              type="button"
              className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl px-5 text-base font-semibold ${
                card.status === "Connected"
                  ? "bg-[#f3f4f8] text-[#64748b]"
                  : "bg-[#477640] text-white"
              }`}
            >
              {card.actionLabel}
            </button>
          </DashboardPanel>
        ))}
      </div>
    </div>
  );
}

