"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type {
  BundleOfferDto,
  BundleOfferStatus,
  OfferDto,
  OfferStatus,
  OfferType,
  SeasonalCampaignDto,
  SeasonalCampaignStatus,
} from "@/server/offers/offer-service";
import { DashboardShell } from "../dashboard-shell";

type OffersPageProps = {
  initialBundles: BundleOfferDto[];
  initialCampaigns: SeasonalCampaignDto[];
  initialOffers: OfferDto[];
};

type OfferTab = "promo" | "bundle" | "seasonal";

type PromoFormState = {
  code: string;
  endsAt: string;
  maxDiscount: string;
  startsAt: string;
  targetCategory: string;
  type: OfferType;
  value: string;
};

type BundleFormState = {
  bundleCode: string;
  components: string;
  discountPercent: string;
  name: string;
  primaryProduct: string;
  status: BundleOfferStatus;
};

type CampaignFormState = {
  audience: string;
  endsAt: string;
  incentive: string;
  startsAt: string;
  status: SeasonalCampaignStatus;
  title: string;
};

type ApiResponse<T> =
  | { data: T; success: true }
  | { error: { message: string }; success: false };

const promoCategories = [
  "Organic Millet Mix",
  "Millet Flours",
  "Health Mix",
  "Dosa Mix",
  "Healthy Ingredients",
];

const tabs: Array<{ id: OfferTab; label: string }> = [
  { id: "promo", label: "Promo Code" },
  { id: "bundle", label: "Bundle Offers" },
  { id: "seasonal", label: "Seasonal Campaigns" },
];

const emptyPromoForm: PromoFormState = {
  code: "",
  endsAt: "",
  maxDiscount: "500",
  startsAt: "",
  targetCategory: "Organic Millet Mix",
  type: "PERCENTAGE",
  value: "20",
};

const emptyBundleForm: BundleFormState = {
  bundleCode: "",
  components: "Coconut Chutney Powder, Ghee Roasted Cashews",
  discountPercent: "15",
  name: "Dosa Starter Pack",
  primaryProduct: "Millet Dosa Mix (500g)",
  status: "DRAFT",
};

const emptyCampaignForm: CampaignFormState = {
  audience: "Loyalists, New Leads, Dormant",
  endsAt: "",
  incentive: "Store-wide 20% Off",
  startsAt: "",
  status: "PLANNING",
  title: "",
};

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M4 20h16" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17 9 12l4 4 7-8" />
      <path d="M16 8h4v4" />
    </svg>
  );
}

