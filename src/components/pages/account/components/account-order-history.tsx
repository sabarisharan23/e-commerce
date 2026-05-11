"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/shared";
import type { OrderHistoryRecord, OrderStatus } from "../account-data";

type OrderFilter = "all" | "in-progress" | "completed";

const ROWS_PER_PAGE = 4;

export type AccountOrderApiDto = {
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
  }>;
  orderNumber: string;
  status: string;
  total: number;
};

export type AccountOrdersResponse =
  | { data: AccountOrderApiDto[]; success: true }
  | { error: { message: string }; success: false };

type AccountOrderHistoryProps = {
  error?: string | null;
  isLoading?: boolean;
  orders?: AccountOrderApiDto[];
};

const filterOptions: Array<{ id: OrderFilter; label: string }> = [
  { id: "all", label: "All Orders" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CopyIcon() {
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
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function getStatusLabel(status: OrderStatus) {
  if (status === "in-progress") {
    return "In Progress";
  }

  if (status === "completed") {
    return "Completed";
  }

  return "Delivered";
}

function getStatusClassName(status: OrderStatus) {
  if (status === "in-progress") {
    return "bg-[#fff1c7] text-[#e08c00]";
  }

  return "bg-[#dff8e7] text-[#27a452]";
}

function getActionLabel(status: OrderStatus) {
  return status === "in-progress" ? "Track" : "Reorder";
}

function formatDateLabel(date: string) {
  const [month, dayWithComma, year] = date.split(" ");
  return (
    <>
      <span>{month}</span>
      <span>{dayWithComma}</span>
      <span>{year}</span>
    </>
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

function normalizeStatus(status: string): OrderStatus {
  if (status === "PLACED" || status === "PROCESSING") {
    return "in-progress";
  }

  if (status === "COMPLETED") {
    return "completed";
  }

  return "delivered";
}

function toOrderHistoryRecord(order: AccountOrderApiDto): OrderHistoryRecord {
  const firstItem = order.items[0];
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    date: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(order.createdAt)),
    id: order.orderNumber,
    itemMeta: `${itemCount} item${itemCount === 1 ? "" : "s"} total`,
    itemName: firstItem?.productName ?? "Order items",
    orderId: `#${order.orderNumber}`,
    status: normalizeStatus(order.status),
    total: formatPrice(order.total),
  };
}

function OrderHistoryTable({
  orders,
}: {
  orders: OrderHistoryRecord[];
}) {
  return (
    <>
      <div className="hidden lg:grid lg:grid-cols-[1.05fr_1fr_1.45fr_0.9fr_1fr_1.65fr] lg:gap-5 lg:px-6 lg:py-4">
        {["Order ID", "Date", "Items", "Total", "Status", "Actions"].map((heading) => (
          <p
            key={heading}
            className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aabc2]"
          >
            {heading}
          </p>
        ))}
      </div>

      <div className="divide-y divide-[#edf1f6]">
        {orders.map((order) => (
          <article
            key={order.id}
            className="grid gap-5 px-5 py-5 lg:grid-cols-[1.05fr_1fr_1.45fr_0.9fr_1fr_1.65fr] lg:items-center lg:gap-5 lg:px-6 lg:py-4"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aabc2] lg:hidden">
                Order ID
              </p>
              <p className="mt-2 text-base font-semibold text-[#1a2540] lg:mt-0">
                {order.orderId}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aabc2] lg:hidden">
                Date
              </p>
              <div className="mt-2 flex gap-1 text-sm font-medium text-[#55657e] lg:mt-0">
                {formatDateLabel(order.date)}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aabc2] lg:hidden">
                Items
              </p>
              <p className="mt-2 truncate text-base font-medium text-[#1f2c47] lg:mt-0">
                {order.itemName}
              </p>
              <p className="mt-1 text-xs font-medium text-[#98a5b9]">
                {order.itemMeta}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aabc2] lg:hidden">
                Total
              </p>
              <p className="mt-2 text-base font-semibold text-[#1a2540] lg:mt-0">
                {order.total}
              </p>
            </div>

            <div className="lg:justify-self-start">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aabc2] lg:hidden">
                Status
              </p>
              <span
                className={`mt-2 inline-flex min-w-[108px] items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold lg:mt-0 ${getStatusClassName(order.status)}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="lg:justify-self-end">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aabc2] lg:hidden">
                Actions
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row lg:mt-0 lg:items-center lg:justify-end">
                <button
                  type="button"
                  className="inline-flex h-10 min-w-[126px] items-center justify-center whitespace-nowrap rounded-xl border border-[#dbe3ee] px-4 text-sm font-semibold text-[#1f2c47] transition-colors hover:bg-[#f8fafc]"
                >
                  View Details
                </button>
                <button
                  type="button"
                  className={`inline-flex h-10 min-w-[112px] items-center justify-center whitespace-nowrap rounded-xl px-4 text-sm font-semibold transition-colors ${
                    order.status === "in-progress"
                      ? "border border-[#cad7c8] bg-[#eef4eb] text-[#487540] hover:bg-[#e5efdf]"
                      : "bg-[#487540] text-white hover:bg-[#3d6437]"
                  }`}
                >
                  {getActionLabel(order.status)}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function AccountOrderHistory({
  error: providedError,
  isLoading: providedIsLoading,
  orders: providedOrders,
}: AccountOrderHistoryProps = {}) {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedOrders, setFetchedOrders] = useState<OrderHistoryRecord[]>([]);
  const [fetchedIsLoading, setFetchedIsLoading] = useState(false);
  const [fetchedError, setFetchedError] = useState<string | null>(null);
  const [isReferDialogOpen, setIsReferDialogOpen] = useState(false);
  const providedRecords = useMemo(
    () => providedOrders?.map(toOrderHistoryRecord),
    [providedOrders],
  );
  const orders = providedRecords ?? fetchedOrders;
  const isLoading = providedRecords ? Boolean(providedIsLoading) : fetchedIsLoading;
  const error = providedRecords ? providedError ?? null : fetchedError;
  const referrerName = user?.name.trim() || "Theni Customer";
  const referralLink = useMemo(() => {
    const origin = typeof window === "undefined" ? "" : window.location.origin;
    const params = new URLSearchParams({ ref: referrerName });

    return `${origin}/?${params.toString()}`;
  }, [referrerName]);

  async function copyReferralLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  useEffect(() => {
    if (providedOrders) {
      return;
    }

    if (!user) {
      return;
    }

    let active = true;

    void (async () => {
      await Promise.resolve();

      if (!active) {
        return;
      }

      setFetchedIsLoading(true);
      setFetchedError(null);

      try {
        const response = await fetch(
          `/api/v1/orders?userAuthId=${encodeURIComponent(user.id)}`,
        );
        const body = (await response.json()) as AccountOrdersResponse;

        if (!response.ok || !body.success) {
          throw new Error(body.success ? "Could not load orders." : body.error.message);
        }

        if (active) {
          setFetchedOrders(body.data.map(toOrderHistoryRecord));
        }
      } catch (loadError) {
        if (active) {
          setFetchedError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load orders.",
          );
        }
      } finally {
        if (active) {
          setFetchedIsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [providedError, providedIsLoading, providedOrders, user]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") {
      return orders;
    }

    if (activeFilter === "completed") {
      return orders.filter(
        (order) => order.status === "completed" || order.status === "delivered",
      );
    }

    return orders.filter((order) => order.status === "in-progress");
  }, [activeFilter, orders]);

  const totalPages = Math.max(Math.ceil(filteredOrders.length / ROWS_PER_PAGE), 1);
  const safePage = Math.min(currentPage, totalPages);
  const visibleOrders = filteredOrders.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-tight text-[#1a2540] sm:text-[2.35rem]">
            Order History
          </h1>
          <p className="mt-2 text-sm leading-7 text-[#64738c] sm:text-base">
            Manage your organic purchases and track deliveries.
          </p>
        </div>

        <div className="inline-flex w-full rounded-2xl bg-[#eef2f7] p-1.5 xl:w-auto">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setActiveFilter(option.id);
                setCurrentPage(1);
              }}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors xl:flex-none xl:min-w-[110px] ${
                activeFilter === option.id
                  ? "bg-white text-[#1f2c47] shadow-[0_10px_22px_rgba(20,31,56,0.08)]"
                  : "text-[#6f7f98] hover:text-[#1f2c47]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-[#edf1f6] bg-white shadow-[0_20px_60px_rgba(20,31,56,0.06)]">
        {isLoading ? (
          <div className="px-6 py-12 text-center text-base font-semibold text-[#71829a]">
            Loading your orders...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-base font-semibold text-[#be3a45]">
            {error}
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-base font-semibold text-[#71829a]">
            No orders found for this account yet.
          </div>
        ) : (
          <OrderHistoryTable orders={visibleOrders} />
        )}

        <div className="flex flex-col gap-4 border-t border-[#edf1f6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm font-medium text-[#7b89a0]">
            Showing {(safePage - 1) * ROWS_PER_PAGE + 1} to{" "}
            {Math.min(safePage * ROWS_PER_PAGE, filteredOrders.length)} of{" "}
            {filteredOrders.length} results
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              aria-label="Previous page"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={safePage === 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e3e9f1] text-[#9aabc2] transition-colors hover:bg-[#f8fafc] disabled:opacity-50"
            >
              <ChevronIcon direction="left" />
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-2xl px-3 text-base font-semibold transition-colors ${
                  pageNumber === safePage
                    ? "bg-[#487540] text-white"
                    : "text-[#44546f] hover:bg-[#f3f6ef]"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              aria-label="Next page"
              onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
              disabled={safePage === totalPages}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e3e9f1] text-[#77859d] transition-colors hover:bg-[#f8fafc] disabled:opacity-50"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#f6b123,#ff8f1f)] px-6 py-8 text-white shadow-[0_24px_70px_rgba(255,145,31,0.22)] sm:px-8 sm:py-10">
        <div className="relative z-10 max-w-[34rem]">
          <h2 className="text-[2.1rem] font-semibold tracking-tight sm:text-[2.55rem]">
            Love your recent orders?
          </h2>
          <p className="mt-3 text-base leading-8 text-white/88 sm:text-lg">
            Earn 15% reward points on your next purchase when you refer a friend
            to Theni Stores.
          </p>
          <button
            type="button"
            onClick={() => {
              setCopyStatus("idle");
              setIsReferDialogOpen(true);
            }}
            className="mt-7 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-[#487540] transition-colors hover:bg-[#f6fbf2]"
          >
            Refer a Friend
          </button>
        </div>

        <div className="pointer-events-none absolute right-[-1.5rem] top-1/2 hidden -translate-y-1/2 text-white/20 sm:block">
          <svg
            aria-hidden="true"
            viewBox="0 0 180 180"
            className="h-40 w-40 fill-none stroke-current"
            strokeWidth="6"
          >
            <path d="M89 24c26 0 47 21 47 47 0 34-47 85-47 85S42 105 42 71c0-26 21-47 47-47Z" />
            <path d="M90 43c15 0 28 13 28 28 0 20-28 49-28 49S62 91 62 71c0-15 13-28 28-28Z" />
          </svg>
        </div>
      </section>

      {isReferDialogOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="refer-dialog-title"
        >
          <button
            type="button"
            aria-label="Close referral popup"
            className="absolute inset-0"
            onClick={() => setIsReferDialogOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#edf1f6] px-6 py-5 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f19a24]">
                  Refer a Friend
                </p>
                <h3
                  id="refer-dialog-title"
                  className="mt-2 text-2xl font-semibold tracking-tight text-[#1a2540]"
                >
                  Share your Theni Stores link
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close referral popup"
                onClick={() => setIsReferDialogOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e3e9f1] text-[#617089] transition-colors hover:bg-[#f8fafc]"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6 sm:px-7">
              <p className="text-base leading-7 text-[#617089]">
                Send this referral link to a friend. It includes your name,
                <span className="font-semibold text-[#1f2c47]"> {referrerName}</span>,
                so we can credit your reward points after their first order.
              </p>

              <div>
                <label
                  htmlFor="referral-link"
                  className="text-sm font-semibold text-[#1f2c47]"
                >
                  Your referral link
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="referral-link"
                    readOnly
                    value={referralLink}
                    className="min-h-12 min-w-0 flex-1 rounded-2xl border border-[#dbe3ee] bg-[#f8fafc] px-4 text-sm font-semibold text-[#1f2c47] outline-none focus:border-[#487540]"
                    onFocus={(event) => event.currentTarget.select()}
                  />
                  <button
                    type="button"
                    onClick={copyReferralLink}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#487540] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3d6437]"
                  >
                    <CopyIcon />
                    {copyStatus === "copied" ? "Copied" : "Copy Link"}
                  </button>
                </div>
                {copyStatus === "failed" ? (
                  <p className="mt-2 text-sm font-medium text-[#be3a45]">
                    Could not copy automatically. Select the link above and copy it.
                  </p>
                ) : null}
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Shop at Theni Stores with ${referrerName}: ${referralLink}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[#dbe3ee] px-5 text-sm font-semibold text-[#1f2c47] transition-colors hover:bg-[#f8fafc]"
              >
                Share on WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
