"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import type { ProductRecord, ProductStatus } from "./components/product-editor-dialog";

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
  | { data: ProductRecord; success: true }
  | {
      error: {
        code: string;
        details?: Record<string, string>;
        message: string;
      };
      success: false;
    };

type ApiProductImageResponse =
  | { data: { imageSrc: string }; success: true }
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
  | { data: TData[]; success: true }
  | { error: { message: string }; success: false };

const emptyForm: ProductFormState = {
  category: "Millet Flour",
  categoryId: "",
  categoryTag: "",
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
  stockUnits: "100",
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

function SearchBreadcrumb() {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-[#7c8ba2]">
      <span>Products</span>
      <span aria-hidden="true">›</span>
      <span className="text-[#477640]">Add New Product</span>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.3" />
      <path d="m20.5 16-4.8-4.8a1.5 1.5 0 0 0-2.1 0L7.5 17.3" />
    </svg>
  );
}

function OrgIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="5" height="5" rx="1.2" />
      <rect x="15" y="4" width="5" height="5" rx="1.2" />
      <rect x="9.5" y="15" width="5" height="5" rx="1.2" />
      <path d="M6.5 9v3h11V9" />
      <path d="M12 12v3" />
    </svg>
  );
}

function AlertsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a5 5 0 0 0-5 5c0 6-3 7-3 7h16s-3-1-3-7a5 5 0 0 0-5-5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function PricingIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 12h10" />
      <path d="M7 9h3M14 15h3" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 4h11l3 3v13H5Z" />
      <path d="M8 4v6h8V4" />
      <path d="M9 16h6" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 16V6" />
      <path d="m8 10 4-4 4 4" />
      <path d="M5 18a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-medium text-[#c2410c]">{message}</p>;
}

