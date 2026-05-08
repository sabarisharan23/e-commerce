import { CartPage } from "@/components/pages/cart/cart-page";
import { listStorefrontProducts } from "@/server";

export const dynamic = "force-dynamic";

export default async function Cart() {
  const products = await listStorefrontProducts();

  return <CartPage products={products} />;
}
