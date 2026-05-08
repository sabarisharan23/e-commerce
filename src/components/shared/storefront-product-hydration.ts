import type { CartItem } from "./cart/cart-provider";
import type { ProductDetails } from "./product-showcase";
import type { WishlistItem } from "./wishlist/wishlist-provider";

export type HydratedCartItem = ProductDetails & {
  quantity: number;
};

export type HydratedWishlistItem = ProductDetails;

function createProductMap(products: ProductDetails[]) {
  return new Map(products.map((product) => [product.id, product]));
}

export function hydrateCartItems(
  items: CartItem[],
  products: ProductDetails[],
): HydratedCartItem[] {
  const productsById = createProductMap(products);

  return items.flatMap((item) => {
    const product = productsById.get(item.id);

    return product ? [{ ...product, quantity: item.quantity }] : [];
  });
}

export function hydrateWishlistItems(
  items: WishlistItem[],
  products: ProductDetails[],
): HydratedWishlistItem[] {
  const productsById = createProductMap(products);

  return items.flatMap((item) => {
    const product = productsById.get(item.id);

    return product ? [product] : [];
  });
}

export function getMissingStoredProductIds(
  items: Array<{ id: string }>,
  products: ProductDetails[],
) {
  const productsById = createProductMap(products);

  return items
    .filter((item) => !productsById.has(item.id))
    .map((item) => item.id);
}
