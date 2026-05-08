import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadEnv } from "dotenv";
import { resolve } from "path";

import { allProducts, productCategories } from "../src/data/products.ts";

loadEnv({ path: resolve(process.cwd(), ".env"), quiet: true });
loadEnv({ override: true, path: resolve(process.cwd(), ".env.local"), quiet: true });

const isDryRun = process.argv.includes("--dry-run");
const requestedHelp = process.argv.includes("--help") || process.argv.includes("-h");

function normalizeSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeSku(value) {
  return value.trim().toUpperCase();
}

function createProductCode(sku) {
  const normalizedSku = normalizeSku(sku)
    .replace(/^TS[-_]?/, "")
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `PRD-${normalizedSku}`;
}

function toDecimal(value) {
  return new Prisma.Decimal(Number(value).toFixed(2));
}

function toProductStatus(stockStatus) {
  const normalized = stockStatus.trim().toLowerCase();

  if (normalized.includes("out")) {
    return "OUT_OF_STOCK";
  }

  if (normalized.includes("low")) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
}

function toStockUnits(stockStatus) {
  const status = toProductStatus(stockStatus);

  if (status === "OUT_OF_STOCK") {
    return 0;
  }

  if (status === "LOW_STOCK") {
    return 10;
  }

  return 100;
}

function getCategoryDescription(categoryLabel) {
  return `Products grouped under ${categoryLabel}.`;
}

function collectSourceCategories() {
  const categoriesBySlug = new Map();

  productCategories.forEach((category) => {
    categoriesBySlug.set(category.id, {
      description: getCategoryDescription(category.label),
      label: category.label,
      slug: category.id,
    });
  });

  allProducts.forEach((product) => {
    const slug = normalizeSlug(product.category);

    if (!categoriesBySlug.has(slug)) {
      categoriesBySlug.set(slug, {
        description: getCategoryDescription(product.category),
        label: product.category,
        slug,
      });
    }
  });

  return Array.from(categoriesBySlug.values()).sort((left, right) =>
    left.label.localeCompare(right.label),
  );
}

function getCategorySlugForProduct(product, categories) {
  const category = categories.find(
    (item) => item.label.toLowerCase() === product.category.toLowerCase(),
  );

  return category?.slug ?? normalizeSlug(product.category);
}

function buildProductData(product, category) {
  return {
    category: category.name,
    categoryId: category.id,
    categoryTag: category.name,
    description: product.description,
    highlights: product.highlights,
    imageAlt: product.imageAlt,
    imageSrc: product.imageSrc,
    name: product.name,
    originalPrice:
      product.originalPrice === undefined ? null : toDecimal(product.originalPrice),
    price: toDecimal(product.price),
    rating: product.rating,
    saleLabel: product.saleLabel ?? null,
    shortDescription: product.shortDescription,
    sku: normalizeSku(product.sku),
    slug: normalizeSlug(product.id),
    status: toProductStatus(product.stockStatus),
    stockUnits: toStockUnits(product.stockStatus),
    weight: product.weight,
  };
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error("Missing DATABASE_URL. Add it to .env or .env.local before syncing.");
  }

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
    }),
  });
}

async function syncCatalog() {
  const sourceCategories = collectSourceCategories();

  if (requestedHelp) {
    console.log("Usage: npm run catalog:sync [-- --dry-run]");
    console.log("Syncs the current static product catalog into the configured database.");
    return;
  }

  if (isDryRun) {
    console.log(
      `[dry-run] Ready to sync ${sourceCategories.length} categories and ${allProducts.length} products.`,
    );
    console.log("[dry-run] No database writes were made.");
    return;
  }

  const prisma = createPrismaClient();
  const syncedCategoriesBySlug = new Map();
  let createdCategories = 0;
  let updatedCategories = 0;
  let createdProducts = 0;
  let updatedProducts = 0;

  try {
    for (const sourceCategory of sourceCategories) {
      const existingCategory = await prisma.category.findUnique({
        select: {
          id: true,
        },
        where: {
          slug: sourceCategory.slug,
        },
      });
      const category = await prisma.category.upsert({
        create: {
          description: sourceCategory.description,
          name: sourceCategory.label,
          slug: sourceCategory.slug,
        },
        update: {
          description: sourceCategory.description,
          name: sourceCategory.label,
        },
        where: {
          slug: sourceCategory.slug,
        },
      });

      syncedCategoriesBySlug.set(sourceCategory.slug, category);

      if (existingCategory) {
        updatedCategories += 1;
      } else {
        createdCategories += 1;
      }
    }

    for (const product of allProducts) {
      const categorySlug = getCategorySlugForProduct(product, sourceCategories);
      const category = syncedCategoriesBySlug.get(categorySlug);

      if (!category) {
        throw new Error(`Category was not synced for product: ${product.name}`);
      }

      const data = buildProductData(product, category);
      const existingProduct = await prisma.product.findFirst({
        select: {
          id: true,
        },
        where: {
          OR: [{ slug: data.slug }, { sku: data.sku }],
        },
      });

      if (existingProduct) {
        await prisma.product.update({
          data,
          where: {
            id: existingProduct.id,
          },
        });
      } else {
        await prisma.product.create({
          data: {
            ...data,
            productCode: createProductCode(product.sku),
            tagId: null,
          },
        });
      }

      if (existingProduct) {
        updatedProducts += 1;
      } else {
        createdProducts += 1;
      }
    }

    console.log(
      `Catalog sync complete. Categories: ${createdCategories} created, ${updatedCategories} updated. Products: ${createdProducts} created, ${updatedProducts} updated.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

syncCatalog().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
