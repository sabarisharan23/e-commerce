import { getProductById } from "@/data/products";

export type FarmBundleHeroProduct = {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
};

export type FarmBundleItem = {
  id: string;
  name: string;
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

const farmBundleHeroProductIds = [
  "froot-plus",
  "diet-choize-chia-seed-finger-millet-flour",
  "uyirsathu-sathumavu",
];

export const farmBundleHeroProducts: FarmBundleHeroProduct[] =
  farmBundleHeroProductIds.map((productId) => {
    const product = getProductById(productId);

    return {
      id: product.id,
      name: product.name,
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt,
    };
  });

export const farmBundleItems: FarmBundleItem[] = [
  {
    productId: "diet-choize-chia-seed-finger-millet-flour",
    defaultSelected: true,
  },
  {
    productId: "nutri-salt-moringa-infusion",
    defaultSelected: false,
  },
].map(({ productId, defaultSelected }) => {
  const product = getProductById(productId);

  return {
    id: product.id,
    name: product.name,
    packSize: `${product.weight} Pack`,
    price: product.price,
    imageSrc: product.imageSrc,
    imageAlt: product.imageAlt,
    defaultSelected,
  };
});
