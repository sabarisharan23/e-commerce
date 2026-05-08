import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

import { prisma } from "../db/prisma";
import { apiErrors } from "../http/api-error";

export type CreateProductPayload = {
  category?: unknown;
  categoryTag?: unknown;
  description?: unknown;
  highlights?: unknown;
  imageAlt?: unknown;
  imageSrc?: unknown;
  name?: unknown;
  originalPrice?: unknown;
  price?: unknown;
  rating?: unknown;
  saleLabel?: unknown;
  shortDescription?: unknown;
  sku?: unknown;
  slug?: unknown;
  status?: unknown;
  stockUnits?: unknown;
  weight?: unknown;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type ProductDto = {
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

type NormalizedCreateProductPayload = {
  category: string;
  categoryTag: string;
  description: string;
  highlights: string[];
  imageAlt: string;
  imageSrc: string;
  name: string;
  originalPrice?: number;
  price: number;
  rating: number;
  saleLabel?: string;
  shortDescription: string;
  sku: string;
  slug: string;
  status: ProductStatus;
  stockUnits: number;
  weight: string;
};

type NormalizedUpdateProductPayload = {
  category?: string;
  categoryTag?: string;
  description?: string;
  highlights?: string[];
  imageAlt?: string;
  imageSrc?: string;
  name?: string;
  originalPrice?: number | null;
  price?: number;
  rating?: number;
  saleLabel?: string | null;
  shortDescription?: string;
  sku?: string;
  slug?: string;
  status?: ProductStatus;
  stockUnits?: number;
  weight?: string;
};

const maxCreateAttempts = 3;
const productStatuses = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"] as const;
export type ProductStatus = (typeof productStatuses)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwnField(payload: Record<string, unknown>, field: string) {
  return Object.prototype.hasOwnProperty.call(payload, field);
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createProductCode() {
  return `PRD-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function normalizeStatus(
  status: unknown,
  fieldErrors: Record<string, string>,
): ProductStatus | undefined {
  if (status === undefined || status === null || status === "") {
    return undefined;
  }

  if (typeof status !== "string") {
    fieldErrors.status = "Product status is invalid.";
    return undefined;
  }

  const normalized = status.trim().toUpperCase().replace(/[\s-]+/g, "_");

  if (!productStatuses.includes(normalized as ProductStatus)) {
    fieldErrors.status = "Choose a valid product status.";
    return undefined;
  }

  return normalized as ProductStatus;
}

function inferStatus(stockUnits: number): ProductStatus {
  if (stockUnits <= 0) {
    return "OUT_OF_STOCK";
  }

  if (stockUnits <= 20) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
}

function normalizeRequiredString(
  payload: Record<string, unknown>,
  field: string,
  label: string,
  fieldErrors: Record<string, string>,
  minimumLength = 1,
) {
  const value = typeof payload[field] === "string" ? payload[field].trim() : "";

  if (value.length < minimumLength) {
    fieldErrors[field] = `${label} must be at least ${minimumLength} character${
      minimumLength === 1 ? "" : "s"
    }.`;
  }

  return value;
}

function normalizeOptionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeMoney(
  value: unknown,
  field: string,
  label: string,
  fieldErrors: Record<string, string>,
  required: boolean,
) {
  if (value === undefined || value === null || value === "") {
    if (required) {
      fieldErrors[field] = `${label} is required.`;
    }

    return undefined;
  }

  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    fieldErrors[field] = `${label} must be a valid non-negative amount.`;
    return undefined;
  }

  return Math.round(numberValue * 100) / 100;
}

function normalizeRating(value: unknown, fieldErrors: Record<string, string>) {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const rating = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    fieldErrors.rating = "Rating must be between 0 and 5.";
    return 0;
  }

  return Math.round(rating * 10) / 10;
}

function normalizeStockUnits(value: unknown, fieldErrors: Record<string, string>) {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const stockUnits = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(stockUnits) || stockUnits < 0) {
    fieldErrors.stockUnits = "Stock units must be a whole number greater than or equal to 0.";
    return 0;
  }

  return stockUnits;
}

function normalizeHighlights(value: unknown, fieldErrors: Record<string, string>) {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  fieldErrors.highlights = "Highlights must be text lines or a list of text values.";
  return [];
}

function normalizeCreateProductPayload(
  payload: CreateProductPayload,
): NormalizedCreateProductPayload {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Product details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const name = normalizeRequiredString(payload, "name", "Product name", fieldErrors, 2);
  const category = normalizeRequiredString(payload, "category", "Category", fieldErrors, 2);
  const imageSrc = normalizeRequiredString(payload, "imageSrc", "Product image", fieldErrors);
  const sku = normalizeRequiredString(payload, "sku", "SKU", fieldErrors, 2).toUpperCase();
  const price = normalizeMoney(payload.price, "price", "Price", fieldErrors, true) ?? 0;
  const originalPrice = normalizeMoney(
    payload.originalPrice,
    "originalPrice",
    "Original price",
    fieldErrors,
    false,
  );
  const stockUnits = normalizeStockUnits(payload.stockUnits, fieldErrors);
  const status = normalizeStatus(payload.status, fieldErrors) ?? inferStatus(stockUnits);
  const shortDescription =
    normalizeOptionalString(payload.shortDescription) ||
    normalizeOptionalString(payload.description) ||
    "Freshly packed pantry staple for everyday cooking.";
  const description =
    normalizeOptionalString(payload.description) || shortDescription;
  const categoryTag = normalizeOptionalString(payload.categoryTag) || category;
  const imageAlt = normalizeOptionalString(payload.imageAlt) || `${name} product image.`;
  const weight = normalizeOptionalString(payload.weight) || "500 g";
  const highlights = normalizeHighlights(payload.highlights, fieldErrors);
  const saleLabel = normalizeOptionalString(payload.saleLabel) || undefined;
  const slug = normalizeSlug(
    normalizeOptionalString(payload.slug) || name,
  );
  const rating = normalizeRating(payload.rating, fieldErrors);

  if (!slug) {
    fieldErrors.slug = "Product slug is invalid.";
  }

  if (originalPrice !== undefined && originalPrice < price) {
    fieldErrors.originalPrice = "Original price must be greater than or equal to price.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Product details are invalid.", fieldErrors);
  }

  return {
    category,
    categoryTag,
    description,
    highlights,
    imageAlt,
    imageSrc,
    name,
    originalPrice,
    price,
    rating,
    saleLabel,
    shortDescription,
    sku,
    slug,
    status,
    stockUnits,
    weight,
  };
}

function normalizeUpdateProductPayload(
  payload: UpdateProductPayload,
): NormalizedUpdateProductPayload {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Product details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const normalized: NormalizedUpdateProductPayload = {};

  if (hasOwnField(payload, "name")) {
    normalized.name = normalizeRequiredString(payload, "name", "Product name", fieldErrors, 2);
  }

  if (hasOwnField(payload, "category")) {
    normalized.category = normalizeRequiredString(payload, "category", "Category", fieldErrors, 2);
  }

  if (hasOwnField(payload, "categoryTag")) {
    normalized.categoryTag = normalizeOptionalString(payload.categoryTag);
  }

  if (hasOwnField(payload, "description")) {
    normalized.description = normalizeRequiredString(
      payload,
      "description",
      "Description",
      fieldErrors,
      2,
    );
  }

  if (hasOwnField(payload, "shortDescription")) {
    normalized.shortDescription = normalizeRequiredString(
      payload,
      "shortDescription",
      "Short description",
      fieldErrors,
      2,
    );
  }

  if (hasOwnField(payload, "imageSrc")) {
    normalized.imageSrc = normalizeRequiredString(payload, "imageSrc", "Product image", fieldErrors);
  }

  if (hasOwnField(payload, "imageAlt")) {
    normalized.imageAlt = normalizeOptionalString(payload.imageAlt);
  }

  if (hasOwnField(payload, "sku")) {
    normalized.sku = normalizeRequiredString(payload, "sku", "SKU", fieldErrors, 2).toUpperCase();
  }

  if (hasOwnField(payload, "slug")) {
    const slug = normalizeSlug(normalizeOptionalString(payload.slug));

    if (!slug) {
      fieldErrors.slug = "Product slug is invalid.";
    } else {
      normalized.slug = slug;
    }
  }

  if (hasOwnField(payload, "price")) {
    normalized.price = normalizeMoney(payload.price, "price", "Price", fieldErrors, true);
  }

  if (hasOwnField(payload, "originalPrice")) {
    normalized.originalPrice =
      payload.originalPrice === undefined || payload.originalPrice === null || payload.originalPrice === ""
        ? null
        : normalizeMoney(
            payload.originalPrice,
            "originalPrice",
            "Original price",
            fieldErrors,
            false,
          );
  }

  if (hasOwnField(payload, "rating")) {
    normalized.rating = normalizeRating(payload.rating, fieldErrors);
  }

  if (hasOwnField(payload, "saleLabel")) {
    normalized.saleLabel = normalizeOptionalString(payload.saleLabel) || null;
  }

  if (hasOwnField(payload, "stockUnits")) {
    normalized.stockUnits = normalizeStockUnits(payload.stockUnits, fieldErrors);
  }

  if (hasOwnField(payload, "status")) {
    normalized.status = normalizeStatus(payload.status, fieldErrors);
  }

  if (hasOwnField(payload, "weight")) {
    normalized.weight = normalizeOptionalString(payload.weight);
  }

  if (hasOwnField(payload, "highlights")) {
    normalized.highlights = normalizeHighlights(payload.highlights, fieldErrors);
  }

  if (
    normalized.originalPrice !== null &&
    normalized.originalPrice !== undefined &&
    normalized.price !== undefined &&
    normalized.originalPrice < normalized.price
  ) {
    fieldErrors.originalPrice = "Original price must be greater than or equal to price.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Product details are invalid.", fieldErrors);
  }

  if (Object.keys(normalized).length === 0) {
    throw apiErrors.badRequest("At least one product field must be provided.");
  }

  return normalized;
}

function toDecimal(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

function toProductDto(product: {
  category: string;
  categoryTag: string;
  createdAt: Date;
  description: string;
  highlights: Prisma.JsonValue;
  id: string;
  imageAlt: string;
  imageSrc: string;
  name: string;
  originalPrice: Prisma.Decimal | null;
  price: Prisma.Decimal;
  productCode: string;
  rating: number;
  saleLabel: string | null;
  shortDescription: string;
  sku: string;
  slug: string;
  status: string;
  stockUnits: number;
  updatedAt: Date;
  weight: string;
}): ProductDto {
  const highlights = Array.isArray(product.highlights)
    ? product.highlights.filter((item): item is string => typeof item === "string")
    : [];

  return {
    category: product.category,
    categoryTag: product.categoryTag,
    createdAt: product.createdAt.toISOString(),
    description: product.description,
    highlights,
    id: product.id,
    imageAlt: product.imageAlt,
    imageSrc: product.imageSrc,
    name: product.name,
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    price: Number(product.price),
    productCode: product.productCode,
    rating: product.rating,
    saleLabel: product.saleLabel,
    shortDescription: product.shortDescription,
    sku: product.sku,
    slug: product.slug,
    status: productStatuses.includes(product.status as ProductStatus)
      ? (product.status as ProductStatus)
      : "IN_STOCK",
    stockUnits: product.stockUnits,
    updatedAt: product.updatedAt.toISOString(),
    weight: product.weight,
  };
}

function isUniqueConstraintError(error: unknown, field: string) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes(field)
  );
}

function isRecordNotFoundError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

function getUniqueConflictMessage(error: unknown, product: { sku?: string; slug?: string }) {
  if (isUniqueConstraintError(error, "sku")) {
    return apiErrors.conflict("A product with this SKU already exists.", {
      sku: product.sku,
    });
  }

  if (isUniqueConstraintError(error, "slug")) {
    return apiErrors.conflict("A product with this slug already exists.", {
      slug: product.slug,
    });
  }

  return null;
}

export async function listProducts(): Promise<ProductDto[]> {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map(toProductDto);
}

export async function getProduct(productId: string): Promise<ProductDto> {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw apiErrors.notFound("Product was not found.", { productId });
  }

  return toProductDto(product);
}

export async function createProduct(payload: CreateProductPayload): Promise<ProductDto> {
  const product = normalizeCreateProductPayload(payload);

  for (let attempt = 1; attempt <= maxCreateAttempts; attempt += 1) {
    try {
      const createdProduct = await prisma.product.create({
        data: {
          category: product.category,
          categoryTag: product.categoryTag,
          description: product.description,
          highlights: product.highlights,
          imageAlt: product.imageAlt,
          imageSrc: product.imageSrc,
          name: product.name,
          originalPrice:
            product.originalPrice === undefined
              ? undefined
              : toDecimal(product.originalPrice),
          price: toDecimal(product.price),
          productCode: createProductCode(),
          rating: product.rating,
          saleLabel: product.saleLabel,
          shortDescription: product.shortDescription,
          sku: product.sku,
          slug: product.slug,
          status: product.status,
          stockUnits: product.stockUnits,
          weight: product.weight,
        },
      });

      return toProductDto(createdProduct);
    } catch (error) {
      const uniqueConflict = getUniqueConflictMessage(error, product);

      if (uniqueConflict) {
        throw uniqueConflict;
      }

      if (isUniqueConstraintError(error, "productCode") && attempt < maxCreateAttempts) {
        continue;
      }

      throw error;
    }
  }

  throw apiErrors.conflict("Could not generate a unique product code. Please try again.");
}

export async function updateProduct(
  productId: string,
  payload: UpdateProductPayload,
): Promise<ProductDto> {
  const product = normalizeUpdateProductPayload(payload);
  const data: Prisma.ProductUpdateInput = {};

  if (product.category !== undefined) data.category = product.category;
  if (product.categoryTag !== undefined) data.categoryTag = product.categoryTag;
  if (product.description !== undefined) data.description = product.description;
  if (product.highlights !== undefined) data.highlights = product.highlights;
  if (product.imageAlt !== undefined) data.imageAlt = product.imageAlt;
  if (product.imageSrc !== undefined) data.imageSrc = product.imageSrc;
  if (product.name !== undefined) data.name = product.name;
  if (product.originalPrice !== undefined) {
    data.originalPrice = product.originalPrice === null ? null : toDecimal(product.originalPrice);
  }
  if (product.price !== undefined) data.price = toDecimal(product.price);
  if (product.rating !== undefined) data.rating = product.rating;
  if (product.saleLabel !== undefined) data.saleLabel = product.saleLabel;
  if (product.shortDescription !== undefined) data.shortDescription = product.shortDescription;
  if (product.sku !== undefined) data.sku = product.sku;
  if (product.slug !== undefined) data.slug = product.slug;
  if (product.status !== undefined) data.status = product.status;
  if (product.stockUnits !== undefined) data.stockUnits = product.stockUnits;
  if (product.weight !== undefined) data.weight = product.weight;

  try {
    const updatedProduct = await prisma.product.update({
      data,
      where: {
        id: productId,
      },
    });

    return toProductDto(updatedProduct);
  } catch (error) {
    const uniqueConflict = getUniqueConflictMessage(error, product);

    if (uniqueConflict) {
      throw uniqueConflict;
    }

    if (isRecordNotFoundError(error)) {
      throw apiErrors.notFound("Product was not found.", { productId });
    }

    throw error;
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw apiErrors.notFound("Product was not found.", { productId });
    }

    throw error;
  }
}
