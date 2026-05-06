import { ProductsPage } from "@/components/pages/products";
import { productCategoriesWithProducts } from "@/data/products";

type ProductsRouteProps = {
  searchParams: Promise<{
    category?: string | string[] | undefined;
  }>;
};

export default async function ProductsRoute({ searchParams }: ProductsRouteProps) {
  const { category } = await searchParams;
  const categoryId = Array.isArray(category) ? category[0] : category;
  const initialCategoryId = productCategoriesWithProducts.some(
    (item) => item.id === categoryId,
  )
    ? categoryId
    : null;

  return <ProductsPage initialCategoryId={initialCategoryId} />;
}
