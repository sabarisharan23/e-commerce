"use client";

import Link from "next/link";

function CartBagIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="h-16 w-16 stroke-current sm:h-20 sm:w-20"
      fill="none"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 27h24a4 4 0 0 1 3.9 4.9l-4.7 19a5 5 0 0 1-4.8 3.8H25.6a5 5 0 0 1-4.8-3.8l-4.7-19A4 4 0 0 1 20 27Z" />
      <path d="M24.5 27V20a7.5 7.5 0 0 1 15 0v7" />
      <path d="M24.5 34.5v2.5" />
      <path d="M39.5 34.5v2.5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function EmptyCartState() {
  return (
    <section className="flex min-h-[58vh] items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <div className="mx-auto flex w-full max-w-[34rem] flex-col items-center text-center">
        <div className="flex h-[10.5rem] w-[10.5rem] items-center justify-center rounded-full bg-[#f3f5f7] sm:h-[13rem] sm:w-[13rem]">
          <div className="flex h-[8rem] w-[8rem] items-center justify-center rounded-full bg-[#dce5d8] text-[#4a7243] sm:h-[10rem] sm:w-[10rem]">
            <CartBagIcon />
          </div>
        </div>

        <h2 className="mt-10 text-[2rem] font-semibold tracking-tight text-[#121c3a] sm:text-[2.6rem]">
          Your cart is empty
        </h2>

        <p className="mt-4 max-w-[31rem] text-base font-medium leading-8 text-[#68748b] sm:text-[1.15rem]">
          Looks like you haven&apos;t added anything to your cart yet. Explore our
          fresh collection of organic products.
        </p>

        <Link
          href="/products"
          className="mt-9 inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#4f7d49] px-8 text-base font-semibold text-white transition-colors hover:bg-[#41693c] sm:px-10"
        >
          <span>Browse Products</span>
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}
