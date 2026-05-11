"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { featuredCategories } from "./featured-categories-data";

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function getItemsPerPage(width: number) {
  if (width < 640) {
    return 2;
  }

  if (width < 1024) {
    return 3;
  }

  return 6;
}

function chunkCategories<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

const SWIPE_THRESHOLD = 50;

export function FeaturedCategoriesSection() {
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [activePage, setActivePage] = useState(0);
  const swipeStartXRef = useRef<number | null>(null);
  const swipeCurrentXRef = useRef<number | null>(null);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(getItemsPerPage(window.innerWidth));
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const pages = useMemo(
    () => chunkCategories(featuredCategories, itemsPerPage),
    [itemsPerPage],
  );
  const currentPage = Math.min(activePage, Math.max(pages.length - 1, 0));

  const showDots = itemsPerPage < 6 || featuredCategories.length > 6;
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
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-[#121938] sm:text-[2rem]">
            Featured Categories
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-base font-semibold text-[#4f7d49] transition-colors hover:text-[#41693c]"
          >
            <span>View All</span>
            <ArrowRightIcon />
          </Link>
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
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
                  {page.map((category) => (
                    <Link
                      key={category.id}
                      href={category.href}
                      className="group flex flex-col items-center text-center"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#f4f0ea] shadow-sm">
                        <Image
                          src={category.imageSrc}
                          alt={category.imageAlt}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-[#121938] sm:text-lg">
                        {category.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDots && pages.length > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-3">
            {pages.map((_, index) => {
              const isActive = index === currentPage;

              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to featured categories page ${index + 1}`}
                  aria-pressed={isActive}
                  onClick={() => setActivePage(index)}
                  className={`h-3.5 rounded-full transition-all ${
                    isActive
                      ? "w-8 bg-[#4f7d49]"
                      : "w-3.5 bg-[#d7ded3] hover:bg-[#b8c8b0]"
                  }`}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
