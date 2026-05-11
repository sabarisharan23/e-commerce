"use client";

import Link from "next/link";

type ShippingInfoPageProps = {
  description: string;
  title: string;
};

const shippingHighlights = [
  {
    title: "Standard delivery",
    description:
      "Orders are shipped with standard delivery handling for pantry and daily-use products.",
  },
  {
    title: "Free delivery threshold",
    description:
      "The cart shows when your order qualifies for free delivery based on the current subtotal threshold.",
  },
  {
    title: "Order tracking support",
    description:
      "Use your order code on the tracking page to follow the latest delivery progress after checkout.",
  },
] as const;

const deliveryAreas = [
  {
    area: "Theni Main",
    note: "Core nearby service area with faster everyday coverage.",
    timeline: "24 Hours",
  },
  {
    area: "Andipatti",
    note: "Regional delivery zone with slightly extended handling time.",
    timeline: "48 Hours",
  },
  {
    area: "Extended service locations",
    note: "Delivery timing can vary depending on courier reach and order mix.",
    timeline: "2 to 5 Days",
  },
] as const;

const shippingSteps = [
  "Place your order and complete checkout with delivery details.",
  "The store confirms payment, stock, and packing requirements.",
  "Your order moves into preparation, shipment, and dispatch.",
  "Use the order tracking page to check progress until delivery is completed.",
] as const;

const shippingNotes = [
  {
    title: "Packed for pantry safety",
    description:
      "Millet flours, health mixes, and similar pantry products are packed to help protect freshness during transit.",
  },
  {
    title: "Timelines can vary",
    description:
      "Delivery can shift based on address, order volume, product mix, holidays, or courier availability.",
  },
  {
    title: "Need help with a shipment?",
    description:
      "If your order is delayed or arrives with an issue, use the support page and include your order code for faster help.",
  },
] as const;

export function ShippingInfoPage({
  description,
  title,
}: ShippingInfoPageProps) {
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
              Delivery Information
            </p>
            <h1 className="mt-3 text-[2.3rem] font-semibold tracking-tight text-[#17213d] sm:text-[3rem]">
              {title}
            </h1>
            <p className="mt-4 text-base leading-8 text-[#5f708a] sm:text-lg">
              {description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {shippingHighlights.map((highlight) => (
              <article
                key={highlight.title}
                className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_10px_24px_rgba(18,37,61,0.05)]"
              >
                <h2 className="text-lg font-semibold text-[#17213d]">{highlight.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[#5f708a]">
                  {highlight.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                Delivery areas and timelines
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {deliveryAreas.map((area) => (
                  <article
                    key={area.area}
                    className="rounded-[22px] border border-[#edf2ea] bg-[#fbfdf8] p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8e6a]">
                      Delivery Area
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#1d2741]">{area.area}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5f708a]">{area.note}</p>
                    <p className="mt-4 text-sm font-semibold text-[#3f713b]">{area.timeline}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                How shipping works
              </h2>
              <div className="mt-6 space-y-4">
                {shippingSteps.map((step, index) => (
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
                Shipping notes
              </h2>
              <div className="mt-6 space-y-4">
                {shippingNotes.map((note) => (
                  <article
                    key={note.title}
                    className="rounded-[22px] border border-[#edf2ea] bg-[#fbfdf8] p-4"
                  >
                    <h3 className="text-lg font-semibold text-[#1d2741]">{note.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#5f708a]">
                      {note.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-[#e8ece3] bg-[#fbfdf8] p-6 shadow-[0_14px_32px_rgba(18,37,61,0.06)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                Need delivery help?
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5f708a] sm:text-base">
                Use the tracking and support pages if you need shipment updates, address help, or
                assistance with a delayed order.
              </p>

              <div className="mt-6 grid gap-3">
                <Link
                  href="/info/order-tracking"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#4f7d49] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#41693c]"
                >
                  Track Your Order
                </Link>
                <Link
                  href="/info/contact-support"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#d7dfd6] bg-white px-5 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
                >
                  Contact Support
                </Link>
              </div>
            </section>

            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                Shipping note
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5f708a] sm:text-base">
                Delivery details can vary by location, order size, and product type. The most accurate
                status for an active order will always be available through the order tracking page.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
