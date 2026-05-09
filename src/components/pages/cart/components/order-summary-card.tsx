import Link from "next/link";
import { formatPrice } from "./cart-shared";

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v6c0 4.4 2.9 8.4 7 9 4.1-.6 7-4.6 7-9V6l-7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.8-3.8" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17H5V6h11v11h-2" />
      <path d="M16 9h3l2 2v6h-2" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="17.5" cy="18" r="1.5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

export function OrderSummaryCard({
  subtotal,
  deliveryFee,
  tax,
  discount,
  isCheckingOut = false,
  onCheckout,
}: {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  isCheckingOut?: boolean;
  onCheckout?: () => void;
}) {
  const total = subtotal + deliveryFee + tax - discount;

  return (
    <section className="rounded-[24px] border border-[#e7edf3] bg-white p-6 shadow-sm">
      <h2 className="text-[2rem] font-semibold tracking-tight text-[#1b2440]">
        Order Summary
      </h2>

      <div className="mt-8 space-y-5 text-[1.1rem] text-[#5f708a]">
        <div className="flex items-center justify-between gap-4">
          <span>Subtotal</span>
          <span className="font-semibold text-[#1b2440]">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Delivery Fee</span>
          <span className="font-semibold text-[#1b2440]">{formatPrice(deliveryFee)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Tax (18%)</span>
          <span className="font-semibold text-[#1b2440]">{formatPrice(tax)}</span>
        </div>
        {discount > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <span>Discount</span>
            <span className="font-semibold text-[#4f7d49]">- {formatPrice(discount)}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-6 border-t border-[#e7edf3] pt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[1.3rem] font-semibold text-[#1b2440]">
            Estimated Total
          </span>
          <span className="text-[2.25rem] font-semibold tracking-tight text-[#4f7d49]">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={isCheckingOut}
        onClick={onCheckout}
        className="mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-[18px] bg-[#4f7d49] px-6 text-[1.05rem] font-semibold text-white shadow-[0_18px_32px_rgba(79,125,73,0.25)] transition-colors hover:bg-[#41693c]"
      >
        <span>{isCheckingOut ? "Placing Order..." : "Proceed to Checkout"}</span>
        <ArrowRightIcon />
      </Link>

      <div className="mt-6 space-y-3 text-sm text-[#7d8ea7]">
        <div className="flex items-center gap-2">
          <ShieldIcon />
          <span>Secure checkout by SSL Encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <TruckIcon />
          <span>Delivered in 24 - 48 hours</span>
        </div>
      </div>
    </section>
  );
}
