"use client";

import { DashboardShell } from "../dashboard-shell";
import { settingsPageData } from "./settings-data";
import { ConnectedIntegrationsSection } from "./components/connected-integrations-section";
import { DeliveryConfigurationSection } from "./components/delivery-configuration-section";
import { NotificationPreferencesSection } from "./components/notification-preferences-section";
import { PaymentMethodsSection } from "./components/payment-methods-section";
import { ProfileInformationSection } from "./components/profile-information-section";
import { RolesPermissionsSection } from "./components/roles-permissions-section";
import { SecurityPrivacySection } from "./components/security-privacy-section";
import { StoreSettingsSection } from "./components/store-settings-section";

export function SettingsPage() {
  const data = settingsPageData;

  return (
    <DashboardShell mobileTitle="Settings">
      <div className="space-y-8">
        <section className="max-w-[760px]">
          <h1 className="text-[2.8rem] font-semibold tracking-tight text-[#17213d]">{data.heading}</h1>
          <p className="mt-2 text-[1.05rem] text-[#71829a]">{data.description}</p>
        </section>

        <ProfileInformationSection data={data.profileInformation} />

        <SecurityPrivacySection
          passwordStrengthLabel={data.security.passwordStrengthLabel}
          twoFactorEnabled={data.security.twoFactorEnabled}
          twoFactorLabel={data.security.twoFactorLabel}
          loginActivity={data.security.loginActivity}
        />

        <StoreSettingsSection {...data.storeSettings} />

        <PaymentMethodsSection
          connectedLabel={data.paymentMethods.connectedLabel}
          toggles={data.paymentMethods.toggles}
          gatewayName={data.paymentMethods.gatewayName}
          gatewayKeyLabel={data.paymentMethods.gatewayKeyLabel}
          gatewayKey={data.paymentMethods.gatewayKey}
        />

        <DeliveryConfigurationSection
          standardCharge={data.deliveryConfiguration.standardCharge}
          freeDeliveryThreshold={data.deliveryConfiguration.freeDeliveryThreshold}
          pinCodes={data.deliveryConfiguration.pinCodes}
        />

        <NotificationPreferencesSection rows={data.notificationPreferences} />

        <RolesPermissionsSection rows={data.userRolePermissions} />

        <ConnectedIntegrationsSection cards={data.integrations} />
      </div>
    </DashboardShell>
  );
}

