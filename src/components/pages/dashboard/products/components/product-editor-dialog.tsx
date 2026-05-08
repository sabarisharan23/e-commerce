"use client";

import { type FormEvent, useState } from "react";

export type ProductStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type ProductRecord = {
  category: string;
  categoryTag: string;
  createdAt: string;
  description: string;
  highlights: string[];
  id: string;
  imageAlt: string;
  imageSrc: string;
  name: string;
  originalPrice: number | null;
  price: number;
  productCode: string;
  rating: number;
  saleLabel: string | null;
  shortDescription: string;
  sku: string;
  slug: string;
  status: ProductStatus;
  stockUnits: number;
  updatedAt: string;
  weight: string;
};

type ProductDialogMode = "create" | "edit";

type ProductEditorDialogProps = {
  mode?: ProductDialogMode;
  onClose: () => void;
  onSaved: (product: ProductRecord, mode: ProductDialogMode) => void;
  open: boolean;
  product?: ProductRecord | null;
};

type ProductFormState = {
  category: string;
  categoryTag: string;
  description: string;
  highlights: string;
  imageAlt: string;
  imageSrc: string;
  name: string;
  originalPrice: string;
  price: string;
  rating: string;
  saleLabel: string;
  shortDescription: string;
  sku: string;
  slug: string;
  status: ProductStatus;
  stockUnits: string;
  weight: string;
};

