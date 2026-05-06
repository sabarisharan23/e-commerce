"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  countryPurchases,
  currentUsersBars,
  dashboardMenuItems,
  dashboardStats,
  monthlyRevenuePoints,
  newCustomers,
  recentOrders,
  topSoldItems,
  weeklyUserActivity,
  type DashboardMenuItem,
} from "./dashboard-data";

function DashboardLogo() {
  return (
    <div className="px-6 py-5">
      <div className="relative h-[58px] w-[132px]">
        <Image
          src="/home/logos/theni-store.png"
          alt="Theni Store"
          fill
          sizes="132px"
          className="object-contain object-left"
        />
      </div>
      <p className="mt-4 text-sm font-medium text-[#6f7d92]">Admin Dashboard</p>
    </div>
  );
}

function MenuIcon({ icon }: { icon: DashboardMenuItem["icon"] }) {
  const commonProps = {
    "aria-hidden": "true",
    viewBox: "0 0 24 24",
    className: "h-5 w-5 stroke-current",
    fill: "none",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  if (icon === "dashboard") {
    return (
      <svg {...commonProps}>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    );
  }

  if (icon === "categories") {
    return (
      <svg {...commonProps}>
        <path d="m12 3 8 5-8 5-8-5 8-5Z" />
        <path d="m4 13 8 5 8-5" />
      </svg>
    );
  }

  if (icon === "products" || icon === "inventory") {
    return (
      <svg {...commonProps}>
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </svg>
    );
  }

  if (icon === "orders") {
    return (
      <svg {...commonProps}>
        <path d="M4 5h2l2 10h10l2-7H7" />
        <circle cx="10" cy="19" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="17" cy="19" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (icon === "vendors") {
    return (
      <svg {...commonProps}>
        <path d="M4 7h16v12H4Z" />
        <path d="M7 7V5h10v2" />
        <path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" />
      </svg>
    );
  }

  if (icon === "users") {
    return (
      <svg {...commonProps}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 18c1.2-2.6 3.2-3.9 6-3.9 2.9 0 4.9 1.3 6.1 3.9" />
        <circle cx="17" cy="9" r="2.2" />
        <path d="M16 14.5c2 .2 3.5 1.1 4.5 2.8" />
      </svg>
    );
  }

  if (icon === "reports") {
    return (
      <svg {...commonProps}>
        <path d="M4 20V9" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M22 20v-12" />
      </svg>
    );
  }

  if (icon === "offers") {
    return (
      <svg {...commonProps}>
        <path d="M8 5h8l3 3v8l-3 3H8l-3-3V8l3-3Z" />
        <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="15" r="1" fill="currentColor" stroke="none" />
        <path d="m8.5 15.5 7-7" />
      </svg>
    );
  }

  if (icon === "reviews") {
    return (
      <svg {...commonProps}>
        <path d="m12 3 2.2 4.4 4.8.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8-3.5-3.4 4.8-.7L12 3Z" />
      </svg>
    );
  }

  if (icon === "brands") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M8 14h8v6l-4-2-4 2v-6Z" />
      </svg>
    );
  }

  if (icon === "settings") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.9 1.9 0 0 1 0 2.7 1.9 1.9 0 0 1-2.7 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9v.2a1.9 1.9 0 0 1-1.9 1.9 1.9 1.9 0 0 1-1.9-1.9v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.9 1.9 0 0 1-2.7 0 1.9 1.9 0 0 1 0-2.7l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6h-.2A1.9 1.9 0 0 1 2 12.7a1.9 1.9 0 0 1 1.9-1.9h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.9 1.9 0 0 1 0-2.7 1.9 1.9 0 0 1 2.7 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9v-.2A1.9 1.9 0 0 1 12.3 3a1.9 1.9 0 0 1 1.9 1.9v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.9 1.9 0 0 1 2.7 0 1.9 1.9 0 0 1 0 2.7l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1.9 1.9 0 0 1 1.9 1.9 1.9 1.9 0 0 1-1.9 1.9h-.2a1 1 0 0 0-.9.6Z" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M12 12h.01M12 16h.01" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  );
}

function MenuToggleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white">
      <DashboardLogo />

      <nav className="flex-1 space-y-1.5 px-3 pb-6">
        {dashboardMenuItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-base font-medium transition-colors ${
                active
                  ? "bg-[#eef4eb] text-[#477640]"
                  : "text-[#526179] hover:bg-[#f5f8fc]"
              }`}
            >
              <span className={active ? "text-[#477640]" : "text-[#526179]"}>
                <MenuIcon icon={item.icon} />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#edf1f6] p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-[#f7f8fc] px-3 py-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(145deg,#f8dccd,#e8b79d)] text-sm font-bold text-[#24304a]">
            JD
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#1c2740]">John Doe</p>
            <p className="text-xs font-medium text-[#8491a5]">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <header className="flex flex-col gap-4 border-b border-[#edf1f6] bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e2e8f0] text-[#526179]"
        >
          <MenuToggleIcon />
        </button>
        <p className="text-lg font-semibold text-[#1c2740]">Admin Dashboard</p>
      </div>

      <label className="flex h-12 w-full max-w-[540px] items-center gap-3 rounded-2xl bg-[#f3f5fb] px-4 text-[#8f9db0]">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search for results..."
          className="w-full border-none bg-transparent text-base text-[#24304a] outline-none placeholder:text-[#9aa6ba]"
        />
      </label>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e2e8f0] text-[#5e6d84] transition-colors hover:bg-[#f5f8fc]"
        >
          <BellIcon />
        </button>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e2e8f0] text-[#5e6d84] transition-colors hover:bg-[#f5f8fc]"
        >
          <MoonIcon />
        </button>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  change,
  changeType,
  barWidth,
}: (typeof dashboardStats)[number]) {
  return (
    <article className="rounded-[1.9rem] border border-[#e8edf4] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-medium text-[#70809a]">{label}</p>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            changeType === "positive"
              ? "bg-[#e9f8ee] text-[#1cb56f]"
              : "bg-[#fff0f3] text-[#f45b6a]"
          }`}
        >
          {change}
        </span>
      </div>
      <p className="mt-5 text-[2.75rem] font-semibold tracking-tight text-[#17213d]">
        {value}
      </p>
      <div className="mt-4 h-1.5 rounded-full bg-[#eef2f6]">
        <div
          className="h-1.5 rounded-full bg-[#477640]"
          style={{ width: barWidth }}
        />
      </div>
    </article>
  );
}

function Panel({
  title,
  subtitle,
  rightSlot,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[2rem] border border-[#e8edf4] bg-white p-5 shadow-[0_18px_40px_rgba(20,31,56,0.04)] sm:p-6 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[1.8rem] font-semibold tracking-tight text-[#17213d]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm font-medium text-[#98a6ba]">{subtitle}</p>
          ) : null}
        </div>
        {rightSlot}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SalesReportChart() {
  const width = 640;
  const height = 260;
  const maxValue = Math.max(...monthlyRevenuePoints);
  const points = monthlyRevenuePoints.map((value, index) => {
    const x = (index / (monthlyRevenuePoints.length - 1)) * (width - 20) + 10;
    const y = height - (value / maxValue) * (height - 20) - 10;
    return { x, y };
  });

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${height} L ${points[0].x.toFixed(2)} ${height} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] w-full">
        <defs>
          <linearGradient id="salesArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#477640" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#477640" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#salesArea)" />
        <path
          d={linePath}
          fill="none"
          stroke="#477640"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-2 grid grid-cols-12 gap-2 px-2 text-center text-xs font-medium text-[#a4afbf]">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
          (month) => (
            <span key={month}>{month}</span>
          ),
        )}
      </div>
    </div>
  );
}

function OrdersOverview() {
  const completed = 75;
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - completed / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[220px] w-[220px] items-center justify-center">
        <svg viewBox="0 0 200 200" className="h-[220px] w-[220px] -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#eef2f7"
            strokeWidth="16"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#477640"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-[3rem] font-semibold tracking-tight text-[#17213d]">5,240</p>
          <p className="text-base font-medium text-[#9aa6ba]">Total Orders</p>
        </div>
      </div>
      <div className="mt-6 w-full space-y-3 text-sm font-medium text-[#70809a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#477640]" />
            <span>Completed</span>
          </div>
          <span className="font-semibold text-[#17213d]">75%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e3e9f1]" />
            <span>Pending</span>
          </div>
          <span className="font-semibold text-[#17213d]">25%</span>
        </div>
      </div>
    </div>
  );
}

