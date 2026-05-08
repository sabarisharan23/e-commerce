import type { Prisma } from "@prisma/client";

import { prisma } from "../db/prisma";
import { apiErrors } from "../http/api-error";

export type UserPayload = {
  addressLabel?: unknown;
  addressLines?: unknown;
  authId?: unknown;
  avatarInitials?: unknown;
  communicationPreference?: unknown;
  email?: unknown;
  membership?: unknown;
  name?: unknown;
  phone?: unknown;
};

export type UserDto = {
  addressLabel: string | null;
  addressLines: string[];
  authId: string;
  avatarInitials: string | null;
  communicationPreference: string | null;
  createdAt: string;
  email: string;
  id: string;
  lastLoginAt: string | null;
  membership: string;
  name: string;
  phone: string | null;
  updatedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeAddressLines(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((line): line is string => typeof line === "string")
    .map((line) => line.trim())
    .filter(Boolean);
}

function createInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "TS";
}

function normalizeUserPayload(payload: UserPayload) {
  if (!isRecord(payload)) {
    throw apiErrors.validation("User details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const authId = optionalString(payload.authId);
  const email = optionalString(payload.email).toLowerCase();
  const name = optionalString(payload.name);

  if (!authId) {
    fieldErrors.authId = "Auth ID is required.";
  }

  if (!email || !email.includes("@")) {
    fieldErrors.email = "A valid email is required.";
  }

  if (name.length < 2) {
    fieldErrors.name = "Name must be at least 2 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("User details are invalid.", fieldErrors);
  }

  return {
    addressLabel: optionalString(payload.addressLabel) || null,
    addressLines: normalizeAddressLines(payload.addressLines),
    authId,
    avatarInitials: optionalString(payload.avatarInitials) || createInitials(name),
    communicationPreference: optionalString(payload.communicationPreference) || null,
    email,
    membership: optionalString(payload.membership) || "Standard Member",
    name,
    phone: optionalString(payload.phone) || null,
  };
}

function toUserDto(user: {
  addressLabel: string | null;
  addressLines: Prisma.JsonValue;
  authId: string;
  avatarInitials: string | null;
  communicationPreference: string | null;
  createdAt: Date;
  email: string;
  id: string;
  lastLoginAt: Date | null;
  membership: string;
  name: string;
  phone: string | null;
  updatedAt: Date;
}): UserDto {
  const addressLines = Array.isArray(user.addressLines)
    ? user.addressLines.filter((line): line is string => typeof line === "string")
    : [];

  return {
    addressLabel: user.addressLabel,
    addressLines,
    authId: user.authId,
    avatarInitials: user.avatarInitials,
    communicationPreference: user.communicationPreference,
    createdAt: user.createdAt.toISOString(),
    email: user.email,
    id: user.id,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    membership: user.membership,
    name: user.name,
    phone: user.phone,
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function upsertUser(payload: UserPayload): Promise<UserDto> {
  const user = normalizeUserPayload(payload);
  const savedUser = await prisma.user.upsert({
    create: {
      ...user,
      lastLoginAt: new Date(),
    },
    update: {
      ...user,
      lastLoginAt: new Date(),
    },
    where: {
      authId: user.authId,
    },
  });

  return toUserDto(savedUser);
}
