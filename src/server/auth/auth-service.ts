import { randomUUID } from "crypto";

import { prisma } from "../db/prisma";
import { apiErrors } from "../http/api-error";
import { hashPassword, verifyPassword } from "../security/password";

export type AuthUserDto = {
  id: string;
  name: string;
  email: string;
  membership: string;
  memberSince: string;
  phone: string;
  communicationPreference: string;
  addressLabel: string;
  addressLines: string[];
  avatarInitials: string;
};

export type SignInPayload = {
  email?: unknown;
  password?: unknown;
};

export type SignUpPayload = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
};

const demoAccount = {
  email: "john.doe@example.com",
  name: "John Doe",
  password: "demo123",
};

const demoLoginAliases = new Set([demoAccount.email, "demo@theni.store"]);

function optionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function createInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "TS";
}

function readAddressLines(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((line): line is string => typeof line === "string")
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatMemberSince(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function toAuthUserDto(user: {
  addressLabel: string | null;
  addressLines: unknown;
  authId: string;
  avatarInitials: string | null;
  communicationPreference: string | null;
  createdAt: Date;
  email: string;
  membership: string;
  name: string;
  phone: string | null;
}): AuthUserDto {
  return {
    addressLabel: user.addressLabel ?? "Home Address",
    addressLines: readAddressLines(user.addressLines),
    avatarInitials: user.avatarInitials ?? createInitials(user.name),
    communicationPreference:
      user.communicationPreference ?? "Email, Push Notifications",
    email: user.email,
    id: user.authId,
    memberSince: formatMemberSince(user.createdAt),
    membership: user.membership,
    name: user.name,
    phone: user.phone ?? "",
  };
}

function normalizeCredentials(payload: SignInPayload | SignUpPayload) {
  const email = optionalString(payload.email).toLowerCase();
  const password = optionalString(payload.password);
  const fieldErrors: Record<string, string> = {};

  if (!email || !email.includes("@")) {
    fieldErrors.email = "A valid email is required.";
  }

  if (password.length < 6) {
    fieldErrors.password = "Password must be at least 6 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Account details are invalid.", fieldErrors);
  }

  return { email, password };
}

async function createDemoAccount(password: string) {
  return prisma.user.create({
    data: {
      addressLabel: "Home Address",
      addressLines: [
        "123 Sunset Boulevard, Apartment 4B",
        "Los Angeles, CA 90028",
      ],
      authId: `member-${randomUUID()}`,
      avatarInitials: "JD",
      communicationPreference: "Email, Push Notifications",
      email: demoAccount.email,
      membership: "Premium Member",
      name: demoAccount.name,
      passwordHash: await hashPassword(password),
      phone: "+1 (555) 000-1234",
      lastLoginAt: new Date(),
    },
  });
}

export async function signUpUser(payload: SignUpPayload): Promise<AuthUserDto> {
  const name = optionalString(payload.name);
  const { email, password } = normalizeCredentials(payload);

  if (name.length < 2) {
    throw apiErrors.validation("Account details are invalid.", {
      name: "Name must be at least 2 characters.",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  const passwordHash = await hashPassword(password);

  if (existingUser?.passwordHash) {
    throw apiErrors.conflict("An account already exists for this email.");
  }

  const user = existingUser
    ? await prisma.user.update({
        data: {
          avatarInitials: existingUser.avatarInitials ?? createInitials(name),
          lastLoginAt: new Date(),
          name,
          passwordHash,
        },
        where: {
          id: existingUser.id,
        },
      })
    : await prisma.user.create({
        data: {
          authId: `member-${randomUUID()}`,
          avatarInitials: createInitials(name),
          communicationPreference: "Email, Push Notifications",
          email,
          membership: "Standard Member",
          name,
          passwordHash,
          lastLoginAt: new Date(),
        },
      });

  return toAuthUserDto(user);
}

export async function signInUser(payload: SignInPayload): Promise<AuthUserDto> {
  const { email, password } = normalizeCredentials(payload);
  const lookupEmail = demoLoginAliases.has(email) ? demoAccount.email : email;
  let user = await prisma.user.findUnique({
    where: { email: lookupEmail },
  });

  if (!user && demoLoginAliases.has(email) && password === demoAccount.password) {
    user = await createDemoAccount(password);
  }

  if (!user?.passwordHash) {
    throw apiErrors.unauthorized("Email or password is incorrect.");
  }

  const validPassword = await verifyPassword(password, user.passwordHash);

  if (!validPassword) {
    throw apiErrors.unauthorized("Email or password is incorrect.");
  }

  const updatedUser = await prisma.user.update({
    data: {
      lastLoginAt: new Date(),
    },
    where: {
      id: user.id,
    },
  });

  return toAuthUserDto(updatedUser);
}

export async function getAuthUserByAuthId(authId: string): Promise<AuthUserDto | null> {
  const user = await prisma.user.findUnique({
    where: {
      authId: authId.trim(),
    },
  });

  return user ? toAuthUserDto(user) : null;
}
