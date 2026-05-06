"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type AdminAuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
};

type AdminAuthContextValue = {
  user: AdminAuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  signIn: (email: string, password: string) => { success: boolean; message?: string };
  signOut: () => void;
};

const ADMIN_AUTH_STORAGE_KEY = "theni-store-admin-auth";
const ADMIN_AUTH_CHANGE_EVENT = "theni-store-admin-auth-change";

export const ADMIN_DEMO_ACCOUNT: AdminAuthUser = {
  id: "admin-john-doe",
  name: "John Doe",
  email: "admin@theni.store",
  role: "Super Admin",
  avatarInitials: "JD",
};

export const ADMIN_DEMO_CREDENTIALS = {
  email: ADMIN_DEMO_ACCOUNT.email,
  password: "admin123",
};

const ADMIN_LOGIN_ALIASES = [ADMIN_DEMO_ACCOUNT.email, "demo-admin@theni.store"];

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

let cachedAdminAuthRaw = "";
let cachedAdminAuthSnapshot: AdminAuthUser | null = null;

function readAdminAuth() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);

  if (!stored) {
    cachedAdminAuthRaw = "";
    cachedAdminAuthSnapshot = null;
    return null;
  }

  if (stored === cachedAdminAuthRaw) {
    return cachedAdminAuthSnapshot;
  }

  try {
    cachedAdminAuthRaw = stored;
    cachedAdminAuthSnapshot = JSON.parse(stored) as AdminAuthUser | null;
    return cachedAdminAuthSnapshot;
  } catch {
    window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    cachedAdminAuthRaw = "";
    cachedAdminAuthSnapshot = null;
    return null;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => callback();

  window.addEventListener("storage", handleChange);
  window.addEventListener(ADMIN_AUTH_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(ADMIN_AUTH_CHANGE_EVENT, handleChange);
  };
}

function subscribeToHydration() {
  return () => {};
}

function writeAdminAuth(user: AdminAuthUser | null) {
  if (user) {
    window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  }

  window.dispatchEvent(new Event(ADMIN_AUTH_CHANGE_EVENT));
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribe, readAdminAuth, () => null);
  const isReady = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady,
      signIn: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        const isValidEmail = ADMIN_LOGIN_ALIASES.includes(normalizedEmail);
        const isValidPassword = normalizedPassword === ADMIN_DEMO_CREDENTIALS.password;

        if (!isValidEmail || !isValidPassword) {
          return {
            success: false,
            message: "Use the demo admin credentials shown on the page to sign in.",
          };
        }

        writeAdminAuth(ADMIN_DEMO_ACCOUNT);
        return { success: true };
      },
      signOut: () => {
        writeAdminAuth(null);
      },
    }),
    [isReady, user],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider.");
  }

  return context;
}

