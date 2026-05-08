"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/shared/cart/cart-provider";
import { useWishlist } from "@/components/shared/wishlist/wishlist-provider";
import type {
  ProductDetails,
  ProductShowcaseSectionConfig,
} from "./product-showcase-types";

function EyeIcon() {
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
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
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

function CloseIcon() {
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
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
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

function ArrowLeftIcon() {
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
      <path d="M19 12H5" />
      <path d="m11 5-7 7 7 7" />
    </svg>
  );
}

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
            index < filledStars ? "fill-[#ff8a00]" : "fill-[#d3d7cf]"
          }`}
        >
          <path d="m10 1.6 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 6.8l5-.7L10 1.6Z" />
        </svg>
      ))}
    </div>
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

function getCartItem(product: ProductDetails) {
  return {
    id: product.id,
    name: product.name,
    imageSrc: product.imageSrc,
    price: product.price,
    href: getProductHref(product),
  };
}

function getProductHref(product: ProductDetails) {
  return product.href && product.href !== "#" ? product.href : `/products/${product.id}`;
}

function useCountdown(target?: string) {
  const targetTime = target ? new Date(target).getTime() : 0;

  const getRemainingTime = useCallback(() => {
    if (!targetTime) {
      return ["00", "00", "00"];
    }

    const diff = Math.max(targetTime - Date.now(), 0);
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds].map((value) => value.toString().padStart(2, "0"));
  }, [targetTime]);

  const [segments, setSegments] = useState<string[]>(["00", "00", "00"]);

  useEffect(() => {
    if (!targetTime) {
      return;
    }

    const timer = window.setInterval(() => {
      setSegments(getRemainingTime());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [getRemainingTime, targetTime]);

  return segments;
}

function getCardsPerView(width: number, section: ProductShowcaseSectionConfig) {
  const config = section.cardsPerView ?? {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  };

  if (width < 640) {
    return config.mobile;
  }

  if (width < 1024) {
    return config.tablet;
  }

  return config.desktop;
}

function chunkProducts(items: ProductDetails[], size: number) {
  const chunks: ProductDetails[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function QuickViewModal({
  product,
  onClose,
}: {
  product: ProductDetails;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const isWishlisted = hasItem(product.id);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dde3d9] bg-white text-[#1e261c] transition-colors hover:text-[#4f7d49]"
        >
          <CloseIcon />
        </button>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.05fr)]">
          <div className="relative min-h-[320px] overflow-hidden rounded-[24px] bg-[#f6f7f2]">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-contain p-8"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4f7d49]">
              {product.category}
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[#1b2440]">
              {product.name}
            </h3>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <StarRating rating={product.rating} />
              <span className="text-sm font-medium text-[#687065]">
                {product.stockStatus}
              </span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-3xl font-semibold text-[#1b2440]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice ? (
                <span className="text-xl text-[#8a9386] line-through">
                  {formatPrice(product.originalPrice, 2)}
                </span>
              ) : null}
            </div>
            <p className="mt-5 text-base leading-7 text-[#5f675c]">
              {product.description}
            </p>

            <dl className="mt-6 grid gap-4 text-sm text-[#445046] sm:grid-cols-3">
              <div className="rounded-2xl bg-[#f5f7f1] p-4">
                <dt className="font-semibold text-[#1b2440]">SKU</dt>
                <dd className="mt-1">{product.sku}</dd>
              </div>
              <div className="rounded-2xl bg-[#f5f7f1] p-4">
                <dt className="font-semibold text-[#1b2440]">Weight</dt>
                <dd className="mt-1">{product.weight}</dd>
              </div>
              <div className="rounded-2xl bg-[#f5f7f1] p-4">
                <dt className="font-semibold text-[#1b2440]">Category</dt>
                <dd className="mt-1">{product.category}</dd>
              </div>
            </dl>

            <ul className="mt-6 space-y-3 text-sm leading-6 text-[#445046]">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#4f7d49]" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => addItem(getCartItem(product))}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#4f7d49] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#41693c]"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() =>
                  toggleItem({
                    id: product.id,
                    name: product.name,
                    imageSrc: product.imageSrc,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    href: getProductHref(product),
                    category: product.category,
                  })
                }
                  className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors ${
                  isWishlisted
                    ? "bg-[#fff1f2] text-[#e23b3b]"
                    : "border border-[#dbe2e7] bg-white text-[#1b2440] hover:border-[#e23b3b] hover:text-[#e23b3b]"
                }`}
              >
                <HeartIcon filled={isWishlisted} />
                {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onQuickView,
}: {
  product: ProductDetails;
  onQuickView: (product: ProductDetails) => void;
}) {
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const isWishlisted = hasItem(product.id);

  return (
    <article className="group relative flex h-full flex-col rounded-[22px] border border-[#e0e7de] bg-white p-4 transition-all hover:border-[#a7c59c] hover:shadow-[0_16px_40px_rgba(43,73,35,0.08)] sm:p-5">
      {product.saleLabel ? (
        <span className="absolute left-4 top-4 z-10 rounded-md bg-[#f04b4b] px-3 py-2 text-sm font-semibold text-white">
          {product.saleLabel}
        </span>
      ) : null}

      <div className="absolute right-4 top-4 z-10 flex flex-col gap-3">
        <button
          type="button"
          aria-label={`${isWishlisted ? "Remove" : "Add"} ${product.name} ${
            isWishlisted ? "from" : "to"
          } wishlist`}
          title="Wishlist"
          onClick={() =>
            toggleItem({
              id: product.id,
              name: product.name,
              imageSrc: product.imageSrc,
              price: product.price,
              originalPrice: product.originalPrice,
              href: getProductHref(product),
              category: product.category,
            })
          }
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white transition-colors ${
            isWishlisted
              ? "border-[#e23b3b] bg-[#fff1f2] text-[#e23b3b]"
              : "border-[#dfe5dc] text-[#20321d] hover:border-[#e23b3b] hover:text-[#e23b3b]"
          }`}
        >
          <HeartIcon filled={isWishlisted} />
        </button>
        <button
          type="button"
          aria-label={`Quick view ${product.name}`}
          title="Quick view"
          onClick={() => onQuickView(product)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dfe5dc] bg-white text-[#20321d] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
        >
          <EyeIcon />
        </button>
      </div>

      <Link
        href={getProductHref(product)}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block min-h-[240px] overflow-hidden rounded-[18px] bg-[#f8f9f5]"
      >
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="mt-5 flex flex-1 flex-col">
        <Link
          href={getProductHref(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl font-medium leading-8 text-[#446a42]"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-1 text-sm leading-6 text-[#798173]">
          {product.shortDescription}
        </p>

        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[2rem] font-semibold leading-none text-[#11253d]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice ? (
                <span className="text-xl text-[#96a193] line-through">
                  {formatPrice(product.originalPrice, 2)}
                </span>
              ) : null}
            </div>
            <div className="mt-3">
              <StarRating rating={product.rating} />
            </div>
          </div>

          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addItem(getCartItem(product))}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e4ece0] text-[#4b7643] transition-colors hover:bg-[#4f7d49] hover:text-white"
          >
            <BagIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

function CarouselHeaderActions({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const isAtStart = currentPage === 0;
  const isAtEnd = currentPage === totalPages - 1;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Previous products"
        onClick={onPrevious}
        disabled={isAtStart}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d7dfd6] bg-white text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49] disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ArrowLeftIcon />
      </button>
      <button
        type="button"
        aria-label="Next products"
        onClick={onNext}
        disabled={isAtEnd}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d7dfd6] bg-white text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49] disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ArrowRightIcon />
      </button>
    </div>
  );
}

export function ProductShowcaseSection({
  section,
  products,
}: {
  section: ProductShowcaseSectionConfig;
  products: ProductDetails[];
}) {
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const countdown = useCountdown(section.countdownTarget);
  const isCarousel = section.layout === "carousel";
  const showHeader = section.showHeader ?? true;

  useEffect(() => {
    if (!isCarousel) {
      return;
    }

    const updateCardsPerView = () => {
      setCardsPerView(getCardsPerView(window.innerWidth, section));
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);

    return () => window.removeEventListener("resize", updateCardsPerView);
  }, [isCarousel, section]);

  const carouselPages = useMemo(
    () => (isCarousel ? chunkProducts(products, cardsPerView) : []),
    [cardsPerView, isCarousel, products],
  );

  const currentPage = isCarousel
    ? Math.min(activePage, Math.max(carouselPages.length - 1, 0))
    : 0;

  return (
    <>
      <section className={section.backgroundClassName ?? "bg-[#e8eef6]"}>
        <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {showHeader ? (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                {section.title ? (
                  <h2 className="text-[2.2rem] font-semibold tracking-tight text-[#1a2440]">
                    {section.title}
                  </h2>
                ) : null}

                {section.countdownLabel && section.countdownTarget ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6b7d8f]">
                      {section.countdownLabel}
                    </span>
                    <div className="flex items-center gap-2 text-white">
                      {countdown.map((value, index) => (
                        <div key={`${value}-${index}`} className="flex items-center gap-2">
                          <span className="inline-flex min-w-12 justify-center rounded-xl bg-[#456d3e] px-3 py-3 text-xl font-semibold leading-none">
                            {value}
                          </span>
                          {index < countdown.length - 1 ? (
                            <span className="text-xl font-semibold text-[#63788e]">:</span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {isCarousel ? (
                <CarouselHeaderActions
                  currentPage={currentPage}
                  totalPages={Math.max(carouselPages.length, 1)}
                  onPrevious={() => setActivePage((page) => Math.max(page - 1, 0))}
                  onNext={() =>
                    setActivePage((page) =>
                      Math.min(page + 1, Math.max(carouselPages.length - 1, 0)),
                    )
                  }
                />
              ) : section.viewAllLabel && section.viewAllHref ? (
                <a
                  href={section.viewAllHref}
                  className="inline-flex items-center gap-2 self-start text-xl font-semibold text-[#4f7d49] transition-colors hover:text-[#41693c] lg:self-auto"
                >
                  <span>{section.viewAllLabel}</span>
                  <ArrowRightIcon />
                </a>
              ) : null}
            </div>
          ) : null}

          {isCarousel ? (
            <div className={`${showHeader ? "mt-8" : ""} overflow-hidden`}>
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentPage * 100}%)` }}
              >
                {carouselPages.map((page, pageIndex) => (
                  <div key={pageIndex} className="min-w-full">
                    <div
                      className={`grid gap-5 ${
                        cardsPerView === 1
                          ? "grid-cols-1"
                          : cardsPerView === 2
                            ? "grid-cols-2"
                            : "grid-cols-4"
                      }`}
                    >
                      {page.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onQuickView={setSelectedProduct}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`${showHeader ? "mt-8 " : ""}grid gap-5 sm:grid-cols-2 xl:grid-cols-4`}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProduct ? (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      ) : null}
    </>
  );
}
