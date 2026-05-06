"use client";

import { FormEvent, useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidEmail = /\S+@\S+\.\S+/.test(email);

    if (!isValidEmail) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage("You’re subscribed. We’ll share new offers and millet tips soon.");
    setEmail("");
  };

  return (
    <section className="bg-[#f7f8f3]">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[24px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14"
          style={{
            backgroundImage:
              "linear-gradient(rgba(19,58,25,0.74), rgba(19,58,25,0.74)), url('/home/newsletter/newsletter-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto max-w-4xl text-center text-white">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[3.2rem]">
              Stay Healthy with Millet Nutrition
            </h2>
            <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-white/80 sm:text-xl">
              Subscribe to receive healthy millet recipes, nutrition tips, and
              exclusive offers on our natural mixes.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-3xl flex-col gap-4 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                className="h-14 flex-1 rounded-2xl border border-white/25 bg-white/10 px-5 text-base text-white outline-none placeholder:text-white/45 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="h-14 rounded-2xl bg-[#5a864f] px-8 text-lg font-semibold text-white transition-colors hover:bg-[#4b7342] sm:min-w-[180px]"
              >
                Subscribe Now
              </button>
            </form>

            {message ? (
              <p className="mt-4 text-sm font-medium text-white/90">{message}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
