import {
  ProductShowcaseSection,
  type ProductDetails,
} from "@/components/shared";
import { topPicksSection } from "./top-picks-data";

type TopPicksSectionProps = {
  products: ProductDetails[];
};

export function TopPicksSection({ products }: TopPicksSectionProps) {
  return (
    <ProductShowcaseSection
      section={topPicksSection}
      products={products}
    />
  );
}
