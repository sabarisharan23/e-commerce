"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DEMO_CREDENTIALS,
  useAuth,
} from "@/components/shared/auth/auth-provider";
import { AccountActivityPanel } from "./components/account-activity-panel";
import { AccountAddresses } from "./components/account-addresses";
import { AccountDetailsGrid } from "./components/account-details-grid";
import { AccountGuestState } from "./components/account-guest-state";
import { AccountHeroCard } from "./components/account-hero-card";
import {
  AccountOrderHistory,
  type AccountOrderApiDto,
  type AccountOrdersResponse,
} from "./components/account-order-history";
import { AccountPaymentMethods } from "./components/account-payment-methods";
import { AccountSettingsPanel } from "./components/account-settings-panel";
import { AccountSidebar } from "./components/account-sidebar";
import { AccountStatsGrid } from "./components/account-stats-grid";
import { type AccountSection } from "./account-data";

export function AccountPage({
  initialSection = "profile",
}: {
  initialSection?: AccountSection;
}) {
  const router = useRouter();
  const { isReady, user, signIn, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<AccountSection>("profile");
  const [accountOrders, setAccountOrders] = useState<AccountOrderApiDto[]>([]);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;

    void (async () => {
      await Promise.resolve();

      if (!active) {
        return;
      }

      setOrdersLoading(true);
      setOrdersError(null);

      try {
        const response = await fetch("/api/v1/orders", {
          cache: "no-store",
          credentials: "same-origin",
        });
        const body = (await response.json()) as AccountOrdersResponse;

        if (!response.ok || !body.success) {
          throw new Error(body.success ? "Could not load orders." : body.error.message);
        }

        if (active) {
          setAccountOrders(body.data);
        }
      } catch (error) {
        if (active) {
          setOrdersError(
            error instanceof Error ? error.message : "Could not load orders.",
          );
        }
      } finally {
        if (active) {
          setOrdersLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [user]);

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
          onDemoLogin={async () => {
            const result = await signIn(
              DEMO_CREDENTIALS.email,
              DEMO_CREDENTIALS.password,
            );

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
              <AccountStatsGrid orders={accountOrders} />
              <AccountActivityPanel orders={accountOrders} />
              <AccountDetailsGrid user={user} />
            </div>
          ) : activeSection === "orders" ? (
            <AccountOrderHistory
              error={ordersError}
              isLoading={ordersLoading}
              orders={accountOrders}
            />
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
