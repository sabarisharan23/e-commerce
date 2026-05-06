export type FeedbackItem = {
  id: string;
  category: string;
  title: string;
  quote: string;
  author: string;
  productImageSrc: string;
  productImageAlt: string;
};

export const feedbackCategories = [
  "All",
  "Millet Flour",
  "Drink Mix",
  "Dosa Mix",
  "Diabetic Mix",
  "Protein Mix",
  "Health Mix",
  "Weight Loss Mix",
  "Weight Gain Mix",
];

export const feedbackItems: FeedbackItem[] = [
  {
    id: "feedback-millet-flour",
    category: "Millet Flour",
    title: "Millet Flour",
    quote:
      "Excellent quality millet flour. The rotis turn out soft and the taste feels very natural and healthy. My family loves it.",
    author: "Priya S",
    productImageSrc: "/home/deal-of-day/pearl-millet.png",
    productImageAlt: "Pearl millet product pack.",
  },
  {
    id: "feedback-drink-mix",
    category: "Drink Mix",
    title: "Drink Mix",
    quote:
      "This drink mix is perfect for a quick and healthy refreshment. It’s easy to prepare and keeps me energized throughout the day.",
    author: "Rahul K",
    productImageSrc: "/home/deal-of-day/nutri-salt-moringa-infusion.png",
    productImageAlt: "Nutri-Salt moringa infusion container.",
  },
  {
    id: "feedback-protein-mix",
    category: "Protein Mix",
    title: "Protein Mix",
    quote:
      "I like how easy it is to include this in my morning routine. It tastes clean and feels like a practical pantry upgrade.",
    author: "Ananya R",
    productImageSrc: "/home/featured-categories/protein-mix.png",
    productImageAlt: "Protein ingredients arranged around a small chalkboard.",
  },
  {
    id: "feedback-health-mix",
    category: "Health Mix",
    title: "Health Mix",
    quote:
      "Our whole family uses this regularly. The mix is smooth, filling, and makes breakfast much easier on busy days.",
    author: "Suresh M",
    productImageSrc: "/home/featured-categories/health-mix.png",
    productImageAlt: "Health mix served in cups and a bowl on a wooden table.",
  },
];
