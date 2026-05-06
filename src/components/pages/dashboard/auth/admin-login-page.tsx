"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_DEMO_CREDENTIALS, useAdminAuth } from "@/components/shared";
import { adminLoginContent } from "./admin-login-data";

export function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isReady, signIn } = useAdminAuth();
  const [email, setEmail] = useState(ADMIN_DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(ADMIN_DEMO_CREDENTIALS.password);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isReady, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const result = signIn(email, password);

    if (!result.success) {
      setErrorMessage(result.message ?? "Unable to sign in with those credentials.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f8f2_0%,#eef3fb_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-[#dfe7d9] bg-white shadow-[0_30px_80px_rgba(28,39,64,0.08)]">
        <section className="hidden w-full max-w-[42%] flex-col justify-between bg-[linear-gradient(160deg,#3f6f38_0%,#507d43_48%,#253f23_100%)] p-10 text-white lg:flex">
          <div>
            <div className="relative h-[62px] w-[144px]">
              <Image
                src="/home/logos/theni-store.png"
                alt="Theni Store"
                fill
                sizes="144px"
                className="object-contain object-left brightness-[1.22]"
              />
            </div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              {adminLoginContent.eyebrow}
            </p>
            <h1 className="mt-4 max-w-sm text-4xl font-bold leading-tight">
              {adminLoginContent.heroTitle}
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/82">
              {adminLoginContent.heroDescription}
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid gap-3">
              {adminLoginContent.credentials.map((credential) => (
                <div
                  key={credential.label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                    {credential.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">{credential.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/8 px-5 py-5 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Included areas
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/82">
                {adminLoginContent.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#d8f0ce]" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="flex min-w-0 flex-1 items-center justify-center px-6 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl">
            <div className="mx-auto mb-8 flex justify-center lg:hidden">
              <div className="relative h-[58px] w-[136px]">
                <Image
                  src="/home/logos/theni-store.png"
                  alt="Theni Store"
                  fill
                  sizes="136px"
                  className="object-contain"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#e8edf4] bg-white p-6 shadow-[0_18px_50px_rgba(20,31,56,0.06)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#477640]">
                {adminLoginContent.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#1c2740]">
                {adminLoginContent.heading}
              </h2>
              <p className="mt-3 max-w-lg text-base leading-7 text-[#6f7d92]">
                {adminLoginContent.description}
              </p>

              <div className="mt-6 grid gap-3 rounded-2xl bg-[#f6f9fc] p-4 sm:grid-cols-2">
                {adminLoginContent.credentials.map((credential) => (
                  <div key={credential.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c8aa0]">
                      {credential.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#1c2740]">{credential.value}</p>
                  </div>
                ))}
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    htmlFor="admin-email"
                    className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7c8aa0]"
                  >
                    Email address
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-14 w-full rounded-2xl border border-[#d9e2ee] px-4 text-base text-[#1c2740] outline-none transition focus:border-[#477640] focus:ring-4 focus:ring-[#477640]/10"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="admin-password"
                    className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7c8aa0]"
                  >
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-14 w-full rounded-2xl border border-[#d9e2ee] px-4 text-base text-[#1c2740] outline-none transition focus:border-[#477640] focus:ring-4 focus:ring-[#477640]/10"
                  />
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-[#f2c6c6] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-[#b33a3a]">
                    {errorMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white shadow-[0_16px_30px_rgba(71,118,64,0.22)] transition hover:bg-[#3f6a38] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Signing in..." : "Sign In to Admin"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
