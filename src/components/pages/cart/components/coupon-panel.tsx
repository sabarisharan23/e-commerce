"use client";

import { useState } from "react";

function TicketIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9Z" />
      <path d="M9 7v10" />
      <path d="M15 7v10" />
    </svg>
  );
}

const COUPONS: Record<string, { type: "percent" | "flat"; value: number }> = {
  THENI10: { type: "percent", value: 10 },
  SAVE100: { type: "flat", value: 100 },
};

export function getCouponDiscount(code: string, subtotal: number) {
  const coupon = COUPONS[code.toUpperCase()];

  if (!coupon) {
    return 0;
  }

  if (coupon.type === "percent") {
    return Math.round((subtotal * coupon.value) / 100);
  }

  return Math.min(coupon.value, subtotal);
}

export function CouponPanel({
  subtotal,
  onDiscountChange,
}: {
  subtotal: number;
  onDiscountChange: (discount: number) => void;
}) {
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const applyCoupon = () => {
    const trimmed = couponCode.trim().toUpperCase();
    const discount = getCouponDiscount(trimmed, subtotal);

    if (!trimmed || discount === 0) {
      onDiscountChange(0);
      setIsError(true);
      setMessage("Enter a valid coupon code.");
      return;
    }

    onDiscountChange(discount);
    setIsError(false);
    setMessage(`${trimmed} applied successfully.`);
  };

  return (
    <section className="rounded-[24px] border border-[#e7edf3] bg-white p-6 shadow-sm">
      <h2 className="text-[1.9rem] font-semibold tracking-tight text-[#1b2440]">
        Apply Coupon
      </h2>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl bg-[#eef4fb] px-4 text-[#7d8ea7]">
          <TicketIcon />
          <input
            type="text"
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder="Enter coupon code"
            className="w-full border-none bg-transparent text-base text-[#25314a] outline-none placeholder:text-[#72819a]"
          />
        </label>
        <button
          type="button"
          onClick={applyCoupon}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#4f7d49] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#41693c]"
        >
          Apply
        </button>
      </div>

      {message ? (
        <p
          className={`mt-4 text-sm font-medium ${
            isError ? "text-[#b44d4d]" : "text-[#4f7d49]"
          }`}
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
