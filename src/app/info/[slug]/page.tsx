import Link from "next/link";
import { notFound } from "next/navigation";
import { BecomeSellerPage } from "@/components/pages/info/become-seller-page";
import { ContactSupportPage } from "@/components/pages/info/contact-support-page";
import { GiftCardsPage } from "@/components/pages/info/gift-cards-page";
import { OrderTrackingPage } from "@/components/pages/info/order-tracking-page";
import { ShippingInfoPage } from "@/components/pages/info/shipping-info-page";

const infoPages = {
  advertise: {
    title: "Advertise With Theni Store",
    description:
      "Partner with Theni Store to showcase healthy pantry products, seasonal campaigns, and local wellness stories.",
  },
  "become-a-seller": {
    title: "Become a Seller",
    description:
      "Join our marketplace to reach customers looking for wholesome ingredients, millet products, and natural food essentials.",
  },
  "contact-support": {
    title: "Contact Support",
    description:
      "Need help with an order, account, or delivery? Reach us by phone at 1-800-ORGANIC or email support@theni.store.",
  },
  faqs: {
    title: "Frequently Asked Questions",
    description:
      "Find quick answers about ordering, shipping, delivery timelines, and pantry product availability.",
  },
  "gift-cards": {
    title: "Gift Cards",
    description:
      "Share healthy pantry favorites with friends and family through Theni Store gift options.",
  },
  "order-tracking": {
    title: "Order Tracking",
    description:
      "Track your recent deliveries from your account dashboard and review shipment updates for active orders.",
  },
  "our-team": {
    title: "Our Team",
    description:
      "Meet the people behind Theni Store who curate products, support customers, and keep daily operations running smoothly.",
  },
  "premium-membership": {
    title: "Premium Membership",
    description:
      "Premium members enjoy free-delivery perks, cashback rewards, and faster access to curated wellness collections.",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "Learn how Theni Store handles account details, order information, delivery contacts, and support communication.",
  },
  "return-policy": {
    title: "Return Policy",
    description:
      "Review our return and refund guidelines for pantry staples, fresh mixes, and packaged wellness products.",
  },
  "shipping-info": {
    title: "Shipping Information",
    description:
      "Learn about delivery zones, estimated shipping timelines, and how we handle fresh and packaged items.",
  },
  "terms-of-service": {
    title: "Terms of Service",
    description:
      "Read the store policies, account terms, and shopping conditions for using Theni Store.",
  },
  "about-us": {
    title: "About Theni Store",
    description:
      "Theni Store brings together millet flours, mixes, and natural pantry staples chosen for everyday healthy cooking.",
  },
} as const;

type InfoSlug = keyof typeof infoPages;

const faqGroups = [
  {
    title: "Products & Nutrition",
    description: "Millet flours, health mixes, drink mixes, and everyday pantry use.",
    faqs: [
      {
        question: "What kind of products does Theni Store sell?",
        answer:
          "Theni Store focuses on millet flours, health mixes, drink mixes, dosa mixes, diabetic-friendly mixes, protein mixes, and natural pantry ingredients for daily cooking.",
      },
      {
        question: "How do I know which millet mix is right for me?",
        answer:
          "Use the product detail page to compare ingredients, key benefits, health benefits, weight options, and usage notes. If you are buying for a specific dietary need, check the ingredients carefully and speak with your healthcare professional when needed.",
      },
      {
        question: "Are the health benefits medical claims?",
        answer:
          "No. The benefits describe common nutritional qualities of ingredients such as millet, chia seeds, and natural mixes. They are for general wellness guidance and should not replace medical advice.",
      },
      {
        question: "How should I store millet flour and health mixes?",
        answer:
          "Keep packs sealed in a cool, dry place away from moisture. After opening, close the pack tightly after every use to help preserve freshness.",
      },
    ],
  },
  {
    title: "Orders & Delivery",
    description: "Checkout, delivery fees, tracking, and order history.",
    faqs: [
      {
        question: "How do I place an order?",
        answer:
          "Add products to your cart, review quantities and coupons, then continue to checkout. You can enter your shipping details and choose a payment method before placing the order.",
      },
      {
        question: "Where can I track my order?",
        answer:
          "Signed-in customers can view recent orders from the account page. The order history section shows order ID, date, items, status, and actions such as tracking in-progress orders.",
      },
      {
        question: "When do I get free delivery?",
        answer:
          "The cart page shows your free-delivery progress. When your subtotal reaches the free-delivery threshold shown there, the standard delivery fee is removed.",
      },
      {
        question: "Can I reorder a previous purchase?",
        answer:
          "Completed and delivered orders in your account history include a reorder action so you can quickly repeat products you liked.",
      },
    ],
  },
  {
    title: "Payments, Returns & Support",
    description: "Payment safety, return help, subscriptions, and customer care.",
    faqs: [
      {
        question: "Are payments secure?",
        answer:
          "The checkout and account payment sections are designed around secure payment handling. Payment information is treated as private account data and is not shared for unrelated purposes.",
      },
      {
        question: "What if I receive a damaged or incorrect item?",
        answer:
          "Contact support with your order number and a clear description of the issue. The support team can review damaged, incorrect, or missing items based on the return policy.",
      },
      {
        question: "How does the Healthy Living Subscription work?",
        answer:
          "The cart page includes a Healthy Living Subscription card. Use Join Now to share your email, and the store can send plan details, savings, and delivery options.",
      },
      {
        question: "How can I contact Theni Store?",
        answer:
          "You can use the Contact Support page, call 1-800-ORGANIC, or email support@theni.store for help with orders, accounts, delivery, and product questions.",
      },
    ],
  },
] as const;

