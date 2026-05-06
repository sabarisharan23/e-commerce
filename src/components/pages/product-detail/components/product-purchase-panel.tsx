"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/shared";
import { useWishlist } from "@/components/shared";
import type { ProductDetails } from "@/components/shared";
import type { ProductDetailContent } from "@/data/product-detail-content";

function StarRating({ rating }: { rating: number }) {
  const filledStars = Math.round(rating);

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${
            index < filledStars ? "fill-[#ffcc17]" : "fill-[#d3d7cf]"
          }`}
        >
          <path d="m10 1.6 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 6.8l5-.7L10 1.6Z" />
        </svg>
      ))}
    </div>
  );
}

function BagIcon() {
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
      <path d="M6 9h12l-1.1 10.1a1 1 0 0 1-1 .9H8.1a1 1 0 0 1-1-.9L6 9Z" />
      <path d="M9 9V7a3 3 0 1 1 6 0v2" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 20-7-6.4a4.5 4.5 0 0 1 6.2-6.5L12 8l.8-.9a4.5 4.5 0 1 1 6.2 6.5L12 20Z" />
    </svg>
  );
}

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

function ShieldIcon() {
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
      <path d="M12 3 5 6v6c0 4.4 2.9 8.4 7 9 4.1-.6 7-4.6 7-9V6l-7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.8-3.8" />
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

export function ProductPurchasePanel({
  product,
  content,
}: {
  product: ProductDetails;
  content: ProductDetailContent;
}) {
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const router = useRouter();
  const [selectedVariantId, setSelectedVariantId] = useState(
    content.variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant =
    content.variants.find((variant) => variant.id === selectedVariantId) ??
    content.variants[0];
  const isWishlisted = hasItem(product.id);

  const addToCart = () => {
    addItem(
      {
        id: `${product.id}-${selectedVariant.id}`,
        name: `${product.name} - ${selectedVariant.label}`,
        imageSrc: product.imageSrc,
        price: selectedVariant.price,
        href: `/products/${product.id}`,
      },
      quantity,
    );
  };

  return (
    <div className="space-y-5">
      <div className="inline-flex rounded-full bg-[#f4c91f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#2b2f13]">
        {content.badgeLabel}
      </div>

      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-[#1b2440] sm:text-[3.2rem]">
          {product.name}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <StarRating rating={product.rating} />
          <span className="text-sm font-medium text-[#7d8ea7]">
            {product.rating.toFixed(1)} ({content.ratingCount} reviews)
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-4xl font-semibold text-[#5ba060]">
          {formatPrice(selectedVariant.price)}
        </span>
        {selectedVariant.originalPrice ? (
          <span className="text-xl text-[#6c7581] line-through">
            {formatPrice(selectedVariant.originalPrice, 2)}
          </span>
        ) : null}

        <select
          value={selectedVariant.id}
          onChange={(event) => setSelectedVariantId(event.target.value)}
          className="ml-auto h-11 rounded-xl border border-[#dbe2e7] bg-white px-4 text-sm font-semibold text-[#1b2440] outline-none"
        >
          {content.variants.map((variant) => (
            <option key={variant.id} value={variant.id} className="text-black">
              {variant.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
        <p className="text-base leading-7 text-[#66727f]">{content.summary}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-[128px_minmax(0,1fr)]">
          <div className="flex h-12 items-center justify-between rounded-xl border border-[#e1e6de] px-4">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(value - 1, 1))}
              className="text-lg font-semibold text-[#5f6d5b]"
            >
              -
            </button>
            <span className="text-sm font-semibold text-[#1b2440]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => value + 1)}
              className="text-lg font-semibold text-[#5f6d5b]"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={addToCart}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4f7d49] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#41693c]"
          >
            <BagIcon />
            <span>Add to Cart</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            toggleItem({
              id: product.id,
              name: product.name,
              imageSrc: product.imageSrc,
              price: product.price,
              originalPrice: product.originalPrice,
              href: `/products/${product.id}`,
              category: product.category,
            })
          }
          className={`mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border px-6 text-sm font-semibold transition-colors ${
            isWishlisted
              ? "border-[#e23b3b] bg-[#fff1f2] text-[#e23b3b]"
              : "border-[#dbe2e7] bg-white text-[#1b2440] hover:border-[#e23b3b] hover:text-[#e23b3b]"
          }`}
        >
          <HeartIcon filled={isWishlisted} />
          <span>{isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            addToCart();
            router.push("/cart");
          }}
          className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#6f9967] bg-white px-6 text-sm font-semibold text-[#4f7d49] transition-colors hover:bg-[#f4f8f1]"
        >
          Buy Now
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-4 text-[#506243] shadow-sm">
          <TruckIcon />
          <span className="text-sm font-semibold">Free Delivery over ₹999</span>
        </div>
        <div className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-4 text-[#506243] shadow-sm">
          <ShieldIcon />
          <span className="text-sm font-semibold">Quality Guaranteed</span>
        </div>
      </div>
    </div>
  );
}
