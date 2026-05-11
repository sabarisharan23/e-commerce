"use client";

import { useRouter } from "next/navigation";
import { type AuthUser } from "@/components/shared/auth/auth-provider";
import { ProfileAvatar } from "./profile-avatar";

function CalendarIcon() {
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
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.125rem] w-[1.125rem] stroke-current"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 20 4.2-1 9.8-9.8a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

export function AccountHeroCard({ user }: { user: AuthUser }) {
  const router = useRouter();

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#edf1f6] bg-white shadow-[0_20px_60px_rgba(20,31,56,0.06)]">
      <div className="h-32 bg-[linear-gradient(135deg,#f9b126,#ff7a17)] sm:h-36" />

      <div className="px-5 pb-5 sm:px-8 sm:pb-8">
        <div className="flex flex-col gap-6 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="-mt-10 sm:mt-0">
              <ProfileAvatar
                initials={user.avatarInitials}
                name={user.name}
                variant="square"
                size="lg"
              />
            </div>

            <div className="pb-1">
              <h1 className="text-[1.9rem] font-semibold tracking-tight text-[#1a2540] sm:text-[2.35rem]">
                {user.name}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#77859d] sm:text-base">
                <CalendarIcon />
                <span>Member since {user.memberSince}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/account?section=settings")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#487540] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#3f6738]"
          >
            <EditIcon />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </section>
  );
}
