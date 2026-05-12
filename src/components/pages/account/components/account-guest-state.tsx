"use client";

import Link from "next/link";
import { DEMO_CREDENTIALS } from "@/components/shared/auth/auth-provider";

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

type AccountGuestStateProps = {
  onDemoLogin: () => void;
};

export function AccountGuestState({ onDemoLogin }: AccountGuestStateProps) {
  return (
    <section className="flex min-h-[62vh] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-[720px] rounded-[2rem] border border-[#edf1f6] bg-white p-8 text-center shadow-[0_24px_80px_rgba(20,31,56,0.08)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf4eb] text-[#487540]">
          <LockIcon />
        </div>

        <h1 className="mt-6 text-[2.3rem] font-semibold tracking-tight text-[#1a2540] sm:text-[3rem]">
          Sign in to view your account
        </h1>

        <p className="mx-auto mt-4 max-w-[36rem] text-base leading-8 text-[#64738c] sm:text-lg">
          Use the demo account to open the profile dashboard and preview the
          logged-in experience.
        </p>

       

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onDemoLogin}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#487540] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#3f6738]"
          >
            Sign In with Demo Account
          </button>
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#d7dfea] px-7 text-sm font-semibold text-[#1f2c47] transition-colors hover:bg-[#f8fafc]"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  );
}
