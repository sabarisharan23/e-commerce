"use client";

import Link from "next/link";

type GiftCardsPageProps = {
  description: string;
  title: string;
};

const giftCardOptions = [
  {
    amount: "Rs 500",
    note: "A thoughtful starter gift for healthy pantry shopping.",
  },
  {
    amount: "Rs 1,000",
    note: "A flexible option for millet mixes, flours, and everyday essentials.",
  },
  {
    amount: "Rs 2,500",
    note: "A fuller gift for families, festive gifting, or monthly pantry restocks.",
  },
] as const;

const howItWorks = [
  "Choose a gift value that matches your occasion or budget.",
  "Share the gift card with friends or family who shop at Theni Store.",
  "Recipients can use the value toward millet flours, mixes, and store essentials.",
  "For custom gifting help, contact the support team through the store support center.",
] as const;

const giftingIdeas = [
  {
    title: "Festive gifting",
    description:
      "A practical gift for families who enjoy healthier pantry staples during seasonal celebrations.",
  },
  {
    title: "Wellness gifting",
    description:
      "Useful for birthdays, thank-you gifts, and wellness-focused hampers built around food and nutrition.",
  },
  {
    title: "Flexible choice",
    description:
      "Recipients can pick the products they actually want instead of being limited to a fixed preselected bundle.",
  },
] as const;

export function GiftCardsPage({
  description,
  title,
}: GiftCardsPageProps) {
  return (
    <section className="bg-white text-[#1a2440]">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#7b8ea8]">
          <Link href="/" className="transition-colors hover:text-[#294b72]">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-[#4f7d49]">{title}</span>
        </nav>

        <div className="mt-8 rounded-[32px] border border-[#e8ece3] bg-[linear-gradient(135deg,#fbf7ec_0%,#f3faee_100%)] p-8 shadow-[0_18px_40px_rgba(18,37,61,0.08)] sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4f7d49]">
              Store Gifting
            </p>
            <h1 className="mt-3 text-[2.3rem] font-semibold tracking-tight text-[#17213d] sm:text-[3rem]">
              {title}
            </h1>
            <p className="mt-4 text-base leading-8 text-[#5f708a] sm:text-lg">
              {description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {giftCardOptions.map((option) => (
              <article
                key={option.amount}
                className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_10px_24px_rgba(18,37,61,0.05)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8e6a]">
                  Gift Value
                </p>
                <p className="mt-3 text-[1.9rem] font-semibold tracking-tight text-[#17213d]">
                  {option.amount}
                </p>
                <p className="mt-2 text-sm leading-7 text-[#5f708a]">
                  {option.note}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                How gift cards work
              </h2>
              <div className="mt-6 space-y-4">
                {howItWorks.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-[22px] border border-[#edf2ea] bg-[#fbfdf8] p-4"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4f7d49] text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-7 text-[#5f708a] sm:text-base">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                Why choose a gift card
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {giftingIdeas.map((idea) => (
                  <article
                    key={idea.title}
                    className="rounded-[22px] border border-[#edf2ea] bg-[#fbfdf8] p-5"
                  >
                    <h3 className="text-lg font-semibold text-[#1d2741]">{idea.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#5f708a]">
                      {idea.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-[#e8ece3] bg-[#fbfdf8] p-6 shadow-[0_14px_32px_rgba(18,37,61,0.06)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                Need gift support?
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5f708a] sm:text-base">
                Contact the support team if you want help choosing a value, planning bulk gifting,
                or checking store purchase options.
              </p>

              <div className="mt-6 grid gap-3">
                <Link
                  href="/info/contact-support"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#4f7d49] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#41693c]"
                >
                  Contact Support
                </Link>
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#d7dfd6] bg-white px-5 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
                >
                  Browse Products
                </Link>
              </div>
            </section>

            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                Gifting note
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5f708a] sm:text-base">
                This page describes Theni Store gift card options and gifting use cases. Final
                purchase or redemption flow can be coordinated through the support team when needed.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