function formatCurrency(value: number | null | undefined) {
  return `Rs ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value ?? 0)}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "No end date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateRange(startsAt: string | null, endsAt: string | null) {
  if (!startsAt && !endsAt) {
    return "Draft timeline";
  }

  return `${formatDate(startsAt)} - ${formatDate(endsAt)}`;
}

function normalizeCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getOfferImpact(offer: OfferDto) {
  if (offer.type === "PERCENTAGE") {
    return `${offer.value}% OFF`;
  }

  return `${formatCurrency(offer.value)} OFF`;
}

function getOfferStatusClass(status: OfferStatus) {
  if (status === "ACTIVE") {
    return "bg-[#dff7e9] text-[#1f7d3a]";
  }

  if (status === "PAUSED") {
    return "bg-[#fff4da] text-[#b97800]";
  }

  return "bg-[#eef2f7] text-[#64748b]";
}

function getBundleStatusClass(status: BundleOfferStatus) {
  if (status === "ACTIVE") {
    return "text-[#16843a]";
  }

  if (status === "SCHEDULED") {
    return "text-[#d07a00]";
  }

  return "text-[#64748b]";
}

function getCampaignStatusLabel(status: SeasonalCampaignStatus) {
  if (status === "HAPPENING_NOW") {
    return "Happening Now";
  }

  if (status === "UPCOMING") {
    return "Upcoming";
  }

  return "Planning";
}

function getCampaignStatusClass(status: SeasonalCampaignStatus) {
  if (status === "HAPPENING_NOW") {
    return "bg-[#dff7e9] text-[#16843a]";
  }

  if (status === "UPCOMING") {
    return "bg-[#e8f0ff] text-[#3f5edb]";
  }

  return "bg-[#eef2f7] text-[#64748b]";
}

function readApiResponse<T>(response: Response) {
  return response.json().then((body: ApiResponse<T>) => {
    if (!response.ok || !body.success) {
      throw new Error(body.success ? "Request failed." : body.error.message);
    }

    return body.data;
  });
}

function Toolbar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dbe3ee] bg-white px-4 text-sm font-semibold text-[#24304a]">
        <CalendarIcon />
        <span>Oct 12 - Oct 19, 2023</span>
      </button>
      <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dbe3ee] bg-white px-4 text-sm font-semibold text-[#24304a]">
        <FilterIcon />
        <span>Filters</span>
      </button>
      <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#3f713b] px-4 text-sm font-semibold text-white">
        <DownloadIcon />
        <span>Export CSV</span>
      </button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.7rem] font-bold uppercase text-[#6f7d92]">
      {children}
    </span>
  );
}

function PromoTab({
  form,
  isSaving,
  message,
  offers,
  onFormChange,
  onSave,
}: {
  form: PromoFormState;
  isSaving: boolean;
  message: string | null;
  offers: OfferDto[];
  onFormChange: (field: keyof PromoFormState, value: string) => void;
  onSave: () => void;
}) {
  const previewDiscount =
    form.type === "PERCENTAGE"
      ? Math.round((450 * Number(form.value || 0)) / 100)
      : Number(form.value || 0);
  const previewPrice = Math.max(450 - previewDiscount, 0);
  const activeOffers = offers.filter((offer) => offer.status === "ACTIVE").length;
  const totalRedemptions = offers.reduce((sum, offer) => sum + offer.usedCount, 0);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-lg border border-[#e8edf4] bg-white shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <h2 className="text-xl font-bold text-[#17213d]">Configuration Engine</h2>
            <p className="mt-1 text-xs font-bold uppercase text-[#6f7d92]">
              New campaign entry
            </p>
          </div>

          <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
            <label className="block">
              <FieldLabel>Coupon Code</FieldLabel>
              <input
                value={form.code}
                onChange={(event) => onFormChange("code", event.target.value)}
                placeholder="e.g., MILLET20"
                className="mt-2 h-11 w-full rounded-lg border border-[#dbe3ee] px-4 text-sm font-semibold uppercase text-[#24304a] outline-none"
              />
              <p className="mt-2 text-xs text-[#8fa0b8]">
                Unique alphanumeric string used by customers at checkout.
              </p>
            </label>

            <label className="block">
              <FieldLabel>Target Category</FieldLabel>
              <select
                value={form.targetCategory}
                onChange={(event) => onFormChange("targetCategory", event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#dbe3ee] px-4 text-sm text-[#24304a] outline-none"
              >
                {promoCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-[#8fa0b8]">
                Promotion metadata for category-specific campaigns.
              </p>
            </label>

            <div>
              <FieldLabel>Discount Type</FieldLabel>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {[
                  ["PERCENTAGE", "Percentage"],
                  ["FLAT", "Flat Amount"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onFormChange("type", value)}
                    className={`h-11 rounded-lg border text-sm font-bold ${
                      form.type === value
                        ? "border-[#3f713b] bg-[#3f713b] text-white shadow-[0_12px_22px_rgba(63,113,59,0.25)]"
                        : "border-[#3f713b] bg-white text-[#3f713b]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <FieldLabel>Value</FieldLabel>
                <input
                  type="number"
                  value={form.value}
                  onChange={(event) => onFormChange("value", event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-[#dbe3ee] px-4 text-sm text-[#24304a] outline-none"
                />
              </label>
              <label className="block">
                <FieldLabel>Max Discount</FieldLabel>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(event) => onFormChange("maxDiscount", event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-[#dbe3ee] px-4 text-sm text-[#24304a] outline-none"
                />
              </label>
            </div>

            <label className="block">
              <FieldLabel>Start Date</FieldLabel>
              <input
                type="date"
                value={form.startsAt}
                onChange={(event) => onFormChange("startsAt", event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#dbe3ee] px-4 text-sm text-[#24304a] outline-none"
              />
            </label>

            <label className="block">
              <FieldLabel>End Date</FieldLabel>
              <input
                type="date"
                value={form.endsAt}
                onChange={(event) => onFormChange("endsAt", event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#dbe3ee] px-4 text-sm text-[#24304a] outline-none"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#edf1f6] px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
            {message ? (
              <p className="mr-auto rounded-lg bg-[#eef4eb] px-4 py-2 text-sm font-semibold text-[#3f713b]">
                {message}
              </p>
            ) : null}
            <button type="button" className="h-11 rounded-lg px-5 text-sm font-bold text-[#526179]">
              Discard Draft
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={onSave}
              className="h-11 rounded-lg bg-[#3f713b] px-7 text-sm font-bold text-white shadow-[0_12px_22px_rgba(63,113,59,0.25)] disabled:opacity-60"
            >
              {isSaving ? "Deploying..." : "Deploy Campaign"}
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-[#e8edf4] bg-white shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
          <div className="flex items-center justify-between border-b border-[#edf1f6] px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-[#17213d]">Existing Inventory</h2>
              <p className="mt-1 text-xs font-bold uppercase text-[#6f7d92]">
                Performance audit
              </p>
            </div>
            <span className="rounded-full bg-[#eef4eb] px-3 py-1 text-xs font-bold text-[#3f713b]">
              {activeOffers} active
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f7f8fc] text-left text-xs font-bold uppercase text-[#8fa0b8]">
                  <th className="px-6 py-4">Coupon Code</th>
                  <th className="px-6 py-4">Impact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Redemptions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="border-b border-[#edf1f6] px-6 py-4">
                      <p className="text-base font-bold text-[#3f713b]">{offer.code}</p>
                      <p className="text-xs text-[#8fa0b8]">{offer.targetCategory ?? "Global"}</p>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-4">
                      <p className="text-sm font-bold text-[#17213d]">{getOfferImpact(offer)}</p>
                      <p className="text-xs text-[#8fa0b8]">
                        Cap {offer.maxDiscount ? formatCurrency(offer.maxDiscount) : "None"}
                      </p>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${getOfferStatusClass(offer.status)}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="border-b border-[#edf1f6] px-6 py-4">
                      <p className="text-sm font-bold text-[#17213d]">{offer.usedCount.toLocaleString("en-IN")}</p>
                      <div className="mt-2 h-1.5 w-24 rounded-full bg-[#e8edf4]">
                        <div
                          className="h-1.5 rounded-full bg-[#3f713b]"
                          style={{ width: `${Math.min(offer.usedCount / 25, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <section className="overflow-hidden rounded-lg bg-[#3f713b] text-white shadow-[0_24px_50px_rgba(63,113,59,0.22)]">
          <div className="relative h-44">
            <Image
              src="/home/featured-categories/millet-flours.png"
              alt="Millet mix preview"
              fill
              sizes="300px"
              className="object-cover opacity-85"
            />
            <span className="absolute right-3 top-3 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase">
              Preview Mode
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold">Heritage Organic Millet Mix</h3>
            <p className="mt-1 text-sm text-white/78">Superfood Grains & Ancient Seeds</p>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-white/75">Standard Price</p>
                <p className="text-lg line-through opacity-80">Rs 450.00</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-white/75">With {form.code || "MILLET20"}</p>
                <p className="text-3xl font-bold">{formatCurrency(previewPrice)}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-white/14 px-4 py-3 text-sm font-bold">
              <span>{form.code || "MILLET20"} Applied</span>
              <span>- {formatCurrency(previewDiscount)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[#e8edf4] bg-white p-5">
          <div className="flex items-center justify-between">
            <TrendIcon />
            <span className="text-xs font-bold text-[#16a34a]">+12% Conversion</span>
          </div>
          <p className="mt-5 text-xs font-bold uppercase text-[#6f7d92]">Projected Lift</p>
          <p className="mt-2 text-3xl font-bold text-[#17213d]">
            {formatCurrency(Math.max(totalRedemptions * 18 + 12450, 12450))}
          </p>
          <p className="mt-3 text-xs leading-5 text-[#8fa0b8]">
            Estimated additional revenue for the active campaign duration.
          </p>
        </section>

        <section className="rounded-lg border border-[#dfe8f0] bg-[#f7fbff] p-5">
          <p className="text-base font-bold text-[#17213d]">Architect Tip</p>
          <p className="mt-3 text-sm leading-6 text-[#64748b]">
            Codes with 20-30% discounts typically perform better than flat
            amount offers in the Millet category.
          </p>
        </section>
      </aside>
    </div>
  );
}

function BundleTab({
  bundles,
  form,
  isSaving,
  message,
  onFormChange,
  onSave,
}: {
  bundles: BundleOfferDto[];
  form: BundleFormState;
  isSaving: boolean;
  message: string | null;
  onFormChange: (field: keyof BundleFormState, value: string) => void;
  onSave: () => void;
}) {
  const combinedValue = 23;
  const savings = Math.round((combinedValue * Number(form.discountPercent || 0))) / 100;
  const customerPrice = Math.max(combinedValue - savings, 0);

  return (
    <div className="space-y-7">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-lg border border-[#dbe3ee] bg-white p-6 shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-[#17213d]">Create New Bundle</h2>
            <span className="rounded bg-[#eef4eb] px-2.5 py-1 text-xs font-bold text-[#3f713b]">
              Draft
            </span>
          </div>

          <div className="mt-7 space-y-5">
            <label className="block">
              <FieldLabel>Bundle Name</FieldLabel>
              <input
                value={form.name}
                onChange={(event) => onFormChange("name", event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#dbe3ee] px-4 text-sm font-semibold text-[#24304a] outline-none"
              />
            </label>

            <label className="block">
              <FieldLabel>Primary Product</FieldLabel>
              <input
                value={form.primaryProduct}
                onChange={(event) => onFormChange("primaryProduct", event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#dbe3ee] px-4 text-sm font-semibold text-[#24304a] outline-none"
              />
            </label>

            <label className="block">
              <FieldLabel>Frequently Bought Together</FieldLabel>
              <textarea
                value={form.components}
                onChange={(event) => onFormChange("components", event.target.value)}
                rows={3}
                className="mt-2 w-full resize-none rounded-lg border border-[#dbe3ee] px-4 py-3 text-sm text-[#24304a] outline-none"
              />
              <p className="mt-2 text-xs text-[#8fa0b8]">Comma separated product names.</p>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>Bundle Discount (%)</FieldLabel>
                <input
                  type="number"
                  value={form.discountPercent}
                  onChange={(event) => onFormChange("discountPercent", event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-[#dbe3ee] px-4 text-sm text-[#24304a] outline-none"
                />
              </label>
              <label className="block">
                <FieldLabel>Bundle Status</FieldLabel>
                <select
                  value={form.status}
                  onChange={(event) => onFormChange("status", event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-[#dbe3ee] px-4 text-sm text-[#24304a] outline-none"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SCHEDULED">Active (Scheduled)</option>
                  <option value="PAUSED">Paused</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            {message ? (
              <p className="mr-auto rounded-lg bg-[#eef4eb] px-4 py-2 text-sm font-semibold text-[#3f713b]">
                {message}
              </p>
            ) : null}
            <button type="button" className="h-11 rounded-lg px-5 text-sm font-bold text-[#526179]">
              Discard Draft
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={onSave}
              className="h-11 rounded-lg bg-[#3f713b] px-10 text-sm font-bold text-white shadow-[0_12px_22px_rgba(63,113,59,0.25)] disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-lg bg-[#3f713b] p-6 text-white">
            <p className="text-xs font-bold uppercase text-white/75">Live Configuration</p>
            <div className="mt-5 space-y-3 text-sm text-white/82">
              <div className="flex justify-between">
                <span>Combined Value</span>
                <span>$23.00</span>
              </div>
              <div className="flex justify-between">
                <span>Bundle Discount ({form.discountPercent || 0}%)</span>
                <span>-${savings.toFixed(2)}</span>
              </div>
            </div>
            <p className="mt-5 text-xs uppercase text-white/75">Customer Price</p>
            <p className="text-4xl font-bold">${customerPrice.toFixed(2)}</p>
          </section>

          <section className="rounded-lg border border-[#dbe3ee] bg-white p-6">
            <h3 className="text-base font-bold text-[#17213d]">Performance Estimate</h3>
            <div className="mt-5 rounded-lg bg-[#f5f6fa] p-4">
              <p className="text-xs font-bold uppercase text-[#8fa0b8]">Expected conversion boost</p>
              <p className="mt-1 text-2xl font-bold text-[#3f713b]">+12.4%</p>
            </div>
            <div className="mt-3 rounded-lg bg-[#f5f6fa] p-4">
              <p className="text-xs font-bold uppercase text-[#8fa0b8]">Projected weekly revenue</p>
              <p className="mt-1 text-2xl font-bold text-[#17213d]">$1,420.00</p>
            </div>
          </section>
        </aside>
      </div>

      <section className="overflow-hidden rounded-lg border border-[#dbe3ee] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
          <h2 className="text-xl font-bold text-[#17213d]">Existing Bundles</h2>
          <span className="rounded-full border border-[#cbdcf7] px-3 py-1 text-xs font-bold text-[#3f713b]">
            Active ({bundles.filter((bundle) => bundle.status === "ACTIVE").length})
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f7f8fc] text-left text-xs font-bold uppercase text-[#8fa0b8]">
                <th className="px-6 py-4">Bundle Details</th>
                <th className="px-6 py-4">Components</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Total Sales</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((bundle) => (
                <tr key={bundle.id}>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <p className="font-bold text-[#17213d]">{bundle.name}</p>
                    <p className="text-xs text-[#8fa0b8]">{bundle.bundleCode}</p>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <div className="flex -space-x-2">
                      {bundle.components.slice(0, 4).map((component) => (
                        <span
                          key={component}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#dce5ef] text-xs font-bold text-[#526179]"
                        >
                          {component.charAt(0).toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <span className="rounded bg-[#dff7e9] px-3 py-1 text-xs font-bold text-[#16843a]">
                      {bundle.discountPercent}% OFF
                    </span>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <p className="font-bold text-[#17213d]">{formatCurrency(bundle.totalSales)}</p>
                    <p className="text-xs text-[#8fa0b8]">{bundle.unitsSold} units sold</p>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <span className={`text-xs font-bold uppercase ${getBundleStatusClass(bundle.status)}`}>
                      {bundle.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SeasonalTab({
  campaigns,
  form,
  isSaving,
  message,
  onFormChange,
  onSave,
}: {
  campaigns: SeasonalCampaignDto[];
  form: CampaignFormState;
  isSaving: boolean;
  message: string | null;
  onFormChange: (field: keyof CampaignFormState, value: string) => void;
  onSave: () => void;
}) {
  const activeCampaign = campaigns.find((campaign) => campaign.status === "HAPPENING_NOW");
  const upcomingCampaign = campaigns.find((campaign) => campaign.status === "UPCOMING");

  return (
    <div className="space-y-7">
      <section className="grid gap-5 lg:grid-cols-3">
        <article className="min-h-[260px] rounded-lg border border-[#e8edf4] bg-white p-6">
          <span className="rounded bg-[#dff7e9] px-2.5 py-1 text-xs font-bold uppercase text-[#16843a]">
            Happening Now
          </span>
          <h3 className="mt-5 text-xl font-bold text-[#17213d]">
            {activeCampaign?.title ?? "Harvest Summer Sale"}
          </h3>
          <p className="mt-1 text-sm text-[#71829a]">
            {activeCampaign
              ? formatDateRange(activeCampaign.startsAt, activeCampaign.endsAt)
              : "Duration: Aug 01 - Aug 15"}
          </p>
          <div className="mt-7 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#526179]">
                <span>Projected Impact</span>
                <span>{formatCurrency(activeCampaign?.projectedImpact ?? 120000)}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#dce5ef]">
                <div className="h-2 w-4/5 rounded-full bg-[#cbd5e1]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-[#526179]">
                <span>Actual Revenue</span>
                <span>{formatCurrency(activeCampaign?.actualRevenue ?? 108000)}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#dce5ef]">
                <div className="h-2 w-3/4 rounded-full bg-[#3f713b]" />
              </div>
            </div>
          </div>
        </article>

        <article className="min-h-[260px] rounded-lg border border-[#e8edf4] bg-white p-6">
          <span className="rounded bg-[#eef4eb] px-2.5 py-1 text-xs font-bold uppercase text-[#3f713b]">
            Upcoming
          </span>
          <h3 className="mt-5 text-xl font-bold text-[#17213d]">
            {upcomingCampaign?.title ?? "Green Friday Specials"}
          </h3>
          <p className="mt-1 text-sm text-[#71829a]">
            {upcomingCampaign
              ? formatDateRange(upcomingCampaign.startsAt, upcomingCampaign.endsAt)
              : "Launch: Nov 24, 2024"}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 rounded-lg bg-[#f5f6fa] p-4">
            <div>
              <p className="text-xs font-bold uppercase text-[#8fa0b8]">Early Signups</p>
              <p className="mt-1 text-2xl font-bold text-[#17213d]">4.2k</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[#8fa0b8]">Inventory Check</p>
              <p className="mt-1 text-2xl font-bold text-[#16a34a]">98%</p>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-[#e8edf4] bg-white p-6">
          <h3 className="text-xl font-bold text-[#17213d]">Quick Draft</h3>
          <div className="mt-5 space-y-4">
            <label className="block">
              <FieldLabel>Campaign Title</FieldLabel>
              <input
                value={form.title}
                onChange={(event) => onFormChange("title", event.target.value)}
                placeholder="e.g. Autumn Equinox"
                className="mt-2 h-10 w-full rounded-lg border border-[#dbe3ee] px-3 text-sm outline-none"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <FieldLabel>Start Date</FieldLabel>
                <input
                  type="date"
                  value={form.startsAt}
                  onChange={(event) => onFormChange("startsAt", event.target.value)}
                  className="mt-2 h-10 w-full rounded-lg border border-[#dbe3ee] px-3 text-sm outline-none"
                />
              </label>
              <label className="block">
                <FieldLabel>End Date</FieldLabel>
                <input
                  type="date"
                  value={form.endsAt}
                  onChange={(event) => onFormChange("endsAt", event.target.value)}
                  className="mt-2 h-10 w-full rounded-lg border border-[#dbe3ee] px-3 text-sm outline-none"
                />
              </label>
            </div>
            <label className="block">
              <FieldLabel>Primary Incentive</FieldLabel>
              <input
                value={form.incentive}
                onChange={(event) => onFormChange("incentive", event.target.value)}
                className="mt-2 h-10 w-full rounded-lg border border-[#dbe3ee] px-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <FieldLabel>Target Audience</FieldLabel>
              <input
                value={form.audience}
                onChange={(event) => onFormChange("audience", event.target.value)}
                className="mt-2 h-10 w-full rounded-lg border border-[#dbe3ee] px-3 text-sm outline-none"
              />
            </label>
            {message ? (
              <p className="rounded-lg bg-[#eef4eb] px-3 py-2 text-xs font-bold text-[#3f713b]">
                {message}
              </p>
            ) : null}
            <button
              type="button"
              disabled={isSaving}
              onClick={onSave}
              className="h-11 w-full rounded-lg bg-[#3f713b] px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save as Planning Draft"}
            </button>
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-lg border border-[#e8edf4] bg-white">
        <div className="px-6 py-5">
          <h2 className="text-xl font-bold text-[#17213d]">Campaign Roadmap 2024</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f7f8fc] text-left text-xs font-bold uppercase text-[#8fa0b8]">
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4">Conversion Goal</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <p className="font-bold text-[#17213d]">{campaign.title}</p>
                    <p className="text-xs text-[#8fa0b8]">{campaign.campaignCode}</p>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${getCampaignStatusClass(campaign.status)}`}>
                      {getCampaignStatusLabel(campaign.status)}
                    </span>
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5 text-sm text-[#526179]">
                    {formatDateRange(campaign.startsAt, campaign.endsAt)}
                  </td>
                  <td className="border-b border-[#edf1f6] px-6 py-5 font-bold text-[#17213d]">
                    {campaign.conversionGoal}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function OffersPage({
  initialBundles,
  initialCampaigns,
  initialOffers,
}: OffersPageProps) {
  const [activeTab, setActiveTab] = useState<OfferTab>("promo");
  const [offers, setOffers] = useState(initialOffers);
  const [bundles, setBundles] = useState(initialBundles);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [promoForm, setPromoForm] = useState<PromoFormState>(emptyPromoForm);
  const [bundleForm, setBundleForm] = useState<BundleFormState>(emptyBundleForm);
  const [campaignForm, setCampaignForm] =
    useState<CampaignFormState>(emptyCampaignForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const heading = useMemo(() => {
    if (activeTab === "bundle") {
      return {
        description: "Design and manage multi-product combinations for increased AOV.",
        title: "Bundle Offers",
      };
    }

    if (activeTab === "seasonal") {
      return {
        description: "Manage, plan, and analyze your e-commerce promotional events.",
        title: "Seasonal Campaigns",
      };
    }

    return {
      description: "Architect specialized discount structures for Millet & Organic products.",
      title: "Promo Code Manager",
    };
  }, [activeTab]);

  const updatePromoForm = (field: keyof PromoFormState, value: string) => {
    setPromoForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateBundleForm = (field: keyof BundleFormState, value: string) => {
    setBundleForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateCampaignForm = (field: keyof CampaignFormState, value: string) => {
    setCampaignForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const savePromo = async () => {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/v1/offers", {
        body: JSON.stringify({
          code: promoForm.code,
          description: `${promoForm.targetCategory} campaign`,
          endsAt: promoForm.endsAt || null,
          maxDiscount: promoForm.maxDiscount || null,
          minSubtotal: 0,
          startsAt: promoForm.startsAt || null,
          status: "ACTIVE",
          targetCategory: promoForm.targetCategory,
          title: `${promoForm.targetCategory} Promo`,
          type: promoForm.type,
          value: promoForm.value,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const offer = await readApiResponse<OfferDto>(response);

      setOffers((current) => [offer, ...current]);
      setMessage(`${offer.code} deployed.`);
      setPromoForm(emptyPromoForm);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save promo.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveBundle = async () => {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/v1/offers/bundles", {
        body: JSON.stringify({
          bundleCode: bundleForm.bundleCode || undefined,
          components: normalizeCsv(bundleForm.components),
          discountPercent: bundleForm.discountPercent,
          name: bundleForm.name,
          primaryProduct: bundleForm.primaryProduct,
          status: bundleForm.status,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const bundle = await readApiResponse<BundleOfferDto>(response);

      setBundles((current) => [bundle, ...current]);
      setMessage(`${bundle.name} saved.`);
      setBundleForm(emptyBundleForm);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save bundle.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveCampaign = async () => {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/v1/offers/campaigns", {
        body: JSON.stringify({
          audience: normalizeCsv(campaignForm.audience),
          endsAt: campaignForm.endsAt || null,
          incentive: campaignForm.incentive,
          startsAt: campaignForm.startsAt || null,
          status: campaignForm.status,
          title: campaignForm.title,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const campaign = await readApiResponse<SeasonalCampaignDto>(response);

      setCampaigns((current) => [campaign, ...current]);
      setMessage(`${campaign.title} saved.`);
      setCampaignForm(emptyCampaignForm);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save campaign.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardShell mobileTitle="Offers & Discounts">
      <div className="space-y-7">
        <nav className="flex flex-wrap gap-8 border-b border-transparent">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setError(null);
                setMessage(null);
              }}
              className={`border-b-2 pb-3 text-base font-semibold ${
                activeTab === tab.id
                  ? "border-[#3f713b] text-[#3f713b]"
                  : "border-transparent text-[#60708e]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-[2.4rem] font-bold text-[#17213d]">{heading.title}</h1>
            <p className="mt-2 text-base text-[#71829a]">{heading.description}</p>
          </div>
          <Toolbar />
        </section>

        {error ? (
          <p className="rounded-lg border border-[#ffd1d6] bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#be3a45]">
            {error}
          </p>
        ) : null}

        {activeTab === "promo" ? (
          <PromoTab
            form={promoForm}
            isSaving={isSaving}
            message={message}
            offers={offers}
            onFormChange={updatePromoForm}
            onSave={savePromo}
          />
        ) : activeTab === "bundle" ? (
          <BundleTab
            bundles={bundles}
            form={bundleForm}
            isSaving={isSaving}
            message={message}
            onFormChange={updateBundleForm}
            onSave={saveBundle}
          />
        ) : (
          <SeasonalTab
            campaigns={campaigns}
            form={campaignForm}
            isSaving={isSaving}
            message={message}
            onFormChange={updateCampaignForm}
            onSave={saveCampaign}
          />
        )}
      </div>
    </DashboardShell>
  );
}
