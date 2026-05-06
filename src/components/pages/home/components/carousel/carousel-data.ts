export type HeroSlide = {
  id: string;
  eyebrow: string;
  titleLines: string[];
  description: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
  overlayClassName?: string;
  contentAlign?: "left" | "center";
};

export const heroSlides: HeroSlide[] = [
  {
    id: "millet-flour",
    eyebrow: "Pure & Traditional",
    titleLines: ["Freshly Ground", "Nutritious Millet Flour"],
    description:
      "Stone-ground millet flour packed with fiber, minerals, and natural goodness for healthy everyday cooking.",
    ctaLabel: "Shop Collections",
    ctaHref: "#",
    imageSrc: "/home/hero-millet-flour.png",
    imageAlt:
      "Freshly ground millet flour in fabric sacks with a bottle of oil beside it.",
    overlayClassName: "bg-black/40",
    contentAlign: "center",
  },
  {
    id: "cold-pressed-oils",
    eyebrow: "Wholesome Pantry",
    titleLines: ["Cold-Pressed Oils", "For Everyday Cooking"],
    description:
      "Bring home fragrant sesame, coconut, and groundnut oils chosen for flavor, freshness, and balance.",
    ctaLabel: "Explore Pantry",
    ctaHref: "#",
    imageSrc: "/home/hero-millet-flour.png",
    imageAlt: "Traditional pantry ingredients displayed in a warm-toned setting.",
    overlayClassName: "bg-[#2f2118]/45",
    contentAlign: "center",
  },
  {
    id: "healthy-staples",
    eyebrow: "Kitchen Essentials",
    titleLines: ["Healthy Staples", "Curated For Your Home"],
    description:
      "Discover grains, flours, and natural ingredients selected to make everyday meals feel thoughtful and easy.",
    ctaLabel: "Browse Essentials",
    ctaHref: "#",
    imageSrc: "/home/hero-millet-flour.png",
    imageAlt: "A rustic arrangement of staple ingredients for a healthy kitchen.",
    overlayClassName: "bg-[#1c130d]/50",
    contentAlign: "center",
  },
];
