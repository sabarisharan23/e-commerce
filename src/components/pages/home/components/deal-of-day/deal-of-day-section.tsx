import { ProductShowcaseSection } from "@/components/shared";
import { dealOfDayProducts, dealOfDaySection } from "./deal-of-day-data";

export function DealOfDaySection() {
  return (
    <ProductShowcaseSection
      section={dealOfDaySection}
      products={dealOfDayProducts}
    />
  );
}
