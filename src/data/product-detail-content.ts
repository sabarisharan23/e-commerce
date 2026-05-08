import type { ProductDetails } from "@/components/shared";

export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  originalPrice?: number;
};

export type ProductReview = {
  id: string;
  name: string;
  rating: number;
  body: string;
  timestamp: string;
};

export type ProductDetailContent = {
  badgeLabel: string;
  ratingCount: number;
  summary: string;
  galleryImages: {
    src: string;
    alt: string;
  }[];
  variants: ProductVariant[];
  keyBenefits: string[];
  ingredients: string[];
  howToUse: string[];
  storageInstructions: string[];
  netWeightOptions: string[];
  healthBenefits: {
    title: string;
    description: string;
  }[];
  healthBenefitsImage: {
    src: string;
    alt: string;
  };
  recommendedProductIds: string[];
  reviews: ProductReview[];
};

const curatedDetailContent: Record<string, ProductDetailContent> = {
  "diet-choize-chia-seed-finger-millet-flour": {
    badgeLabel: "Millet Flour",
    ratingCount: 124,
    summary:
      "A nutritious blend of finger millet (ragi) and chia seeds, designed to support a healthy diet with natural ingredients rich in calcium and fiber.",
    galleryImages: [
      {
        src: "/home/deal-of-day/diet-choize-chia-seed-finger-millet-flour.png",
        alt: "Diet Choize Chia Seed Finger Millet Flour front view.",
      },
      {
        src: "/home/deal-of-day/diet-choize-chia-seed-finger-millet-flour.png",
        alt: "Diet Choize Chia Seed Finger Millet Flour alternate pack view.",
      },
      {
        src: "/home/featured-categories/millet-flours.png",
        alt: "Millet flour served in a bowl with raw ingredients nearby.",
      },
      {
        src: "/home/hero-millet-flour.png",
        alt: "Freshly ground millet flour featured in a rustic preparation scene.",
      },
    ],
    variants: [
      { id: "300-g", label: "300 g", price: 450, originalPrice: 550 },
      { id: "500-g", label: "500 g", price: 650, originalPrice: 780 },
    ],
    keyBenefits: [
      "Rich source of calcium for bone health",
      "High in dietary fiber",
      "Made with natural ingredients",
      "Supports healthy digestion",
      "Suitable for daily nutrition",
    ],
    ingredients: [
      "Finger Millet (Ragi)",
      "Chia Seeds",
      "Nendran Banana Powder",
    ],
    howToUse: [
      "Mix with warm water or milk to prepare a healthy drink.",
      "Use in porridge or breakfast recipes.",
      "Can be added to dosa batter or baked foods for extra nutrition.",
    ],
    storageInstructions: [
      "Store in a cool and dry place.",
      "Do not refrigerate.",
    ],
    netWeightOptions: ["300 g", "500 g"],
    healthBenefits: [
      {
        title: "Supports Bone Strength",
        description:
          "Finger millet is naturally rich in calcium, helping maintain strong bones.",
      },
      {
        title: "Improves Digestion",
        description:
          "The fiber from chia seeds and ragi supports better digestion.",
      },
      {
        title: "Nutritious for Children",
        description:
          "A wholesome mix that provides essential nutrients for growing children.",
      },
      {
        title: "Natural Energy Source",
        description:
          "Helps provide sustained energy throughout the day.",
      },
    ],
    healthBenefitsImage: {
      src: "/home/featured-categories/millet-flours.png",
      alt: "Millet flour and grains displayed in a rustic serving arrangement.",
    },
    recommendedProductIds: [
      "amudhu-bajra-bamboo-rice-koozh-mix",
      "karumponnu-black-kavuni-kanji-mix",
      "foxtail-millet-quinoa-puttu-podi",
      "mappillai-samba-illuppai-poo-samba-laddu-mix",
    ],
    reviews: [
      {
        id: "kristin-watson",
        name: "Kristin Watson",
        rating: 5,
        body: "The taste is mild and natural. I use it in porridge and it blends smoothly every time.",
        timestamp: "2 min ago",
      },
      {
        id: "jane-cooper",
        name: "Jane Cooper",
        rating: 4,
        body: "Good texture and easy to work into daily meals. It feels like a practical pantry staple.",
        timestamp: "30 Apr, 2021",
      },
      {
        id: "jacob-jones",
        name: "Jacob Jones",
        rating: 4,
        body: "Works well for dosa batter and morning drinks. The pack also stores nicely.",
        timestamp: "2 min ago",
      },
      {
        id: "ralph-edwards",
        name: "Ralph Edwards",
        rating: 5,
        body: "A reliable option for healthier breakfasts. The flavor stays familiar while still feeling nutritious.",
        timestamp: "2 min ago",
      },
    ],
  },
};

function toSentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toKebabCase(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildGenericReviews(productName: string): ProductReview[] {
  return [
    {
      id: `${productName}-review-1`,
      name: "Kristin Watson",
      rating: 5,
      body: `${productName} has been easy to use in our weekly cooking routine, and the flavor feels clean and natural.`,
      timestamp: "2 min ago",
    },
    {
      id: `${productName}-review-2`,
      name: "Jane Cooper",
      rating: 4,
      body: "The quality feels consistent and the texture works well in simple home recipes.",
      timestamp: "1 day ago",
    },
    {
      id: `${productName}-review-3`,
      name: "Jacob Jones",
      rating: 4,
      body: "A dependable pantry choice with a straightforward preparation experience.",
      timestamp: "3 days ago",
    },
  ];
}

function buildGenericDetailContent(product: ProductDetails): ProductDetailContent {
  const keyBenefits =
    product.highlights.length > 0
      ? product.highlights
      : [product.shortDescription || product.description];

  return {
    badgeLabel: toSentenceCase(product.category),
    ratingCount: 36,
    summary: product.description,
    galleryImages: [
      {
        src: product.imageSrc,
        alt: product.imageAlt,
      },
      {
        src: product.imageSrc,
        alt: `${product.name} alternate view.`,
      },
      {
        src: product.imageSrc,
        alt: `${product.name} product pack close-up.`,
      },
      {
        src: product.imageSrc,
        alt: `${product.name} packaging detail.`,
      },
    ],
    variants: [
      {
        id: toKebabCase(product.weight) || "default",
        label: product.weight,
        price: product.price,
        originalPrice: product.originalPrice,
      },
    ],
    keyBenefits,
    ingredients: keyBenefits.slice(0, 3),
    howToUse: [
      `Use ${product.name} in everyday breakfasts and simple home recipes.`,
      "Stir into porridges, batter mixes, or nourishing drinks.",
      "Adjust the quantity to suit your preferred texture and serving style.",
    ],
    storageInstructions: [
      "Store in a cool and dry place.",
      "Seal the pack tightly after each use.",
    ],
    netWeightOptions: [product.weight],
    healthBenefits: keyBenefits.map((highlight) => ({
      title: highlight,
      description: product.shortDescription,
    })),
    healthBenefitsImage: {
      src: product.imageSrc,
      alt: product.imageAlt,
    },
    recommendedProductIds: [],
    reviews: buildGenericReviews(product.name),
  };
}

export function getProductDetailContent(product: ProductDetails): ProductDetailContent {
  const generic = buildGenericDetailContent(product);
  const curated = curatedDetailContent[product.id];

  if (!curated) {
    return generic;
  }

  return {
    ...generic,
    badgeLabel: curated.badgeLabel,
    galleryImages: [
      generic.galleryImages[0],
      ...curated.galleryImages.filter((image) => image.src !== generic.galleryImages[0].src),
    ].slice(0, 4),
    healthBenefits: curated.healthBenefits,
    healthBenefitsImage: curated.healthBenefitsImage,
    howToUse: curated.howToUse,
    ingredients: curated.ingredients,
    keyBenefits: curated.keyBenefits,
    ratingCount: curated.ratingCount,
    recommendedProductIds: curated.recommendedProductIds,
    reviews: curated.reviews,
    storageInstructions: curated.storageInstructions,
    summary: curated.summary,
  };
}
