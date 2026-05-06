"use client";

import { DashboardPanel } from "../../dashboard-shell";
import { type DeliveryPinCode } from "../settings-data";
import { SectionTitle } from "./settings-shared";

export function DeliveryConfigurationSection({
  standardCharge,
  freeDeliveryThreshold,
  pinCodes,
}: {
  standardCharge: string;
  freeDeliveryThreshold: string;
  pinCodes: DeliveryPinCode[];
}) {
  return (
    <DashboardPanel className="overflow-hidden p-0">
      <SectionTitle title="Delivery Configuration" />
      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Standard Delivery Charge (₹)</p>
            <input value={standardCharge} readOnly className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base outline-none" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">Free Delivery Threshold (₹)</p>
            <input value={freeDeliveryThreshold} readOnly className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base outline-none" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-[1.05rem] font-semibold text-[#17213d]">Serviceable Pin-codes</p>
          <button type="button" className="inline-flex h-10 items-center justify-center rounded-xl bg-[#f3f4f8] px-4 text-sm font-semibold text-[#64748b]">
            + Add Pin-code
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f4f6fb] text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                <th className="rounded-l-2xl px-4 py-3">Pin Code</th>
                <th className="px-4 py-3">Area Name</th>
                <th className="px-4 py-3">Delivery Time</th>
                <th className="rounded-r-2xl px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pinCodes.map((row) => (
                <tr key={row.id}>
                  <td className="border-b border-[#edf1f6] px-4 py-4 text-sm font-medium text-[#17213d]">{row.pinCode}</td>
                  <td className="border-b border-[#edf1f6] px-4 py-4 text-sm text-[#64748b]">{row.areaName}</td>
                  <td className="border-b border-[#edf1f6] px-4 py-4 text-sm text-[#64748b]">{row.deliveryTime}</td>
                  <td className="border-b border-[#edf1f6] px-4 py-4 text-sm text-[#94a3b8]">🗑</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardPanel>
  );
}

