import {
  BeyondProductSection,
  BrandStripSection,
  CustomerFeedbackSection,
  DealOfDaySection,
  FarmBundleSection,
  FeaturedCategoriesSection,
  HeroCarousel,
  JourneySection,
  NewArrivalsSection,
  NewsletterSection,
  ShopByConcernSection,
  TopPicksSection,
} from "./components";
import { dealOfDayProductIds } from "./components/deal-of-day/deal-of-day-data";
import {
  farmBundleHeroProductIds,
  farmBundleItemSeeds,
  type FarmBundleHeroProduct,
  type FarmBundleItem,
} from "./components/farm-bundle/farm-bundle-data";
import { journeyItemSeeds, type JourneyItem } from "./components/journey/journey-data";
import { newArrivalsProductIds } from "./components/new-arrivals/new-arrivals-data";
import {
  concernTabs,
  type ConcernTabWithProducts,
} from "./components/shop-by-concern/shop-by-concern-data";
import { topPicksProductIds } from "./components/top-picks/top-picks-data";
import type { ProductDetails } from "@/components/shared";

type HomePageProps = {
  products: ProductDetails[];
};

function createProductMap(products: ProductDetails[]) {
  return new Map(products.map((product) => [product.id, product]));
}

function pickProducts(
  productMap: Map<string, ProductDetails>,
  productIds: string[],
  fallbackProducts: ProductDetails[] = [],
) {
  const pickedProducts = productIds.flatMap((productId) => {
    const product = productMap.get(productId);

    return product ? [product] : [];
  });

  return pickedProducts.length > 0 ? pickedProducts : fallbackProducts;
}

function toFarmBundleHeroProducts(
  productMap: Map<string, ProductDetails>,
): FarmBundleHeroProduct[] {
  return farmBundleHeroProductIds.flatMap((productId) => {
    const product = productMap.get(productId);

    if (!product) {
      return [];
    }

    return [
      {
        id: product.id,
        name: product.name,
        imageSrc: product.imageSrc,
        imageAlt: product.imageAlt,
      },
    ];
  });
}

function toFarmBundleItems(
  productMap: Map<string, ProductDetails>,
): FarmBundleItem[] {
  return farmBundleItemSeeds.flatMap(({ productId, defaultSelected }) => {
    const product = productMap.get(productId);

    if (!product) {
      return [];
    }

    return [
      {
        id: product.id,
        name: product.name,
        href: product.href,
        packSize: `${product.weight} Pack`,
        price: product.price,
        imageSrc: product.imageSrc,
        imageAlt: product.imageAlt,
        defaultSelected,
      },
    ];
  });
}

function toJourneyItems(productMap: Map<string, ProductDetails>): JourneyItem[] {
  return journeyItemSeeds.flatMap((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      return [];
    }

    return [
      {
        id: item.id,
        productId: product.id,
        mediaSrc: item.mediaSrc,
        mediaAlt: item.mediaAlt,
        title: item.title,
        productName: product.name,
        productHref: product.href,
        productImageSrc: product.imageSrc,
        productImageAlt: product.imageAlt,
        price: product.price,
        story: item.story,
      },
    ];
  });
}

function toConcernTabsWithProducts(
  productMap: Map<string, ProductDetails>,
): ConcernTabWithProducts[] {
  return concernTabs.flatMap((tab) => {
    const products = pickProducts(productMap, tab.productIds);

    return products.length > 0 ? [{ ...tab, products }] : [];
  });
}

export function HomePage({ products }: HomePageProps) {
  const productMap = createProductMap(products);
  const fallbackProducts = products.slice(0, 4);
  const topPicksProducts = pickProducts(
    productMap,
    topPicksProductIds,
    fallbackProducts,
  );
  const newArrivalsProducts = pickProducts(
    productMap,
    newArrivalsProductIds,
    fallbackProducts,
  );
  const dealOfDayProducts = pickProducts(
    productMap,
    dealOfDayProductIds,
    products.slice(0, 8),
  );
  const concernTabsWithProducts = toConcernTabsWithProducts(productMap);
  const farmBundleHeroProducts = toFarmBundleHeroProducts(productMap);
  const farmBundleItems = toFarmBundleItems(productMap);
  const journeyItems = toJourneyItems(productMap);

  return (
    <div className="flex flex-col">
      <HeroCarousel />
      <FeaturedCategoriesSection />
      <DealOfDaySection products={dealOfDayProducts} />
      <FarmBundleSection
        heroProducts={farmBundleHeroProducts}
        items={farmBundleItems}
      />
      <TopPicksSection products={topPicksProducts} />
      <NewArrivalsSection products={newArrivalsProducts} />
      <ShopByConcernSection tabs={concernTabsWithProducts} />
      <NewsletterSection />
      <JourneySection items={journeyItems} />
      <CustomerFeedbackSection />
      <BrandStripSection />
      <BeyondProductSection />
    </div>
  );
}
