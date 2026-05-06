"use client";

import { type AuthUser } from "@/components/shared/auth/auth-provider";

function ContactIcon() {
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function HomeIcon() {
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
      <path d="m4 10 8-6 8 6" />
      <path d="M6.5 9.5V20h11V9.5" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3.5 6.5 5-2 7 2 5-2v13l-5 2-7-2-5 2Z" />
      <path d="M8.5 4.5v13M15.5 6.5v13" />
    </svg>
  );
}

export function AccountDetailsGrid({ user }: { user: AuthUser }) {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <article className="rounded-[2rem] border border-[#edf1f6] bg-white px-6 py-6 shadow-[0_20px_60px_rgba(20,31,56,0.06)] sm:px-8 sm:py-7">
        <div className="flex items-center gap-3 text-[#487540]">
          <ContactIcon />
          <h2 className="text-[1.5rem] font-semibold tracking-tight text-[#1a2540]">
            Contact Information
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b89a0]">
              Email Address
            </p>
            <p className="mt-2 text-[1.35rem] font-medium text-[#1f2c47]">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b89a0]">
              Phone Number
            </p>
            <p className="mt-2 text-[1.35rem] font-medium text-[#1f2c47]">
              {user.phone}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b89a0]">
              Communication Preference
            </p>
            <p className="mt-2 text-[1.35rem] font-medium text-[#1f2c47]">
              {user.communicationPreference}
            </p>
          </div>
        </div>
      </article>

      <article className="rounded-[2rem] border border-[#edf1f6] bg-white px-6 py-6 shadow-[0_20px_60px_rgba(20,31,56,0.06)] sm:px-8 sm:py-7">
        <div className="flex items-center gap-3 text-[#487540]">
          <HomeIcon />
          <h2 className="text-[1.5rem] font-semibold tracking-tight text-[#1a2540]">
            Default Shipping
          </h2>
        </div>

        <div className="mt-8 flex items-start gap-4 rounded-[1.5rem] bg-[#f7f9fc] p-4 sm:p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8eef6] text-[#7d8ca4]">
            <MapIcon />
          </div>
          <div className="min-w-0">
            <p className="text-[1.35rem] font-semibold text-[#1f2c47]">
              {user.addressLabel}
            </p>
            <div className="mt-2 space-y-1 text-base leading-7 text-[#617089]">
              {user.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[#f0d9ca] text-sm font-semibold text-[#487540] transition-colors hover:bg-[#fcfaf6]"
        >
          Manage Addresses
        </button>
      </article>
    </section>
  );
}