function SectionTitle({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-[#477640]">{icon}</span>
        <h2 className="text-[1.05rem] font-semibold text-[#1d2840]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#72839d]">
      {children}
    </span>
  );
}

function TextInput({
  error,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <>
      <input
        className="h-12 w-full rounded-2xl border border-[#dde4ef] bg-[#f8f9fd] px-4 text-[1rem] text-[#1f2a44] outline-none transition-colors placeholder:text-[#adb8ca] focus:border-[#477640] focus:bg-white"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      <FieldError message={error} />
    </>
  );
}

function Toggle({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f6f7fb] px-4 py-3">
      <div>
        <p className="text-[1rem] font-semibold text-[#1f2a44]">{label}</p>
        <p className="text-sm text-[#7e8ea7]">{description}</p>
      </div>
      <button
        aria-pressed={checked}
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#477640]" : "bg-[#d7dfeb]"
        }`}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export function DashboardProductCreatePage() {
  const router = useRouter();
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const imagePreviewUrlRef = useRef<string | null>(null);
  const [categories, setCategories] = useState<TaxonomyOption[]>([]);
  const [tags, setTags] = useState<TaxonomyOption[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [taxonomyError, setTaxonomyError] = useState("");
  const [formError, setFormError] = useState("");
  const [isTaxonomyLoading, setIsTaxonomyLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [storefrontVisible, setStorefrontVisible] = useState(true);

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

        if (!isMounted) {
          return;
        }

        setCategories(categoriesPayload.data);
        setTags(tagsPayload.data);
      } catch (error) {
        if (isMounted) {
          setTaxonomyError(
            error instanceof Error ? error.message : "Unable to load product taxonomy.",
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

  const selectedTag = tags.find((tag) => tag.id === form.tagId) ?? null;
  const selectedCategory = categories.find((category) => category.id === form.categoryId) ?? null;

  const score = useMemo(() => {
    const checks = [
      Boolean(form.name.trim()),
      Boolean(form.description.trim()),
      Boolean(form.shortDescription.trim()),
      Boolean(form.price.trim()),
      Boolean(form.categoryId),
      Boolean(form.tagId),
      Boolean(form.imageSrc || imagePreviewSrc),
      Number(form.stockUnits) > 0,
      Boolean(form.imageAlt.trim()),
    ];
    const completed = checks.filter(Boolean).length;
    const percentage = Math.round((completed / checks.length) * 100);

    return {
      completed,
      percentage,
      total: checks.length,
    };
  }, [form, imagePreviewSrc]);

  function updateField(field: keyof ProductFormState, value: string) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "name" && !slugTouched) {
        next.slug = slugify(value);
      }

      if (field === "stockUnits" && Number(value) <= 0) {
        next.status = "OUT_OF_STOCK";
      } else if (field === "stockUnits" && Number(value) < 20) {
        next.status = "LOW_STOCK";
      } else if (field === "stockUnits") {
        next.status = storefrontVisible ? "IN_STOCK" : "OUT_OF_STOCK";
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
    const category = categories.find((item) => item.id === value);

    setForm((current) => ({
      ...current,
      category: category?.name ?? current.category,
      categoryId: value,
      categoryTag: current.tagId ? current.categoryTag : category?.name ?? "",
    }));
    setFieldErrors((current) => ({ ...current, category: "", categoryId: "" }));
  }

  function updateTag(value: string) {
    const tag = tags.find((item) => item.id === value);

    setForm((current) => ({
      ...current,
      categoryTag: tag?.name ?? "",
      tagId: value,
    }));
    setFieldErrors((current) => ({ ...current, categoryTag: "", tagId: "" }));
  }

  function insertDescriptionText(prefix: string, suffix = "") {
    const textarea = descriptionRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.description.slice(start, end);
    const nextValue =
      form.description.slice(0, start) +
      prefix +
      selected +
      suffix +
      form.description.slice(end);

    updateField("description", nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPosition = start + prefix.length + selected.length + suffix.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
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

    const highlights = form.highlights
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const imageSrc = await uploadProductImage();
      const response = await fetch("/api/v1/products", {
        body: JSON.stringify({
          category: form.category,
          categoryId: form.categoryId,
          categoryTag: form.categoryTag,
          description: form.description,
          highlights,
          imageAlt: form.imageAlt,
          imageSrc,
          name: form.name,
          originalPrice: form.originalPrice || null,
          price: form.price,
          rating: form.rating,
          saleLabel: form.saleLabel || null,
          shortDescription: form.shortDescription,
          sku: form.sku,
          slug: form.slug || undefined,
          status: storefrontVisible ? form.status : "OUT_OF_STOCK",
          stockUnits: form.stockUnits,
          tagId: form.tagId || null,
          weight: form.weight,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json()) as ApiProductResponse;

      if (!response.ok || !payload.success) {
        if (!payload.success && payload.error.details) {
          setFieldErrors(payload.error.details);
        }

        throw new Error(
          payload.success ? "Unable to save product." : payload.error.message,
        );
      }

      router.push("/dashboard/products");
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

  return (
    <DashboardShell mobileTitle="Add Product">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <SearchBreadcrumb />
            <h1 className="mt-2 text-[2.4rem] font-semibold tracking-tight text-[#17213d]">
              Add New Product
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#dbe3ee] bg-white px-6 text-base font-semibold text-[#334155] transition-colors hover:bg-[#f7f8fc]"
              onClick={() => router.push("/dashboard/products")}
              type="button"
            >
              Discard
            </button>
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-colors hover:bg-[#3d6637] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              <SaveIcon />
              <span>{isSubmitting ? "Saving..." : "Save Product"}</span>
            </button>
          </div>
        </section>

        {taxonomyError ? (
          <div className="rounded-2xl border border-[#f7d3b0] bg-[#fff8ef] px-5 py-4 text-sm font-medium text-[#b45309]">
            {taxonomyError}
          </div>
        ) : null}

        {formError ? (
          <div className="rounded-2xl border border-[#fecaca] bg-[#fff1f2] px-5 py-4 text-sm font-medium text-[#b91c1c]">
            {formError}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_320px]">
          <div className="space-y-6">
            <DashboardPanel className="rounded-[1.75rem]">
              <SectionTitle icon={<InfoIcon />} title="Basic Information" />
              <div className="space-y-5">
                <label className="block">
                  <FieldLabel>Product Name</FieldLabel>
                  <TextInput
                    error={fieldErrors.name}
                    onChange={(value) => updateField("name", value)}
                    placeholder="e.g. Organic Pearl Millet"
                    value={form.name}
                  />
                </label>

                <label className="block">
                  <FieldLabel>Short Description</FieldLabel>
                  <textarea
                    className="min-h-[96px] w-full rounded-2xl border border-[#dde4ef] bg-[#f8f9fd] px-4 py-3 text-[1rem] text-[#1f2a44] outline-none transition-colors placeholder:text-[#adb8ca] focus:border-[#477640] focus:bg-white"
                    onChange={(event) => updateField("shortDescription", event.target.value)}
                    placeholder="One-line summary that appears in product cards."
                    value={form.shortDescription}
                  />
                  <FieldError message={fieldErrors.shortDescription} />
                </label>

                <label className="block">
                  <FieldLabel>Description</FieldLabel>
                  <div className="overflow-hidden rounded-2xl border border-[#dde4ef] bg-[#f8f9fd]">
                    <div className="flex items-center gap-1 border-b border-[#e4e9f2] px-3 py-2 text-[#6c7c95]">
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold hover:bg-white"
                        onClick={() => insertDescriptionText("**", "**")}
                        type="button"
                      >
                        B
                      </button>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm italic hover:bg-white"
                        onClick={() => insertDescriptionText("_", "_")}
                        type="button"
                      >
                        I
                      </button>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm hover:bg-white"
                        onClick={() => insertDescriptionText("\n- ")}
                        type="button"
                      >
                        •
                      </button>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm hover:bg-white"
                        onClick={() => insertDescriptionText("[", "](https://)")}
                        type="button"
                      >
                        ⛓
                      </button>
                    </div>
                    <textarea
                      ref={descriptionRef}
                      className="min-h-[164px] w-full bg-transparent px-4 py-4 text-[1rem] text-[#1f2a44] outline-none placeholder:text-[#adb8ca]"
                      onChange={(event) => updateField("description", event.target.value)}
                      placeholder="Describe the product benefits, nutritional value, and best use cases..."
                      value={form.description}
                    />
                  </div>
                  <FieldError message={fieldErrors.description} />
                </label>
              </div>
            </DashboardPanel>

            <DashboardPanel className="rounded-[1.75rem]">
              <SectionTitle
                icon={<ImageIcon />}
                title="Product Images"
                action={
                  <span className="rounded-xl bg-[#f3f5fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#7d8da4]">
                    Max 5 Images
                  </span>
                }
              />
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[#d4dfd1] bg-[#fbfdf9] px-6 text-center text-[#7a9470]">
                  <input
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="sr-only"
                    onChange={handleImageChange}
                    type="file"
                  />
                  {imagePreviewSrc ? (
                    <div className="relative h-full min-h-[220px] w-full overflow-hidden rounded-[1.3rem]">
                      <Image
                        alt={form.imageAlt || form.name || "Product preview"}
                        fill
                        sizes="(max-width: 1200px) 100vw, 420px"
                        src={imagePreviewSrc}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <>
                      <UploadIcon />
                      <p className="mt-4 text-base font-semibold text-[#587a4f]">
                        Upload Main Image
                      </p>
                      <p className="mt-2 text-sm text-[#8ba181]">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </label>

                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((slot) => (
                    <div
                      key={slot}
                      className="flex min-h-[132px] items-center justify-center rounded-[1.4rem] border border-[#e1e7f0] bg-[#f8f9fd] text-[#71829a]"
                    >
                      {slot === 0 && imagePreviewSrc ? (
                        <div className="relative h-full min-h-[132px] w-full overflow-hidden rounded-[1.4rem] bg-white">
                          <Image
                            alt={form.imageAlt || form.name || "Product preview"}
                            fill
                            sizes="160px"
                            src={imagePreviewSrc}
                            className="object-contain p-3"
                          />
                        </div>
                      ) : (
                        <PlusIcon />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <FieldLabel>Image Alt Text</FieldLabel>
                  <TextInput
                    error={fieldErrors.imageAlt}
                    onChange={(value) => updateField("imageAlt", value)}
                    placeholder="Describe the package shown in the image"
                    value={form.imageAlt}
                  />
                </label>
                <label className="block">
                  <FieldLabel>Highlights</FieldLabel>
                  <textarea
                    className="min-h-[108px] w-full rounded-2xl border border-[#dde4ef] bg-[#f8f9fd] px-4 py-3 text-[1rem] text-[#1f2a44] outline-none transition-colors placeholder:text-[#adb8ca] focus:border-[#477640] focus:bg-white"
                    onChange={(event) => updateField("highlights", event.target.value)}
                    placeholder={"Rich in fibre\nStone-ground texture\nWorks well for rotis"}
                    value={form.highlights}
                  />
                  <FieldError message={fieldErrors.highlights || fieldErrors.imageSrc} />
                </label>
              </div>
            </DashboardPanel>

            <DashboardPanel className="rounded-[1.75rem]">
              <SectionTitle icon={<PricingIcon />} title="Pricing & Inventory" />
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <FieldLabel>Base Price (₹)</FieldLabel>
                  <TextInput
                    error={fieldErrors.price}
                    onChange={(value) => updateField("price", value)}
                    placeholder="0.00"
                    type="number"
                    value={form.price}
                  />
                </label>
                <label className="block">
                  <FieldLabel>Original Price (₹)</FieldLabel>
                  <TextInput
                    error={fieldErrors.originalPrice}
                    onChange={(value) => updateField("originalPrice", value)}
                    placeholder="0.00"
                    type="number"
                    value={form.originalPrice}
                  />
                </label>
                <label className="block">
                  <FieldLabel>Stock Quantity</FieldLabel>
                  <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] overflow-hidden rounded-2xl border border-[#dde4ef] bg-[#f8f9fd]">
                    <button
                      className="text-2xl text-[#334155] hover:bg-white"
                      onClick={() =>
                        updateField("stockUnits", String(Math.max(Number(form.stockUnits || 0) - 1, 0)))
                      }
                      type="button"
                    >
                      −
                    </button>
                    <input
                      className="h-12 border-x border-[#dde4ef] bg-transparent px-4 text-center text-[1.05rem] font-semibold text-[#1f2a44] outline-none"
                      onChange={(event) => updateField("stockUnits", event.target.value)}
                      type="number"
                      value={form.stockUnits}
                    />
                    <button
                      className="text-2xl text-[#334155] hover:bg-white"
                      onClick={() =>
                        updateField("stockUnits", String(Number(form.stockUnits || 0) + 1))
                      }
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  <FieldError message={fieldErrors.stockUnits} />
                </label>
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <label className="block">
                    <FieldLabel>SKU Code</FieldLabel>
                    <TextInput
                      error={fieldErrors.sku}
                      onChange={(value) => updateField("sku", value)}
                      placeholder="PROD-MIL-001"
                      value={form.sku}
                    />
                  </label>
                  <button
                    className="mt-[1.65rem] h-12 rounded-2xl bg-[#eaf1e6] px-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#5e7a58]"
                    onClick={() => {
                      const prefix = selectedCategory?.slug?.slice(0, 3).toUpperCase() ?? "PRD";
                      updateField("sku", `${prefix}-${Math.floor(Math.random() * 900 + 100)}`);
                    }}
                    type="button"
                  >
                    Auto SKU
                  </button>
                </div>
                <label className="block">
                  <FieldLabel>Slug</FieldLabel>
                  <TextInput
                    error={fieldErrors.slug}
                    onChange={(value) => updateField("slug", value)}
                    placeholder="organic-pearl-millet"
                    value={form.slug}
                  />
                </label>
                <label className="block">
                  <FieldLabel>Weight</FieldLabel>
                  <TextInput
                    error={fieldErrors.weight}
                    onChange={(value) => updateField("weight", value)}
                    placeholder="500 g"
                    value={form.weight}
                  />
                </label>
              </div>
            </DashboardPanel>
          </div>

          <div className="space-y-6">
            <DashboardPanel className="rounded-[1.75rem]">
              <SectionTitle icon={<OrgIcon />} title="Organization" />
              <div className="space-y-5">
                <label className="block">
                  <FieldLabel>Category</FieldLabel>
                  <select
                    className="h-12 w-full rounded-2xl border border-[#dde4ef] bg-[#f8f9fd] px-4 text-[1rem] text-[#1f2a44] outline-none"
                    disabled={isTaxonomyLoading || categories.length === 0}
                    onChange={(event) => updateCategory(event.target.value)}
                    value={form.categoryId}
                  >
                    <option value="">
                      {isTaxonomyLoading
                        ? "Loading categories..."
                        : categories.length === 0
                          ? "Add a category first"
                          : "Select Category"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <FieldError message={fieldErrors.categoryId || fieldErrors.category} />
                </label>

                <div className="block">
                  <FieldLabel>Product Tags</FieldLabel>
                  <div className="mb-3 flex min-h-10 flex-wrap gap-2">
                    {selectedTag ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#eef4eb] px-3 py-1.5 text-sm font-medium text-[#55744d]">
                        {selectedTag.name}
                        <button
                          className="text-[#7d8f74]"
                          onClick={() => updateTag("")}
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ) : (
                      <span className="text-sm text-[#94a3b8]">No tag selected yet</span>
                    )}
                  </div>
                  <select
                    className="h-12 w-full rounded-2xl border border-[#dde4ef] bg-[#f8f9fd] px-4 text-[1rem] text-[#1f2a44] outline-none"
                    disabled={isTaxonomyLoading}
                    onChange={(event) => updateTag(event.target.value)}
                    value={form.tagId}
                  >
                    <option value="">Add tag...</option>
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                  <FieldError message={fieldErrors.tagId} />
                </div>

                <label className="block">
                  <FieldLabel>Sale Label</FieldLabel>
                  <TextInput
                    error={fieldErrors.saleLabel}
                    onChange={(value) => updateField("saleLabel", value)}
                    placeholder="Bestseller"
                    value={form.saleLabel}
                  />
                </label>

                <label className="block">
                  <FieldLabel>Rating</FieldLabel>
                  <TextInput
                    error={fieldErrors.rating}
                    onChange={(value) => updateField("rating", value)}
                    placeholder="4.8"
                    type="number"
                    value={form.rating}
                  />
                </label>
              </div>
            </DashboardPanel>

            <DashboardPanel className="rounded-[1.75rem]">
              <SectionTitle icon={<AlertsIcon />} title="Alerts & Visibility" />
              <div className="space-y-3">
                <Toggle
                  checked={lowStockAlert}
                  description="Notify when below 20 units"
                  label="Low stock alert"
                  onChange={setLowStockAlert}
                />
                <Toggle
                  checked={storefrontVisible}
                  description="Visible on store frontend"
                  label="Product Status"
                  onChange={(value) => {
                    setStorefrontVisible(value);
                    setForm((current) => ({
                      ...current,
                      status: value
                        ? Number(current.stockUnits) < 20
                          ? "LOW_STOCK"
                          : "IN_STOCK"
                        : "OUT_OF_STOCK",
                    }));
                  }}
                />
              </div>
            </DashboardPanel>

            <section className="overflow-hidden rounded-[1.75rem] bg-[#477640] p-6 text-white shadow-[0_18px_40px_rgba(71,118,64,0.25)]">
              <p className="text-sm uppercase tracking-[0.18em] text-[#d7ead2]">Catalog Score</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-[3rem] font-semibold leading-none">{score.percentage}%</span>
                <span className="pb-2 text-sm font-medium text-[#cbf0c4]">
                  {score.percentage >= 85 ? "Highly Optimized" : "Needs more detail"}
                </span>
              </div>
              <div className="mt-5 h-1.5 rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-[#d8f5d2]"
                  style={{ width: `${score.percentage}%` }}
                />
              </div>
              <p className="mt-5 text-sm leading-7 text-[#edf8ea]">
                Your product listing meets {score.completed} out of {score.total} quality
                benchmarks. Add more detail for a stronger catalog entry.
              </p>
            </section>
          </div>
        </div>
      </form>
    </DashboardShell>
  );
}
