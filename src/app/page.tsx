import { HomePage } from "@/components/pages/home";
import { listStorefrontProducts } from "@/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await listStorefrontProducts();

  return <HomePage products={products} />;
}
