import { CheckoutPage } from "@/components/pages/checkout/checkout-page";
import { listStorefrontProducts } from "@/server";

export const dynamic = "force-dynamic";

export default async function Checkout() {
  const products = await listStorefrontProducts();

  return <CheckoutPage products={products} />;
}
