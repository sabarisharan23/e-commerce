import type {
  ProductShowcaseSectionConfig,
} from "@/components/shared";
import { getProductsByIds } from "@/data/products";

export const newArrivalsSection: ProductShowcaseSectionConfig = {
  title: "New Arrivals",
  layout: "carousel",
  backgroundClassName: "bg-white",
  cardsPerView: {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
};

export const newArrivalsProducts = getProductsByIds([
  "millet-vita-traditional-health-mix",
  "diet-choize-quinoa-sorghum-flour",
  "uyirsathu-sathumavu",
  "bamboo-rice-quinoa-puttu-mix",
]);
