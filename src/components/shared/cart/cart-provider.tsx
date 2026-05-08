"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  quantity: number;
};

export type CartItemInput = {
  id: string;
  name?: string;
  imageSrc?: string;
  price?: number;
  href?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (item: CartItemInput, quantity?: number) => void;
  removeItem: (id: string) => void;
  removeItems: (ids: string[]) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "theni-store-cart";
const CART_CHANGE_EVENT = "theni-store-cart-change";
const EMPTY_CART: CartItem[] = [];
let cachedCartRaw = "";
let cachedCartSnapshot: CartItem[] = EMPTY_CART;

const CartContext = createContext<CartContextValue | null>(null);

type CartToast = {
  id: number;
  name: string;
};

function getProductIdFromHref(href: string) {
  const match = href.match(/\/products\/([^/?#]+)/);

  return match?.[1] ? decodeURIComponent(match[1]).trim() : null;
}

function getProductIdFromItem(item: unknown) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Record<string, unknown>;
  const hrefProductId =
    typeof record.href === "string" ? getProductIdFromHref(record.href) : null;
  const productId =
    hrefProductId ??
    (typeof record.id === "string" && record.id.trim() ? record.id.trim() : null);

  return productId;
}

function normalizeQuantity(value: unknown) {
  const quantity = Number(value);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return 1;
  }

  return Math.floor(quantity);
}

function normalizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return EMPTY_CART;
  }

  const quantitiesById = new Map<string, number>();

  value.forEach((item) => {
    const productId = getProductIdFromItem(item);

    if (!productId) {
      return;
    }

    const quantity =
      item && typeof item === "object"
        ? normalizeQuantity((item as Record<string, unknown>).quantity)
        : 1;

    quantitiesById.set(productId, (quantitiesById.get(productId) ?? 0) + quantity);
  });

  return Array.from(quantitiesById, ([id, quantity]) => ({ id, quantity }));
}

function readCart() {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  const stored = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!stored) {
    cachedCartRaw = "";
    cachedCartSnapshot = EMPTY_CART;
    return EMPTY_CART;
  }

  if (stored === cachedCartRaw) {
    return cachedCartSnapshot;
  }

  try {
    cachedCartRaw = stored;
    cachedCartSnapshot = normalizeCartItems(JSON.parse(stored));
    return cachedCartSnapshot;
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    cachedCartRaw = "";
    cachedCartSnapshot = EMPTY_CART;
    return EMPTY_CART;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => callback();

  window.addEventListener("storage", handleChange);
  window.addEventListener(CART_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CART_CHANGE_EVENT, handleChange);
  };
}

function writeCart(items: CartItem[]) {
  const compactItems = normalizeCartItems(items);
  const serialized = JSON.stringify(compactItems);

  cachedCartRaw = serialized;
  cachedCartSnapshot = compactItems;

  window.localStorage.setItem(CART_STORAGE_KEY, serialized);
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

function migrateCartStorage() {
  if (typeof window === "undefined") {
    return;
  }

  const stored = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!stored) {
    return;
  }

  try {
    const compactItems = normalizeCartItems(JSON.parse(stored));
    const serialized = JSON.stringify(compactItems);

    if (stored !== serialized) {
      writeCart(compactItems);
    }
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    cachedCartRaw = "";
    cachedCartSnapshot = EMPTY_CART;
  }
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3 4.7-4.8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function CartToastBanner({
  toast,
  onClose,
}: {
  toast: CartToast;
  onClose: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex justify-center sm:inset-x-auto sm:right-6 sm:top-6">
      <div
        aria-live="polite"
        className="pointer-events-auto flex w-full max-w-[360px] items-start gap-4 rounded-[18px] bg-[#154f12] px-4 py-4 text-white shadow-[0_22px_50px_rgba(0,0,0,0.34)]"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-white/12 text-white">
          <CheckIcon />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[1.08rem] font-semibold">
            {toast.name} added to cart!
          </p>
          <div className="mt-2 flex items-center gap-3 text-sm font-semibold text-[#d4efcf]">
            <Link href="/cart" onClick={onClose} className="underline underline-offset-2">
              View Cart
            </Link>
            <span className="text-white/50">•</span>
            <Link href="/cart" onClick={onClose} className="underline underline-offset-2">
              Checkout
            </Link>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close cart notification"
          onClick={onClose}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readCart, () => EMPTY_CART);
  const [toast, setToast] = useState<CartToast | null>(null);

  useEffect(() => {
    migrateCartStorage();
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem: (item, quantity = 1) => {
        const productId = getProductIdFromItem(item);

        if (!productId) {
          return;
        }

        const normalizedQuantity = normalizeQuantity(quantity);
        const existing = items.find((currentItem) => currentItem.id === productId);
        const nextItems = !existing
          ? [...items, { id: productId, quantity: normalizedQuantity }]
          : items.map((currentItem) =>
              currentItem.id === productId
                ? {
                    ...currentItem,
                    quantity: currentItem.quantity + normalizedQuantity,
                  }
                : currentItem,
            );

        writeCart(nextItems);
        setToast({
          id: Date.now(),
          name: item.name ?? "Product",
        });
      },
      removeItem: (id) => {
        writeCart(items.filter((item) => item.id !== id));
      },
      removeItems: (ids) => {
        const idsToRemove = new Set(ids);

        writeCart(items.filter((item) => !idsToRemove.has(item.id)));
      },
      updateQuantity: (id, quantity) => {
        const nextItems = items.flatMap((item) => {
          if (item.id !== id) {
            return [item];
          }

          if (quantity <= 0) {
            return [];
          }

          return [{ ...item, quantity: normalizeQuantity(quantity) }];
        });

        writeCart(nextItems);
      },
      clearCart: () => writeCart([]),
    }),
    [items],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast ? <CartToastBanner toast={toast} onClose={() => setToast(null)} /> : null}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
