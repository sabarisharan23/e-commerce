import { ProductsPage } from "@/components/pages/products";
import {
  listStorefrontCategoriesWithProducts,
  listStorefrontProducts,
} from "@/server";

type ProductsRouteProps = {
  searchParams: Promise<{
    category?: string | string[] | undefined;
  }>;
};

export default async function ProductsRoute({ searchParams }: ProductsRouteProps) {
  const { category } = await searchParams;
  const categoryId = Array.isArray(category) ? category[0] : category;
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
      products={products}
    />
  );
}