type ApiProductResponse =
  | {
      data: ProductRecord;
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

const statusOptions: Array<{ label: string; value: ProductStatus }> = [
  { label: "In Stock", value: "IN_STOCK" },
  { label: "Low Stock", value: "LOW_STOCK" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
];

const emptyForm: ProductFormState = {
  category: "Millet Flour",
  categoryTag: "Millet",
  description: "",
  highlights: "",
  imageAlt: "",
  imageSrc: "",
  name: "",
  originalPrice: "",
  price: "",
  rating: "0",
  saleLabel: "",
  shortDescription: "",
  sku: "",
  slug: "",
  status: "IN_STOCK",
  stockUnits: "0",
  weight: "500 g",
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getInitialForm(mode: ProductDialogMode, product?: ProductRecord | null) {
  if (mode === "edit" && product) {
    return {
      category: product.category,
      categoryTag: product.categoryTag,
      description: product.description,
      highlights: product.highlights.join("\n"),
      imageAlt: product.imageAlt,
      imageSrc: product.imageSrc,
      name: product.name,
      originalPrice: product.originalPrice?.toString() ?? "",
      price: product.price.toString(),
      rating: product.rating.toString(),
      saleLabel: product.saleLabel ?? "",
      shortDescription: product.shortDescription,
      sku: product.sku,
      slug: product.slug,
      status: product.status,
      stockUnits: product.stockUnits.toString(),
      weight: product.weight,
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

function TextInput({
  autoComplete,
  error,
  label,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
}: {
  autoComplete?: string;
  error?: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
        {label}
      </span>
      <input
        autoComplete={autoComplete}
        className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640] focus:bg-white"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      <FieldError message={error} />
    </label>
  );
}

export function ProductEditorDialog({
  mode = "create",
  onClose,
  onSaved,
  open,
  product,
}: ProductEditorDialogProps) {
  const [form, setForm] = useState<ProductFormState>(() => getInitialForm(mode, product));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  if (!open || (mode === "edit" && !product)) {
    return null;
  }

  function resetDialogState() {
    setForm(emptyForm);
    setFieldErrors({});
    setFormError("");
    setIsSubmitting(false);
    setSlugTouched(false);
  }

  function handleClose() {
    resetDialogState();
    onClose();
  }

  function updateField(field: keyof ProductFormState, value: string) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "name" && mode === "create" && !slugTouched) {
        next.slug = slugify(value);
      }

      return next;
    });

    if (field === "slug") {
      setSlugTouched(true);
    }

    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setFormError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    const isEditMode = mode === "edit" && product;
    const highlights = form.highlights
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    const requestBody = {
      category: form.category,
      categoryTag: form.categoryTag,
      description: form.description,
      highlights,
      imageAlt: form.imageAlt,
      imageSrc: form.imageSrc,
      name: form.name,
      originalPrice: form.originalPrice || null,
      price: form.price,
      rating: form.rating,
      saleLabel: form.saleLabel || null,
      shortDescription: form.shortDescription,
      sku: form.sku,
      slug: form.slug || undefined,
      status: form.status,
      stockUnits: form.stockUnits,
      weight: form.weight,
    };

    try {
      const response = await fetch(
        isEditMode ? `/api/v1/products/${product.id}` : "/api/v1/products",
        {
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
          method: isEditMode ? "PATCH" : "POST",
        },
      );
      const payload = (await response.json()) as ApiProductResponse;

      if (!response.ok || !payload.success) {
        if (!payload.success && payload.error.details) {
          setFieldErrors(payload.error.details);
        }

        throw new Error(
          payload.success ? "Unable to save product." : payload.error.message,
        );
      }

      onSaved(payload.data, isEditMode ? "edit" : "create");
      resetDialogState();
      onClose();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to save product. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Product" : "Add Product";

  return (
    <div
      aria-labelledby="product-editor-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-[#101827]/45 px-4 py-8 backdrop-blur-sm"
      role="dialog"
    >
      <form
        className="max-h-[92vh] w-full max-w-[860px] overflow-y-auto rounded-[1.8rem] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)] sm:p-8"
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8ea06f]">
              Product Catalog
            </p>
            <h2
              className="mt-2 text-[2rem] font-semibold tracking-tight text-[#17213d]"
              id="product-editor-title"
            >
              {title}
            </h2>
          </div>

          <button
            aria-label="Close product form"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dbe3ee] text-[#64748b] transition-colors hover:bg-[#f5f8fc] hover:text-[#17213d]"
            onClick={handleClose}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <TextInput
            error={fieldErrors.name}
            label="Product Name"
            onChange={(value) => updateField("name", value)}
            placeholder="Diet Choize Chia Seed Finger Millet Flour"
            required
            value={form.name}
          />
          <TextInput
            error={fieldErrors.sku}
            label="SKU"
            onChange={(value) => updateField("sku", value)}
            placeholder="TS-MF-001"
            required
            value={form.sku}
          />
          <TextInput
            error={fieldErrors.slug}
            label="Slug"
            onChange={(value) => updateField("slug", value)}
            placeholder="diet-choize-chia-seed-finger-millet-flour"
            value={form.slug}
          />
          <TextInput
            error={fieldErrors.imageSrc}
            label="Product Image"
            onChange={(value) => updateField("imageSrc", value)}
            placeholder="/home/deal-of-day/diet-choize-chia-seed-finger-millet-flour.png"
            required
            value={form.imageSrc}
          />
          <TextInput
            error={fieldErrors.category}
            label="Category"
            onChange={(value) => updateField("category", value)}
            placeholder="Millet Flour"
            required
            value={form.category}
          />
          <TextInput
            error={fieldErrors.categoryTag}
            label="Category Tag"
            onChange={(value) => updateField("categoryTag", value)}
            placeholder="Millet"
            value={form.categoryTag}
          />
          <TextInput
            error={fieldErrors.price}
            label="Price"
            onChange={(value) => updateField("price", value)}
            placeholder="250"
            required
            type="number"
            value={form.price}
          />
          <TextInput
            error={fieldErrors.originalPrice}
            label="Original Price"
            onChange={(value) => updateField("originalPrice", value)}
            placeholder="352"
            type="number"
            value={form.originalPrice}
          />
          <TextInput
            error={fieldErrors.stockUnits}
            label="Stock Units"
            onChange={(value) => updateField("stockUnits", value)}
            placeholder="42"
            required
            type="number"
            value={form.stockUnits}
          />
          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              Stock Status
            </span>
            <select
              className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none transition-colors focus:border-[#477640] focus:bg-white"
              onChange={(event) => updateField("status", event.target.value)}
              value={form.status}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.status} />
          </label>
          <TextInput
            error={fieldErrors.weight}
            label="Weight"
            onChange={(value) => updateField("weight", value)}
            placeholder="500 g"
            value={form.weight}
          />
          <TextInput
            error={fieldErrors.rating}
            label="Rating"
            onChange={(value) => updateField("rating", value)}
            placeholder="4.2"
            type="number"
            value={form.rating}
          />
          <TextInput
            error={fieldErrors.saleLabel}
            label="Sale Label"
            onChange={(value) => updateField("saleLabel", value)}
            placeholder="Sale 50%"
            value={form.saleLabel}
          />
          <TextInput
            error={fieldErrors.imageAlt}
            label="Image Alt Text"
            onChange={(value) => updateField("imageAlt", value)}
            placeholder="Diet Choize chia seed finger millet flour package."
            value={form.imageAlt}
          />
        </div>

        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              Short Description
            </span>
            <textarea
              className="mt-2 min-h-24 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 py-3 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640] focus:bg-white"
              onChange={(event) => updateField("shortDescription", event.target.value)}
              placeholder="Stone-ground flour blend for rotis, dosas, and wholesome baking."
              required
              value={form.shortDescription}
            />
            <FieldError message={fieldErrors.shortDescription} />
          </label>

          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              Full Description
            </span>
            <textarea
              className="mt-2 min-h-28 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 py-3 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640] focus:bg-white"
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="A nourishing flour blend made with finger millet and chia seeds."
              required
              value={form.description}
            />
            <FieldError message={fieldErrors.description} />
          </label>

          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              Highlights
            </span>
            <textarea
              className="mt-2 min-h-28 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 py-3 text-base text-[#24304a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#477640] focus:bg-white"
              onChange={(event) => updateField("highlights", event.target.value)}
              placeholder={"Rich in calcium and dietary fiber.\nWorks well for porridge and rotis."}
              value={form.highlights}
            />
            <FieldError message={fieldErrors.highlights} />
          </label>
        </div>

        {formError ? (
          <div className="mt-6 rounded-2xl border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">
            {formError}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#dbe3ee] bg-white px-5 text-base font-semibold text-[#334155]"
            onClick={handleClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-65"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : title}
          </button>
        </div>
      </form>
    </div>
  );
}
