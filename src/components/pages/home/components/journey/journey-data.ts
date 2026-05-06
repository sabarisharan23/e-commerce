import { getProductById } from "@/data/products";

export type JourneyItem = {
  id: string;
  mediaSrc: string;
  mediaAlt: string;
  title: string;
  productName: string;
  productImageSrc: string;
  productImageAlt: string;
  price: number;
  story: string;
};

const journeyItemSeeds = [
  {
    id: "doctor-seeds",
    mediaSrc: "/home/journey/doctor-seeds.png",
    mediaAlt: "Video thumbnail discussing the best timing for chia seeds.",
    title: "Timing for Best Seeds",
    productId: "diet-choize-chia-seed-finger-millet-flour",
    story:
      "A quick educational clip about seed timing and how simple pantry swaps can support healthier breakfast routines.",
  },
  {
    id: "salt-amount",
    mediaSrc: "/home/journey/salt-amount.png",
    mediaAlt: "Video thumbnail about the amount of salt to use while cooking.",
    title: "The Right Amount of Salt",
    productId: "nutri-salt-moringa-infusion",
    story:
      "A bite-sized explainer on making everyday meals more thoughtful, with seasoning choices that support smarter cooking habits.",
  },
  {
    id: "wheat-vs-ragi",
    mediaSrc: "/home/journey/wheat-vs-ragi.png",
    mediaAlt: "Video thumbnail comparing ragi roti and whole wheat chapati.",
    title: "Ragi vs Whole Wheat",
    productId: "very-nize-wheat-cookies",
    story:
      "A comparison-led story that helps shoppers understand grain choices and how those choices show up in everyday meals.",
  },
  {
    id: "salt-amount-2",
    mediaSrc: "/home/journey/salt-amount-2.png",
    mediaAlt: "A second video thumbnail about the amount of salt to use while cooking.",
    title: "Salt, Taste, and Balance",
    productId: "nutri-salt-moringa-infusion",
    story:
      "Another short-form nutrition story focused on flavor, balance, and making daily pantry decisions feel easier.",
  },
];

export const journeyItems: JourneyItem[] = journeyItemSeeds.map((item) => {
  const product = getProductById(item.productId);

  return {
    id: item.id,
    mediaSrc: item.mediaSrc,
    mediaAlt: item.mediaAlt,
    title: item.title,
    productName: product.name,
    productImageSrc: product.imageSrc,
    productImageAlt: product.imageAlt,
    price: product.price,
    story: item.story,
  };
});
