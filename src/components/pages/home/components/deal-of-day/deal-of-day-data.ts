import type {
  ProductShowcaseSectionConfig,
} from "@/components/shared";
import { getProductsByIds } from "@/data/products";

export const dealOfDaySection: ProductShowcaseSectionConfig = {
  title: "Deal of the Day",
  viewAllLabel: "View All Deals",
  viewAllHref: "#",
  countdownLabel: "Ends In:",
  countdownTarget: "2026-05-13T12:45:30+05:30",
};

export const dealOfDayProducts = getProductsByIds([
  "diet-choize-chia-seed-finger-millet-flour",
  "pearl-millet",
  "nutri-salt-moringa-infusion",
  "froot-plus",
  "diet-choize-quinoa-sorghum-flour",
  "bamboo-rice-quinoa-puttu-mix",
  "uyirsathu-sathumavu",
  "millet-vita-traditional-health-mix",
]);
