import { ProductShowcaseSection } from "@/components/shared";
import type { ProductDetails } from "@/components/shared";
import type { ProductDetailContent } from "@/data/product-detail-content";
import { ProductBreadcrumbs } from "./components/product-breadcrumbs";
import { ProductGallery } from "./components/product-gallery";
import { ProductHealthBenefitsSection } from "./components/product-health-benefits-section";
import { ProductInfoSections } from "./components/product-info-sections";
import { ProductPurchasePanel } from "./components/product-purchase-panel";
import { ProductReviewsSection } from "./components/product-reviews-section";

export function ProductDetailPage({
  product,
  content,
  recommendedProducts,
}: {
  product: ProductDetails;
  content: ProductDetailContent;
  recommendedProducts: ProductDetails[];
}) {
  return (
    <div className="w-full bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-10">
        <ProductBreadcrumbs
          categoryLabel={product.category}
          productName={product.name}
        />

        <section className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <ProductGallery images={content.galleryImages} />
          <ProductPurchasePanel product={product} content={content} />
        </section>

        <ProductInfoSections content={content} />

        <ProductHealthBenefitsSection content={content} />

        <ProductShowcaseSection
          section={{
            title: "Recommended Products",
            layout: "carousel",
            backgroundClassName: "bg-transparent",
            cardsPerView: { mobile: 1, tablet: 2, desktop: 4 },
          }}
          products={recommendedProducts}
        />

        <ProductReviewsSection reviews={content.reviews} />
      </div>
    </div>
  );
}
