import type {
  ProductShowcaseSectionConfig,
} from "@/components/shared";
import { getProductsByIds } from "@/data/products";

export const topPicksSection: ProductShowcaseSectionConfig = {
  title: "Top Pick For You!",
  layout: "carousel",
  backgroundClassName: "bg-white",
  cardsPerView: {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
};

export const topPicksProducts = getProductsByIds([
  "amudhu-bajra-bamboo-rice-koozh-mix",
  "karumponnu-black-kavuni-kanji-mix",
  "foxtail-millet-quinoa-puttu-podi",
  "mappillai-samba-illuppai-poo-samba-laddu-mix",
]);
