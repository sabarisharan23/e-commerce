"use client";

import { DashboardPanel } from "../../dashboard-shell";
import { type LoginActivity } from "../settings-data";
import { SectionTitle, Toggle } from "./settings-shared";

export function SecurityPrivacySection({
  passwordStrengthLabel,
  twoFactorEnabled,
  twoFactorLabel,
  loginActivity,
}: {
  passwordStrengthLabel: string;
  twoFactorEnabled: boolean;
  twoFactorLabel: string;
  loginActivity: LoginActivity[];
}) {
  return (
    <DashboardPanel className="overflow-hidden p-0">
      <SectionTitle
        title="Security & Privacy"
        right={
          <span className="inline-flex rounded-full bg-[#edf3ea] px-3 py-1 text-sm font-semibold text-[#477640]">
            {twoFactorLabel}
          </span>
        }
      />

      <div className="grid gap-8 px-6 py-6 xl:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="text-[1.05rem] font-semibold text-[#17213d]">Change Password</p>
            <div className="mt-4 space-y-3">
              <input placeholder="Current Password" className="h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base outline-none placeholder:text-[#9aa6ba]" />
              <input placeholder="New Password" className="h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base outline-none placeholder:text-[#9aa6ba]" />
              <div className="h-1.5 w-20 rounded-full bg-[#ef4444]" />
              <p className="text-sm text-[#9aa6ba]">{passwordStrengthLabel}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-[#edf1f6] pt-5">
            <div>
              <p className="text-[1.05rem] font-semibold text-[#17213d]">Two-Factor Authentication</p>
              <p className="mt-1 text-sm text-[#9aa6ba]">Secure your account with TOTP</p>
            </div>
            <Toggle enabled={twoFactorEnabled} />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-[1.05rem] font-semibold text-[#17213d]">Login Activity</p>
            <div className="mt-4 space-y-3">
              {loginActivity.map((activity) => (
                <div key={activity.id} className="rounded-2xl bg-[#f7f8fc] px-4 py-4">
                  <p className="text-[1rem] font-semibold text-[#17213d]">{activity.device}</p>
                  <p className="mt-1 text-sm text-[#9aa6ba]">{activity.location}</p>
                </div>
              ))}
            </div>
          </div>
          <button type="button" className="text-sm font-semibold text-[#477640]">
            Log out from all other devices
          </button>
        </div>
      </div>
    </DashboardPanel>
  );
}

