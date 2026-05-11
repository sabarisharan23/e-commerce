"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

type OrderTrackingPageProps = {
  description: string;
  title: string;
};

type TrackingResult = {
  itemSummary: string;
  orderNumber: string;
  placedOn: string;
  status: string;
  statusDetail: string;
  statusTone: "green" | "amber" | "red";
  trackingCarrier: string;
  trackingCode: string;
  trackingSteps: Array<{
    detail: string;
    id: string;
    state: "completed" | "current" | "upcoming";
    title: string;
  }>;
};

type TrackingResponse =
  | {
      data: TrackingResult;
      success: true;
    }
  | {
      error: {
        code: string;
        details?: unknown;
        message: string;
      };
      success: false;
    };

const trackingHighlights = [
  {
    title: "Track by order code",
    description:
      "Enter the order number you received after checkout to check the latest delivery state.",
  },
  {
    title: "See status steps",
    description:
      "The tracker shows whether your order is processing, shipped, delivered, or cancelled.",
  },
  {
    title: "Get help quickly",
    description:
      "If the code is missing or the delivery needs attention, support links are available right on the page.",
  },
] as const;

function SearchIcon() {
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
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function getToneClasses(tone: TrackingResult["statusTone"]) {
  if (tone === "green") {
    return "bg-[#e8f5e5] text-[#2f6b28]";
  }

  if (tone === "red") {
    return "bg-[#fff1f2] text-[#be3a45]";
  }

  return "bg-[#fff5d9] text-[#a06a00]";
}

function getStepClasses(state: TrackingResult["trackingSteps"][number]["state"]) {
  if (state === "completed") {
    return {
      badge: "bg-[#dff1d9] text-[#2f6b28]",
      dot: "bg-[#4f7d49]",
      title: "text-[#1d2741]",
    };
  }

  if (state === "current") {
    return {
      badge: "bg-[#fff0cd] text-[#9a6500]",
      dot: "bg-[#efba18]",
      title: "text-[#1d2741]",
    };
  }

  return {
    badge: "bg-[#eef2f7] text-[#708197]",
    dot: "bg-[#cfd8e3]",
    title: "text-[#708197]",
  };
}

export function OrderTrackingPage({
  description,
  title,
}: OrderTrackingPageProps) {
  const [trackCode, setTrackCode] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCode = trackCode.trim();

    setErrorMessage("");
    setResult(null);

    if (!normalizedCode) {
      setErrorMessage("Enter your order code to track the shipment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/v1/orders/tracking?code=${encodeURIComponent(normalizedCode)}`,
      );
      const payload = (await response.json()) as TrackingResponse;

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.success ? "Unable to track this order." : payload.error.message,
        );
      }

      setResult(payload.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to track this order right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

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
              Delivery Tracker
            </p>
            <h1 className="mt-3 text-[2.3rem] font-semibold tracking-tight text-[#17213d] sm:text-[3rem]">
              {title}
            </h1>
            <p className="mt-4 text-base leading-8 text-[#5f708a] sm:text-lg">
              {description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {trackingHighlights.map((highlight) => (
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

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">
          <section className="rounded-[28px] border border-[#e8ece3] bg-[#fbfdf8] p-6 shadow-[0_14px_32px_rgba(18,37,61,0.06)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4f7d49]">
              Track Code
            </p>
            <h2 className="mt-2 text-[2rem] font-semibold tracking-tight text-[#17213d]">
              Enter your order number
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5f708a] sm:text-base">
              You can use the order code from checkout confirmation or your account order history.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
                  Order Code
                </span>
                <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#e3eaf2] bg-white px-4 text-[#7d8da5]">
                  <SearchIcon />
                  <input
                    value={trackCode}
                    onChange={(event) => setTrackCode(event.target.value)}
                    className="w-full border-none bg-transparent text-base text-[#24304a] outline-none placeholder:text-[#94a3b8]"
                    placeholder="Example: TS-1234ABCD"
                  />
                </div>
              </label>

              {errorMessage ? (
                <div className="rounded-2xl border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSubmitting ? "Tracking..." : "Track Order"}
              </button>
            </form>

            <div className="mt-8 rounded-[24px] border border-[#edf2ea] bg-white p-5">
              <h3 className="text-lg font-semibold text-[#17213d]">Need another route?</h3>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/account"
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#d7dfd6] bg-white px-5 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
                >
                  View Account Orders
                </Link>
                <Link
                  href="/info/contact-support"
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#d7dfd6] bg-white px-5 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4f7d49]">
                  Track Box
                </p>
                <h2 className="mt-2 text-[2rem] font-semibold tracking-tight text-[#17213d]">
                  Shipment result
                </h2>
              </div>

              {result ? (
                <span
                  className={`inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold ${getToneClasses(result.statusTone)}`}
                >
                  {result.status}
                </span>
              ) : null}
            </div>

            {result ? (
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 rounded-[24px] border border-[#edf2ea] bg-[#fbfdf8] p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8aa17b]">
                      Tracking Code
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#17213d]">
                      {result.trackingCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8aa17b]">
                      Order Number
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#17213d]">
                      #{result.orderNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8aa17b]">
                      Placed On
                    </p>
                    <p className="mt-2 text-base font-medium text-[#46566f]">
                      {result.placedOn}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8aa17b]">
                      Shipment
                    </p>
                    <p className="mt-2 text-base font-medium text-[#46566f]">
                      {result.trackingCarrier} - {result.itemSummary}
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#edf2ea] bg-white p-5">
                  <h3 className="text-lg font-semibold text-[#17213d]">Current update</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5f708a]">
                    {result.statusDetail}
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#edf2ea] bg-white p-5">
                  <h3 className="text-lg font-semibold text-[#17213d]">Tracking steps</h3>
                  <div className="mt-5 space-y-4">
                    {result.trackingSteps.map((step) => {
                      const classes = getStepClasses(step.state);

                      return (
                        <div
                          key={step.id}
                          className="flex gap-4 rounded-[22px] border border-[#edf2ea] bg-[#fbfdf8] p-4"
                        >
                          <div className="flex flex-col items-center">
                            <span className={`h-3 w-3 rounded-full ${classes.dot}`} />
                            <span className="mt-2 h-full w-px bg-[#dfe7d8]" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <h4 className={`text-base font-semibold ${classes.title}`}>
                                {step.title}
                              </h4>
                              <span
                                className={`inline-flex h-8 items-center justify-center rounded-full px-3 text-xs font-semibold uppercase tracking-[0.08em] ${classes.badge}`}
                              >
                                {step.state}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-[#5f708a]">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-[#d7dfd6] bg-[#fbfdf8] px-5 py-10 text-center">
                <p className="text-lg font-semibold text-[#17213d]">Tracking details will appear here.</p>
                <p className="mt-3 text-sm leading-7 text-[#5f708a]">
                  Enter an order code in the track box to view the latest shipment status and
                  delivery progress.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
