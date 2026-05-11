"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

type BecomeSellerPageProps = {
  description: string;
  title: string;
};

type FormState = {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
};

type ApiVendorResponse =
  | {
      data: {
        createdAt: string;
        email: string;
        id: string;
        name: string;
        status: string;
        updatedAt: string;
        vendorCode: string;
      };
      success: true;
    }
  | {
      error: {
        code: string;
        details?: Record<string, string>;
        message: string;
      };
      success: false;
    };

const onboardingHighlights = [
  {
    title: "Reach wellness-focused shoppers",
    description:
      "List millet flours, health mixes, drink mixes, and pantry staples for customers already shopping in this category.",
  },
  {
    title: "Simple review process",
    description:
      "Start with your seller account details here. The team can follow up for catalog, fulfillment, and brand information after submission.",
  },
  {
    title: "Seller-first setup",
    description:
      "Your application starts in a fresh onboarding state so the team can review and activate it carefully.",
  },
] as const;

const onboardingSteps = [
  "Create your seller account with business name, email, and password.",
  "Receive a vendor code after successful submission.",
  "Wait for the Theni Store team to review your onboarding request.",
  "Complete product and operations setup once your profile is approved.",
] as const;

const emptyForm: FormState = {
  confirmPassword: "",
  email: "",
  name: "",
  password: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-medium text-[#be3a45]">{message}</p>;
}

export function BecomeSellerPage({
  description,
  title,
}: BecomeSellerPageProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successState, setSuccessState] = useState<{
    email: string;
    name: string;
    vendorCode: string;
  } | null>(null);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setFormError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});
    setSuccessState(null);

    const nextFieldErrors: Record<string, string> = {};

    if (form.name.trim().length < 2) {
      nextFieldErrors.name = "Business name must be at least 2 characters.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim().toLowerCase())) {
      nextFieldErrors.email = "Enter a valid business email address.";
    }

    if (form.password.length < 8) {
      nextFieldErrors.password = "Password must be at least 8 characters.";
    }

    if (form.password !== form.confirmPassword) {
      nextFieldErrors.confirmPassword = "Passwords must match before submission.";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/vendors", {
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          name: form.name.trim(),
          password: form.password,
          status: "FRESH_ONBOARD",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as ApiVendorResponse;

      if (!response.ok || !payload.success) {
        if (!payload.success && payload.error.details) {
          setFieldErrors(payload.error.details);
        }

        throw new Error(
          payload.success ? "Unable to submit seller application." : payload.error.message,
        );
      }

      setSuccessState({
        email: payload.data.email,
        name: payload.data.name,
        vendorCode: payload.data.vendorCode,
      });
      setForm(emptyForm);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to submit seller application. Please try again.",
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

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] xl:items-start">
          <div className="space-y-6">
            <section className="rounded-[32px] border border-[#e8ece3] bg-[linear-gradient(135deg,#fbf7ec_0%,#f3faee_100%)] p-8 shadow-[0_18px_40px_rgba(18,37,61,0.08)] sm:p-10 lg:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4f7d49]">
                Seller Onboarding
              </p>
              <h1 className="mt-3 max-w-3xl text-[2.4rem] font-semibold tracking-tight text-[#17213d] sm:text-[3.2rem]">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#5f708a] sm:text-lg">
                {description}
              </p>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {onboardingHighlights.map((highlight) => (
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
            </section>

            <section className="rounded-[28px] border border-[#e8ece3] bg-white p-6 shadow-[0_14px_32px_rgba(18,37,61,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[#17213d]">
                How onboarding works
              </h2>
              <div className="mt-6 space-y-4">
                {onboardingSteps.map((step, index) => (
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
          </div>

          <section className="rounded-[28px] border border-[#e8ece3] bg-[#fbfdf8] p-6 shadow-[0_14px_32px_rgba(18,37,61,0.06)] sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4f7d49]">
                Seller Form
              </p>
              <h2 className="mt-2 text-[2rem] font-semibold tracking-tight text-[#17213d]">
                Submit your details
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5f708a] sm:text-base">
                We will create your seller profile in fresh onboarding status and share the next
                setup steps from there.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
                  Business Name
                </span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-white px-4 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640]"
                  placeholder="Your brand or business name"
                  autoComplete="organization"
                  required
                />
                <FieldError message={fieldErrors.name} />
              </label>

              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
                  Business Email
                </span>
                <input
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-white px-4 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640]"
                  placeholder="seller@example.com"
                  autoComplete="email"
                  required
                  type="email"
                />
                <FieldError message={fieldErrors.email} />
              </label>

              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
                  Create Password
                </span>
                <input
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-white px-4 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640]"
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  type="password"
                />
                <FieldError message={fieldErrors.password} />
              </label>

              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
                  Confirm Password
                </span>
                <input
                  value={form.confirmPassword}
                  onChange={(event) => updateField("confirmPassword", event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-white px-4 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640]"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  type="password"
                />
                <FieldError message={fieldErrors.confirmPassword} />
              </label>

              {formError ? (
                <div className="rounded-2xl border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">
                  {formError}
                </div>
              ) : null}

              {successState ? (
                <div className="rounded-2xl border border-[#d7ead0] bg-[#eef7e9] px-4 py-4 text-sm text-[#315f29]">
                  <p className="font-semibold">
                    Seller application submitted for {successState.name}.
                  </p>
                  <p className="mt-1">
                    Vendor code: <span className="font-semibold">{successState.vendorCode}</span>
                  </p>
                  <p className="mt-1">
                    We created the onboarding profile using {successState.email}.
                  </p>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}
