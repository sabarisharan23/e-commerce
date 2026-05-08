"use client";

import { type FormEvent, useState } from "react";

export type VendorRecord = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  status: string;
  updatedAt: string;
  vendorCode: string;
};

export type CreatedVendor = VendorRecord;

type VendorDialogMode = "create" | "edit";

type VendorOnboardingDialogProps = {
  mode?: VendorDialogMode;
  onClose: () => void;
  onSaved: (vendor: VendorRecord, mode: VendorDialogMode) => void;
  open: boolean;
  vendor?: VendorRecord | null;
};

type FormState = {
  email: string;
  name: string;
  password: string;
  status: string;
};

type ApiVendorResponse =
  | {
      data: VendorRecord;
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

const statusOptions = [
  { label: "Fresh Onboard", value: "FRESH_ONBOARD" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Under Audit", value: "UNDER_AUDIT" },
];

const emptyForm: FormState = {
  email: "",
  name: "",
  password: "",
  status: "FRESH_ONBOARD",
};

function normalizeApiStatus(status: string) {
  const normalized = status.toUpperCase();

  return statusOptions.some((option) => option.value === normalized)
    ? normalized
    : emptyForm.status;
}

function getInitialForm(mode: VendorDialogMode, vendor?: VendorRecord | null): FormState {
  if (mode === "edit" && vendor) {
    return {
      email: vendor.email,
      name: vendor.name,
      password: "",
      status: normalizeApiStatus(vendor.status),
    };
  }

  return emptyForm;
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-medium text-[#dc2626]">{message}</p>;
}

export function VendorOnboardingDialog({
  mode = "create",
  onClose,
  onSaved,
  open,
  vendor,
}: VendorOnboardingDialogProps) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(mode, vendor));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || (mode === "edit" && !vendor)) {
    return null;
  }

  function resetDialogState() {
    setForm(emptyForm);
    setFieldErrors({});
    setFormError("");
    setIsSubmitting(false);
  }

  function handleClose() {
    resetDialogState();
    onClose();
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setFormError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    const isEditMode = mode === "edit" && vendor;
    const requestBody = isEditMode
      ? {
          email: form.email,
          name: form.name,
          ...(form.password ? { password: form.password } : {}),
          status: form.status,
        }
      : form;

    try {
      const response = await fetch(
        isEditMode ? `/api/v1/vendors/${vendor.id}` : "/api/v1/vendors",
        {
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
          method: isEditMode ? "PATCH" : "POST",
        },
      );
      const payload = (await response.json()) as ApiVendorResponse;

      if (!response.ok || !payload.success) {
        if (!payload.success && payload.error.details) {
          setFieldErrors(payload.error.details);
        }

        throw new Error(
          payload.success ? "Unable to save vendor." : payload.error.message,
        );
      }

      onSaved(payload.data, isEditMode ? "edit" : "create");
      resetDialogState();
      onClose();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to save vendor. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Vendor" : "Add Vendor";
  const passwordLabel = isEditMode ? "New Password" : "Password";

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-[#101827]/45 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vendor-onboarding-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[560px] rounded-[1.8rem] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)] sm:p-8"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8ea06f]">
              Vendor Setup
            </p>
            <h2
              id="vendor-onboarding-title"
              className="mt-2 text-[2rem] font-semibold tracking-tight text-[#17213d]"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dbe3ee] text-[#64748b] transition-colors hover:bg-[#f5f8fc] hover:text-[#17213d]"
            aria-label="Close vendor form"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              Name
            </span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640] focus:bg-white"
              placeholder="Vendor name"
              autoComplete="organization"
              required
            />
            <FieldError message={fieldErrors.name} />
          </label>

          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              Email
            </span>
            <input
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640] focus:bg-white"
              placeholder="vendor@example.com"
              autoComplete="email"
              required
              type="email"
            />
            <FieldError message={fieldErrors.email} />
          </label>

          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              Status
            </span>
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none transition-colors focus:border-[#477640] focus:bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.status} />
          </label>

          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              {passwordLabel}
            </span>
            <input
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640] focus:bg-white"
              placeholder={isEditMode ? "Leave blank to keep current password" : "Minimum 8 characters"}
              autoComplete="new-password"
              minLength={8}
              required={!isEditMode}
              type="password"
            />
            <FieldError message={fieldErrors.password} />
          </label>
        </div>

        {formError ? (
          <div className="mt-6 rounded-2xl border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">
            {formError}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#dbe3ee] bg-white px-5 text-base font-semibold text-[#334155]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isSubmitting ? "Saving..." : title}
          </button>
        </div>
      </form>
    </div>
  );
}
