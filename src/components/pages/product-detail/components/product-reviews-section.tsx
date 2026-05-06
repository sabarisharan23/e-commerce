"use client";

import { useState } from "react";
import type { ProductReview } from "@/data/product-detail-content";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${
            index < rating ? "fill-[#ff8a00]" : "fill-[#d3d7cf]"
          }`}
        >
          <path d="m10 1.6 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 6.8l5-.7L10 1.6Z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef2eb] text-sm font-semibold text-[#355a34]">
      {initials}
    </div>
  );
}

export function ProductReviewsSection({ reviews }: { reviews: ProductReview[] }) {
  const [visibleCount, setVisibleCount] = useState(3);
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <section className="border-t border-[#e5ebf0] pt-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[2rem] font-semibold tracking-tight text-[#15203d]">
          Customer Feedback
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {visibleReviews.map((review) => (
          <article key={review.id} className="rounded-[22px] bg-white px-5 py-5 shadow-sm sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <Avatar name={review.name} />
                <div>
                  <h3 className="text-base font-semibold text-[#1b2440]">{review.name}</h3>
                  <div className="mt-1">
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-[#9aa4b0]">{review.timestamp}</p>
            </div>
            <p className="mt-4 text-base leading-7 text-[#67727f]">{review.body}</p>
          </article>
        ))}
      </div>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + 2)}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[#5f8755] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#4f7d49]"
        >
          Load More
        </button>
      ) : null}
    </section>
  );
}
