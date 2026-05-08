import { WishlistPage } from "@/components/pages/wishlist/wishlist-page";
import { listStorefrontProducts } from "@/server";

export const dynamic = "force-dynamic";

export default async function WishlistRoute() {
  const products = await listStorefrontProducts();

  return <WishlistPage products={products} />;
}
