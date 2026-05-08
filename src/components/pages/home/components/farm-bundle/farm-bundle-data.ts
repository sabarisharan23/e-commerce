export type FarmBundleHeroProduct = {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
};

export type FarmBundleItem = {
  id: string;
  name: string;
  href: string;
  packSize: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  defaultSelected?: boolean;
};

export const farmBundleSection = {
  title: "Fresh from Theni Farms!",
  description: "Organic flours, grains & daily essentials",
  ctaLabel: "Shop Now",
  ctaHref: "#",
  bundleTitle: "Frequently Bought Together!",
};

export const farmBundleHeroProductIds = [
  "froot-plus",
  "diet-choize-chia-seed-finger-millet-flour",
  "uyirsathu-sathumavu",
];

export const farmBundleItemSeeds = [
  {
    productId: "diet-choize-chia-seed-finger-millet-flour",
    defaultSelected: true,
  },
  {
    productId: "nutri-salt-moringa-infusion",
    defaultSelected: false,
  },
];
