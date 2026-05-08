import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

import { apiErrors } from "../http/api-error";
import { prisma } from "../db/prisma";
import { hashPassword } from "../security/password";

export type CreateVendorPayload = {
  email?: unknown;
  name?: unknown;
  password?: unknown;
  status?: unknown;
};

export type UpdateVendorPayload = {
  email?: unknown;
  name?: unknown;
  password?: unknown;
  status?: unknown;
};

export type VendorDto = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  status: string;
  updatedAt: string;
  vendorCode: string;
};

type NormalizedCreateVendorPayload = {
  email: string;
  name: string;
  password: string;
  status?: VendorStatus;
};

type NormalizedUpdateVendorPayload = {
  email?: string;
  name?: string;
  password?: string;
  status?: VendorStatus;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxCreateAttempts = 3;
const vendorStatuses = ["ACTIVE", "INACTIVE", "UNDER_AUDIT", "FRESH_ONBOARD"] as const;
type VendorStatus = (typeof vendorStatuses)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwnField(payload: Record<string, unknown>, field: string) {
  return Object.prototype.hasOwnProperty.call(payload, field);
}

function normalizeStatus(status: unknown, fieldErrors: Record<string, string>) {
  if (status === undefined || status === null || status === "") {
    return undefined;
  }

  if (typeof status !== "string") {
    fieldErrors.status = "Vendor status is invalid.";
    return undefined;
  }

  const normalized = status.trim().toUpperCase().replaceAll("-", "_");

  if (!vendorStatuses.includes(normalized as VendorStatus)) {
    fieldErrors.status = "Choose a valid vendor status.";
    return undefined;
  }

  return normalized as VendorStatus;
}

function normalizeCreateVendorPayload(payload: CreateVendorPayload): NormalizedCreateVendorPayload {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Vendor details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const fieldErrors: Record<string, string> = {};
  const status = normalizeStatus(payload.status, fieldErrors);

  if (name.length < 2) {
    fieldErrors.name = "Vendor name must be at least 2 characters.";
  }

  if (!emailPattern.test(email)) {
    fieldErrors.email = "Enter a valid vendor email address.";
  }

  if (password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Vendor details are invalid.", fieldErrors);
  }

  return { email, name, password, status };
}

function normalizeUpdateVendorPayload(payload: UpdateVendorPayload): NormalizedUpdateVendorPayload {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Vendor details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const normalized: NormalizedUpdateVendorPayload = {};

  if (hasOwnField(payload, "name")) {
    const name = typeof payload.name === "string" ? payload.name.trim() : "";

    if (name.length < 2) {
      fieldErrors.name = "Vendor name must be at least 2 characters.";
    } else {
      normalized.name = name;
    }
  }

  if (hasOwnField(payload, "email")) {
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

    if (!emailPattern.test(email)) {
      fieldErrors.email = "Enter a valid vendor email address.";
    } else {
      normalized.email = email;
    }
  }

  if (hasOwnField(payload, "password")) {
    const password = typeof payload.password === "string" ? payload.password : "";

    if (password.length > 0 && password.length < 8) {
      fieldErrors.password = "Password must be at least 8 characters.";
    } else if (password.length >= 8) {
      normalized.password = password;
    }
  }

  if (hasOwnField(payload, "status")) {
    normalized.status = normalizeStatus(payload.status, fieldErrors);
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Vendor details are invalid.", fieldErrors);
  }

  if (Object.keys(normalized).length === 0) {
    throw apiErrors.badRequest("At least one vendor field must be provided.");
  }

  return normalized;
}

function createVendorCode() {
  return `VND-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function toVendorDto(vendor: {
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  status: string;
  updatedAt: Date;
  vendorCode: string;
}): VendorDto {
  return {
    createdAt: vendor.createdAt.toISOString(),
    email: vendor.email,
    id: vendor.id,
    name: vendor.name,
    status: vendor.status,
    updatedAt: vendor.updatedAt.toISOString(),
    vendorCode: vendor.vendorCode,
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

export async function listVendors(): Promise<VendorDto[]> {
  const vendors = await prisma.vendor.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return vendors.map(toVendorDto);
}

export async function getVendor(vendorId: string): Promise<VendorDto> {
  const vendor = await prisma.vendor.findUnique({
    where: {
      id: vendorId,
    },
  });

  if (!vendor) {
    throw apiErrors.notFound("Vendor was not found.", { vendorId });
  }

  return toVendorDto(vendor);
}

export async function createVendor(payload: CreateVendorPayload): Promise<VendorDto> {
  const vendor = normalizeCreateVendorPayload(payload);
  const passwordHash = await hashPassword(vendor.password);

  for (let attempt = 1; attempt <= maxCreateAttempts; attempt += 1) {
    try {
      const createdVendor = await prisma.vendor.create({
        data: {
          email: vendor.email,
          name: vendor.name,
          passwordHash,
          status: vendor.status,
          vendorCode: createVendorCode(),
        },
      });

      return toVendorDto(createdVendor);
    } catch (error) {
      if (isUniqueConstraintError(error, "email")) {
        throw apiErrors.conflict("A vendor with this email already exists.", {
          email: vendor.email,
        });
      }

      if (isUniqueConstraintError(error, "vendorCode") && attempt < maxCreateAttempts) {
        continue;
      }

      throw error;
    }
  }

  throw apiErrors.conflict("Could not generate a unique vendor code. Please try again.");
}

export async function updateVendor(
  vendorId: string,
  payload: UpdateVendorPayload,
): Promise<VendorDto> {
  const vendor = normalizeUpdateVendorPayload(payload);
  const data: Prisma.VendorUpdateInput = {};

  if (vendor.email) {
    data.email = vendor.email;
  }

  if (vendor.name) {
    data.name = vendor.name;
  }

  if (vendor.status) {
    data.status = vendor.status;
  }

  if (vendor.password) {
    data.passwordHash = await hashPassword(vendor.password);
  }

  try {
    const updatedVendor = await prisma.vendor.update({
      data,
      where: {
        id: vendorId,
      },
    });

    return toVendorDto(updatedVendor);
  } catch (error) {
    if (isUniqueConstraintError(error, "email")) {
      throw apiErrors.conflict("A vendor with this email already exists.", {
        email: vendor.email,
      });
    }

    if (isRecordNotFoundError(error)) {
      throw apiErrors.notFound("Vendor was not found.", { vendorId });
    }

    throw error;
  }
}

export async function deleteVendor(vendorId: string): Promise<void> {
  try {
    await prisma.vendor.delete({
      where: {
        id: vendorId,
      },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw apiErrors.notFound("Vendor was not found.", { vendorId });
    }

    throw error;
  }
}
