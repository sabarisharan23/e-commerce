"use client";

import { useEffect, useState, type FormEvent } from "react";

function CloseIcon() {
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
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function SubscriptionCard() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (!isPopupOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPopupOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPopupOpen]);

  const openPopup = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setErrorMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();
    const isValidEmail = /\S+@\S+\.\S+/.test(normalizedEmail);

    if (!isValidEmail) {
      setErrorMessage("Please enter a valid email address.");
      setSuccessMessage("");
      return;
    }

    setEmail("");
    setErrorMessage("");
    setSuccessMessage("You are joined. We will send subscription details soon.");
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-[24px] border border-[#e5bd09] bg-[#f2c813] p-6 shadow-sm">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 bottom-0 h-28 w-28 rounded-full border-[12px] border-[#f4da73]/50"
        />
        <div className="relative">
          <h2 className="text-[1.9rem] font-semibold tracking-tight text-[#2c3b10]">
            Healthy Living Subscription
          </h2>
          <p className="mt-4 text-[1.05rem] font-medium leading-8 text-[#49524c]">
            Receive your favorite millet flours, health mixes, and drink mixes
            regularly with exclusive subscriber savings.
          </p>
          <button
            type="button"
            onClick={openPopup}
            className="mt-5 text-[1.05rem] font-semibold text-[#335f1f] transition-colors hover:text-[#1f4213]"
          >
            Join Now -&gt;
          </button>
        </div>
      </section>

      {isPopupOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscription-popup-title"
        >
          <button
            type="button"
            aria-label="Close subscription popup"
            className="absolute inset-0 cursor-default"
            onClick={closePopup}
          />

          <div className="relative w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl">
            <button
              type="button"
              aria-label="Close subscription popup"
              onClick={closePopup}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe7d8] bg-[#f7faf4] text-[#335f1f] transition-colors hover:bg-[#edf5e8]"
            >
              <CloseIcon />
            </button>

            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6c7b40]">
              Subscription
            </p>
            <h3
              id="subscription-popup-title"
              className="mt-2 pr-10 text-2xl font-semibold tracking-tight text-[#1f3218]"
            >
              Join Healthy Living
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#5a6653]">
              Enter your email and we will send plan options, savings, and
              delivery details.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label
                htmlFor="subscription-email"
                className="block text-sm font-semibold text-[#2f421f]"
              >
                Email address
              </label>
              <input
                id="subscription-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="you@example.com"
                className="h-12 w-full rounded-2xl border border-[#d9e4d2] bg-white px-4 text-base text-[#24321f] outline-none transition-colors placeholder:text-[#98a490] focus:border-[#6d8f44]"
              />

              {errorMessage ? (
                <p className="rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#be3a45]">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <p className="rounded-2xl bg-[#eef7e9] px-4 py-3 text-sm font-semibold text-[#477640]">
                  {successMessage}
                </p>
              ) : null}

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#335f1f] px-5 text-base font-semibold text-white transition-colors hover:bg-[#244615]"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
