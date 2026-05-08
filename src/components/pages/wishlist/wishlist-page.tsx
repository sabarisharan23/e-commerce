"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import type { ProductDetails } from "@/components/shared";
import {
  getMissingStoredProductIds,
  hydrateWishlistItems,
} from "@/components/shared/storefront-product-hydration";
import { useCart } from "@/components/shared/cart/cart-provider";
import { useWishlist } from "@/components/shared/wishlist/wishlist-provider";
import { EmptyWishlistState } from "./components/empty-wishlist-state";

function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 20-7-6.4a4.5 4.5 0 0 1 6.2-6.5L12 8l.8-.9a4.5 4.5 0 1 1 6.2 6.5L12 20Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9h12l-1.1 10.1a1 1 0 0 1-1 .9H8.1a1 1 0 0 1-1-.9L6 9Z" />
      <path d="M9 9V7a3 3 0 1 1 6 0v2" />
    </svg>
  );
}

function formatPrice(value: number, minimumFractionDigits = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(value);
}

type WishlistPageProps = {
  products: ProductDetails[];
};

export function WishlistPage({ products }: WishlistPageProps) {
  const { items, removeItem, removeItems, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const hydratedItems = useMemo(
    () => hydrateWishlistItems(items, products),
    [items, products],
  );
  const missingProductIds = useMemo(
    () => getMissingStoredProductIds(items, products),
    [items, products],
  );
  const count = hydratedItems.length;

  useEffect(() => {
    if (missingProductIds.length > 0) {
      removeItems(missingProductIds);
    }
  }, [missingProductIds, removeItems]);

  return (
    <div className="w-full bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-[#7b8ea8]"
        >
          <Link href="/" className="transition-colors hover:text-[#294b72]">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-[#4f7d49]">Wishlist</span>
        </nav>

        {hydratedItems.length === 0 ? (
          <EmptyWishlistState />
        ) : (
          <>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-[#15203d] sm:text-[3.2rem]">
                  Your Wishlist
                </h1>
                <p className="mt-2 text-base leading-7 text-[#67758e]">
                  {count} saved {count === 1 ? "item" : "items"} ready whenever you are.
                </p>
              </div>

              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#edf2e8] px-5 text-sm font-semibold text-[#24401f] transition-colors hover:bg-[#dfe8d7]"
              >
                Clear Wishlist
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {hydratedItems.map((item) => (
                <article
                  key={item.id}
                  className="group relative flex h-full flex-col rounded-[22px] border border-[#e0e7de] bg-white p-4 transition-all hover:border-[#a7c59c] hover:shadow-[0_16px_40px_rgba(43,73,35,0.08)] sm:p-5"
                >
                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from wishlist`}
                    onClick={() => removeItem(item.id)}
                    className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#4f7d49] bg-white text-[#4f7d49] transition-colors hover:bg-[#4f7d49] hover:text-white"
                  >
                    <HeartIcon />
                  </button>

                  <Link
                    href={item.href ?? "/products"}
                    className="relative block min-h-[240px] overflow-hidden rounded-[18px] bg-[#f8f9f5]"
                  >
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </Link>

                  <div className="mt-5 flex flex-1 flex-col">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6b7d8f]">
                      {item.category}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#4f7d49]">
                      {item.stockStatus}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-2 text-xl font-medium leading-8 text-[#446a42]"
                    >
                      {item.name}
                    </Link>

                    <div className="mt-4 flex items-end justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[2rem] font-semibold leading-none text-[#11253d]">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice ? (
                          <span className="text-xl text-[#96a193] line-through">
                            {formatPrice(item.originalPrice, 2)}
                          </span>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        aria-label={`Add ${item.name} to cart`}
                        onClick={() =>
                          addItem({
                            id: item.id,
                            name: item.name,
                            imageSrc: item.imageSrc,
                            price: item.price,
                            href: item.href,
                          })
                        }
                        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e4ece0] text-[#4b7643] transition-colors hover:bg-[#4f7d49] hover:text-white"
                      >
                        <BagIcon />
                      </button>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() =>
                          addItem({
                            id: item.id,
                            name: item.name,
                            imageSrc: item.imageSrc,
                            price: item.price,
                            href: item.href,
                          })
                        }
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#4f7d49] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#41693c]"
                      >
                        Move to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#dbe2e7] px-5 text-sm font-semibold text-[#1a2440] transition-colors hover:bg-[#f8fafc]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
