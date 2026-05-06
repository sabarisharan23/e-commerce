"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type WishlistItem = {
  id: string;
  name: string;
  imageSrc: string;
  price: number;
  originalPrice?: number;
  href?: string;
  category?: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  count: number;
  hasItem: (id: string) => boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
};

const WISHLIST_STORAGE_KEY = "theni-store-wishlist";
const WISHLIST_CHANGE_EVENT = "theni-store-wishlist-change";
const EMPTY_WISHLIST: WishlistItem[] = [];

let cachedWishlistRaw = "";
let cachedWishlistSnapshot: WishlistItem[] = EMPTY_WISHLIST;

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readWishlist() {
  if (typeof window === "undefined") {
    return EMPTY_WISHLIST;
  }

  const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);

  if (!stored) {
    cachedWishlistRaw = "";
    cachedWishlistSnapshot = EMPTY_WISHLIST;
    return EMPTY_WISHLIST;
  }

  if (stored === cachedWishlistRaw) {
    return cachedWishlistSnapshot;
  }

  try {
    cachedWishlistRaw = stored;
    cachedWishlistSnapshot = JSON.parse(stored) as WishlistItem[];
    return cachedWishlistSnapshot;
  } catch {
    window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
    cachedWishlistRaw = "";
    cachedWishlistSnapshot = EMPTY_WISHLIST;
    return EMPTY_WISHLIST;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => callback();

  window.addEventListener("storage", handleChange);
  window.addEventListener(WISHLIST_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(WISHLIST_CHANGE_EVENT, handleChange);
  };
}

function writeWishlist(items: WishlistItem[]) {
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readWishlist, () => EMPTY_WISHLIST);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count: items.length,
      hasItem: (id) => items.some((item) => item.id === id),
      addItem: (item) => {
        if (items.some((currentItem) => currentItem.id === item.id)) {
          return;
        }

        writeWishlist([...items, item]);
      },
      removeItem: (id) => {
        writeWishlist(items.filter((item) => item.id !== id));
      },
      toggleItem: (item) => {
        if (items.some((currentItem) => currentItem.id === item.id)) {
          writeWishlist(items.filter((currentItem) => currentItem.id !== item.id));
          return;
        }

        writeWishlist([...items, item]);
      },
      clearWishlist: () => writeWishlist([]),
    }),
    [items],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider.");
  }

  return context;
}
