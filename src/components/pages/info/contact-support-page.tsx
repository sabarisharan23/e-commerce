"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

type ContactSupportPageProps = {
  description: string;
  title: string;
};

type ContactFormState = {
  email: string;
  message: string;
  name: string;
  orderCode: string;
  topic: string;
};

const supportChannels = [
  {
    description: "Call the store team directly for urgent order, delivery, or account support.",
    label: "Customer Care",
    value: "1-800-ORGANIC",
    href: "tel:+18006742642",
  },
  {
    description: "Send order questions, payment issues, or product concerns by email.",
    label: "Support Email",
    value: "support@theni.store",
    href: "mailto:support@theni.store",
  },
  {
    description: "Visit or write to the store location used across the storefront and footer.",
    label: "Store Address",
    value: "Gokulam Colony, SPK Road, Chinnamanur, Theni District, Tamil Nadu",
    href: "/info/about-us",
  },
] as const;

const supportTopics = [
  "Order Support",
  "Delivery Help",
  "Payment Assistance",
  "Product Questions",
  "Returns & Refunds",
  "Account Access",
] as const;

const supportNotes = [
  {
    title: "Order help",
    description: "Share your order code if you need help with delivery updates, missing items, or checkout issues.",
  },
  {
    title: "Payment support",
    description: "Use the support email for payment confirmation questions or issues with saved methods.",
  },
  {
    title: "Seller and business enquiries",
    description: "Vendor applications and business requests can also be started from the Become a Seller page.",
  },
] as const;

const emptyForm: ContactFormState = {
  email: "",
  message: "",
  name: "",
  orderCode: "",
  topic: supportTopics[0],
};

export function ContactSupportPage({
  description,
  title,
}: ContactSupportPageProps) {
  const [form, setForm] = useState<ContactFormState>(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function updateField(field: keyof ContactFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrorMessage("");
    setSuccessMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = form.name.trim();
    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedMessage = form.message.trim();

    if (normalizedName.length < 2) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (normalizedMessage.length < 10) {
      setErrorMessage("Please add a short message so the support team can help.");
      return;
    }

    setSuccessMessage("Your support request is ready. The team can follow up using the email you entered.");
    setErrorMessage("");
    setForm(emptyForm);
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
              Support Center
            </p>
            <h1 className="mt-3 text-[2.3rem] font-semibold tracking-tight text-[#17213d] sm:text-[3rem]">
              {title}
            </h1>
            <p className="mt-4 text-base leading-8 text-[#5f708a] sm:text-lg">
              {description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {supportChannels.map((channel) => (
              <article
                key={channel.label}
                className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_10px_24px_rgba(18,37,61,0.05)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8e6a]">
                  {channel.label}
                </p>
                <p className="mt-3 text-lg font-semibold text-[#17213d]">
                  {channel.value}
                </p>
                <p className="mt-2 text-sm leading-7 text-[#5f708a]">
                  {channel.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:items-start">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                Store details
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-[22px] border border-[#edf2ea] bg-[#fbfdf8] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8e6a]">
                    Store Name
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#17213d]">
                    Theni Store
                  </p>
                </div>
                <div className="rounded-[22px] border border-[#edf2ea] bg-[#fbfdf8] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8e6a]">
                    Phone
                  </p>
                  <a
                    href="tel:+18006742642"
                    className="mt-2 inline-flex text-lg font-semibold text-[#3f713b]"
                  >
                    1-800-ORGANIC
                  </a>
                </div>
                <div className="rounded-[22px] border border-[#edf2ea] bg-[#fbfdf8] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8e6a]">
                    Email
                  </p>
                  <a
                    href="mailto:support@theni.store"
                    className="mt-2 inline-flex text-lg font-semibold text-[#3f713b]"
                  >
                    support@theni.store
                  </a>
                </div>
                <div className="rounded-[22px] border border-[#edf2ea] bg-[#fbfdf8] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8e6a]">
                    Address
                  </p>
                  <p className="mt-2 text-base font-medium leading-7 text-[#46566f]">
                    Gokulam Colony, SPK Road, Chinnamanur, Theni District, Tamil Nadu
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                Contact details
              </h2>
              <div className="mt-6 space-y-4">
                {supportNotes.map((note) => (
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

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/info/order-tracking"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#d7dfd6] bg-white px-5 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
                >
                  Track Your Order
                </Link>
                <Link
                  href="/info/become-a-seller"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#d7dfd6] bg-white px-5 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
                >
                  Become a Seller
                </Link>
              </div>
            </section>
          </div>

          <section className="rounded-[28px] border border-[#e8ece3] bg-[#fbfdf8] p-6 shadow-[0_14px_32px_rgba(18,37,61,0.06)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4f7d49]">
              Contact Form
            </p>
            <h2 className="mt-2 text-[2rem] font-semibold tracking-tight text-[#17213d]">
              Send a support request
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5f708a] sm:text-base">
              Add your contact details and message so the store team can follow up with the right context.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
                  Name
                </span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-white px-4 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640]"
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
                  Email
                </span>
                <input
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-white px-4 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640]"
                  placeholder="you@example.com"
                  autoComplete="email"
                  type="email"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
                    Topic
                  </span>
                  <select
                    value={form.topic}
                    onChange={(event) => updateField("topic", event.target.value)}
                    className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-white px-4 text-base text-[#24304a] outline-none transition-colors focus:border-[#477640]"
                  >
                    {supportTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
                    Order Code
                  </span>
                  <input
                    value={form.orderCode}
                    onChange={(event) => updateField("orderCode", event.target.value)}
                    className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-white px-4 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640]"
                    placeholder="Optional"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
                  Message
                </span>
                <textarea
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  rows={5}
                  className="mt-2 w-full rounded-2xl border border-[#e3eaf2] bg-white px-4 py-3 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640]"
                  placeholder="Tell us how we can help."
                />
              </label>

              {errorMessage ? (
                <div className="rounded-2xl border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-2xl border border-[#d7ead0] bg-[#eef7e9] px-4 py-3 text-sm font-semibold text-[#315f29]">
                  {successMessage}
                </div>
              ) : null}

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white"
              >
                Submit Request
              </button>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}
