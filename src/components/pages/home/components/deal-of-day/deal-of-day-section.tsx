import {
  ProductShowcaseSection,
  type ProductDetails,
} from "@/components/shared";
import { dealOfDaySection } from "./deal-of-day-data";

type DealOfDaySectionProps = {
  products: ProductDetails[];
};

export function DealOfDaySection({ products }: DealOfDaySectionProps) {
  return (
    <ProductShowcaseSection
      section={dealOfDaySection}
      products={products}
    />
  );
}
