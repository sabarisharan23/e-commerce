import { Prisma } from "@prisma/client";

import { prisma } from "../db/prisma";
import { apiErrors } from "../http/api-error";

export type CreateCategoryPayload = {
  description?: unknown;
  name?: unknown;
  parentId?: unknown;
  slug?: unknown;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type CategoryDto = {
  count: number;
  createdAt: string;
  description: string;
  id: string;
  name: string;
  parentId: string | null;
  parentName: string | null;
  slug: string;
  updatedAt: string;
};

export type CreateTagPayload = {
  description?: unknown;
  name?: unknown;
  slug?: unknown;
};

export type UpdateTagPayload = Partial<CreateTagPayload>;

export type TagDto = {
  count: number;
  createdAt: string;
  description: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
};

type NormalizedCreateCategoryPayload = {
  description: string;
  name: string;
  parentId?: string | null;
  slug: string;
};

type NormalizedUpdateCategoryPayload = {
  description?: string;
  name?: string;
  parentId?: string | null;
  slug?: string;
};

type NormalizedCreateTagPayload = {
  description: string;
  name: string;
  slug: string;
};

type NormalizedUpdateTagPayload = Partial<NormalizedCreateTagPayload>;

type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: {
    _count: {
      select: {
        products: true;
      };
    };
    parent: {
      select: {
        name: true;
      };
    };
  };
}>;

type TagWithCount = Prisma.ProductTagGetPayload<{
  include: {
    _count: {
      select: {
        products: true;
      };
    };
  };
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwnField(payload: Record<string, unknown>, field: string) {
  return Object.prototype.hasOwnProperty.call(payload, field);
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeRequiredString(
  payload: Record<string, unknown>,
  field: string,
  label: string,
  fieldErrors: Record<string, string>,
  minimumLength = 2,
) {
  const value = typeof payload[field] === "string" ? payload[field].trim() : "";

  if (value.length < minimumLength) {
    fieldErrors[field] = `${label} must be at least ${minimumLength} characters.`;
  }

  return value;
}

function normalizeOptionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalId(value: unknown, field: string, fieldErrors: Record<string, string>) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    fieldErrors[field] = "Choose a valid record.";
    return null;
  }

  return value.trim() || null;
}

function normalizeCreateCategoryPayload(
  payload: CreateCategoryPayload,
): NormalizedCreateCategoryPayload {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Category details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const name = normalizeRequiredString(payload, "name", "Category name", fieldErrors);
  const description =
    normalizeOptionalString(payload.description) || "Products grouped under this category.";
  const slug = slugify(normalizeOptionalString(payload.slug) || name);
  const parentId = normalizeOptionalId(payload.parentId, "parentId", fieldErrors);

  if (!slug) {
    fieldErrors.slug = "Category slug is invalid.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Category details are invalid.", fieldErrors);
  }

  return {
    description,
    name,
    parentId,
    slug,
  };
}

function normalizeUpdateCategoryPayload(
  payload: UpdateCategoryPayload,
): NormalizedUpdateCategoryPayload {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Category details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const normalized: NormalizedUpdateCategoryPayload = {};

  if (hasOwnField(payload, "name")) {
    normalized.name = normalizeRequiredString(payload, "name", "Category name", fieldErrors);
  }

  if (hasOwnField(payload, "description")) {
    normalized.description =
      normalizeOptionalString(payload.description) || "Products grouped under this category.";
  }

  if (hasOwnField(payload, "slug")) {
    const slug = slugify(normalizeOptionalString(payload.slug));

    if (!slug) {
      fieldErrors.slug = "Category slug is invalid.";
    } else {
      normalized.slug = slug;
    }
  }

  if (hasOwnField(payload, "parentId")) {
    normalized.parentId = normalizeOptionalId(payload.parentId, "parentId", fieldErrors);
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Category details are invalid.", fieldErrors);
  }

  if (Object.keys(normalized).length === 0) {
    throw apiErrors.badRequest("At least one category field must be provided.");
  }

  return normalized;
}

function normalizeCreateTagPayload(payload: CreateTagPayload): NormalizedCreateTagPayload {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Tag details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const name = normalizeRequiredString(payload, "name", "Tag name", fieldErrors);
  const description = normalizeOptionalString(payload.description) || "Product tag.";
  const slug = slugify(normalizeOptionalString(payload.slug) || name);

  if (!slug) {
    fieldErrors.slug = "Tag slug is invalid.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Tag details are invalid.", fieldErrors);
  }

  return {
    description,
    name,
    slug,
  };
}

