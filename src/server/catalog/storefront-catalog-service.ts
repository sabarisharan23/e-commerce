import type { Prisma } from "@prisma/client";
import type { ProductDetails } from "@/components/shared/product-showcase";

import { prisma } from "../db/prisma";

export type StorefrontCategoryWithProducts = {
  id: string;
  label: string;
  products: ProductDetails[];
};

const storefrontProductInclude = {
  categoryRef: {
    select: {
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.ProductInclude;

type StorefrontProductRecord = Prisma.ProductGetPayload<{
  include: typeof storefrontProductInclude;
}>;

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatStockStatus(status: string) {
  if (status === "LOW_STOCK") {
    return "Low stock";
  }

  if (status === "OUT_OF_STOCK") {
    return "Out of stock";
  }

  return "In stock";
}

function getStorefrontProductHref(slug: string) {
  return `/products/${slug}`;
}

export function toStorefrontProductDetails(
  product: StorefrontProductRecord,
): ProductDetails {
  const category = product.categoryRef?.name ?? product.category;

  return {
    category,
    description: product.description,
    highlights: Array.isArray(product.highlights)
      ? product.highlights.filter((item): item is string => typeof item === "string")
      : [],
    href: getStorefrontProductHref(product.slug),
    id: product.slug,
    imageAlt: product.imageAlt,
    imageSrc: product.imageSrc,
    name: product.name,
    originalPrice:
      product.originalPrice === null ? undefined : Number(product.originalPrice),
    price: Number(product.price),
    rating: product.rating,
    saleLabel: product.saleLabel ?? undefined,
    shortDescription: product.shortDescription,
    sku: product.sku,
    stockStatus: formatStockStatus(product.status),
    weight: product.weight,
  };
}

export async function listStorefrontProducts(): Promise<ProductDetails[]> {
  const products = await prisma.product.findMany({
    include: storefrontProductInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map(toStorefrontProductDetails);
}

export async function listStorefrontCategoriesWithProducts(): Promise<
  StorefrontCategoryWithProducts[]
> {
  const [categories, unlinkedProducts] = await Promise.all([
    prisma.category.findMany({
      include: {
        products: {
          include: storefrontProductInclude,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.product.findMany({
      include: storefrontProductInclude,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        categoryId: null,
      },
    }),
  ]);
  const categoriesBySlug = new Map<string, StorefrontCategoryWithProducts>();

  categories.forEach((category) => {
    categoriesBySlug.set(category.slug, {
      id: category.slug,
      label: category.name,
      products: category.products.map(toStorefrontProductDetails),
    });
  });

  unlinkedProducts.forEach((product) => {
    const slug = product.categoryRef?.slug ?? normalizeSlug(product.category);
    const safeSlug = slug || "uncategorized";
    const category = categoriesBySlug.get(safeSlug) ?? {
      id: safeSlug,
      label: product.category || "Uncategorized",
      products: [],
    };

    category.products.push(toStorefrontProductDetails(product));
    categoriesBySlug.set(safeSlug, category);
  });

  return Array.from(categoriesBySlug.values()).sort((left, right) =>
    left.label.localeCompare(right.label),
  );
}

export async function getStorefrontProductByPublicId(
  publicId: string,
): Promise<ProductDetails | null> {
  const lookup = publicId.trim();

  if (!lookup) {
    return null;
  }

  const normalizedSlug = normalizeSlug(lookup);
  const slugFallback =
    normalizedSlug && normalizedSlug !== lookup ? [{ slug: normalizedSlug }] : [];
  const product = await prisma.product.findFirst({
    include: storefrontProductInclude,
    where: {
      OR: [{ slug: lookup }, { id: lookup }, ...slugFallback],
    },
  });

  return product ? toStorefrontProductDetails(product) : null;
}
