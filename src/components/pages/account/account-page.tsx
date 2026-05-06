"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DEMO_CREDENTIALS,
  useAuth,
} from "@/components/shared/auth/auth-provider";
import { AccountActivityPanel } from "./components/account-activity-panel";
import { AccountAddresses } from "./components/account-addresses";
import { AccountDetailsGrid } from "./components/account-details-grid";
import { AccountGuestState } from "./components/account-guest-state";
import { AccountHeroCard } from "./components/account-hero-card";
import { AccountOrderHistory } from "./components/account-order-history";
import { AccountPaymentMethods } from "./components/account-payment-methods";
import { AccountSettingsPanel } from "./components/account-settings-panel";
import { AccountSidebar } from "./components/account-sidebar";
import { AccountStatsGrid } from "./components/account-stats-grid";
import { type AccountSection } from "./account-data";

export function AccountPage() {
  const router = useRouter();
  const { isReady, user, signIn, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<AccountSection>("profile");

  if (!isReady) {
    return (
      <div className="w-full bg-[#f7f9fc] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1240px] animate-pulse space-y-6">
          <div className="h-16 rounded-[2rem] bg-[#edf1f6]" />
          <div className="grid gap-6 xl:grid-cols-[256px_minmax(0,1fr)]">
            <div className="h-[520px] rounded-[2rem] bg-[#edf1f6]" />
            <div className="space-y-6">
              <div className="h-[260px] rounded-[2rem] bg-[#edf1f6]" />
              <div className="grid gap-5 md:grid-cols-3">
                <div className="h-32 rounded-[1.75rem] bg-[#edf1f6]" />
                <div className="h-32 rounded-[1.75rem] bg-[#edf1f6]" />
                <div className="h-32 rounded-[1.75rem] bg-[#edf1f6]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full bg-[#f7f9fc]">
        <AccountGuestState
          onDemoLogin={() => {
            const result = signIn(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

            if (result.success) {
              router.refresh();
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f7f9fc] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-8 xl:grid-cols-[256px_minmax(0,1fr)]">
          <div>
            <AccountSidebar
              user={user}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onSignOut={() => {
                signOut();
                router.push("/");
              }}
            />
          </div>

          {activeSection === "profile" ? (
            <div className="space-y-7">
              <AccountHeroCard user={user} />
              <AccountStatsGrid />
              <AccountActivityPanel />
              <AccountDetailsGrid user={user} />
            </div>
          ) : activeSection === "orders" ? (
            <AccountOrderHistory />
          ) : activeSection === "addresses" ? (
            <AccountAddresses />
          ) : activeSection === "payments" ? (
            <AccountPaymentMethods />
          ) : (
            <AccountSettingsPanel user={user} />
          )}
        </div>
      </div>
    </div>
  );
}
