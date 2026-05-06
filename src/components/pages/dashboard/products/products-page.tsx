"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  inventoryProducts,
  productCategoryOptions,
  productInventoryOverview,
  productStatusOptions,
  type InventoryProduct,
  type InventoryStatus,
} from "./products-data";

type ViewMode = "list" | "grid";

type Filters = {
  category: string;
  status: string;
  minPrice: string;
  maxPrice: string;
};

function GridViewIcon() {
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
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 4 7 4-7 4-7-4 7-4Z" />
      <path d="m5 12 7 4 7-4" />
      <path d="m5 16 7 4 7-4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      viewBox="0 0 24 24"
      className="h-4 w-4 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function statusBadgeClass(status: InventoryStatus) {
  if (status === "in-stock") {
    return "bg-[#e7f8ef] text-[#0c9b61]";
  }

  if (status === "low-stock") {
    return "bg-[#fff4da] text-[#d07a00]";
  }

  return "bg-[#ffe9e9] text-[#e24646]";
}

function statusText(status: InventoryStatus) {
  if (status === "in-stock") {
    return "In Stock";
  }

  if (status === "low-stock") {
    return "Low Stock";
  }

  return "Out of Stock";
}

function OverviewCard({
  label,
  value,
  tone,
}: (typeof productInventoryOverview.cards)[number]) {
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
  viewMode,
  onChange,
}: {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-[#dbe3ee] bg-white p-1 shadow-[0_10px_24px_rgba(20,31,56,0.05)]">
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          viewMode === "grid"
            ? "bg-[#eef4eb] text-[#477640]"
            : "text-[#64748b] hover:bg-[#f5f8fc]"
        }`}
      >
        <GridViewIcon />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          viewMode === "list"
            ? "bg-[#eef4eb] text-[#477640]"
            : "text-[#64748b] hover:bg-[#f5f8fc]"
        }`}
      >
        <ListViewIcon />
      </button>
    </div>
  );
}

