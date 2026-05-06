"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "@/components/shared";
import {
  farmBundleHeroProducts,
  farmBundleItems,
  farmBundleSection,
} from "./farm-bundle-data";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function CheckIcon({ checked }: { checked: boolean }) {
  return checked ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  ) : null;
}

export function FarmBundleSection() {
  const { addItem } = useCart();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    farmBundleItems
      .filter((item) => item.defaultSelected)
      .map((item) => item.id),
  );

  const selectedCount = selectedIds.length;

  const totalPrice = useMemo(
    () =>
      farmBundleItems
        .filter((item) => selectedIds.includes(item.id))
        .reduce((sum, item) => sum + item.price, 0),
    [selectedIds],
  );

  const toggleItem = (itemId: string) => {
    setSelectedIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  };

  return (
    <section className="bg-[#f7f8f3]">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_14px_40px_rgba(29,42,66,0.08)]">
          <div className="bg-[linear-gradient(90deg,#eda422_0%,#ffa13d_100%)] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)] lg:gap-10">
              <div className="max-w-xl text-white">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {farmBundleSection.title}
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/95 sm:text-[1.65rem] sm:leading-10">
                  {farmBundleSection.description}
                </p>
                <a
                  href={farmBundleSection.ctaHref}
                  className="mt-7 inline-flex h-14 items-center justify-center rounded-2xl bg-[#46713f] px-8 text-lg font-semibold text-white transition-colors hover:bg-[#3d6238] sm:min-w-[180px]"
                >
                  {farmBundleSection.ctaLabel}
                </a>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-5">
                {farmBundleHeroProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative aspect-[0.72] overflow-hidden rounded-[18px]"
                  >
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 33vw, 20vw"
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-[#dee5ee] bg-white">
            <div className="px-4 py-5 sm:px-6 lg:px-8">
              <h3 className="text-2xl font-semibold tracking-tight text-[#1b2440] sm:text-[2rem]">
                {farmBundleSection.bundleTitle}
              </h3>
            </div>

            <div className="divide-y divide-[#ebeff5]">
              {farmBundleItems.map((item) => {
                const checked = selectedIds.includes(item.id);

                return (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-4 px-4 py-4 sm:px-6 lg:px-8"
                  >
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl border border-[#d9e1ea] bg-white">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        fill
                        sizes="72px"
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-semibold text-[#263247] sm:text-[1.6rem]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[1.05rem] font-semibold text-[#3f6c3e] sm:text-[1.75rem]">
                        {formatPrice(item.price)}
                      </p>
                      <p className="mt-1 text-sm text-[#708198] sm:text-lg">
                        {item.packSize}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(item.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border transition-colors ${
                        checked
                          ? "border-[#46713f] bg-[#46713f]"
                          : "border-[#5f6470] bg-white"
                      }`}
                    >
                      <CheckIcon checked={checked} />
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="bg-[#eef3f8] px-4 py-5 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:items-center sm:justify-between lg:flex-row">
                <p className="text-sm font-medium text-[#647489] sm:text-base">
                  {selectedCount > 0
                    ? `${selectedCount} item${selectedCount > 1 ? "s" : ""} selected • ${formatPrice(totalPrice)}`
                    : "Select products to continue"}
                </p>
                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => {
                    farmBundleItems
                      .filter((item) => selectedIds.includes(item.id))
                      .forEach((item) =>
                        addItem({
                          id: item.id,
                          name: item.name,
                          imageSrc: item.imageSrc,
                          price: item.price,
                        }),
                      );
                  }}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#46713f] px-8 text-base font-semibold text-white transition-colors hover:bg-[#3d6238] disabled:cursor-not-allowed disabled:bg-[#9ab194] sm:min-w-[320px]"
                >
                  Add {selectedCount} Item{selectedCount === 1 ? "" : "s"} to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
