"use client";

import { savedAddresses, type SavedAddressRecord } from "../account-data";

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

function HomeIcon({ type }: { type: SavedAddressRecord["type"] }) {
  return type === "home" ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4.5 10 7.5-6 7.5 6" />
      <path d="M7 9.5V20h10V9.5" />
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
      <rect x="5" y="7" width="14" height="13" rx="2" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 10.2 19 19.4 19.4 0 0 1 4.9 13.8 19.8 19.8 0 0 1 2.1 5.2 2 2 0 0 1 4.1 3h3a2 2 0 0 1 2 1.7l.4 2.8a2 2 0 0 1-.6 1.8l-1.7 1.7a16 16 0 0 0 5.7 5.7l1.7-1.7a2 2 0 0 1 1.8-.6l2.8.4A2 2 0 0 1 21 16.9Z" />
    </svg>
  );
}

function PinPlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10Z" />
      <path d="M12 8v6M9 11h6" />
    </svg>
  );
}

function MapPreview() {
  return (
    <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#f3f6f9,#eaf0f5)]">
      <div className="absolute h-14 w-[2px] rotate-[28deg] bg-[#b5d1a1]" />
      <div className="absolute h-16 w-[2px] -rotate-[32deg] bg-[#9dc7ef]" />
      <div className="absolute h-[2px] w-14 rotate-[12deg] bg-[#f6dd86]" />
      <div className="absolute h-[2px] w-12 -rotate-[24deg] bg-[#9ec9b0]" />
      <div className="absolute h-2 w-2 rounded-full bg-[#6ea6e0]" />
    </div>
  );
}

export function AccountAddresses() {
  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[2.4rem] font-semibold tracking-tight text-[#1a2540] sm:text-[3rem]">
            Saved Addresses
          </h1>
          <p className="mt-2 text-base leading-8 text-[#64738c] sm:text-lg">
            Manage your delivery locations for faster checkout.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#487540] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#3d6437]"
        >
          <PlusIcon />
          <span>Add New Address</span>
        </button>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        {savedAddresses.map((address) => (
          <article
            key={address.id}
            className={`rounded-[2rem] border bg-white p-6 shadow-[0_20px_60px_rgba(20,31,56,0.06)] ${
              address.isDefault ? "border-[#4f7d49]" : "border-[#edf1f6]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f9f6e6] text-[#487540]">
                  <HomeIcon type={address.type} />
                </div>
                <div>
                  <h2 className="text-[2rem] font-semibold tracking-tight text-[#1a2540]">
                    {address.label}
                  </h2>
                </div>
              </div>

              {address.isDefault ? (
                <span className="inline-flex rounded-xl bg-[#f8f4db] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7d8b55]">
                  Default
                </span>
              ) : null}
            </div>

            <div className="mt-6 space-y-1 text-[1.15rem] leading-8 text-[#5c6b84]">
              {address.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 text-base text-[#67758e]">
              <PhoneIcon />
              <span>{address.phone}</span>
            </div>

            <div className="mt-7 flex items-end justify-between gap-4 border-t border-[#edf1f6] pt-6">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  className="text-base font-semibold text-[#487540] transition-colors hover:text-[#3d6437]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-base font-semibold text-[#b0bad0] transition-colors hover:text-[#8694ab]"
                >
                  Delete
                </button>
              </div>

              <MapPreview />
            </div>
          </article>
        ))}

        <button
          type="button"
          className="flex min-h-[280px] flex-col items-center justify-center rounded-[2rem] border border-[#edf1f6] bg-[#f7fafe] px-6 py-10 text-center shadow-[0_20px_60px_rgba(20,31,56,0.04)] transition-colors hover:bg-[#f3f7fc]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8eef8] text-[#1f2c47]">
            <PinPlusIcon />
          </div>
          <h3 className="mt-6 text-[1.9rem] font-semibold tracking-tight text-[#1a2540]">
            Add Another Address
          </h3>
          <p className="mt-3 max-w-[18rem] text-base leading-7 text-[#65748d]">
            Delivery to a different location? Add it here.
          </p>
        </button>
      </section>

      <section className="rounded-[2rem] bg-[#f7cd08] px-6 py-7 text-[#2e4b2d] shadow-[0_24px_70px_rgba(247,205,8,0.2)] sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-current">
            <span className="text-lg font-bold">i</span>
          </div>
          <div>
            <h2 className="text-[1.7rem] font-semibold tracking-tight">Delivery Tip</h2>
            <p className="mt-2 max-w-[48rem] text-base leading-8 text-[#476244]">
              Setting a default address ensures a faster 1-click checkout
              experience. Your primary address is used to estimate shipping times
              and availability of fresh organic produce in your area.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
