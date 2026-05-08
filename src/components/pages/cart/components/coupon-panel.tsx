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

export type AppliedCoupon = {
  code: string;
  discount: number;
};

type CouponValidationResponse =
  | {
      data: {
        code: string;
        discount: number;
        message: string;
      };
      success: true;
    }
  | {
      error: {
        message: string;
      };
      success: false;
    };

export function CouponPanel({
  subtotal,
  onCouponChange,
}: {
  subtotal: number;
  onCouponChange: (coupon: AppliedCoupon | null) => void;
}) {
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const applyCoupon = async () => {
    const trimmed = couponCode.trim().toUpperCase();

    if (!trimmed) {
      onCouponChange(null);
      setIsError(true);
      setMessage("Enter a valid coupon code.");
      return;
    }

    setIsApplying(true);
    setIsError(false);
    setMessage(null);

    try {
      const response = await fetch("/api/v1/offers/validate", {
        body: JSON.stringify({ code: trimmed, subtotal }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const body = (await response.json()) as CouponValidationResponse;

      if (!response.ok || !body.success) {
        throw new Error(
          body.success ? "Coupon could not be applied." : body.error.message,
        );
      }

      onCouponChange({
        code: body.data.code,
        discount: body.data.discount,
      });
      setIsError(false);
      setMessage(body.data.message);
    } catch (error) {
      onCouponChange(null);
      setIsError(true);
      setMessage(
        error instanceof Error ? error.message : "Coupon could not be applied.",
      );
    } finally {
      setIsApplying(false);
    }
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
          disabled={isApplying}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#4f7d49] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#41693c]"
        >
          {isApplying ? "Applying" : "Apply"}
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
