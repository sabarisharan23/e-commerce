"use client";

import { useMemo, useState } from "react";
import type { OfferDto, OfferStatus, OfferType } from "@/server/offers/offer-service";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";

type OffersPageProps = {
  initialOffers: OfferDto[];
};

type OfferFormState = {
  code: string;
  description: string;
  endsAt: string;
  maxDiscount: string;
  minSubtotal: string;
  startsAt: string;
  status: OfferStatus;
  title: string;
  type: OfferType;
  usageLimit: string;
  value: string;
};

type ApiResponse<T> =
  | { data: T; success: true }
  | { error: { details?: unknown; message: string }; success: false };

const emptyOfferForm: OfferFormState = {
  code: "",
  description: "",
  endsAt: "",
  maxDiscount: "",
  minSubtotal: "0",
  startsAt: "",
  status: "ACTIVE",
  title: "",
  type: "PERCENTAGE",
  usageLimit: "",
  value: "",
};

function formatMoney(value: number | null) {
  if (value === null) {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function toDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function offerToForm(offer: OfferDto): OfferFormState {
  return {
    code: offer.code,
    description: offer.description ?? "",
    endsAt: toDateInputValue(offer.endsAt),
    maxDiscount: offer.maxDiscount === null ? "" : String(offer.maxDiscount),
    minSubtotal: String(offer.minSubtotal),
    startsAt: toDateInputValue(offer.startsAt),
    status: offer.status,
    title: offer.title,
    type: offer.type,
    usageLimit: offer.usageLimit === null ? "" : String(offer.usageLimit),
    value: String(offer.value),
  };
}

function toOfferPayload(form: OfferFormState) {
  return {
    code: form.code,
    description: form.description,
    endsAt: form.endsAt || null,
    maxDiscount: form.maxDiscount || null,
    minSubtotal: form.minSubtotal || 0,
    startsAt: form.startsAt || null,
    status: form.status,
    title: form.title,
    type: form.type,
    usageLimit: form.usageLimit || null,
    value: form.value,
  };
}

function getStatusClassName(status: OfferStatus) {
  if (status === "ACTIVE") {
    return "bg-[#dcfce7] text-[#16843a]";
  }

  if (status === "PAUSED") {
    return "bg-[#fff1c7] text-[#b97800]";
  }

  return "bg-[#eef2f7] text-[#64748b]";
}

function getDiscountLabel(offer: OfferDto) {
  if (offer.type === "PERCENTAGE") {
    return `${offer.value}%${offer.maxDiscount ? ` up to ${formatMoney(offer.maxDiscount)}` : ""}`;
  }

  return formatMoney(offer.value);
}

async function readApiResponse<T>(response: Response) {
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new Error(
      body.success ? "Request failed." : body.error.message || "Request failed.",
    );
  }

  return body.data;
}

export function OffersPage({ initialOffers }: OffersPageProps) {
  const [offers, setOffers] = useState<OfferDto[]>(initialOffers);
  const [form, setForm] = useState<OfferFormState>(emptyOfferForm);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const activeOffers = useMemo(
    () => offers.filter((offer) => offer.status === "ACTIVE").length,
    [offers],
  );
  const totalRedemptions = useMemo(
    () => offers.reduce((sum, offer) => sum + offer.usedCount, 0),
    [offers],
  );

  const updateForm = (field: keyof OfferFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyOfferForm);
    setEditingOfferId(null);
    setError(null);
    setMessage(null);
  };

  const saveOffer = async () => {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(
        editingOfferId ? `/api/v1/offers/${editingOfferId}` : "/api/v1/offers",
        {
          body: JSON.stringify(toOfferPayload(form)),
          headers: {
            "Content-Type": "application/json",
          },
          method: editingOfferId ? "PATCH" : "POST",
        },
      );
      const savedOffer = await readApiResponse<OfferDto>(response);

      setOffers((current) =>
        editingOfferId
          ? current.map((offer) => (offer.id === savedOffer.id ? savedOffer : offer))
          : [savedOffer, ...current],
      );
      setForm(emptyOfferForm);
      setEditingOfferId(null);
      setMessage(`${savedOffer.code} saved.`);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this offer.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteOffer = async (offer: OfferDto) => {
    const confirmed = window.confirm(`Delete coupon ${offer.code}?`);

    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/v1/offers/${offer.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete this offer.");
      }

      setOffers((current) => current.filter((item) => item.id !== offer.id));
      setMessage(`${offer.code} deleted.`);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete this offer.",
      );
    }
  };

  return (
    <DashboardShell mobileTitle="Offers & Discounts">
      <div className="space-y-7">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#71829a]">
              Coupon Engine
            </p>
            <h1 className="mt-3 text-[2.8rem] font-semibold tracking-tight text-[#17213d]">
              Offers & Discounts
            </h1>
            <p className="mt-2 max-w-3xl text-[1.05rem] leading-8 text-[#71829a]">
              Create coupon codes that can be validated from cart and saved into
              checkout order history.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white"
          >
            New Offer
          </button>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <DashboardPanel>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
              Total Offers
            </p>
            <p className="mt-3 text-[2.6rem] font-semibold tracking-tight text-[#17213d]">
              {offers.length}
            </p>
          </DashboardPanel>
          <DashboardPanel>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
              Active
            </p>
            <p className="mt-3 text-[2.6rem] font-semibold tracking-tight text-[#477640]">
              {activeOffers}
            </p>
          </DashboardPanel>
          <DashboardPanel>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
              Redemptions
            </p>
            <p className="mt-3 text-[2.6rem] font-semibold tracking-tight text-[#17213d]">
              {totalRedemptions}
            </p>
          </DashboardPanel>
        </section>

        <section className="grid gap-7 xl:grid-cols-[420px_minmax(0,1fr)]">
          <DashboardPanel>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">
                  {editingOfferId ? "Edit Offer" : "Create Offer"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#71829a]">
                  Customers can enter this code in the cart coupon box.
                </p>
              </div>
              {editingOfferId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-semibold text-[#477640]"
                >
                  Cancel
                </button>
              ) : null}
            </div>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                  Coupon Code
                </span>
                <input
                  type="text"
                  value={form.code}
                  onChange={(event) => updateForm("code", event.target.value)}
                  placeholder="MILLET20"
                  className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base font-semibold uppercase text-[#24304a] outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                  Title
                </span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="Millet starter discount"
                  className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                  Description
                </span>
                <textarea
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder="Short internal note for admins."
                  rows={3}
                  className="mt-2 w-full resize-none rounded-2xl border border-[#dbe3ee] bg-white px-4 py-3 text-base text-[#24304a] outline-none"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                    Type
                  </span>
                  <select
                    value={form.type}
                    onChange={(event) =>
                      updateForm("type", event.target.value as OfferType)
                    }
                    className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FLAT">Flat amount</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                    Value
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={form.value}
                    onChange={(event) => updateForm("value", event.target.value)}
                    placeholder={form.type === "PERCENTAGE" ? "20" : "100"}
                    className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                    Min Subtotal
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={form.minSubtotal}
                    onChange={(event) =>
                      updateForm("minSubtotal", event.target.value)
                    }
                    className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                    Max Discount
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={form.maxDiscount}
                    onChange={(event) =>
                      updateForm("maxDiscount", event.target.value)
                    }
                    placeholder="Optional"
                    className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                    Starts
                  </span>
                  <input
                    type="date"
                    value={form.startsAt}
                    onChange={(event) => updateForm("startsAt", event.target.value)}
                    className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                    Ends
                  </span>
                  <input
                    type="date"
                    value={form.endsAt}
                    onChange={(event) => updateForm("endsAt", event.target.value)}
                    className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                    Usage Limit
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={form.usageLimit}
                    onChange={(event) =>
                      updateForm("usageLimit", event.target.value)
                    }
                    placeholder="Optional"
                    className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                    Status
                  </span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value as OfferStatus)
                    }
                    className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3ee] bg-white px-4 text-base text-[#24304a] outline-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </label>
              </div>

              {error ? (
                <p className="rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#be3a45]">
                  {error}
                </p>
              ) : null}

              {message ? (
                <p className="rounded-2xl bg-[#eef4eb] px-4 py-3 text-sm font-semibold text-[#477640]">
                  {message}
                </p>
              ) : null}

              <button
                type="button"
                disabled={isSaving}
                onClick={saveOffer}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-colors hover:bg-[#3d6437] disabled:cursor-not-allowed disabled:bg-[#9ab194]"
              >
                {isSaving ? "Saving..." : editingOfferId ? "Update Offer" : "Create Offer"}
              </button>
            </div>
          </DashboardPanel>

          <DashboardPanel className="overflow-hidden p-0">
            <div className="border-b border-[#edf1f6] px-6 py-5">
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">
                Coupon Inventory
              </h2>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#8fa0b8]">
                Used by cart checkout
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Discount</th>
                    <th className="px-6 py-4">Rules</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Usage</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-base font-medium text-[#71829a]"
                      >
                        No offers yet. Create your first coupon.
                      </td>
                    </tr>
                  ) : (
                    offers.map((offer) => (
                      <tr key={offer.id}>
                        <td className="border-b border-[#edf1f6] px-6 py-5">
                          <p className="text-[1.45rem] font-semibold tracking-tight text-[#477640]">
                            {offer.code}
                          </p>
                          <p className="mt-1 text-sm text-[#71829a]">{offer.title}</p>
                        </td>
                        <td className="border-b border-[#edf1f6] px-6 py-5">
                          <p className="text-[1.1rem] font-semibold text-[#17213d]">
                            {getDiscountLabel(offer)}
                          </p>
                          <p className="mt-1 text-sm text-[#71829a]">
                            Min {formatMoney(offer.minSubtotal)}
                          </p>
                        </td>
                        <td className="border-b border-[#edf1f6] px-6 py-5 text-sm text-[#64748b]">
                          <p>Starts: {formatDate(offer.startsAt)}</p>
                          <p className="mt-1">Ends: {formatDate(offer.endsAt)}</p>
                        </td>
                        <td className="border-b border-[#edf1f6] px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusClassName(offer.status)}`}
                          >
                            {offer.status}
                          </span>
                        </td>
                        <td className="border-b border-[#edf1f6] px-6 py-5">
                          <p className="text-[1.1rem] font-semibold text-[#17213d]">
                            {offer.usedCount}
                            {offer.usageLimit ? ` / ${offer.usageLimit}` : ""}
                          </p>
                        </td>
                        <td className="border-b border-[#edf1f6] px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingOfferId(offer.id);
                                setForm(offerToForm(offer));
                                setError(null);
                                setMessage(null);
                              }}
                              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dbe3ee] px-4 text-sm font-semibold text-[#17213d]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteOffer(offer)}
                              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#fff1f2] px-4 text-sm font-semibold text-[#be3a45]"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </DashboardPanel>
        </section>
      </div>
    </DashboardShell>
  );
}
