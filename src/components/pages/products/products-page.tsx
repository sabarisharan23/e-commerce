"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/shared";
import { useWishlist } from "@/components/shared";
import type { ProductDetails } from "@/components/shared";

type ProductsPageProps = {
  categoriesWithProducts: ProductCategoryWithProducts[];
  initialCategoryId?: string | null;
  products: ProductDetails[];
};

type ProductCategoryWithProducts = {
  id: string;
  label: string;
  products: ProductDetails[];
};

type SortOptionId =
  | "newest"
  | "price-low-high"
  | "price-high-low"
  | "top-rated"
  | "name-a-z";

type PageCopy = {
  title: string;
  description: string;
};

const SORT_OPTIONS: { id: SortOptionId; label: string }[] = [
  { id: "newest", label: "Newest Arrivals" },
  { id: "price-low-high", label: "Price: Low to High" },
  { id: "price-high-low", label: "Price: High to Low" },
  { id: "top-rated", label: "Top Rated" },
  { id: "name-a-z", label: "Name: A to Z" },
];

const CATEGORY_COPY: Record<string, PageCopy> = {
  "millet-flour": {
    title: "Flour Collection",
    description:
      "Freshly milled, wholesome flours made from quality grains to bring natural nutrition to your kitchen.",
  },
  "health-mix": {
    title: "Health Mix Collection",
    description:
      "Balanced daily health mixes for porridges, drinks, and simple nourishing routines.",
  },
  "protein-mix": {
    title: "Protein Mix Collection",
    description:
      "Protein-focused pantry picks for active mornings, shakes, and steady nutrition.",
  },
  "diabetic-mix": {
    title: "Diabetic Care Collection",
    description:
      "Mindful grain blends chosen for thoughtful meal planning and everyday pantry ease.",
  },
  "drink-mix": {
    title: "Drink Mix Collection",
    description:
      "Refreshing drink mixes for quick preparation, breakfast support, and everyday energy.",
  },
};

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 20-7-6.4a4.5 4.5 0 0 1 6.2-6.5L12 8l.8-.9a4.5 4.5 0 1 1 6.2 6.5L12 20Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9h12l-1.1 10.1a1 1 0 0 1-1 .9H8.1a1 1 0 0 1-1-.9L6 9Z" />
      <path d="M9 9V7a3 3 0 1 1 6 0v2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18 9 12l6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  const filledStars = Math.round(rating);

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${
            index < filledStars ? "fill-[#ff8a00]" : "fill-[#d3d7cf]"
          }`}
        >
          <path d="m10 1.6 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 6.8l5-.7L10 1.6Z" />
        </svg>
      ))}
    </div>
  );
}

function formatPrice(value: number, minimumFractionDigits = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(value);
}

function getCartItem(product: ProductDetails) {
  return {
    id: product.id,
    name: product.name,
    imageSrc: product.imageSrc,
    price: product.price,
    href: getProductHref(product),
  };
}

function getProductHref(product: ProductDetails) {
  return product.href || `/products/${product.id}`;
}

function getPageSize(width: number) {
  if (width < 640) {
    return 4;
  }

  if (width < 1024) {
    return 4;
  }

  return 6;
}

function getPageCopy(categoryId: string | null) {
  if (categoryId && CATEGORY_COPY[categoryId]) {
    return CATEGORY_COPY[categoryId];
  }

  return {
    title: "All Products",
    description:
      "Explore wholesome flours, mixes, and pantry essentials from our full Theni Store collection.",
  };
}

function buildPagination(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages] as const;
  }

  return [1, "ellipsis", currentPage, "ellipsis-2", totalPages] as const;
}

function QuickViewModal({
  product,
  onClose,
}: {
  product: ProductDetails;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const isWishlisted = hasItem(product.id);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <button
        type="button"
        aria-label="Close quick view"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dde3d9] bg-white text-[#1e261c] transition-colors hover:text-[#4f7d49]"
        >
          <CloseIcon />
        </button>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.05fr)]">
          <div className="relative min-h-[320px] overflow-hidden rounded-[24px] bg-[#f6f7f2]">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-contain p-8"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4f7d49]">
              {product.category}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1b2440]">
              {product.name}
            </h2>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <StarRating rating={product.rating} />
              <span className="text-sm font-medium text-[#687065]">
                {product.stockStatus}
              </span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-3xl font-semibold text-[#1b2440]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice ? (
                <span className="text-xl text-[#8a9386] line-through">
                  {formatPrice(product.originalPrice, 2)}
                </span>
              ) : null}
            </div>
            <p className="mt-5 text-base leading-7 text-[#5f675c]">
              {product.description}
            </p>

            <dl className="mt-6 grid gap-4 text-sm text-[#445046] sm:grid-cols-3">
              <div className="rounded-2xl bg-[#f5f7f1] p-4">
                <dt className="font-semibold text-[#1b2440]">SKU</dt>
                <dd className="mt-1">{product.sku}</dd>
              </div>
              <div className="rounded-2xl bg-[#f5f7f1] p-4">
                <dt className="font-semibold text-[#1b2440]">Weight</dt>
                <dd className="mt-1">{product.weight}</dd>
              </div>
              <div className="rounded-2xl bg-[#f5f7f1] p-4">
                <dt className="font-semibold text-[#1b2440]">Category</dt>
                <dd className="mt-1">{product.category}</dd>
              </div>
            </dl>

            <ul className="mt-6 space-y-3 text-sm leading-6 text-[#445046]">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#4f7d49]" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => addItem(getCartItem(product))}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#4f7d49] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#41693c]"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toggleItem({
                      id: product.id,
                      name: product.name,
                      imageSrc: product.imageSrc,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      href: getProductHref(product),
                      category: product.category,
                    })
                  }
                  className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors ${
                    isWishlisted
                      ? "bg-[#fff1f2] text-[#e23b3b]"
                      : "border border-[#dbe2e7] bg-white text-[#1b2440] hover:border-[#e23b3b] hover:text-[#e23b3b]"
                  }`}
                >
                  <HeartIcon filled={isWishlisted} />
                  {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onQuickView,
}: {
  product: ProductDetails;
  onQuickView: (product: ProductDetails) => void;
}) {
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const isWishlisted = hasItem(product.id);

  return (
    <article className="group relative flex h-full flex-col rounded-[20px] border border-[#dde4d8] bg-white p-4 transition-all hover:border-[#a8c69c] hover:shadow-[0_16px_40px_rgba(43,73,35,0.08)] sm:p-5">
      {product.saleLabel ? (
        <span className="absolute left-4 top-4 z-10 rounded-md bg-[#f04b4b] px-3 py-2 text-sm font-semibold text-white">
          {product.saleLabel}
        </span>
      ) : null}

      <div className="absolute right-4 top-4 z-10 flex flex-col gap-3">
        <button
          type="button"
          aria-label={`${isWishlisted ? "Remove" : "Add"} ${product.name} ${
            isWishlisted ? "from" : "to"
          } wishlist`}
          title="Wishlist"
          onClick={() =>
            toggleItem({
              id: product.id,
              name: product.name,
              imageSrc: product.imageSrc,
              price: product.price,
              originalPrice: product.originalPrice,
              href: getProductHref(product),
              category: product.category,
            })
          }
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white transition-colors ${
            isWishlisted
              ? "border-[#e23b3b] bg-[#fff1f2] text-[#e23b3b]"
              : "border-[#dfe5dc] text-[#20321d] hover:border-[#e23b3b] hover:text-[#e23b3b]"
          }`}
        >
          <HeartIcon filled={isWishlisted} />
        </button>
        <button
          type="button"
          aria-label={`Quick view ${product.name}`}
          title="Quick view"
          onClick={() => onQuickView(product)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dfe5dc] bg-white text-[#20321d] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49]"
        >
          <EyeIcon />
        </button>
      </div>

      <Link
        href={getProductHref(product)}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block min-h-[230px] overflow-hidden rounded-[18px] bg-[#f8f9f5]"
      >
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="mt-5 flex flex-1 flex-col">
        <Link
          href={getProductHref(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-1 text-xl font-medium leading-8 text-[#446a42]"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-1 text-sm leading-6 text-[#798173]">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[2rem] font-semibold leading-none text-[#11253d]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice ? (
                <span className="text-xl text-[#96a193] line-through">
                  {formatPrice(product.originalPrice, 2)}
                </span>
              ) : null}
            </div>
            <div className="mt-3">
              <StarRating rating={product.rating} />
            </div>
          </div>

          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addItem(getCartItem(product))}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e4ece0] text-[#4b7643] transition-colors hover:bg-[#4f7d49] hover:text-white"
          >
            <BagIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

function FiltersPanel({
  categoriesWithProducts,
  productsCount,
  selectedCategoryId,
  onCategoryChange,
  minPrice,
  maxPrice,
  absoluteMinPrice,
  absoluteMaxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  ratingOnly,
  onRatingChange,
  onClear,
}: {
  categoriesWithProducts: ProductCategoryWithProducts[];
  productsCount: number;
  selectedCategoryId: string | null;
  onCategoryChange: (value: string | null) => void;
  minPrice: number;
  maxPrice: number;
  absoluteMinPrice: number;
  absoluteMaxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  ratingOnly: boolean;
  onRatingChange: (value: boolean) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-9">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#4f7d49]">
            <FilterIcon />
            <h2 className="text-[1.65rem] font-semibold text-[#17213d]">Filters</h2>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-semibold text-[#5e7697] transition-colors hover:text-[#294b72]"
          >
            Clear
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6c7b93]">
            Categories
          </p>
          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => onCategoryChange(null)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-base font-medium transition-colors ${
                selectedCategoryId === null
                  ? "bg-[#5f8755] text-white"
                  : "text-[#5e7697] hover:bg-[#f3f6ef] hover:text-[#294b72]"
              }`}
            >
              <span>All Products</span>
              <span className="text-sm">{productsCount}</span>
            </button>

            {categoriesWithProducts.map((category) => {
              const active = category.id === selectedCategoryId;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange(category.id)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-base font-medium transition-colors ${
                    active
                      ? "bg-[#5f8755] text-white"
                      : "text-[#5e7697] hover:bg-[#f3f6ef] hover:text-[#294b72]"
                  }`}
                >
                  <span>{category.label}</span>
                  <span className="text-sm">{category.products.length}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6c7b93]">
          Price Range
        </p>
        <div className="mt-5 space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-[#7b8ea8]">
              <span>Min</span>
              <span>{formatPrice(minPrice)}</span>
            </div>
            <input
              type="range"
              min={absoluteMinPrice}
              max={absoluteMaxPrice}
              value={minPrice}
              onChange={(event) => onMinPriceChange(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#d7dfe8] accent-[#5f8755]"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-[#7b8ea8]">
              <span>Max</span>
              <span>{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={absoluteMinPrice}
              max={absoluteMaxPrice}
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#d7dfe8] accent-[#5f8755]"
            />
          </div>

          <div className="flex items-center justify-between text-sm font-medium text-[#5e7697]">
            <span>{formatPrice(absoluteMinPrice)}</span>
            <span>{formatPrice(absoluteMaxPrice)}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6c7b93]">
          Customer Rating
        </p>
        <label className="mt-5 flex cursor-pointer items-center gap-3 text-[#5e7697]">
          <input
            type="checkbox"
            checked={ratingOnly}
            onChange={(event) => onRatingChange(event.target.checked)}
            className="h-5 w-5 rounded border border-[#d8dfd7] accent-[#5f8755]"
          />
          <StarRating rating={4} />
          <span className="text-sm font-medium">&amp; up</span>
        </label>
      </div>
    </div>
  );
}

export function ProductsPage({
  categoriesWithProducts,
  initialCategoryId = null,
  products,
}: ProductsPageProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId,
  );
  const [sortBy, setSortBy] = useState<SortOptionId>("newest");
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingOnly, setRatingOnly] = useState(false);

  const absoluteMinPrice = useMemo(() => {
    if (products.length === 0) {
      return 0;
    }

    return Math.min(...products.map((product) => product.price));
  }, [products]);
  const absoluteMaxPrice = useMemo(() => {
    if (products.length === 0) {
      return 0;
    }

    return Math.max(...products.map((product) => product.price));
  }, [products]);

  const [minPrice, setMinPrice] = useState(absoluteMinPrice);
  const [maxPrice, setMaxPrice] = useState(absoluteMaxPrice);

  useEffect(() => {
    const updatePageSize = () => {
      setPageSize(getPageSize(window.innerWidth));
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);

    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  useEffect(() => {
    if (!isFiltersOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFiltersOpen]);

  const activeCategory = categoriesWithProducts.find(
    (category) => category.id === selectedCategoryId,
  );
  const pageCopy = getPageCopy(selectedCategoryId);

  const baseProducts = useMemo(() => {
    if (!selectedCategoryId) {
      return products;
    }

    return activeCategory?.products ?? [];
  }, [activeCategory, products, selectedCategoryId]);

  const filteredProducts = useMemo(() => {
    return baseProducts.filter((product) => {
      const withinPrice = product.price >= minPrice && product.price <= maxPrice;
      const withinRating = ratingOnly ? product.rating >= 4 : true;

      return withinPrice && withinRating;
    });
  }, [baseProducts, maxPrice, minPrice, ratingOnly]);

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];

    switch (sortBy) {
      case "price-low-high":
        return products.sort((left, right) => left.price - right.price);
      case "price-high-low":
        return products.sort((left, right) => right.price - left.price);
      case "top-rated":
        return products.sort((left, right) => right.rating - left.rating);
      case "name-a-z":
        return products.sort((left, right) => left.name.localeCompare(right.name));
      case "newest":
      default:
        return products;
    }
  }, [filteredProducts, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return sortedProducts.slice(startIndex, startIndex + pageSize);
  }, [pageSize, safeCurrentPage, sortedProducts]);

  const pagination = buildPagination(safeCurrentPage, totalPages);

  const handleCategoryChange = (value: string | null) => {
    setSelectedCategoryId(value);
    setCurrentPage(1);
    setIsFiltersOpen(false);
  };

  const clearFilters = () => {
    setSelectedCategoryId(initialCategoryId);
    setMinPrice(absoluteMinPrice);
    setMaxPrice(absoluteMaxPrice);
    setRatingOnly(false);
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <>
      <section className="bg-white text-[#1a2440]">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-[#7b8ea8]"
          >
            <Link href="/" className="transition-colors hover:text-[#294b72]">
              Home
            </Link>
            <span>&gt;</span>
            <Link href="/products" className="transition-colors hover:text-[#294b72]">
              Featured Categories
            </Link>
            {activeCategory ? (
              <>
                <span>&gt;</span>
                <span className="text-[#4f7d49]">{activeCategory.label}</span>
              </>
            ) : null}
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-6 rounded-[24px] border border-[#e8ece3] bg-[#fbfdf8] p-5 shadow-[0_14px_32px_rgba(18,37,61,0.06)]">
                <FiltersPanel
                  categoriesWithProducts={categoriesWithProducts}
                  productsCount={products.length}
                  selectedCategoryId={selectedCategoryId}
                  onCategoryChange={handleCategoryChange}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  absoluteMinPrice={absoluteMinPrice}
                  absoluteMaxPrice={absoluteMaxPrice}
                  onMinPriceChange={(value) => {
                    setMinPrice(Math.min(value, maxPrice));
                    setCurrentPage(1);
                  }}
                  onMaxPriceChange={(value) => {
                    setMaxPrice(Math.max(value, minPrice));
                    setCurrentPage(1);
                  }}
                  ratingOnly={ratingOnly}
                  onRatingChange={(value) => {
                    setRatingOnly(value);
                    setCurrentPage(1);
                  }}
                  onClear={clearFilters}
                />
              </div>
            </aside>

            <div>
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <h1 className="text-4xl font-semibold tracking-tight text-[#18213d] sm:text-[3.5rem]">
                    {pageCopy.title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-[#6d7d8d] sm:text-lg">
                    {pageCopy.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => setIsFiltersOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#dbe2e7] px-4 py-3 text-sm font-semibold text-[#1a2440] transition-colors hover:border-[#5f8755] hover:text-[#4f7d49] lg:hidden"
                  >
                    <FilterIcon />
                    <span>Filters</span>
                  </button>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6c7b93]">
                      Sort By
                    </span>
                    <select
                      value={sortBy}
                      onChange={(event) => {
                        setSortBy(event.target.value as SortOptionId);
                        setCurrentPage(1);
                      }}
                      className="h-12 rounded-2xl border border-[#dbe2e7] bg-white px-4 text-base font-medium text-[#1a2440] outline-none"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-8 rounded-[24px] bg-white p-4 shadow-[0_18px_40px_rgba(18,37,61,0.08)] sm:p-6">
                <div className="flex flex-col gap-3 border-b border-[#edf0ea] pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-[#6f7f8d]">
                    Showing{" "}
                    <span className="font-semibold text-[#1a2440]">
                      {paginatedProducts.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[#1a2440]">
                      {sortedProducts.length}
                    </span>{" "}
                    products
                  </p>
                  <p className="text-sm font-medium text-[#6f7f8d]">
                    Price range:{" "}
                    <span className="font-semibold text-[#1a2440]">
                      {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                    </span>
                  </p>
                </div>

                {paginatedProducts.length > 0 ? (
                  <>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {paginatedProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onQuickView={setSelectedProduct}
                        />
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        aria-label="Previous page"
                        disabled={safeCurrentPage === 1}
                        onClick={() =>
                          setCurrentPage((page) => Math.max(page - 1, 1))
                        }
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d7dfd6] bg-white text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <ChevronLeftIcon />
                      </button>

                      {pagination.map((item) =>
                        typeof item === "number" ? (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setCurrentPage(item)}
                            className={`inline-flex h-11 min-w-11 items-center justify-center rounded-2xl border px-4 text-base font-semibold transition-colors ${
                              item === safeCurrentPage
                                ? "border-[#5f8755] bg-[#5f8755] text-white"
                                : "border-[#d7dfd6] bg-white text-[#1a2440] hover:border-[#4f7d49] hover:text-[#4f7d49]"
                            }`}
                          >
                            {item}
                          </button>
                        ) : (
                          <span
                            key={item}
                            className="inline-flex h-11 min-w-11 items-center justify-center text-base font-semibold text-[#6f7f8d]"
                          >
                            ...
                          </span>
                        ),
                      )}

                      <button
                        type="button"
                        aria-label="Next page"
                        disabled={safeCurrentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((page) => Math.min(page + 1, totalPages))
                        }
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d7dfd6] bg-white text-[#1a2440] transition-colors hover:border-[#4f7d49] hover:text-[#4f7d49] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <ChevronRightIcon />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-6 rounded-[24px] border border-dashed border-[#d4ddd2] bg-[#f8faf6] px-6 py-12 text-center">
                    <h2 className="text-2xl font-semibold text-[#1a2440]">
                      No products match these filters
                    </h2>
                    <p className="mt-3 text-base text-[#667480]">
                      Try a different category, widen the price range, or remove the
                      rating filter.
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#4f7d49] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#41693c]"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isFiltersOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsFiltersOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[88vw] max-w-sm overflow-y-auto bg-white px-5 py-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#17213d]">Filter Products</h2>
              <button
                type="button"
                onClick={() => setIsFiltersOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe2e7] text-[#17213d]"
              >
                <CloseIcon />
              </button>
            </div>

            <FiltersPanel
              categoriesWithProducts={categoriesWithProducts}
              productsCount={products.length}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={handleCategoryChange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              absoluteMinPrice={absoluteMinPrice}
              absoluteMaxPrice={absoluteMaxPrice}
              onMinPriceChange={(value) => {
                setMinPrice(Math.min(value, maxPrice));
                setCurrentPage(1);
              }}
              onMaxPriceChange={(value) => {
                setMaxPrice(Math.max(value, minPrice));
                setCurrentPage(1);
              }}
              ratingOnly={ratingOnly}
              onRatingChange={(value) => {
                setRatingOnly(value);
                setCurrentPage(1);
              }}
              onClear={clearFilters}
            />
          </div>
        </div>
      ) : null}

      {selectedProduct ? (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      ) : null}
    </>
  );
}
