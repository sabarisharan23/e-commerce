export type FeaturedCategory = {
  id: string;
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export const featuredCategories: FeaturedCategory[] = [
  {
    id: "millet-flours",
    title: "Millet Flours",
    href: "/products?category=millet-flour",
    imageSrc: "/home/featured-categories/millet-flours.png",
    imageAlt: "A bowl of millet flour with a wooden spoon beside it.",
  },
  {
    id: "health-mix",
    title: "Health Mix",
    href: "/products?category=health-mix",
    imageSrc: "/home/featured-categories/health-mix.png",
    imageAlt: "Health mix served in cups and a bowl on a wooden table.",
  },
  {
    id: "dosa-mix",
    title: "Dosa Mix",
    href: "/products",
    imageSrc: "/home/featured-categories/dosa-mix.png",
    imageAlt: "Crisp dosa served on a banana leaf with chutneys.",
  },
  {
    id: "diabetic-mix",
    title: "Diabetic Mix",
    href: "/products?category=diabetic-mix",
    imageSrc: "/home/featured-categories/diabetic-mix.png",
    imageAlt: "Bowls of diabetic mix and grains arranged for cooking.",
  },
  {
    id: "protein-mix",
    title: "Protein Mix",
    href: "/products?category=protein-mix",
    imageSrc: "/home/featured-categories/protein-mix.png",
    imageAlt: "Protein ingredients arranged around a small chalkboard.",
  },
  {
    id: "healthy-ingredients",
    title: "Healthy Ingredients",
    href: "/products",
    imageSrc: "/home/featured-categories/healthy-ingredients.png",
    imageAlt: "Assorted healthy ingredients including lentils, beans, and rice.",
  },
];
