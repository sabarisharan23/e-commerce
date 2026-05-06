import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/pages/product-detail";
import {
  getProductDetailContent,
} from "@/data/product-detail-content";
import { getProductById, getProductsByIds } from "@/data/products";

type ProductDetailRouteProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ProductDetailRoute({
  params,
}: ProductDetailRouteProps) {
  const { productId } = await params;
  let product;
  let content;
  let recommendedProducts;

  try {
    product = getProductById(productId);
    content = getProductDetailContent(productId);
    recommendedProducts = getProductsByIds(content.recommendedProductIds);
  } catch {
    notFound();
  }

  return (
    <ProductDetailPage
      product={product}
      content={content}
      recommendedProducts={recommendedProducts}
    />
  );
}