function normalizeUpdateTagPayload(payload: UpdateTagPayload): NormalizedUpdateTagPayload {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Tag details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const normalized: NormalizedUpdateTagPayload = {};

  if (hasOwnField(payload, "name")) {
    normalized.name = normalizeRequiredString(payload, "name", "Tag name", fieldErrors);
  }

  if (hasOwnField(payload, "description")) {
    normalized.description = normalizeOptionalString(payload.description) || "Product tag.";
  }

  if (hasOwnField(payload, "slug")) {
    const slug = slugify(normalizeOptionalString(payload.slug));

    if (!slug) {
      fieldErrors.slug = "Tag slug is invalid.";
    } else {
      normalized.slug = slug;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Tag details are invalid.", fieldErrors);
  }

  if (Object.keys(normalized).length === 0) {
    throw apiErrors.badRequest("At least one tag field must be provided.");
  }

  return normalized;
}

function toCategoryDto(category: CategoryWithCount): CategoryDto {
  return {
    count: category._count.products,
    createdAt: category.createdAt.toISOString(),
    description: category.description,
    id: category.id,
    name: category.name,
    parentId: category.parentId,
    parentName: category.parent?.name ?? null,
    slug: category.slug,
    updatedAt: category.updatedAt.toISOString(),
  };
}

function toTagDto(tag: TagWithCount): TagDto {
  return {
    count: tag._count.products,
    createdAt: tag.createdAt.toISOString(),
    description: tag.description,
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    updatedAt: tag.updatedAt.toISOString(),
  };
}

function categoryInclude() {
  return {
    _count: {
      select: {
        products: true,
      },
    },
    parent: {
      select: {
        name: true,
      },
    },
  } satisfies Prisma.CategoryInclude;
}

function tagInclude() {
  return {
    _count: {
      select: {
        products: true,
      },
    },
  } satisfies Prisma.ProductTagInclude;
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

function isForeignKeyError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003";
}

export async function listCategories(): Promise<CategoryDto[]> {
  const categories = await prisma.category.findMany({
    include: categoryInclude(),
    orderBy: {
      name: "asc",
    },
  });

  return categories.map(toCategoryDto);
}

export async function getCategory(categoryId: string): Promise<CategoryDto> {
  const category = await prisma.category.findUnique({
    include: categoryInclude(),
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw apiErrors.notFound("Category was not found.", { categoryId });
  }

  return toCategoryDto(category);
}

export async function createCategory(payload: CreateCategoryPayload): Promise<CategoryDto> {
  const category = normalizeCreateCategoryPayload(payload);

  try {
    const createdCategory = await prisma.category.create({
      data: category,
      include: categoryInclude(),
    });

    return toCategoryDto(createdCategory);
  } catch (error) {
    if (isUniqueConstraintError(error, "slug")) {
      throw apiErrors.conflict("A category with this slug already exists.", {
        slug: category.slug,
      });
    }

    if (isForeignKeyError(error)) {
      throw apiErrors.validation("Category details are invalid.", {
        parentId: "Choose a valid parent category.",
      });
    }

    throw error;
  }
}

export async function updateCategory(
  categoryId: string,
  payload: UpdateCategoryPayload,
): Promise<CategoryDto> {
  const category = normalizeUpdateCategoryPayload(payload);

  if (category.parentId === categoryId) {
    throw apiErrors.validation("Category details are invalid.", {
      parentId: "A category cannot be its own parent.",
    });
  }

  try {
    const updatedCategory = await prisma.category.update({
      data: category,
      include: categoryInclude(),
      where: {
        id: categoryId,
      },
    });

    return toCategoryDto(updatedCategory);
  } catch (error) {
    if (isUniqueConstraintError(error, "slug")) {
      throw apiErrors.conflict("A category with this slug already exists.", {
        slug: category.slug,
      });
    }

    if (isForeignKeyError(error)) {
      throw apiErrors.validation("Category details are invalid.", {
        parentId: "Choose a valid parent category.",
      });
    }

    if (isRecordNotFoundError(error)) {
      throw apiErrors.notFound("Category was not found.", { categoryId });
    }

    throw error;
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw apiErrors.notFound("Category was not found.", { categoryId });
    }

    throw error;
  }
}

export async function listTags(): Promise<TagDto[]> {
  const tags = await prisma.productTag.findMany({
    include: tagInclude(),
    orderBy: {
      name: "asc",
    },
  });

  return tags.map(toTagDto);
}

export async function getTag(tagId: string): Promise<TagDto> {
  const tag = await prisma.productTag.findUnique({
    include: tagInclude(),
    where: {
      id: tagId,
    },
  });

  if (!tag) {
    throw apiErrors.notFound("Tag was not found.", { tagId });
  }

  return toTagDto(tag);
}

export async function createTag(payload: CreateTagPayload): Promise<TagDto> {
  const tag = normalizeCreateTagPayload(payload);

  try {
    const createdTag = await prisma.productTag.create({
      data: tag,
      include: tagInclude(),
    });

    return toTagDto(createdTag);
  } catch (error) {
    if (isUniqueConstraintError(error, "slug")) {
      throw apiErrors.conflict("A tag with this slug already exists.", {
        slug: tag.slug,
      });
    }

    throw error;
  }
}

export async function updateTag(tagId: string, payload: UpdateTagPayload): Promise<TagDto> {
  const tag = normalizeUpdateTagPayload(payload);

  try {
    const updatedTag = await prisma.productTag.update({
      data: tag,
      include: tagInclude(),
      where: {
        id: tagId,
      },
    });

    return toTagDto(updatedTag);
  } catch (error) {
    if (isUniqueConstraintError(error, "slug")) {
      throw apiErrors.conflict("A tag with this slug already exists.", {
        slug: tag.slug,
      });
    }

    if (isRecordNotFoundError(error)) {
      throw apiErrors.notFound("Tag was not found.", { tagId });
    }

    throw error;
  }
}

export async function deleteTag(tagId: string): Promise<void> {
  try {
    await prisma.productTag.delete({
      where: {
        id: tagId,
      },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw apiErrors.notFound("Tag was not found.", { tagId });
    }

    throw error;
  }
}
