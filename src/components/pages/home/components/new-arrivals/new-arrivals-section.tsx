import {
  ProductShowcaseSection,
  type ProductDetails,
} from "@/components/shared";
import { newArrivalsSection } from "./new-arrivals-data";

type NewArrivalsSectionProps = {
  products: ProductDetails[];
};

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  return (
    <ProductShowcaseSection
      section={newArrivalsSection}
      products={products}
    />
  );
}
