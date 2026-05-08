"use client";

import Image from "next/image";
import type { HydratedCartItem } from "@/components/shared/storefront-product-hydration";
import { formatPrice, getPackLabel } from "./cart-shared";

function TrashIcon() {
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
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="inline-flex h-10 items-center overflow-hidden rounded-xl border border-[#d9e2ea] bg-white">
      <button
        type="button"
        onClick={onDecrease}
        className="inline-flex h-full w-12 items-center justify-center text-lg font-semibold text-[#1b2440]"
      >
        -
      </button>
      <span className="inline-flex min-w-10 items-center justify-center text-base font-semibold text-[#1b2440]">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className="inline-flex h-full w-12 items-center justify-center text-lg font-semibold text-[#1b2440]"
      >
        +
      </button>
    </div>
  );
}

export function CartItemsTable({
  items,
  updateQuantity,
  removeItem,
}: {
  items: HydratedCartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#e7edf3] bg-white shadow-sm">
      <div className="hidden grid-cols-[minmax(0,1.5fr)_140px_170px_140px_48px] gap-4 border-b border-[#e7edf3] bg-[#f8fafc] px-6 py-5 text-[1.02rem] font-semibold uppercase tracking-[0.08em] text-[#1b2440] md:grid">
        <span>Product</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Total</span>
        <span />
      </div>

      <div className="divide-y divide-[#e7edf3]">
        {items.map((item) => (
          <article
            key={item.id}
            className="grid gap-5 px-5 py-5 md:grid-cols-[minmax(0,1.5fr)_140px_170px_140px_48px] md:items-center md:px-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[14px] border border-[#dfe5ec] bg-white sm:h-20 sm:w-20">
                <Image
                  src={item.imageSrc}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
              </div>
              <div className="min-w-0">
                <h2 className="line-clamp-1 text-[1.2rem] font-semibold text-[#1b2440]">
                  {item.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-[#7d8ea7]">
                  {item.weight ? `${item.weight} Pack` : getPackLabel(item.name)}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#4f7d49]">
                  {item.stockStatus}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 md:block">
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#7d8ea7] md:hidden">
                Price
              </span>
              <span className="text-[1.1rem] font-semibold text-[#5f708a]">
                {formatPrice(item.price)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 md:block">
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#7d8ea7] md:hidden">
                Quantity
              </span>
              <QuantityControl
                quantity={item.quantity}
                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 md:block">
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#7d8ea7] md:hidden">
                Total
              </span>
              <span className="text-[1.2rem] font-semibold text-[#1b2440]">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>

            <div className="flex justify-end md:justify-start">
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#93a4bd] transition-colors hover:bg-[#f2f5f8] hover:text-[#b44d4d]"
              >
                <TrashIcon />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
