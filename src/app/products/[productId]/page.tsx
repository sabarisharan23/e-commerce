import { notFound } from "next/navigation";
import type { ProductDetails } from "@/components/shared";
import { ProductDetailPage } from "@/components/pages/product-detail";
import { getProductDetailContent } from "@/data/product-detail-content";
import {
  getStorefrontProductByPublicId,
  listStorefrontProducts,
} from "@/server";

type ProductDetailRouteProps = {
  params: Promise<{
    productId: string;
  }>;
};

function getRecommendedProducts(
  product: ProductDetails,
  products: ProductDetails[],
  preferredProductIds: string[],
) {
  const productsById = new Map(products.map((item) => [item.id, item]));
  const recommendations: ProductDetails[] = [];
  const addRecommendation = (candidate: ProductDetails | undefined) => {
    if (!candidate || candidate.id === product.id) {
      return;
    }

    if (recommendations.some((item) => item.id === candidate.id)) {
      return;
    }

    recommendations.push(candidate);
  };

  preferredProductIds.forEach((productId) => {
    addRecommendation(productsById.get(productId));
  });

  products
    .filter((item) => item.category === product.category)
    .forEach(addRecommendation);

  products.forEach(addRecommendation);

  return recommendations.slice(0, 4);
}

export default async function ProductDetailRoute({
  params,
}: ProductDetailRouteProps) {
  const { productId } = await params;

  const product = await getStorefrontProductByPublicId(productId);

  if (!product) {
    notFound();
  }

  const content = getProductDetailContent(product);
  const products = await listStorefrontProducts();
  const recommendedProducts = getRecommendedProducts(
    product,
    products,
    content.recommendedProductIds,
  );

  return (
    <ProductDetailPage
      product={product}
      content={content}
      recommendedProducts={recommendedProducts}
    />
  );
}
