"use client";

import { DashboardPanel } from "../../dashboard-shell";
import { type NotificationPreference } from "../settings-data";
import { CheckCell, SectionTitle } from "./settings-shared";

export function NotificationPreferencesSection({
  rows,
}: {
  rows: NotificationPreference[];
}) {
  return (
    <DashboardPanel className="overflow-hidden p-0">
      <SectionTitle title="Notification Preferences" />
      <div className="overflow-x-auto px-6 py-6">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#f4f6fb] text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
              <th className="rounded-l-2xl px-4 py-3">Alert Type</th>
              <th className="px-4 py-3 text-center">Email</th>
              <th className="px-4 py-3 text-center">SMS</th>
              <th className="rounded-r-2xl px-4 py-3 text-center">Push</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="border-b border-[#edf1f6] px-4 py-4 text-sm font-medium text-[#17213d]">{row.alertType}</td>
                <td className="border-b border-[#edf1f6] px-4 py-4 text-center"><CheckCell checked={row.email} /></td>
                <td className="border-b border-[#edf1f6] px-4 py-4 text-center"><CheckCell checked={row.sms} /></td>
                <td className="border-b border-[#edf1f6] px-4 py-4 text-center"><CheckCell checked={row.push} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}