function ProductListRow({ product }: { product: InventoryProduct }) {
  return (
    <tr>
      <td className="border-b border-[#edf1f6] px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-[#dbe3ee] bg-white">
            <Image
              src={product.imageSrc}
              alt={product.name}
              fill
              sizes="56px"
              className="object-contain p-1.5"
            />
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 max-w-[240px] text-[1.05rem] font-medium text-[#24304a]">
              {product.name}
            </p>
          </div>
        </div>
      </td>
      <td className="border-b border-[#edf1f6] px-6 py-5">
        <span className="inline-flex rounded-full bg-[#edf3ea] px-3 py-1 text-sm font-semibold text-[#5f7a55]">
          {product.categoryTag}
        </span>
      </td>
      <td className="border-b border-[#edf1f6] px-6 py-5">
        <div className="flex items-center gap-2 text-[1.02rem]">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              product.status === "in-stock"
                ? "bg-[#19b27a]"
                : product.status === "low-stock"
                  ? "bg-[#f2a11c]"
                  : "bg-[#ef4f4f]"
            }`}
          />
          <span
            className={`font-medium ${
              product.status === "in-stock"
                ? "text-[#0f8d67]"
                : product.status === "low-stock"
                  ? "text-[#d07a00]"
                  : "text-[#e24646]"
            }`}
          >
            {statusText(product.status)}
          </span>
          <span className="text-sm text-[#94a3b8]">({product.stockUnits} units)</span>
        </div>
      </td>
      <td className="border-b border-[#edf1f6] px-6 py-5 text-[1.05rem] font-semibold text-[#17213d]">
        ₹{product.price.toFixed(2)}
      </td>
      <td className="border-b border-[#edf1f6] px-6 py-5">
        <div className="flex items-center justify-end gap-3 text-[#94a3b8]">
          <button type="button" className="transition-colors hover:text-[#477640]">
            <StackIcon />
          </button>
          <button type="button" className="transition-colors hover:text-[#477640]">
            <EditIcon />
          </button>
          <button type="button" className="transition-colors hover:text-[#e24646]">
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ProductListCard({ product }: { product: InventoryProduct }) {
  return (
    <article className="rounded-[1.6rem] border border-[#e8edf4] bg-white p-4 shadow-[0_14px_30px_rgba(20,31,56,0.04)]">
      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#dbe3ee] bg-white">
          <Image
            src={product.imageSrc}
            alt={product.name}
            fill
            sizes="96px"
            className="object-contain p-2"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${statusBadgeClass(product.status)}`}>
              {statusText(product.status)}
            </span>
            <span className="inline-flex rounded-full bg-[#edf3ea] px-2.5 py-1 text-xs font-semibold text-[#5f7a55]">
              {product.categoryTag}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-base font-semibold text-[#24304a]">
            {product.name}
          </p>
          <p className="mt-2 text-sm text-[#71829a]">{product.category}</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xl font-semibold text-[#477640]">₹{product.price.toFixed(2)}</p>
              <p className="text-sm text-[#94a3b8]">{product.stockUnits} units</p>
            </div>
            <div className="flex items-center gap-2 text-[#94a3b8]">
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe3ee]">
                <StackIcon />
              </button>
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe3ee]">
                <EditIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductGridCard({ product }: { product: InventoryProduct }) {
  return (
    <article className="rounded-[1.6rem] border border-[#e8edf4] bg-white p-3 shadow-[0_16px_34px_rgba(20,31,56,0.04)]">
      <div className="relative overflow-hidden rounded-2xl border border-[#dbe3ee] bg-white">
        <span
          className={`absolute left-4 top-4 z-10 inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${statusBadgeClass(
            product.status,
          )}`}
        >
          {statusText(product.status)}
        </span>
        <div className="relative h-[210px] w-full">
          <Image
            src={product.imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain p-6"
          />
        </div>
      </div>
      <div className="px-1 pb-1 pt-4">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">
          {product.category}
        </p>
        <p className="mt-2 line-clamp-2 text-[1.05rem] font-semibold text-[#24304a]">
          {product.name}
        </p>
        <p className="mt-3 text-[1.05rem] font-semibold text-[#477640]">₹ {product.price.toFixed(2)}</p>
        <div className="mt-4 flex items-center justify-between border-t border-[#edf1f6] pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9aa6ba]">
              Stock
            </p>
            <p className="mt-1 text-[1.02rem] font-semibold text-[#24304a]">
              {product.stockUnits} units
            </p>
          </div>
          <button type="button" className="text-sm font-semibold text-[#477640]">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const visiblePages = totalPages <= 4 ? pages : pages.slice(0, 3);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#64748b]"
      >
        <ChevronLeftIcon />
      </button>
      {visiblePages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold ${
            page === currentPage
              ? "border-[#477640] bg-[#477640] text-white"
              : "border-[#dbe3ee] bg-white text-[#334155]"
          }`}
        >
          {page}
        </button>
      ))}
      {totalPages > visiblePages.length ? (
        <>
          <span className="px-1 text-[#94a3b8]">...</span>
          <button
            type="button"
            onClick={() => onChange(totalPages)}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold ${
              totalPages === currentPage
                ? "border-[#477640] bg-[#477640] text-white"
                : "border-[#dbe3ee] bg-white text-[#334155]"
            }`}
          >
            {totalPages}
          </button>
        </>
      ) : null}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#64748b]"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

export function DashboardProductsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [draftFilters, setDraftFilters] = useState<Filters>({
    category: "All Categories",
    status: "all",
    minPrice: "",
    maxPrice: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    category: "All Categories",
    status: "all",
    minPrice: "",
    maxPrice: "",
  });

  const filteredProducts = useMemo(() => {
    return inventoryProducts.filter((product) => {
      if (
        appliedFilters.category !== "All Categories" &&
        product.category !== appliedFilters.category
      ) {
        return false;
      }

      if (
        appliedFilters.status !== "all" &&
        product.status !== appliedFilters.status
      ) {
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
  }, [appliedFilters]);

  const itemsPerPage = viewMode === "grid" ? 8 : 4;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
  };

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
              viewMode={viewMode}
              onChange={(mode) => {
                setViewMode(mode);
                setCurrentPage(1);
              }}
            />
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-colors hover:bg-[#3d6637]"
            >
              <PlusIcon />
              <span>Add New Product</span>
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {productInventoryOverview.cards.map((card) => (
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
                value={draftFilters.category}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
              >
                {productCategoryOptions.map((category) => (
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
                value={draftFilters.status}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
                className="h-12 w-full rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
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
                  value={draftFilters.minPrice}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      minPrice: event.target.value,
                    }))
                  }
                  type="number"
                  placeholder="Min"
                  className="h-12 rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
                />
                <span className="text-[#94a3b8]">-</span>
                <input
                  value={draftFilters.maxPrice}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      maxPrice: event.target.value,
                    }))
                  }
                  type="number"
                  placeholder="Max"
                  className="h-12 rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={applyFilters}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#f3f5fb] px-6 text-base font-semibold text-[#334155] transition-colors hover:bg-[#ebeff6]"
            >
              <FilterIcon />
              <span>Apply Filters</span>
            </button>
          </div>
        </DashboardPanel>

        {viewMode === "list" ? (
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
                  {paginatedProducts.map((product) => (
                    <ProductListRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 lg:hidden">
              {paginatedProducts.map((product) => (
                <ProductListCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-[#edf1f6] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-[#64748b]">
                Showing {filteredProducts.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onChange={setCurrentPage}
              />
            </div>
          </DashboardPanel>
        ) : (
          <>
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductGridCard key={product.id} product={product} />
              ))}
            </section>

            <div className="flex justify-center">
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
