"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import { productCategoryOptions, productInventoryOverview } from "./products-data";
import {
  ProductEditorDialog,
  type ProductRecord,
  type ProductStatus,
} from "./components/product-editor-dialog";

type ViewMode = "list" | "grid";

type Filters = {
  category: string;
  maxPrice: string;
  minPrice: string;
  status: string;
};

type ApiListProductsResponse =
  | {
      data: ProductRecord[];
      success: true;
    }
  | {
      error: {
        message: string;
      };
      success: false;
    };

const allCategoriesLabel = "All Categories";
const productStatusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "In Stock", value: "IN_STOCK" },
  { label: "Low Stock", value: "LOW_STOCK" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
];

function GridViewIcon() {
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
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" />
    </svg>
  );
}

function ListViewIcon() {
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
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

function FilterIcon() {
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
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </svg>
  );
}

function PlusIcon() {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m4 20 4.2-1 9-9a2 2 0 0 0-2.8-2.8l-9 9L4 20Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7v12h10V7" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 stroke-current"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 stroke-current"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function statusBadgeClass(status: ProductStatus) {
  if (status === "IN_STOCK") {
    return "bg-[#e7f8ef] text-[#0c9b61]";
  }

  if (status === "LOW_STOCK") {
    return "bg-[#fff4da] text-[#d07a00]";
  }

  return "bg-[#ffe9e9] text-[#e24646]";
}

function statusDotClass(status: ProductStatus) {
  if (status === "IN_STOCK") {
    return "bg-[#19b27a]";
  }

  if (status === "LOW_STOCK") {
    return "bg-[#f2a11c]";
  }

  return "bg-[#ef4f4f]";
}

function statusText(status: ProductStatus) {
  if (status === "IN_STOCK") {
    return "In Stock";
  }

  if (status === "LOW_STOCK") {
    return "Low Stock";
  }

  return "Out of Stock";
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

async function getApiErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as ApiListProductsResponse;

    if (!payload.success) {
      return payload.error.message;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function getCategoryOptions(products: ProductRecord[]) {
  const categories = new Set(productCategoryOptions);

  products.forEach((product) => {
    categories.add(product.category);
  });

  categories.delete(allCategoriesLabel);

  return [allCategoriesLabel, ...Array.from(categories).sort()];
}

function OverviewCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "danger" | "default" | "success" | "warning";
  value: string;
}) {
  const valueClass =
    tone === "warning"
      ? "text-[#d47a07]"
      : tone === "danger"
        ? "text-[#ef4f4f]"
        : tone === "success"
          ? "text-[#477640]"
          : "text-[#17213d]";

  return (
    <article className="rounded-[1.7rem] border border-[#e8edf4] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">
        {label}
      </p>
      <p className={`mt-3 text-[2.2rem] font-semibold tracking-tight ${valueClass}`}>
        {value}
      </p>
    </article>
  );
}

function ViewToggle({
  onChange,
  viewMode,
}: {
  onChange: (mode: ViewMode) => void;
  viewMode: ViewMode;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-[#dbe3ee] bg-white p-1 shadow-[0_10px_24px_rgba(20,31,56,0.05)]">
      <button
        aria-label="Show product grid"
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          viewMode === "grid"
            ? "bg-[#eef4eb] text-[#477640]"
            : "text-[#64748b] hover:bg-[#f5f8fc]"
        }`}
        onClick={() => onChange("grid")}
        type="button"
      >
        <GridViewIcon />
      </button>
      <button
        aria-label="Show product list"
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          viewMode === "list"
            ? "bg-[#eef4eb] text-[#477640]"
            : "text-[#64748b] hover:bg-[#f5f8fc]"
        }`}
        onClick={() => onChange("list")}
        type="button"
      >
        <ListViewIcon />
      </button>
    </div>
  );
}

function ProductImage({ product, sizes }: { product: ProductRecord; sizes: string }) {
  return (
    <Image
      alt={product.imageAlt || product.name}
      className="object-contain p-2"
      fill
      sizes={sizes}
      src={product.imageSrc}
    />
  );
}

