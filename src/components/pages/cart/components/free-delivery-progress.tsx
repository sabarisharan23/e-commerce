import { formatPrice } from "./cart-shared";

function TruckIcon() {
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
      <path d="M10 17H5V6h11v11h-2" />
      <path d="M16 9h3l2 2v6h-2" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="17.5" cy="18" r="1.5" />
    </svg>
  );
}

export function FreeDeliveryProgress({
  subtotal,
  threshold,
}: {
  subtotal: number;
  threshold: number;
}) {
  const remaining = Math.max(threshold - subtotal, 0);
  const progress = Math.min((subtotal / threshold) * 100, 100);

  return (
    <section className="rounded-[24px] border border-[#e7edf3] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-[#466c40]">
          <TruckIcon />
          <h2 className="text-[1.1rem] font-semibold text-[#1b2440]">
            Free Delivery Progress
          </h2>
        </div>
        <p className="text-lg font-semibold text-[#4f7d49]">
          {remaining > 0
            ? `${formatPrice(remaining)} more to go`
            : "Free delivery unlocked"}
        </p>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#e7edf4]">
        <div
          className="h-full rounded-full bg-[#4f7d49] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-4 text-base text-[#6d7d8d]">
        {remaining > 0
          ? `Add ${formatPrice(remaining)} more to your cart to enjoy free delivery on this order!`
          : "Your order now qualifies for free delivery."}
      </p>
    </section>
  );
}
