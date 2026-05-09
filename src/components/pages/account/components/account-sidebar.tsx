"use client";

import { type AuthUser } from "@/components/shared/auth/auth-provider";
import {
  type AccountMenuItem,
  type AccountSection,
  accountMenuItems,
} from "../account-data";
import { ProfileAvatar } from "./profile-avatar";

function SidebarIcon({ icon }: { icon: AccountMenuItem["icon"] }) {
  const commonProps = {
    "aria-hidden": "true",
    viewBox: "0 0 24 24",
    className: "h-4 w-4 stroke-current",
    fill: "none",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  if (icon === "profile") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5.5 19c1.4-2.8 3.5-4.2 6.5-4.2s5.1 1.4 6.5 4.2" />
      </svg>
    );
  }

  if (icon === "orders") {
    return (
      <svg {...commonProps}>
        <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5Z" />
        <path d="M12 4v16" />
        <path d="m4 8.5 8 4.5 8-4.5" />
      </svg>
    );
  }

  if (icon === "addresses") {
    return (
      <svg {...commonProps}>
        <path d="M12 20s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10Z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    );
  }

  if (icon === "payments") {
    return (
      <svg {...commonProps}>
        <rect x="3.5" y="6" width="17" height="12" rx="2" />
        <path d="M3.5 10.2h17" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.9 1.9 0 0 1 0 2.7 1.9 1.9 0 0 1-2.7 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9v.2a1.9 1.9 0 0 1-1.9 1.9 1.9 1.9 0 0 1-1.9-1.9v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.9 1.9 0 0 1-2.7 0 1.9 1.9 0 0 1 0-2.7l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6h-.2A1.9 1.9 0 0 1 2 12.7a1.9 1.9 0 0 1 1.9-1.9h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.9 1.9 0 0 1 0-2.7 1.9 1.9 0 0 1 2.7 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9v-.2A1.9 1.9 0 0 1 12.3 3a1.9 1.9 0 0 1 1.9 1.9v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.9 1.9 0 0 1 2.7 0 1.9 1.9 0 0 1 0 2.7l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1.9 1.9 0 0 1 1.9 1.9 1.9 1.9 0 0 1-1.9 1.9h-.2a1 1 0 0 0-.9.6Z" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
      <path d="M10 12h10" />
      <path d="m17 7 5 5-5 5" />
    </svg>
  );
}

type AccountSidebarProps = {
  user: AuthUser;
  activeSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
  onSignOut: () => void;
};

export function AccountSidebar({
  user,
  activeSection,
  onSectionChange,
  onSignOut,
}: AccountSidebarProps) {
  return (
    <div className="space-y-6">
      <aside className="rounded-[2rem] border border-[#e8edf4] bg-white p-6 shadow-[0_20px_60px_rgba(20,31,56,0.06)]">
        <div className="flex items-center gap-4">
          <ProfileAvatar
            initials={user.avatarInitials}
            name={user.name}
            size="sm"
          />
          <div className="min-w-0">
            <h2 className="truncate text-[1.7rem] font-semibold tracking-tight text-[#1b2640]">
              {user.name}
            </h2>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7b89a0]">
              {user.membership}
            </p>
          </div>
        </div>

        <nav aria-label="Account sections" className="mt-7 space-y-2.5">
          {accountMenuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`grid min-h-11 w-full grid-cols-[1rem_minmax(0,1fr)] items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-[0.82rem] font-semibold leading-4 transition-colors ${
                activeSection === item.id
                  ? "bg-[#fbf7e5] text-[#426c3c]"
                  : "text-[#1f2c47] hover:bg-[#f6f8fb]"
              }`}
            >
              <span
                className={`inline-flex h-4 w-4 items-center justify-center ${
                  activeSection === item.id ? "text-[#426c3c]" : "text-[#1f2c47]"
                }`}
              >
                <SidebarIcon icon={item.icon} />
              </span>
              <span className="min-w-0 truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-6 border-t border-[#e8edf4] pt-6">
          <button
            type="button"
            onClick={onSignOut}
            className="grid min-h-11 w-full grid-cols-[1rem_minmax(0,1fr)] items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-[0.82rem] font-semibold text-[#ff4d4f] transition-colors hover:bg-[#fff5f5] hover:text-[#dd3a3d]"
          >
            <SignOutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <section className="rounded-[2rem] bg-[#487540] p-6 text-white shadow-[0_24px_60px_rgba(72,117,64,0.22)]">
        <h3 className="text-[1.9rem] font-semibold tracking-tight">Upgrade to Pro</h3>
        <p className="mt-3 text-base leading-8 text-white/80">
          Get unlimited free deliveries and 5% cashback on every order.
        </p>
        <button
          type="button"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-white text-sm font-semibold text-[#487540] transition-colors hover:bg-[#f2f6ee]"
        >
          Learn More
        </button>
      </section>
    </div>
  );
}