function ProductListRow({
  deletingProductId,
  onDelete,
  onEdit,
  product,
}: {
  deletingProductId: string;
  onDelete: (productId: string) => void;
  onEdit: (productId: string) => void;
  product: ProductRecord;
}) {
  return (
    <tr>
      <td className="border-b border-[#edf1f6] px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-[#dbe3ee] bg-white">
            <ProductImage product={product} sizes="56px" />
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 max-w-[260px] text-[1.05rem] font-medium text-[#24304a]">
              {product.name}
            </p>
            <p className="mt-1 text-sm text-[#94a3b8]">SKU: {product.sku}</p>
          </div>
        </div>
      </td>
      <td className="border-b border-[#edf1f6] px-6 py-5">
        <span className="inline-flex rounded-full bg-[#edf3ea] px-3 py-1 text-sm font-semibold text-[#5f7a55]">
          {product.categoryTag || product.category}
        </span>
      </td>
      <td className="border-b border-[#edf1f6] px-6 py-5">
        <div className="flex items-center gap-2 text-[1.02rem]">
          <span className={`h-2.5 w-2.5 rounded-full ${statusDotClass(product.status)}`} />
          <span className="font-medium text-[#334155]">{statusText(product.status)}</span>
          <span className="text-sm text-[#94a3b8]">({product.stockUnits} units)</span>
        </div>
      </td>
      <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.05rem] font-semibold text-[#17213d]">
        <div className="flex flex-col">
          <span>{formatPrice(product.price)}</span>
          {product.originalPrice ? (
            <span className="text-sm font-medium text-[#94a3b8] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>
      </td>
      <td className="border-b border-[#edf1f6] px-6 py-5">
        <div className="flex items-center justify-end gap-3 text-[#94a3b8]">
          <button
            aria-label={`Edit ${product.name}`}
            className="transition-colors hover:text-[#477640]"
            onClick={() => onEdit(product.id)}
            type="button"
          >
            <EditIcon />
          </button>
          <button
            aria-label={`Delete ${product.name}`}
            className="transition-colors hover:text-[#e24646] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={deletingProductId === product.id}
            onClick={() => onDelete(product.id)}
            type="button"
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ProductListCard({
  deletingProductId,
  onDelete,
  onEdit,
  product,
}: {
  deletingProductId: string;
  onDelete: (productId: string) => void;
  onEdit: (productId: string) => void;
  product: ProductRecord;
}) {
  return (
    <article className="rounded-[1.6rem] border border-[#e8edf4] bg-white p-4 shadow-[0_14px_30px_rgba(20,31,56,0.04)]">
      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#dbe3ee] bg-white">
          <ProductImage product={product} sizes="96px" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${statusBadgeClass(
                product.status,
              )}`}
            >
              {statusText(product.status)}
            </span>
            <span className="inline-flex rounded-full bg-[#edf3ea] px-2.5 py-1 text-xs font-semibold text-[#5f7a55]">
              {product.categoryTag || product.category}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-base font-semibold text-[#24304a]">
            {product.name}
          </p>
          <p className="mt-2 line-clamp-1 text-sm text-[#71829a]">
            {product.shortDescription}
          </p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xl font-semibold text-[#477640]">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-[#94a3b8]">{product.stockUnits} units</p>
            </div>
            <div className="flex items-center gap-2 text-[#94a3b8]">
              <button
                aria-label={`Edit ${product.name}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe3ee]"
                onClick={() => onEdit(product.id)}
                type="button"
              >
                <EditIcon />
              </button>
              <button
                aria-label={`Delete ${product.name}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe3ee] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={deletingProductId === product.id}
                onClick={() => onDelete(product.id)}
                type="button"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductGridCard({
  deletingProductId,
  onDelete,
  onEdit,
  product,
}: {
  deletingProductId: string;
  onDelete: (productId: string) => void;
  onEdit: (productId: string) => void;
  product: ProductRecord;
}) {
  return (
    <article className="rounded-[1.6rem] border border-[#e8edf4] bg-white p-3 shadow-[0_16px_34px_rgba(20,31,56,0.04)]">
      <div className="relative overflow-hidden rounded-2xl border border-[#dbe3ee] bg-white">
        <span
          className={`absolute left-4 top-4 z-10 inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${statusBadgeClass(
            product.status,
          )}`}
        >
          {product.saleLabel || statusText(product.status)}
        </span>
        <div className="relative h-[210px] w-full">
          <ProductImage product={product} sizes="(max-width: 768px) 100vw, 25vw" />
        </div>
      </div>
      <div className="px-1 pb-1 pt-4">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">
          {product.category}
        </p>
        <p className="mt-2 line-clamp-2 text-[1.05rem] font-semibold text-[#24304a]">
          {product.name}
        </p>
        <p className="mt-2 line-clamp-1 text-sm text-[#71829a]">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[1.05rem] font-semibold text-[#477640]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice ? (
            <span className="text-sm font-medium text-[#94a3b8] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[#edf1f6] pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9aa6ba]">
              Stock
            </p>
            <p className="mt-1 text-[1.02rem] font-semibold text-[#24304a]">
              {product.stockUnits} units
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#94a3b8]">
            <button
              aria-label={`Edit ${product.name}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe3ee] transition-colors hover:text-[#477640]"
              onClick={() => onEdit(product.id)}
              type="button"
            >
              <EditIcon />
            </button>
            <button
              aria-label={`Delete ${product.name}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe3ee] transition-colors hover:text-[#e24646] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={deletingProductId === product.id}
              onClick={() => onDelete(product.id)}
              type="button"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Pagination({
  currentPage,
  onChange,
  totalPages,
}: {
  currentPage: number;
  onChange: (page: number) => void;
  totalPages: number;
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const visiblePages = totalPages <= 4 ? pages : pages.slice(0, 3);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#64748b]"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        type="button"
      >
        <ChevronLeftIcon />
      </button>
      {visiblePages.map((page) => (
        <button
          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold ${
            page === currentPage
              ? "border-[#477640] bg-[#477640] text-white"
              : "border-[#dbe3ee] bg-white text-[#334155]"
          }`}
          key={page}
          onClick={() => onChange(page)}
          type="button"
        >
          {page}
        </button>
      ))}
      {totalPages > visiblePages.length ? (
        <>
          <span className="px-1 text-[#94a3b8]">...</span>
          <button
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold ${
              totalPages === currentPage
                ? "border-[#477640] bg-[#477640] text-white"
                : "border-[#dbe3ee] bg-white text-[#334155]"
            }`}
            onClick={() => onChange(totalPages)}
            type="button"
          >
            {totalPages}
          </button>
        </>
      ) : null}
      <button
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#64748b]"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        type="button"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

export function DashboardProductsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [deletingProductId, setDeletingProductId] = useState("");
  const [draftFilters, setDraftFilters] = useState<Filters>({
    category: allCategoriesLabel,
    maxPrice: "",
    minPrice: "",
    status: "all",
  });
  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    category: allCategoriesLabel,
    maxPrice: "",
    minPrice: "",
    status: "all",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoading(true);
      setPageError("");

      try {
        const response = await fetch("/api/v1/products", {
          cache: "no-store",
        });
        const payload = (await response.json()) as ApiListProductsResponse;

        if (!response.ok || !payload.success) {
          throw new Error(
            payload.success ? "Unable to load products." : payload.error.message,
          );
        }

        if (isMounted) {
          setProducts(payload.data);
        }
      } catch (error) {
        if (isMounted) {
          setPageError(
            error instanceof Error
              ? error.message
              : "Unable to load products. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryOptions = useMemo(() => getCategoryOptions(products), [products]);

  const overviewCards = useMemo(() => {
    const totalValuation = products.reduce(
      (sum, product) => sum + product.price * product.stockUnits,
      0,
    );

    return [
      {
        id: "total",
        label: "Total Items",
        tone: "default" as const,
        value: products.length.toLocaleString("en-IN"),
      },
      {
        id: "low",
        label: "Low Stock",
        tone: "warning" as const,
        value: products
          .filter((product) => product.status === "LOW_STOCK")
          .length.toLocaleString("en-IN"),
      },
      {
        id: "out",
        label: "Out of Stock",
        tone: "danger" as const,
        value: products
          .filter((product) => product.status === "OUT_OF_STOCK")
          .length.toLocaleString("en-IN"),
      },
      {
        id: "valuation",
        label: "Total Valuation",
        tone: "success" as const,
        value: formatPrice(totalValuation),
      },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        appliedFilters.category !== allCategoriesLabel &&
        product.category !== appliedFilters.category
      ) {
        return false;
      }

      if (appliedFilters.status !== "all" && product.status !== appliedFilters.status) {
        return false;
      }

      const min = appliedFilters.minPrice ? Number(appliedFilters.minPrice) : null;
      const max = appliedFilters.maxPrice ? Number(appliedFilters.maxPrice) : null;

      if (min !== null && product.price < min) {
        return false;
      }

      if (max !== null && product.price > max) {
        return false;
      }

      return true;
    });
  }, [appliedFilters, products]);

  const itemsPerPage = viewMode === "grid" ? 8 : 4;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  function applyFilters() {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
  }

  function openCreateDialog() {
    setDialogMode("create");
    setEditingProduct(null);
    setIsEditorOpen(true);
  }

  function openEditDialog(productId: string) {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    setDialogMode("edit");
    setEditingProduct(product);
    setIsEditorOpen(true);
  }

  function closeProductDialog() {
    setIsEditorOpen(false);
    setEditingProduct(null);
  }

  function handleProductSaved(product: ProductRecord, mode: "create" | "edit") {
    setProducts((current) => {
      if (mode === "create") {
        return [product, ...current];
      }

      return current.map((item) => (item.id === product.id ? product : item));
    });
    setNotice(
      mode === "create"
        ? `${product.name} was added successfully.`
        : `${product.name} was updated successfully.`,
    );
  }

  async function handleProductDelete(productId: string) {
    const product = products.find((item) => item.id === productId);

    if (!product || !window.confirm(`Delete ${product.name}?`)) {
      return;
    }

    setDeletingProductId(productId);
    setPageError("");

    try {
      const response = await fetch(`/api/v1/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          await getApiErrorMessage(response, "Unable to delete product."),
        );
      }

      setProducts((current) => current.filter((item) => item.id !== productId));
      setNotice(`${product.name} was deleted successfully.`);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to delete product. Please try again.",
      );
    } finally {
      setDeletingProductId("");
    }
  }

  return (
    <DashboardShell mobileTitle="Products">
      <div className="space-y-6">
        <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[2.6rem] font-semibold tracking-tight text-[#17213d]">
              {productInventoryOverview.heading}
            </h1>
            <p className="mt-2 text-[1.02rem] text-[#71829a]">
              {productInventoryOverview.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ViewToggle
              onChange={(mode) => {
                setViewMode(mode);
                setCurrentPage(1);
              }}
              viewMode={viewMode}
            />
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-colors hover:bg-[#3d6637]"
              onClick={openCreateDialog}
              type="button"
            >
              <PlusIcon />
              <span>Add New Product</span>
            </button>
          </div>
        </section>

        {notice ? (
          <div className="rounded-2xl border border-[#c9ead0] bg-[#f0fff4] px-5 py-4 text-base font-semibold text-[#276238]">
            {notice}
          </div>
        ) : null}

        {pageError ? (
          <div className="rounded-2xl border border-[#fecaca] bg-[#fff1f2] px-5 py-4 text-base font-semibold text-[#b91c1c]">
            {pageError}
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <OverviewCard key={card.id} {...card} />
          ))}
        </section>

        <DashboardPanel>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.7fr)_auto] xl:items-end">
            <label className="block">
              <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
                Category
              </span>
              <select
                className="h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                value={draftFilters.category}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
                Stock Status
              </span>
              <select
                className="h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
                value={draftFilters.status}
              >
                {productStatusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
                Price Range
              </span>
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                <input
                  className="h-12 rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      minPrice: event.target.value,
                    }))
                  }
                  placeholder="Min"
                  type="number"
                  value={draftFilters.minPrice}
                />
                <span className="text-[#94a3b8]">-</span>
                <input
                  className="h-12 rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      maxPrice: event.target.value,
                    }))
                  }
                  placeholder="Max"
                  type="number"
                  value={draftFilters.maxPrice}
                />
              </div>
            </div>

            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#f3f5fb] px-6 text-base font-semibold text-[#334155] transition-colors hover:bg-[#ebeff6]"
              onClick={applyFilters}
              type="button"
            >
              <FilterIcon />
              <span>Apply Filters</span>
            </button>
          </div>
        </DashboardPanel>

        {isLoading ? (
          <DashboardPanel>
            <p className="text-base font-medium text-[#71829a]">Loading products...</p>
          </DashboardPanel>
        ) : viewMode === "list" ? (
          <DashboardPanel className="overflow-hidden">
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
                    <th className="rounded-l-2xl px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Stock Status</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="rounded-r-2xl px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td
                        className="px-6 py-14 text-center text-base font-medium text-[#71829a]"
                        colSpan={5}
                      >
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <ProductListRow
                        deletingProductId={deletingProductId}
                        key={product.id}
                        onDelete={handleProductDelete}
                        onEdit={openEditDialog}
                        product={product}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 lg:hidden">
              {paginatedProducts.length === 0 ? (
                <p className="py-8 text-center text-base font-medium text-[#71829a]">
                  No products found.
                </p>
              ) : (
                paginatedProducts.map((product) => (
                  <ProductListCard
                    deletingProductId={deletingProductId}
                    key={product.id}
                    onDelete={handleProductDelete}
                    onEdit={openEditDialog}
                    product={product}
                  />
                ))
              )}
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-[#edf1f6] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-[#64748b]">
                Showing {filteredProducts.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>
              <Pagination
                currentPage={safePage}
                onChange={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </DashboardPanel>
        ) : (
          <>
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductGridCard
                  deletingProductId={deletingProductId}
                  key={product.id}
                  onDelete={handleProductDelete}
                  onEdit={openEditDialog}
                  product={product}
                />
              ))}
              <button
                className="flex min-h-[360px] flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-[#d7e1ef] bg-[#fbfcff] px-8 text-center shadow-[0_18px_40px_rgba(20,31,56,0.03)] transition-colors hover:border-[#477640]"
                onClick={openCreateDialog}
                type="button"
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl text-[#9fb0c8] shadow-[0_14px_30px_rgba(20,31,56,0.08)]">
                  +
                </span>
                <h3 className="mt-8 text-[2rem] font-semibold tracking-tight text-[#6c7b95]">
                  Add New Product
                </h3>
                <p className="mt-4 max-w-[240px] text-[1.02rem] leading-8 text-[#9aa6ba]">
                  Add product images, pricing, stock, and product details to the catalog.
                </p>
              </button>
            </section>

            <div className="flex justify-center">
              <Pagination
                currentPage={safePage}
                onChange={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </>
        )}
      </div>

      {isEditorOpen ? (
        <ProductEditorDialog
          key={`${dialogMode}-${editingProduct?.id ?? "new"}`}
          mode={dialogMode}
          onClose={closeProductDialog}
          onSaved={handleProductSaved}
          open={isEditorOpen}
          product={editingProduct}
        />
      ) : null}
    </DashboardShell>
  );
}
