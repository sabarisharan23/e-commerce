"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/components/shared";
import { dashboardMenuItems, type DashboardMenuItem } from "./dashboard-data";

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

function isMenuActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isSubmenuActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

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

function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { signOut, user } = useAdminAuth();

  return (
    <div className="flex h-full flex-col bg-white">
      <DashboardLogo />

      <nav className="flex-1 space-y-1.5 px-3 pb-6">
        {dashboardMenuItems.map((item) => {
          const active = isMenuActive(pathname, item.href);

          return (
            <div key={item.id}>
              <Link
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

              {active && item.children?.length ? (
                <div className="mt-2 space-y-2 pl-12">
                  {item.children.map((child) => {
                    const childActive = isSubmenuActive(pathname, child.href);

                    return (
                      <Link
                        key={child.id}
                        href={child.href}
                        onClick={onClose}
                        className={`block text-[0.98rem] font-medium transition-colors ${
                          childActive
                            ? "text-[#477640]"
                            : "text-[#6f7d92] hover:text-[#477640]"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-[#edf1f6] p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-[#f7f8fc] px-3 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(145deg,#f8dccd,#e8b79d)] text-sm font-bold text-[#24304a]">
              {user?.avatarInitials ?? "JD"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1c2740]">
                {user?.name ?? "John Doe"}
              </p>
              <p className="text-xs font-medium text-[#8491a5]">
                {user?.role ?? "Super Admin"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              signOut();
              onClose?.();
            }}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-[#dbe3ee] px-4 py-3 text-sm font-semibold text-[#4a5d78] transition-colors hover:bg-[#f5f8fc]"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function TopBar({
  onOpenSidebar,
  mobileTitle,
}: {
  onOpenSidebar: () => void;
  mobileTitle: string;
}) {
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
        <p className="text-lg font-semibold text-[#1c2740]">{mobileTitle}</p>
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

export function DashboardPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[2rem] border border-[#e8edf4] bg-white p-5 shadow-[0_18px_40px_rgba(20,31,56,0.04)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function DashboardShell({
  children,
  mobileTitle = "Admin Dashboard",
}: {
  children: React.ReactNode;
  mobileTitle?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isReady } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const footerYear = useMemo(() => 2026, []);
  const isLoginRoute = pathname === "/dashboard/login";

  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!isReady || isLoginRoute || isAuthenticated) {
      return;
    }

    router.replace("/dashboard/login");
  }, [isAuthenticated, isLoginRoute, isReady, router]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (!isReady || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-6">
        <div className="w-full max-w-md rounded-[2rem] border border-[#e8edf4] bg-white p-8 text-center shadow-[0_18px_40px_rgba(20,31,56,0.06)]">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#dce8d8] border-t-[#477640]" />
          <h1 className="text-2xl font-bold text-[#1c2740]">Preparing admin workspace...</h1>
          <p className="mt-2 text-sm text-[#6f7d92]">
            We are checking your session and getting the dashboard ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#17213d]">
      <div className="grid min-h-screen lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#e9edf4] bg-white lg:block">
          <DashboardSidebar />
        </aside>

        <div className="flex min-h-screen flex-col">
          <TopBar onOpenSidebar={() => setSidebarOpen(true)} mobileTitle={mobileTitle} />

          <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</div>

          <footer className="border-t border-[#e9edf4] px-4 py-6 text-center text-sm font-medium text-[#9aa6ba] sm:px-6 lg:px-8">
            © {footerYear} Theni Stores. All rights reserved.
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
