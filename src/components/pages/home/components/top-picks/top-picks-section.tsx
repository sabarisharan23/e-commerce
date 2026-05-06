import { ProductShowcaseSection } from "@/components/shared";
import { topPicksProducts, topPicksSection } from "./top-picks-data";

export function TopPicksSection() {
  return (
    <ProductShowcaseSection
      section={topPicksSection}
      products={topPicksProducts}
    />
  );
}
