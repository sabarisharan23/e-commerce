"use client";

import Link from "next/link";

function HeartIcon() {
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
      <path d="m32 52-18.5-17A12 12 0 0 1 30.4 18L32 19.8l1.6-1.8A12 12 0 0 1 50.5 35L32 52Z" />
    </svg>
  );
}

export function EmptyWishlistState() {
  return (
    <section className="flex min-h-[56vh] items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <div className="mx-auto flex w-full max-w-[34rem] flex-col items-center text-center">
        <div className="flex h-[10.5rem] w-[10.5rem] items-center justify-center rounded-full bg-[#f3f5f7] sm:h-[13rem] sm:w-[13rem]">
          <div className="flex h-[8rem] w-[8rem] items-center justify-center rounded-full bg-[#dce5d8] text-[#4a7243] sm:h-[10rem] sm:w-[10rem]">
            <HeartIcon />
          </div>
        </div>

        <h2 className="mt-10 text-[2rem] font-semibold tracking-tight text-[#121c3a] sm:text-[2.6rem]">
          Your wishlist is empty
        </h2>

        <p className="mt-4 max-w-[31rem] text-base font-medium leading-8 text-[#68748b] sm:text-[1.15rem]">
          Save the products you love and come back to them anytime from your
          wishlist.
        </p>

        <Link
          href="/products"
          className="mt-9 inline-flex h-14 items-center justify-center rounded-2xl bg-[#4f7d49] px-8 text-base font-semibold text-white transition-colors hover:bg-[#41693c] sm:px-10"
        >
          Browse Products
        </Link>
      </div>
    </section>
  );
}