const returnPolicyHighlights = [
  {
    title: "Report issues within 48 hours",
    description:
      "For damaged, incorrect, missing, or quality-related issues, contact support as soon as possible after delivery so the team can review the order quickly.",
  },
  {
    title: "Keep product and packing details",
    description:
      "Please keep the original packaging, invoice, and clear photos of the item if the order arrived damaged or incorrect.",
  },
  {
    title: "Refunds follow verification",
    description:
      "Approved return or refund requests are processed after the support team checks the order details, item condition, and delivery record.",
  },
] as const;

const returnPolicySections = [
  {
    title: "Eligible for review",
    items: [
      "Damaged items received in transit.",
      "Wrong item delivered compared with the confirmed order.",
      "Missing items from a delivered package.",
      "Sealed pantry products with a verified quality concern at delivery.",
    ],
  },
  {
    title: "Not usually eligible",
    items: [
      "Opened or partially used products without a delivery or quality issue.",
      "Requests raised too late after successful delivery.",
      "Taste preference changes after opening a product.",
      "Items stored improperly after delivery.",
    ],
  },
] as const;

const returnPolicySteps = [
  "Share your order number, contact details, and a short explanation of the issue.",
  "Attach photos of the parcel, label, and affected item when relevant.",
  "Wait for the support team to review the request and confirm the next step.",
  "If approved, receive a refund, replacement, or order adjustment based on the case.",
] as const;

const returnPolicyFaqs = [
  {
    question: "How long does refund review take?",
    answer:
      "Most requests are reviewed after the support team verifies the order information and issue details. Resolution time can vary depending on whether photos, courier checks, or stock confirmation are needed.",
  },
  {
    question: "Will I get a replacement or a refund?",
    answer:
      "That depends on the issue and stock availability. Theni Store may offer a replacement, refund, or other order adjustment after reviewing the case.",
  },
  {
    question: "Can I return health mixes or millet flours if I change my mind?",
    answer:
      "Because these are pantry and food products, change-of-mind returns are generally not accepted once packs are opened or after the order is delivered in good condition.",
  },
  {
    question: "Where do I raise a return request?",
    answer:
      "Use the Contact Support page and include your order number, issue summary, and photos if available. This helps the team process the request faster.",
  },
] as const;

type InfoPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function FaqPageContent({ title, description }: { title: string; description: string }) {
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

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <div className="rounded-[28px] border border-[#e8ece3] bg-[#fbfdf8] p-8 shadow-[0_14px_32px_rgba(18,37,61,0.06)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4f7d49]">
              Customer Help
            </p>
            <h1 className="mt-3 text-[2.2rem] font-semibold tracking-tight sm:text-[2.8rem]">
              {title}
            </h1>
            <p className="mt-4 text-base leading-8 text-[#5f708a] sm:text-lg">
              {description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Link
                href="/info/order-tracking"
                className="rounded-2xl border border-[#dfe8db] bg-white px-5 py-4 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
              >
                Track an order
              </Link>
              <Link
                href="/info/contact-support"
                className="rounded-2xl border border-[#dfe8db] bg-white px-5 py-4 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
              >
                Contact support
              </Link>
              <Link
                href="/info/return-policy"
                className="rounded-2xl border border-[#dfe8db] bg-white px-5 py-4 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
              >
                Read return policy
              </Link>
              <Link
                href="/products"
                className="rounded-2xl bg-[#4f7d49] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#41693c]"
              >
                Browse products
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {faqGroups.map((group) => (
              <section
                key={group.title}
                className="rounded-[28px] border border-[#e8ece3] bg-white p-5 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-6"
              >
                <div className="px-1">
                  <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                    {group.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#66758c]">
                    {group.description}
                  </p>
                </div>

                <div className="mt-5 divide-y divide-[#eaf0e5]">
                  {group.faqs.map((faq) => (
                    <details key={faq.question} className="group py-4">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold text-[#1d2741]">
                        <span>{faq.question}</span>
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef4eb] text-[#4f7d49] transition-transform group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f708a]">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReturnPolicyPageContent({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
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
              Customer Support
            </p>
            <h1 className="mt-3 text-[2.3rem] font-semibold tracking-tight text-[#17213d] sm:text-[3rem]">
              {title}
            </h1>
            <p className="mt-4 text-base leading-8 text-[#5f708a] sm:text-lg">
              {description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {returnPolicyHighlights.map((highlight) => (
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

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                What this policy covers
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5f708a] sm:text-base">
                Theni Store handles returns carefully because most products are food and pantry
                items. For safety and quality reasons, return requests are reviewed case by case,
                especially for damaged, incorrect, or missing deliveries.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {returnPolicySections.map((section) => (
                  <div
                    key={section.title}
                    className="rounded-[22px] border border-[#edf2ea] bg-[#fbfdf8] p-5"
                  >
                    <h3 className="text-lg font-semibold text-[#1d2741]">{section.title}</h3>
                    <ul className="mt-3 space-y-3 text-sm leading-6 text-[#5f708a]">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#5f8755]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                How to request a return or refund
              </h2>
              <div className="mt-6 space-y-4">
                {returnPolicySteps.map((step, index) => (
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
                Return policy questions
              </h2>
              <div className="mt-5 divide-y divide-[#eaf0e5]">
                {returnPolicyFaqs.map((faq) => (
                  <details key={faq.question} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold text-[#1d2741]">
                      <span>{faq.question}</span>
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef4eb] text-[#4f7d49] transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f708a]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-[#e8ece3] bg-[#fbfdf8] p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                Need help now?
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5f708a] sm:text-base">
                The fastest way to resolve a return-related issue is to share your order number and
                photos with support right away.
              </p>

              <div className="mt-6 grid gap-3">
                <Link
                  href="/info/contact-support"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#4f7d49] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#41693c]"
                >
                  Contact Support
                </Link>
                <Link
                  href="/info/order-tracking"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#d7dfd6] bg-white px-5 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
                >
                  Track Your Order
                </Link>
                <Link
                  href="/info/faqs"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#d7dfd6] bg-white px-5 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
                >
                  Read FAQs
                </Link>
              </div>
            </section>

            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                Important note
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5f708a] sm:text-base">
                This page explains the general return process for Theni Store. Final resolution may
                depend on item type, delivery condition, stock availability, and order verification.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params;

  if (!(slug in infoPages)) {
    notFound();
  }

  const page = infoPages[slug as InfoSlug];

  if (slug === "faqs") {
    return <FaqPageContent title={page.title} description={page.description} />;
  }

  if (slug === "become-a-seller") {
    return <BecomeSellerPage title={page.title} description={page.description} />;
  }

  if (slug === "contact-support") {
    return <ContactSupportPage title={page.title} description={page.description} />;
  }

  if (slug === "gift-cards") {
    return <GiftCardsPage title={page.title} description={page.description} />;
  }

  if (slug === "order-tracking") {
    return <OrderTrackingPage title={page.title} description={page.description} />;
  }

  if (slug === "return-policy") {
    return <ReturnPolicyPageContent title={page.title} description={page.description} />;
  }

  if (slug === "shipping-info") {
    return <ShippingInfoPage title={page.title} description={page.description} />;
  }

  return (
    <section className="bg-white text-[#1a2440]">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#7b8ea8]">
          <Link href="/" className="transition-colors hover:text-[#294b72]">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-[#4f7d49]">{page.title}</span>
        </nav>

        <div className="mt-8 max-w-4xl rounded-[28px] border border-[#e8ece3] bg-[#fbfdf8] p-8 shadow-[0_14px_32px_rgba(18,37,61,0.06)] sm:p-10">
          <h1 className="text-[2.2rem] font-semibold tracking-tight sm:text-[2.8rem]">
            {page.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-[#5f708a] sm:text-lg">
            {page.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#4f7d49] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#41693c]"
            >
              Browse Products
            </Link>
            <Link
              href="/account"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#d7dfd6] bg-white px-5 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
            >
              Go to Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
