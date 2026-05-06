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
  name: string;
  imageSrc: string;
  price: number;
  href?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
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
    cachedCartSnapshot = JSON.parse(stored) as CartItem[];
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
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
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
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem: (item, quantity = 1) => {
        const existing = items.find((currentItem) => currentItem.id === item.id);
        const nextItems = !existing
          ? [...items, { ...item, quantity }]
          : items.map((currentItem) =>
              currentItem.id === item.id
                ? { ...currentItem, quantity: currentItem.quantity + quantity }
                : currentItem,
            );

        writeCart(nextItems);
        setToast({
          id: Date.now(),
          name: item.name,
        });
      },
      removeItem: (id) => {
        writeCart(items.filter((item) => item.id !== id));
      },
      updateQuantity: (id, quantity) => {
        const nextItems = items.flatMap((item) => {
          if (item.id !== id) {
            return [item];
          }

          if (quantity <= 0) {
            return [];
          }

          return [{ ...item, quantity }];
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
