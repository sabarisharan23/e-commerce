import { randomUUID } from "crypto";

import { prisma } from "../db/prisma";
import { apiErrors } from "../http/api-error";
import { serverLogger } from "../observability/logger";
import { hashPassword, verifyPassword } from "../security/password";
import {
  readDevAuthUsers,
  writeDevAuthUsers,
  type DevAuthUserRecord,
} from "./dev-auth-store";

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

type UserRecord = {
  id: string;
  authId: string;
  email: string;
  passwordHash: string | null;
  name: string;
  phone: string | null;
  membership: string;
  communicationPreference: string | null;
  addressLabel: string | null;
  addressLines: unknown;
  avatarInitials: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
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

function toAuthUserDto(user: UserRecord): AuthUserDto {
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

function fromDevAuthUser(user: DevAuthUserRecord): UserRecord {
  return {
    ...user,
    createdAt: new Date(user.createdAt),
    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
    updatedAt: new Date(user.updatedAt),
  };
}

function toDevAuthUser(user: UserRecord): DevAuthUserRecord {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    updatedAt: user.updatedAt.toISOString(),
  };
}

function shouldUseDevAuthStore(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    /EACCES|ECONNREFUSED|ENOTFOUND|Can't reach database server|connect/i.test(message) ||
    /Cannot read properties of undefined \(reading '(findUnique|create|update)'\)/i.test(
      message,
    )
  );
}

async function withAuthStoreFallback<T>(action: () => Promise<T>, fallback: () => Promise<T>) {
  try {
    return await action();
  } catch (error) {
    if (!shouldUseDevAuthStore(error)) {
      throw error;
    }

    serverLogger.warn(
      "Database unavailable for auth flow. Falling back to local development auth store.",
      { error: error instanceof Error ? error.message : String(error) },
    );

    return fallback();
  }
}

async function findUserByEmail(email: string) {
  return withAuthStoreFallback(
    async () =>
      prisma.user.findUnique({
        where: { email },
      }),
    async () => {
      const users = await readDevAuthUsers();
      const user = users.find((entry) => entry.email === email);
      return user ? fromDevAuthUser(user) : null;
    },
  );
}

async function findUserByAuthId(authId: string) {
  return withAuthStoreFallback(
    async () =>
      prisma.user.findUnique({
        where: {
          authId,
        },
      }),
    async () => {
      const users = await readDevAuthUsers();
      const user = users.find((entry) => entry.authId === authId);
      return user ? fromDevAuthUser(user) : null;
    },
  );
}

async function createUser(data: Omit<UserRecord, "id" | "createdAt" | "updatedAt">) {
  return withAuthStoreFallback(
    async () =>
      prisma.user.create({
        data,
      }),
    async () => {
      const users = await readDevAuthUsers();
      const now = new Date();
      const user: UserRecord = {
        ...data,
        createdAt: now,
        id: `dev-user-${randomUUID()}`,
        updatedAt: now,
      };

      users.push(toDevAuthUser(user));
      await writeDevAuthUsers(users);

      return user;
    },
  );
}

async function updateUser(id: string, data: Partial<UserRecord>) {
  return withAuthStoreFallback(
    async () =>
      prisma.user.update({
        data,
        where: {
          id,
        },
      }),
    async () => {
      const users = await readDevAuthUsers();
      const index = users.findIndex((entry) => entry.id === id);

      if (index < 0) {
        throw apiErrors.notFound("User not found.");
      }

      const current = fromDevAuthUser(users[index]);
      const nextUser: UserRecord = {
        ...current,
        ...data,
        updatedAt: new Date(),
      };

      users[index] = toDevAuthUser(nextUser);
      await writeDevAuthUsers(users);

      return nextUser;
    },
  );
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
  return createUser({
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

  const existingUser = await findUserByEmail(email);
  const passwordHash = await hashPassword(password);

  if (existingUser?.passwordHash) {
    throw apiErrors.conflict("An account already exists for this email.");
  }

  const user = existingUser
    ? await updateUser(existingUser.id, {
        avatarInitials: existingUser.avatarInitials ?? createInitials(name),
        lastLoginAt: new Date(),
        name,
        passwordHash,
      })
    : await createUser({
        authId: `member-${randomUUID()}`,
        avatarInitials: createInitials(name),
        communicationPreference: "Email, Push Notifications",
        email,
        lastLoginAt: new Date(),
        membership: "Standard Member",
        name,
        passwordHash,
        phone: null,
        addressLabel: null,
        addressLines: [],
      });

  return toAuthUserDto(user);
}

export async function signInUser(payload: SignInPayload): Promise<AuthUserDto> {
  const { email, password } = normalizeCredentials(payload);
  const lookupEmail = demoLoginAliases.has(email) ? demoAccount.email : email;
  let user = await findUserByEmail(lookupEmail);

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

  const updatedUser = await updateUser(user.id, {
    lastLoginAt: new Date(),
  });

  return toAuthUserDto(updatedUser);
}

export async function getAuthUserByAuthId(authId: string): Promise<AuthUserDto | null> {
  const user = await findUserByAuthId(authId.trim());

  return user ? toAuthUserDto(user) : null;
}
