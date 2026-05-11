"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  feedbackCategories,
  feedbackItems,
} from "./customer-feedback-data";

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
      aria-label={direction === "left" ? "Previous feedback" : "Next feedback"}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d7dfd6] bg-white text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49] disabled:cursor-not-allowed disabled:opacity-45"
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

function getCardsPerPage(width: number) {
  return width < 1024 ? 1 : 2;
}

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

const SWIPE_THRESHOLD = 50;

export function CustomerFeedbackSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cardsPerPage, setCardsPerPage] = useState(2);
  const [activePage, setActivePage] = useState(0);
  const swipeStartXRef = useRef<number | null>(null);
  const swipeCurrentXRef = useRef<number | null>(null);

  useEffect(() => {
    const updateCardsPerPage = () => {
      setCardsPerPage(getCardsPerPage(window.innerWidth));
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);

    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const filteredItems = useMemo(
    () =>
      activeCategory === "All"
        ? feedbackItems
        : feedbackItems.filter((item) => item.category === activeCategory),
    [activeCategory],
  );
  const pages = useMemo(
    () => chunkItems(filteredItems, cardsPerPage),
    [cardsPerPage, filteredItems],
  );
  const currentPage = Math.min(activePage, Math.max(pages.length - 1, 0));

  const showPreviousPage = () => {
    setActivePage((page) => Math.max(page - 1, 0));
  };

  const showNextPage = () => {
    setActivePage((page) => Math.min(page + 1, Math.max(pages.length - 1, 0)));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    swipeStartXRef.current = event.clientX;
    swipeCurrentXRef.current = event.clientX;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (swipeStartXRef.current === null) {
      return;
    }

    swipeCurrentXRef.current = event.clientX;
  };

  const handlePointerEnd = () => {
    if (swipeStartXRef.current === null || swipeCurrentXRef.current === null) {
      swipeStartXRef.current = null;
      swipeCurrentXRef.current = null;
      return;
    }

    const swipeDistance = swipeStartXRef.current - swipeCurrentXRef.current;

    if (Math.abs(swipeDistance) >= SWIPE_THRESHOLD) {
      if (swipeDistance > 0) {
        showNextPage();
      } else {
        showPreviousPage();
      }
    }

    swipeStartXRef.current = null;
    swipeCurrentXRef.current = null;
  };

  return (
    <section className="bg-white">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[2.2rem] font-semibold tracking-tight text-[#1a2440]">
            Customer Feedback
          </h2>
          <div className="flex items-center gap-3">
            <ArrowButton
              direction="left"
              onClick={showPreviousPage}
              disabled={currentPage === 0}
            />
            <ArrowButton
              direction="right"
              onClick={showNextPage}
              disabled={currentPage === pages.length - 1}
            />
          </div>
        </div>

        <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex min-w-max items-center gap-8 border-b border-[#d8dee8]">
            {feedbackCategories.map((category) => {
              const active = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setActivePage(0);
                  }}
                  className={`border-b-2 px-1 pb-3 text-lg font-semibold transition-colors ${
                    active
                      ? "border-[#4f7d49] text-[#4f7d49]"
                      : "border-transparent text-[#5f6f87] hover:text-[#1a2440]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="mt-8 overflow-hidden touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onPointerLeave={handlePointerEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((page, pageIndex) => (
              <div key={pageIndex} className="min-w-full">
                <div
                  className={`grid gap-4 ${
                    cardsPerPage === 1 ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {page.map((item) => (
                    <article
                      key={item.id}
                      className="grid gap-6 rounded-[24px] border border-[#dce5dc] bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_210px]"
                    >
                      <div>
                        <h3 className="text-2xl font-medium text-[#4f7d49]">
                          {item.title}
                        </h3>
                        <p className="mt-5 text-lg leading-9 text-[#1d2225] sm:text-[1.15rem]">
                          “{item.quote}”
                        </p>
                        <p className="mt-8 text-2xl font-semibold text-[#111]">
                          • {item.author}
                        </p>
                      </div>
                      <div className="relative min-h-[200px] overflow-hidden rounded-[24px] border border-[#dce5dc] bg-[#fafcf9]">
                        <Image
                          src={item.productImageSrc}
                          alt={item.productImageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 220px"
                          className="object-contain p-6"
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
