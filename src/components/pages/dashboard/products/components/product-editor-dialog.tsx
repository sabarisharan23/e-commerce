"use client";

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";

export type ProductStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type ProductRecord = {
  category: string;
  categoryId: string | null;
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
  tagId: string | null;
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
  categoryId: string;
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
  tagId: string;
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

type ApiProductImageResponse =
  | {
      data: {
        imageSrc: string;
      };
      success: true;
    }
  | {
      error: {
        details?: Record<string, string>;
        message: string;
      };
      success: false;
    };

type TaxonomyOption = {
  id: string;
  name: string;
  slug: string;
};

type ApiListResponse<TData> =
  | {
      data: TData[];
      success: true;
    }
  | {
      error: {
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
  categoryId: "",
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
  tagId: "",
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
      categoryId: product.categoryId ?? "",
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
      tagId: product.tagId ?? "",
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewSrc, setImagePreviewSrc] = useState(() => product?.imageSrc ?? "");
  const imagePreviewUrlRef = useRef<string | null>(null);
  const [categories, setCategories] = useState<TaxonomyOption[]>([]);
  const [tags, setTags] = useState<TaxonomyOption[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [taxonomyError, setTaxonomyError] = useState("");
  const [isTaxonomyLoading, setIsTaxonomyLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadTaxonomy() {
      setIsTaxonomyLoading(true);
      setTaxonomyError("");

      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch("/api/v1/categories", { cache: "no-store" }),
          fetch("/api/v1/tags", { cache: "no-store" }),
        ]);
        const [categoriesPayload, tagsPayload] = await Promise.all([
          categoriesResponse.json() as Promise<ApiListResponse<TaxonomyOption>>,
          tagsResponse.json() as Promise<ApiListResponse<TaxonomyOption>>,
        ]);

        if (!categoriesResponse.ok || !categoriesPayload.success) {
          throw new Error(
            categoriesPayload.success
              ? "Unable to load categories."
              : categoriesPayload.error.message,
          );
        }

        if (!tagsResponse.ok || !tagsPayload.success) {
          throw new Error(
            tagsPayload.success ? "Unable to load tags." : tagsPayload.error.message,
          );
        }

        if (isMounted) {
          setCategories(categoriesPayload.data);
          setTags(tagsPayload.data);
        }
      } catch (error) {
        if (isMounted) {
          setTaxonomyError(
            error instanceof Error
              ? error.message
              : "Unable to load categories and tags.",
          );
        }
      } finally {
        if (isMounted) {
          setIsTaxonomyLoading(false);
        }
      }
    }

    loadTaxonomy();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!open || (mode === "edit" && !product)) {
    return null;
  }

  function resetDialogState() {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
      imagePreviewUrlRef.current = null;
    }

    setForm(emptyForm);
    setImageFile(null);
    setImagePreviewSrc("");
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

  function updateCategory(value: string) {
    const selectedCategory = categories.find((category) => category.id === value);

    setForm((current) => ({
      ...current,
      category: selectedCategory?.name ?? current.category,
      categoryId: value,
      categoryTag: current.tagId ? current.categoryTag : selectedCategory?.name ?? current.categoryTag,
    }));
    setFieldErrors((current) => ({ ...current, category: "", categoryId: "" }));
    setFormError("");
  }

  function updateTag(value: string) {
    const selectedTag = tags.find((tag) => tag.id === value);

    setForm((current) => ({
      ...current,
      categoryTag: selectedTag?.name ?? current.category,
      tagId: value,
    }));
    setFieldErrors((current) => ({ ...current, categoryTag: "", tagId: "" }));
    setFormError("");
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFieldErrors((current) => ({
        ...current,
        imageSrc: "Choose a PNG, JPG, WEBP, or GIF image.",
      }));
      setFormError("");
      return;
    }

    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
      imagePreviewUrlRef.current = null;
    }

    const previewUrl = URL.createObjectURL(file);
    imagePreviewUrlRef.current = previewUrl;

    setImageFile(file);
    setImagePreviewSrc(previewUrl);
    setFieldErrors((current) => ({ ...current, imageSrc: "" }));
    setFormError("");
  }

  async function uploadProductImage() {
    if (!imageFile) {
      if (!form.imageSrc) {
        setFieldErrors((current) => ({
          ...current,
          imageSrc: "Choose a product image file.",
        }));
        throw new Error("Choose a product image file.");
      }

      return form.imageSrc;
    }

    const imageFormData = new FormData();
    imageFormData.append("image", imageFile);

    const response = await fetch("/api/v1/products/images", {
      body: imageFormData,
      method: "POST",
    });
    const payload = (await response.json()) as ApiProductImageResponse;

    if (!response.ok || !payload.success) {
      if (!payload.success && payload.error.details) {
        setFieldErrors((current) => ({ ...current, ...payload.error.details }));
      }

      throw new Error(
        payload.success ? "Unable to upload product image." : payload.error.message,
      );
    }

    return payload.data.imageSrc;
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
      categoryId: form.categoryId,
      categoryTag: form.categoryTag,
      description: form.description,
      highlights,
      imageAlt: form.imageAlt,
      imageSrc: "",
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
      tagId: form.tagId || null,
      weight: form.weight,
    };

    try {
      const imageSrc = await uploadProductImage();
      const response = await fetch(
        isEditMode ? `/api/v1/products/${product.id}` : "/api/v1/products",
        {
          body: JSON.stringify({ ...requestBody, imageSrc }),
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
  const imageInputId = `product-image-${product?.id ?? "new"}`;
  const selectedImageName = imageFile?.name ?? (form.imageSrc ? "Current image selected" : "");

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

        {taxonomyError ? (
          <div className="mt-6 rounded-2xl border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">
            {taxonomyError}
          </div>
        ) : null}

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
          <div className="block lg:col-span-2">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              Product Image
            </span>
            <div className="mt-2 grid gap-4 rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] p-3 sm:grid-cols-[160px_minmax(0,1fr)]">
              <div
                className="min-h-36 rounded-2xl border border-[#dbe3ee] bg-white bg-contain bg-center bg-no-repeat"
                style={
                  imagePreviewSrc
                    ? { backgroundImage: `url("${imagePreviewSrc}")` }
                    : undefined
                }
              >
                {!imagePreviewSrc ? (
                  <div className="flex h-full min-h-36 items-center justify-center px-4 text-center text-sm font-semibold text-[#94a3b8]">
                    No image selected
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col justify-center">
                <input
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="sr-only"
                  id={imageInputId}
                  onChange={handleImageChange}
                  type="file"
                />
                <label
                  className="inline-flex h-12 w-fit cursor-pointer items-center justify-center rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white transition-colors hover:bg-[#3d6637]"
                  htmlFor={imageInputId}
                >
                  Choose Image
                </label>
                <p className="mt-3 text-sm font-medium text-[#71829a]">
                  {selectedImageName || "PNG, JPG, WEBP, or GIF. Max 5 MB."}
                </p>
                <FieldError message={fieldErrors.imageSrc} />
              </div>
            </div>
          </div>
          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              Product Category
            </span>
            <select
              className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none transition-colors focus:border-[#477640] focus:bg-white"
              disabled={isTaxonomyLoading || categories.length === 0}
              onChange={(event) => updateCategory(event.target.value)}
              required
              value={form.categoryId}
            >
              <option value="">
                {isTaxonomyLoading
                  ? "Loading categories..."
                  : categories.length === 0
                    ? "Add a category first"
                    : "Choose category"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.categoryId || fieldErrors.category} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              Product Tag
            </span>
            <select
              className="mt-2 h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none transition-colors focus:border-[#477640] focus:bg-white"
              disabled={isTaxonomyLoading}
              onChange={(event) => updateTag(event.target.value)}
              value={form.tagId}
            >
              <option value="">No tag</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.tagId} />
          </label>
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
