"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type WishlistItem = {
  id: string;
};

export type WishlistItemInput = {
  id: string;
  name?: string;
  imageSrc?: string;
  price?: number;
  originalPrice?: number;
  href?: string;
  category?: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  count: number;
  hasItem: (id: string) => boolean;
  addItem: (item: WishlistItemInput) => void;
  removeItem: (id: string) => void;
  removeItems: (ids: string[]) => void;
  toggleItem: (item: WishlistItemInput) => void;
  clearWishlist: () => void;
};

const WISHLIST_STORAGE_KEY = "theni-store-wishlist";
const WISHLIST_CHANGE_EVENT = "theni-store-wishlist-change";
const EMPTY_WISHLIST: WishlistItem[] = [];

let cachedWishlistRaw = "";
let cachedWishlistSnapshot: WishlistItem[] = EMPTY_WISHLIST;

const WishlistContext = createContext<WishlistContextValue | null>(null);

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

function normalizeWishlistItems(value: unknown): WishlistItem[] {
  if (!Array.isArray(value)) {
    return EMPTY_WISHLIST;
  }

  const productIds = new Set<string>();

  value.forEach((item) => {
    const productId = getProductIdFromItem(item);

    if (productId) {
      productIds.add(productId);
    }
  });

  return Array.from(productIds, (id) => ({ id }));
}

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
    cachedWishlistSnapshot = normalizeWishlistItems(JSON.parse(stored));
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

function subscribeToHydration() {
  return () => {};
}

function writeWishlist(items: WishlistItem[]) {
  const compactItems = normalizeWishlistItems(items);
  const serialized = JSON.stringify(compactItems);

  cachedWishlistRaw = serialized;
  cachedWishlistSnapshot = compactItems;

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, serialized);
  window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT));
}

function migrateWishlistStorage() {
  if (typeof window === "undefined") {
    return;
  }

  const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);

  if (!stored) {
    return;
  }

  try {
    const compactItems = normalizeWishlistItems(JSON.parse(stored));
    const serialized = JSON.stringify(compactItems);

    if (stored !== serialized) {
      writeWishlist(compactItems);
    }
  } catch {
    window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
    cachedWishlistRaw = "";
    cachedWishlistSnapshot = EMPTY_WISHLIST;
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const storedItems = useSyncExternalStore(
    subscribe,
    readWishlist,
    () => EMPTY_WISHLIST,
  );
  const isReady = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const items = isReady ? storedItems : EMPTY_WISHLIST;

  useEffect(() => {
    if (!isReady) {
      return;
    }

    migrateWishlistStorage();
  }, [isReady]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count: items.length,
      hasItem: (id) => items.some((item) => item.id === id),
      addItem: (item) => {
        const productId = getProductIdFromItem(item);

        if (!productId || items.some((currentItem) => currentItem.id === productId)) {
          return;
        }

        writeWishlist([...items, { id: productId }]);
      },
      removeItem: (id) => {
        writeWishlist(items.filter((item) => item.id !== id));
      },
      removeItems: (ids) => {
        const idsToRemove = new Set(ids);

        writeWishlist(items.filter((item) => !idsToRemove.has(item.id)));
      },
      toggleItem: (item) => {
        const productId = getProductIdFromItem(item);

        if (!productId) {
          return;
        }

        if (items.some((currentItem) => currentItem.id === productId)) {
          writeWishlist(items.filter((currentItem) => currentItem.id !== productId));
          return;
        }

        writeWishlist([...items, { id: productId }]);
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
