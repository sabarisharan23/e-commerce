"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { type AuthUser, useAuth } from "@/components/shared/auth/auth-provider";

function PasswordIcon() {
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
      <path d="M12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v5h-5" />
    </svg>
  );
}

function VerifiedIcon() {
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
      <path d="m12 3 2.4 1.5 2.8-.2 1 2.6 2.3 1.7-.8 2.7.8 2.7-2.3 1.7-1 2.6-2.8-.2L12 21l-2.4-1.5-2.8.2-1-2.6-2.3-1.7.8-2.7-.8-2.7 2.3-1.7 1-2.6 2.8.2L12 3Z" />
      <path d="m9.3 12.3 1.8 1.8 3.8-4.2" />
    </svg>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-12 items-center rounded-full transition-colors ${
        checked ? "bg-[#487540]" : "bg-[#dfe6f1]"
      }`}
    >
      <span
        className={`inline-flex h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[1.35rem]" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function AccountSettingsPanel({ user }: { user: AuthUser }) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [language, setLanguage] = useState("English (US)");
  const [currency, setCurrency] = useState("Indian Rupee (Rs)");
  const [profileDetails, setProfileDetails] = useState({
    email: user.email,
    name: user.name,
    phone: user.phone,
  });

  const editProfileDetails = () => {
    const name = window.prompt("Full name", profileDetails.name);
    if (!name) {
      return;
    }

    const email = window.prompt("Email address", profileDetails.email);
    if (!email) {
      return;
    }

    const phone = window.prompt("Phone number", profileDetails.phone);
    if (!phone) {
      return;
    }

    setProfileDetails({
      email: email.trim(),
      name: name.trim(),
      phone: phone.trim(),
    });
  };

  const changePassword = () => {
    const currentPassword = window.prompt("Enter your current password");
    if (!currentPassword) {
      return;
    }

    const newPassword = window.prompt("Enter a new password");
    if (!newPassword) {
      return;
    }

    window.alert("Password updated for this demo session.");
  };

  const deleteAccount = () => {
    if (!window.confirm("Delete this account from the demo session and sign out?")) {
      return;
    }

    signOut();
    router.push("/");
  };

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[1.95rem] font-semibold tracking-tight text-[#1a2540] sm:text-[2.2rem]">
          Personal Information
        </h1>
        <p className="mt-2 text-sm leading-7 text-[#64738c] sm:text-base">
          Manage your account details and contact preferences.
        </p>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-[#edf1f6] bg-white shadow-[0_20px_60px_rgba(20,31,56,0.06)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#edf1f6] px-6 py-5 sm:px-7">
          <h2 className="text-[1.35rem] font-semibold tracking-tight text-[#1a2540]">
            Profile Details
          </h2>
          <button
            type="button"
            onClick={editProfileDetails}
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#fcf1e9] px-4 text-sm font-semibold text-[#487540]"
          >
            Edit All
          </button>
        </div>

        <div className="divide-y divide-[#edf1f6]">
          {[
            { label: "Full Name", value: profileDetails.name },
            { label: "Email", value: profileDetails.email, verified: true },
            { label: "Phone Number", value: profileDetails.phone },
          ].map((row) => (
            <div
              key={row.label}
              className="grid gap-2 px-6 py-5 sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:items-center sm:px-7"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8fa1bb]">
                {row.label}
              </p>
              <p className="text-base font-medium text-[#1f2c47]">{row.value}</p>
              {row.verified ? (
                <span className="justify-self-start text-[#22b356] sm:justify-self-end">
                  <VerifiedIcon />
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-[#edf1f6] bg-white shadow-[0_20px_60px_rgba(20,31,56,0.06)]">
        <div className="border-b border-[#edf1f6] px-6 py-5 sm:px-7">
          <h2 className="text-[1.35rem] font-semibold tracking-tight text-[#1a2540]">
            Security &amp; Password
          </h2>
        </div>

        <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef2f8] text-[#71839e]">
              <PasswordIcon />
            </div>
            <div>
              <h3 className="text-[1.1rem] font-semibold tracking-tight text-[#1a2540]">
                Login Password
              </h3>
              <p className="mt-1 text-sm leading-7 text-[#6a7992] sm:text-base">
                Last changed 3 months ago. We recommend changing it every 6 months.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={changePassword}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#487540] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#3d6437]"
          >
            Change Password
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="overflow-hidden rounded-[2rem] border border-[#edf1f6] bg-white shadow-[0_20px_60px_rgba(20,31,56,0.06)]">
          <div className="border-b border-[#edf1f6] px-6 py-5 sm:px-7">
            <h2 className="text-[1.3rem] font-semibold tracking-tight text-[#1a2540]">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-6 px-6 py-6 sm:px-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-[#1a2540]">
                  Order Updates
                </h3>
                <p className="mt-1 text-sm text-[#6a7992]">
                  Track your order status and delivery
                </p>
              </div>
              <Toggle checked={orderUpdates} onChange={setOrderUpdates} />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-[#1a2540]">
                  Promotions &amp; Offers
                </h3>
                <p className="mt-1 text-sm text-[#6a7992]">
                  New arrivals and seasonal discounts
                </p>
              </div>
              <Toggle checked={promotions} onChange={setPromotions} />
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-[2rem] border border-[#edf1f6] bg-white shadow-[0_20px_60px_rgba(20,31,56,0.06)]">
          <div className="border-b border-[#edf1f6] px-6 py-5 sm:px-7">
            <h2 className="text-[1.3rem] font-semibold tracking-tight text-[#1a2540]">
              Language &amp; Region
            </h2>
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-7">
            <label className="block">
              <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8fa1bb]">
                Primary Language
              </span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="mt-3 h-12 w-full rounded-2xl border border-[#d8e1ee] bg-[#f9fbfd] px-4 text-base text-[#1f2c47] outline-none"
              >
                <option>English (US)</option>
                <option>English (India)</option>
                <option>Tamil</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8fa1bb]">
                Currency Preference
              </span>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="mt-3 h-12 w-full rounded-2xl border border-[#d8e1ee] bg-[#f9fbfd] px-4 text-base text-[#1f2c47] outline-none"
              >
                <option>Indian Rupee (Rs)</option>
                <option>US Dollar (USD)</option>
                <option>Euro (EUR)</option>
              </select>
            </label>
          </div>
        </article>
      </section>

      <section className="flex flex-col gap-5 rounded-[2rem] border border-[#ffd3d2] bg-[#fff2f1] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <h2 className="text-[1.3rem] font-semibold tracking-tight text-[#b62323]">
            Deactivate Account
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#ff4d4f] sm:text-base">
            Permanently delete your account and all associated data.
          </p>
        </div>

        <button
          type="button"
          onClick={deleteAccount}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#ff4d4f] px-6 text-sm font-semibold text-[#ff4d4f] transition-colors hover:bg-white"
        >
          Delete Account
        </button>
      </section>
    </div>
  );
}
