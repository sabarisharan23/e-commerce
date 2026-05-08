"use client";

import { useState } from "react";
import { ProductShowcaseSection } from "@/components/shared";
import type { ConcernTabWithProducts } from "./shop-by-concern-data";

type ShopByConcernSectionProps = {
  tabs: ConcernTabWithProducts[];
};

export function ShopByConcernSection({ tabs }: ShopByConcernSectionProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "");
  const activeTab =
    tabs.find((tab) => tab.id === activeTabId) ??
    tabs[0];

  if (!activeTab) {
    return null;
  }

  return (
    <section className="bg-[#e8eef6]">
      <div className="w-full px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="flex flex-col gap-5">
          <h2 className="text-[2.2rem] font-semibold tracking-tight text-[#1a2440]">
            Shop By Concern
          </h2>
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="inline-flex min-w-max items-center gap-6 border-b border-[#d7dde8]">
              {tabs.map((tab) => {
                const active = tab.id === activeTab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    className={`border-b-2 px-1 pb-3 text-lg font-semibold transition-colors ${
                      active
                        ? "border-[#4f7d49] text-[#4f7d49]"
                        : "border-transparent text-[#6f83a0] hover:text-[#1a2440]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ProductShowcaseSection
        section={{
          title: "",
          layout: "carousel",
          backgroundClassName: "bg-[#e8eef6]",
          cardsPerView: { mobile: 1, tablet: 2, desktop: 4 },
          showHeader: true,
        }}
        products={activeTab.products}
      />
    </section>
  );
}
