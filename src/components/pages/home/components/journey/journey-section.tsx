"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/shared";
import type { JourneyItem } from "./journey-data";

function ExternalIcon() {
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
      <path d="M14 5h5v5" />
      <path d="M10 14 19 5" />
      <path d="M19 14v5h-5" />
      <path d="M5 10v9h9" />
    </svg>
  );
}

function CartIcon() {
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

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "left" ? "Previous stories" : "Next stories"}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#456d3e] text-white transition-colors hover:bg-[#3a5d35] disabled:cursor-not-allowed disabled:opacity-40"
    >
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
        {direction === "left" ? (
          <>
            <path d="M19 12H5" />
            <path d="m11 5-7 7 7 7" />
          </>
        ) : (
          <>
            <path d="M5 12h14" />
            <path d="m13 5 7 7-7 7" />
          </>
        )}
      </svg>
    </button>
  );
}

function getCardsPerView(width: number) {
  if (width < 640) {
    return 1;
  }

  if (width < 1024) {
    return 2;
  }

  return 4;
}

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type JourneySectionProps = {
  items: JourneyItem[];
};

export function JourneySection({ items }: JourneySectionProps) {
  const { addItem } = useCart();
  const [activePage, setActivePage] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  useEffect(() => {
    const updateCardsPerView = () => {
      setCardsPerView(getCardsPerView(window.innerWidth));
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);

    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const pages = useMemo(
    () => chunkItems(items, cardsPerView),
    [items, cardsPerView],
  );

  const currentPage = Math.min(activePage, Math.max(pages.length - 1, 0));
  const selectedStory =
    items.find((item) => item.id === selectedStoryId) ?? null;

  return (
    <>
      <section className="relative overflow-hidden bg-[#f7f0db]">
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-[radial-gradient(circle_at_left,_rgba(226,178,83,0.4),transparent_58%)] lg:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-[radial-gradient(circle_at_right,_rgba(226,178,83,0.4),transparent_58%)] lg:block" />

        <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-[#3f6f3f] sm:text-4xl lg:flex-1 lg:text-[3.2rem]">
              See the Journey of Your Food
            </h2>
            <div className="hidden items-center gap-3 lg:flex">
              <ArrowButton
                direction="left"
                onClick={() => setActivePage((page) => Math.max(page - 1, 0))}
                disabled={currentPage === 0}
              />
              <ArrowButton
                direction="right"
                onClick={() =>
                  setActivePage((page) =>
                    Math.min(page + 1, Math.max(pages.length - 1, 0)),
                  )
                }
                disabled={currentPage === pages.length - 1}
              />
            </div>
          </div>

          <div className="mt-8 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {pages.map((page, pageIndex) => (
                <div key={pageIndex} className="min-w-full">
                  <div
                    className={`grid gap-4 ${
                      cardsPerView === 1
                        ? "grid-cols-1"
                        : cardsPerView === 2
                          ? "grid-cols-2"
                          : "grid-cols-4"
                    }`}
                  >
                    {page.map((item) => (
                      <article
                        key={item.id}
                        className="overflow-hidden rounded-[22px] border border-[#d9e1da] bg-white shadow-sm"
                      >
                        <div className="relative aspect-[0.74] overflow-hidden">
                          <Image
                            src={item.mediaSrc}
                            alt={item.mediaAlt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                          />
                        </div>

                        <div className="border-t border-[#e6ebea] p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#d9e1ea] bg-white">
                              <Image
                                src={item.productImageSrc}
                                alt={item.productImageAlt}
                                fill
                                sizes="56px"
                                className="object-contain p-2"
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="truncate text-lg font-semibold text-[#263247]">
                                {item.productName}
                              </h3>
                              <p className="mt-1 text-[1.7rem] font-semibold leading-none text-[#3f6c3e]">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                addItem({
                                  id: item.productId,
                                  name: item.productName,
                                  imageSrc: item.productImageSrc,
                                  price: item.price,
                                  href: item.productHref,
                                })
                              }
                              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#46713f] px-4 text-lg font-semibold text-white transition-colors hover:bg-[#3d6238]"
                            >
                              <CartIcon />
                              <span>Add to Cart</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedStoryId(item.id)}
                              className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf2e8] text-[#466c40] transition-colors hover:bg-[#dde8d7]"
                            >
                              <ExternalIcon />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
            {pages.map((_, index) => {
              const active = index === currentPage;

              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to journey page ${index + 1}`}
                  onClick={() => setActivePage(index)}
                  className={`h-3.5 rounded-full transition-all ${
                    active ? "w-8 bg-[#456d3e]" : "w-3.5 bg-[#d9c89b]"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {selectedStory ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <button
            type="button"
            aria-label="Close story preview"
            className="absolute inset-0"
            onClick={() => setSelectedStoryId(null)}
          />
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[320px]">
                <Image
                  src={selectedStory.mediaSrc}
                  alt={selectedStory.mediaAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-3xl font-semibold tracking-tight text-[#1b2440]">
                  {selectedStory.title}
                </h3>
                <p className="mt-5 text-base leading-7 text-[#5f675c]">
                  {selectedStory.story}
                </p>
                <div className="mt-6 rounded-2xl bg-[#f5f7f1] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7d49]">
                    Featured Product
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[#1b2440]">
                    {selectedStory.productName}
                  </p>
                </div>
                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: selectedStory.productId,
                        name: selectedStory.productName,
                        imageSrc: selectedStory.productImageSrc,
                        price: selectedStory.price,
                        href: selectedStory.productHref,
                      })
                    }
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#46713f] px-6 text-sm font-semibold text-white"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStoryId(null)}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#edf2e8] px-6 text-sm font-semibold text-[#24401f]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
