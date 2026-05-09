"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (values: { name: string; email: string; password: string }) => Promise<AuthResult>;
  signOut: () => void;
};

type AuthResult = {
  success: boolean;
  message?: string;
};

type AuthApiResponse =
  | { data: AuthUser; success: true }
  | { error: { message: string }; success: false };

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

const AuthContext = createContext<AuthContextValue | null>(null);

let cachedAuthRaw = "";
let cachedAuthSnapshot: AuthUser | null = null;

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

async function readAuthResponse(response: Response) {
  const body = (await response.json()) as AuthApiResponse;

  if (!response.ok || !body.success) {
    return {
      success: false,
      message: body.success
        ? "Unable to authenticate. Please try again."
        : body.error.message,
    };
  }

  writeAuth(body.data);
  return { success: true };
}

async function submitAuth(
  endpoint: "/api/v1/auth/signin" | "/api/v1/auth/signup",
  body: Record<string, string>,
): Promise<AuthResult> {
  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify(body),
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    return readAuthResponse(response);
  } catch {
    return {
      success: false,
      message: "Unable to reach the server. Please try again.",
    };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribe, readAuth, () => null);
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/v1/auth/session", {
      cache: "no-store",
      credentials: "same-origin",
    })
      .then(async (response) => {
        const body = (await response.json()) as AuthApiResponse;

        if (!active) {
          return;
        }

        if (response.ok && body.success) {
          writeAuth(body.data);
        } else {
          writeAuth(null);
        }
      })
      .catch(() => {
        if (active) {
          writeAuth(null);
        }
      })
      .finally(() => {
        if (active) {
          setSessionChecked(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const isReady = isHydrated && sessionChecked;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady,
      signIn: async (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (!normalizedEmail || normalizedPassword.length < 6) {
          return {
            success: false,
            message: "Enter a valid email and a password with at least 6 characters.",
          };
        }

        return submitAuth("/api/v1/auth/signin", {
          email: normalizedEmail,
          password: normalizedPassword,
        });
      },
      signUp: async ({ name, email, password }) => {
        const trimmedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (!trimmedName || !normalizedEmail || normalizedPassword.length < 6) {
          return {
            success: false,
            message: "Enter your name, email, and a password with at least 6 characters.",
          };
        }

        return submitAuth("/api/v1/auth/signup", {
          email: normalizedEmail,
          name: trimmedName,
          password: normalizedPassword,
        });
      },
      signOut: () => {
        writeAuth(null);
        void fetch("/api/v1/auth/signout", {
          credentials: "same-origin",
          method: "POST",
        });
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
