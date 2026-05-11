"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  alternatePaymentMethods,
  savedCards,
  type AlternatePaymentMethod,
  type SavedCardRecord,
} from "../account-data";

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ShieldIcon() {
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
      <path d="M12 3 5 6v6c0 4.2 2.9 8.2 7 9 4.1-.8 7-4.8 7-9V6l-7-3Z" />
    </svg>
  );
}

function SectionIcon({ type }: { type: "cards" | "other" }) {
  return type === "cards" ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M9 9h6M9 13h6" />
    </svg>
  );
}

function CheckBadge() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 stroke-current"
      fill="none"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3 4.7-4.8" />
    </svg>
  );
}

function CardLogo({ brand }: { brand: SavedCardRecord["brand"] }) {
  return (
    <div
      className={`flex h-10 w-12 items-center justify-center rounded-lg text-xs font-bold uppercase tracking-[0.14em] text-white ${
        brand === "visa" ? "bg-[#1e86c7]" : "bg-[#1e2024]"
      }`}
    >
      {brand === "visa" ? "Visa" : "MC"}
    </div>
  );
}

function MethodIcon({ icon }: { icon: AlternatePaymentMethod["icon"] }) {
  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
        icon === "upi" ? "bg-[#eef0ff] text-[#5757f4]" : "bg-[#fff5e8] text-[#d88706]"
      }`}
    >
      {icon === "upi" ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 stroke-current"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 5h4v4H7zM13 5h4v4h-4zM7 11h4v4H7zM13 11h4v4h-4zM7 17h4v2H7zM13 17h4v2h-4z" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 stroke-current"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 10h16M6 10V7h12v3M6 10v7h12v-7M9 14h6" />
        </svg>
      )}
    </div>
  );
}

export function AccountPaymentMethods() {
  const router = useRouter();
  const [cards, setCards] = useState(savedCards);

  const addNewMethod = () => {
    const holder = window.prompt("Card holder name", "John Doe");
    if (!holder) {
      return;
    }

    const brandInput = window.prompt("Card brand (visa or mastercard)", "visa");
    if (!brandInput) {
      return;
    }

    const maskedNumber = window.prompt("Last 4 digits", "1234");
    if (!maskedNumber) {
      return;
    }

    const expiry = window.prompt("Expiry (MM/YY)", "12/26");
    if (!expiry) {
      return;
    }

    const cardName = window.prompt("Card nickname", "My Card");
    if (!cardName) {
      return;
    }

    const setAsDefault = window.confirm("Set this as your default payment method?");

    const nextCard: SavedCardRecord = {
      brand: brandInput.toLowerCase() === "mastercard" ? "mastercard" : "visa",
      expiry: expiry.trim(),
      holder: holder.trim(),
      id: `card-${Date.now()}`,
      isDefault: setAsDefault,
      maskedNumber: `•••• ${maskedNumber.trim()}`,
      name: cardName.trim(),
    };

    setCards((existing) => {
      const base = [...existing, nextCard];
      if (!setAsDefault) {
        return base;
      }

      return base.map((card) => ({
        ...card,
        isDefault: card.id === nextCard.id,
      }));
    });
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[1.95rem] font-semibold tracking-tight text-[#1a2540] sm:text-[2.2rem]">
            Payment Methods
          </h1>
          <p className="mt-2 text-sm leading-7 text-[#64738c] sm:text-base">
            Manage your saved cards and payment preferences for a faster checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={addNewMethod}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#487540] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#3d6437]"
        >
          <PlusIcon />
          <span>Add New Method</span>
        </button>
      </div>

      <section className="flex items-start gap-3 rounded-[1.5rem] bg-[#e7fbef] px-5 py-4 text-[#167252]">
        <div className="mt-0.5">
          <ShieldIcon />
        </div>
        <p className="text-sm leading-7 sm:text-base">
          Your payment information is encrypted and securely stored. We never share
          your full card details.
        </p>
      </section>

      <div className="space-y-5">
        <div className="flex items-center gap-3 text-[#1a2540]">
          <SectionIcon type="cards" />
          <h2 className="text-[1.35rem] font-semibold tracking-tight">
            Saved Credit &amp; Debit Cards
          </h2>
        </div>

        <div className="space-y-4">
          {cards.map((card) => (
            <article
              key={card.id}
              className="rounded-[1.7rem] border border-[#edf1f6] bg-white px-5 py-5 shadow-[0_18px_50px_rgba(20,31,56,0.05)] sm:px-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl border border-[#dbe4ef] p-1.5">
                    <CardLogo brand={card.brand} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-[1.1rem] font-semibold tracking-tight text-[#1a2540]">
                        {card.name} {card.maskedNumber}
                      </h3>
                      {card.isDefault ? (
                        <span className="inline-flex rounded-xl bg-[#fff0e6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#ff8e44]">
                          Default
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-[#6a7992] sm:text-base">
                      Expires {card.expiry} • {card.holder}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-3 text-[#1a2540]">
          <SectionIcon type="other" />
          <h2 className="text-[1.35rem] font-semibold tracking-tight">
            Other Payment Methods
          </h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {alternatePaymentMethods.map((method) => (
            <article
              key={method.id}
              className="rounded-[1.9rem] border border-[#edf1f6] bg-white px-5 py-5 shadow-[0_18px_50px_rgba(20,31,56,0.05)] sm:px-6"
            >
              <MethodIcon icon={method.icon} />
              <h3 className="mt-5 text-[1.25rem] font-semibold tracking-tight text-[#1a2540]">
                {method.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#6a7992] sm:text-base">
                {method.description}
              </p>
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-dashed border-[#c8d3e4] bg-[#f9fbfd] px-4 py-3 text-sm font-medium text-[#4f607b]">
                <span>{method.value}</span>
                <span className="text-[#22b356]">
                  <CheckBadge />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="border-t border-[#dfe6ef] pt-6 text-center text-sm text-[#64738c] sm:text-base">
        Need help with payments?{" "}
        <button
          type="button"
          onClick={() => router.push("/info/contact-support")}
          className="font-semibold text-[#487540]"
        >
          Visit Support Center
        </button>{" "}
        or{" "}
        <button
          type="button"
          onClick={() => {
            window.location.href = "mailto:support@theni.store";
          }}
          className="font-semibold text-[#2f8e44]"
        >
          Contact us
        </button>
      </div>
    </div>
  );
}
