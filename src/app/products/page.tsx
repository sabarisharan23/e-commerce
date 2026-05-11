import { ProductsPage } from "@/components/pages/products";
import {
  listStorefrontCategoriesWithProducts,
  listStorefrontProducts,
} from "@/server";

type ProductsRouteProps = {
  searchParams: Promise<{
    category?: string | string[] | undefined;
    q?: string | string[] | undefined;
  }>;
};

export default async function ProductsRoute({ searchParams }: ProductsRouteProps) {
  const { category, q } = await searchParams;
  const categoryId = Array.isArray(category) ? category[0] : category;
  const searchQuery = Array.isArray(q) ? q[0] : q;
  const [products, categoriesWithProducts] = await Promise.all([
    listStorefrontProducts(),
    listStorefrontCategoriesWithProducts(),
  ]);
  const initialCategoryId = categoriesWithProducts.some(
    (item) => item.id === categoryId,
  )
    ? categoryId
    : null;

  return (
    <ProductsPage
      categoriesWithProducts={categoriesWithProducts}
      initialCategoryId={initialCategoryId}
      initialSearchQuery={searchQuery ?? ""}
      products={products}
    />
  );
}
