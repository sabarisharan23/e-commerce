import { ProductShowcaseSection } from "@/components/shared";
import { newArrivalsProducts, newArrivalsSection } from "./new-arrivals-data";

export function NewArrivalsSection() {
  return (
    <ProductShowcaseSection
      section={newArrivalsSection}
      products={newArrivalsProducts}
    />
  );
}
