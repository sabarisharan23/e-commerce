"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type AuthUser = {
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

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  signIn: (email: string, password: string) => { success: boolean; message?: string };
  signUp: (values: { name: string; email: string; password: string }) => {
    success: boolean;
    message?: string;
  };
  signOut: () => void;
};

const AUTH_STORAGE_KEY = "theni-store-auth";
const AUTH_CHANGE_EVENT = "theni-store-auth-change";

export const DEMO_ACCOUNT: AuthUser = {
  id: "demo-john-doe",
  name: "John Doe",
  email: "john.doe@example.com",
  membership: "Premium Member",
  memberSince: "Oct 2023",
  phone: "+1 (555) 000-1234",
  communicationPreference: "Email, Push Notifications",
  addressLabel: "Home Address",
  addressLines: [
    "123 Sunset Boulevard, Apartment 4B",
    "Los Angeles, CA 90028",
  ],
  avatarInitials: "JD",
};

export const DEMO_CREDENTIALS = {
  email: DEMO_ACCOUNT.email,
  password: "demo123",
};

const DEMO_LOGIN_ALIASES = [DEMO_ACCOUNT.email, "demo@theni.store"];

const AuthContext = createContext<AuthContextValue | null>(null);

let cachedAuthRaw = "";
let cachedAuthSnapshot: AuthUser | null = null;

function createInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "TS";
}

function readAuth() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!stored) {
    cachedAuthRaw = "";
    cachedAuthSnapshot = null;
    return null;
  }

  if (stored === cachedAuthRaw) {
    return cachedAuthSnapshot;
  }

  try {
    cachedAuthRaw = stored;
    cachedAuthSnapshot = JSON.parse(stored) as AuthUser | null;
    return cachedAuthSnapshot;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    cachedAuthRaw = "";
    cachedAuthSnapshot = null;
    return null;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => callback();

  window.addEventListener("storage", handleChange);
  window.addEventListener(AUTH_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, handleChange);
  };
}

function subscribeToHydration() {
  return () => {};
}

function writeAuth(user: AuthUser | null) {
  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function createSignedUpUser(name: string, email: string): AuthUser {
  const formattedMemberSince = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date());

  return {
    ...DEMO_ACCOUNT,
    id: `member-${Date.now()}`,
    name,
    email,
    memberSince: formattedMemberSince,
    avatarInitials: createInitials(name),
  };
}

function syncUserToDatabase(user: AuthUser | null) {
  if (!user) {
    return;
  }

  void fetch("/api/v1/users/upsert", {
    body: JSON.stringify({
      addressLabel: user.addressLabel,
      addressLines: user.addressLines,
      authId: user.id,
      avatarInitials: user.avatarInitials,
      communicationPreference: user.communicationPreference,
      email: user.email,
      membership: user.membership,
      name: user.name,
      phone: user.phone,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }).catch(() => {
    // Login should not fail just because persistence is temporarily unavailable.
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribe, readAuth, () => null);
  const isReady = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  useEffect(() => {
    syncUserToDatabase(user);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady,
      signIn: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        const isValidEmail = DEMO_LOGIN_ALIASES.includes(normalizedEmail);
        const isValidPassword = normalizedPassword === DEMO_CREDENTIALS.password;

        if (!isValidEmail || !isValidPassword) {
          return {
            success: false,
            message: "Use the demo account details shown in the popup to sign in.",
          };
        }

        writeAuth(DEMO_ACCOUNT);
        return { success: true };
      },
      signUp: ({ name, email, password }) => {
        const trimmedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (!trimmedName || !normalizedEmail || normalizedPassword.length < 6) {
          return {
            success: false,
            message: "Enter your name, email, and a password with at least 6 characters.",
          };
        }

        writeAuth(createSignedUpUser(trimmedName, normalizedEmail));
        return { success: true };
      },
      signOut: () => {
        writeAuth(null);
      },
    }),
    [isReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