function UserActivityBars() {
  return (
    <div className="flex h-[240px] items-end gap-4 sm:gap-5">
      {weeklyUserActivity.map((entry) => (
        <div key={entry.day} className="flex flex-1 flex-col items-center gap-4">
          <div
            className={`w-full rounded-t-2xl ${
              entry.accent ? "bg-[#477640]" : "bg-[#e9edf5]"
            } ${entry.day === "Tue" || entry.day === "Sat" ? "opacity-70" : ""}`}
            style={{ height: `${entry.value}%` }}
          />
          <span className="text-xs font-medium text-[#9ca7b9]">{entry.day}</span>
        </div>
      ))}
    </div>
  );
}

function CurrentUsersBars() {
  return (
    <div className="flex h-[210px] items-end gap-2">
      {currentUsersBars.map((value, index) => (
        <div
          key={index}
          className={`flex-1 rounded-t-xl ${
            index === currentUsersBars.length - 1
              ? "bg-[#477640]"
              : index >= currentUsersBars.length - 3
                ? "bg-[#88a57d]"
                : "bg-[#cfd9ce]"
          }`}
          style={{ height: `${value}%` }}
        />
      ))}
    </div>
  );
}

function CountryProgress() {
  return (
    <div className="space-y-7">
      {countryPurchases.map((item) => (
        <div key={item.country}>
          <div className="mb-3 flex items-center justify-between gap-3 text-base font-medium">
            <span className="text-[#17213d]">{item.country}</span>
            <span className="text-[#6e7d95]">{item.percentage}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-[#eef2f7]">
            <div
              className="h-2.5 rounded-full bg-[#477640]"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function statusPillClass(type: string) {
  if (type === "shipped") {
    return "bg-[#e9f8ee] text-[#1cb56f]";
  }

  if (type === "pending") {
    return "bg-[#fff3d9] text-[#f0a100]";
  }

  if (type === "delivered") {
    return "bg-[#eaf6f0] text-[#18a356]";
  }

  return "bg-[#fff0f3] text-[#f45b6a]";
}

export function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [salesRange, setSalesRange] = useState("Yearly");

  const dashboardSummary = useMemo(
    () => ({
      footerYear: 2026,
      liveUsersChange: "+15.2% vs last hour",
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#17213d]">
      <div className="grid min-h-screen lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#e9edf4] bg-white lg:block">
          <DashboardSidebar />
        </aside>

        <div className="flex min-h-screen flex-col">
          <TopBar onOpenSidebar={() => setSidebarOpen(true)} />

          <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="space-y-6">
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((stat) => (
                  <StatCard key={stat.id} {...stat} />
                ))}
              </section>

              <section className="grid gap-6 xl:grid-cols-[minmax(0,1.85fr)_minmax(300px,0.9fr)]">
                <Panel
                  title="Sales Report"
                  subtitle="Monthly overview of total revenue"
                  rightSlot={
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#6f7d92]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#477640]" />
                        <span>Revenue</span>
                      </div>
                      <select
                        value={salesRange}
                        onChange={(event) => setSalesRange(event.target.value)}
                        className="h-11 rounded-2xl border border-[#dde5ef] bg-white px-4 text-sm font-medium text-[#526179] outline-none"
                      >
                        <option>Yearly</option>
                        <option>Quarterly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  }
                >
                  <SalesReportChart />
                </Panel>

                <Panel title="Orders Overview">
                  <OrdersOverview />
                </Panel>
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <Panel title="User Activity">
                  <UserActivityBars />
                </Panel>

                <Panel
                  title="Current Users"
                  rightSlot={
                    <span className="inline-flex rounded-xl bg-[#fff0f3] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#f45b6a]">
                      Live
                    </span>
                  }
                >
                  <div className="mb-6 flex items-end gap-3">
                    <span className="text-[3.1rem] font-semibold tracking-tight text-[#17213d]">
                      425
                    </span>
                    <span className="pb-2 text-sm font-semibold text-[#22b356]">
                      {dashboardSummary.liveUsersChange}
                    </span>
                  </div>
                  <CurrentUsersBars />
                </Panel>
              </section>

              <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
                <Panel
                  title="Purchased by Country"
                  rightSlot={
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#526179]"
                    >
                      <span>Country</span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 stroke-current"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  }
                >
                  <CountryProgress />
                </Panel>

                <Panel title="Top Sold Items">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0">
                      <thead>
                        <tr className="bg-[#f4f6fb] text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                          <th className="rounded-l-2xl px-4 py-4">Item Name</th>
                          <th className="px-4 py-4">Sales</th>
                          <th className="px-4 py-4">Stock</th>
                          <th className="rounded-r-2xl px-4 py-4">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topSoldItems.map((item, index) => (
                          <tr key={item.id} className={index < topSoldItems.length - 1 ? "" : ""}>
                            <td className="border-b border-[#edf1f6] px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#f7f8fc]">
                                  <Image
                                    src={item.imageSrc}
                                    alt={item.name}
                                    fill
                                    sizes="40px"
                                    className="object-contain p-1.5"
                                  />
                                </div>
                                <span className="line-clamp-2 text-sm font-medium text-[#1c2740]">
                                  {item.name}
                                </span>
                              </div>
                            </td>
                            <td className="border-b border-[#edf1f6] px-4 py-4 text-sm font-semibold text-[#1c2740]">
                              {item.sales}
                            </td>
                            <td
                              className={`border-b border-[#edf1f6] px-4 py-4 text-sm font-medium ${
                                item.stockType === "in" ? "text-[#22b356]" : "text-[#f45b6a]"
                              }`}
                            >
                              {item.stock}
                            </td>
                            <td className="border-b border-[#edf1f6] px-4 py-4 text-sm font-medium text-[#1c2740]">
                              {item.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              </section>

              <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
                <Panel
                  title="Recent Orders"
                  rightSlot={
                    <button
                      type="button"
                      className="text-sm font-semibold text-[#477640]"
                    >
                      View All
                    </button>
                  }
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0">
                      <thead>
                        <tr className="bg-[#f4f6fb] text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                          <th className="rounded-l-2xl px-4 py-4">Order ID</th>
                          <th className="px-4 py-4">Customer</th>
                          <th className="px-4 py-4">Date</th>
                          <th className="px-4 py-4">Amount</th>
                          <th className="rounded-r-2xl px-4 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="border-b border-[#edf1f6] px-4 py-4 text-sm font-semibold text-[#4a586f]">
                              {order.id}
                            </td>
                            <td className="border-b border-[#edf1f6] px-4 py-4 text-sm font-medium text-[#1c2740]">
                              {order.customer}
                            </td>
                            <td className="border-b border-[#edf1f6] px-4 py-4 text-sm text-[#5f6f85]">
                              {order.date}
                            </td>
                            <td className="border-b border-[#edf1f6] px-4 py-4 text-sm font-semibold text-[#1c2740]">
                              {order.amount}
                            </td>
                            <td className="border-b border-[#edf1f6] px-4 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusPillClass(
                                  order.statusType,
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>

                <Panel title="New Customers">
                  <div className="space-y-4">
                    {newCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22595a] text-sm font-semibold text-white">
                            {customer.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-[#1c2740]">
                              {customer.name}
                            </p>
                            <p className="truncate text-sm text-[#8b98ac]">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#dde5ef] text-[#8b98ac] transition-colors hover:bg-[#f7f9fc]"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-5 w-5 stroke-current"
                            fill="none"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 6h16v12H4Z" />
                            <path d="m4 8 8 6 8-6" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#f4f6fb] text-sm font-semibold text-[#526179] transition-colors hover:bg-[#edf1f6]"
                  >
                    View All Customers
                  </button>
                </Panel>
              </section>
            </div>
          </div>

          <footer className="border-t border-[#e9edf4] px-4 py-6 text-center text-sm font-medium text-[#9aa6ba] sm:px-6 lg:px-8">
            © {dashboardSummary.footerYear} Theni Stores. All rights reserved.
          </footer>
        </div>
      </div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <button
            type="button"
            aria-label="Close dashboard navigation"
            className="absolute inset-0 bg-[#17213d]/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[88vw] max-w-[280px] border-r border-[#e9edf4] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf1f6] px-4 py-4">
              <p className="text-lg font-semibold text-[#1c2740]">Navigation</p>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e2e8f0] text-[#526179]"
              >
                <CloseIcon />
              </button>
            </div>
            <DashboardSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
