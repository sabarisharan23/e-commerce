export type ReviewMetric = {
  id: string;
  label: string;
  value: string;
  helper: string;
};

export type RatingDistribution = {
  stars: number;
  percentage: number;
};

export type ReviewRow = {
  id: string;
  productName: string;
  productImageSrc: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  date: string;
  content: string;
  status: "Approved" | "Pending" | "Spam";
};

export const reviewMetrics: ReviewMetric[] = [
  {
    id: "total",
    label: "Total Reviews",
    value: "12,482",
    helper: "Lifetime platform submissions",
  },
  {
    id: "average",
    label: "Avg. Rating",
    value: "4.8",
    helper: "",
  },
  {
    id: "queue",
    label: "Moderation Queue",
    value: "24",
    helper: "Pending approval",
  },
];

export const reviewDistribution: RatingDistribution[] = [
  { stars: 5, percentage: 75 },
  { stars: 4, percentage: 15 },
  { stars: 3, percentage: 5 },
  { stars: 2, percentage: 3 },
  { stars: 1, percentage: 2 },
];

export const reviewProductOptions = ["All Products", "Millet Flour", "Dosa Mix", "Drink Mix"] as const;
export const reviewStatusOptions = ["Any Status", "Approved", "Pending", "Spam"] as const;

export const reviewRows: ReviewRow[] = [
  {
    id: "review-1",
    productName: "Millet Flour",
    productImageSrc: "/home/featured-categories/millet-flours.png",
    customerName: "Amara Walker",
    customerEmail: "amara.w@example.com",
    rating: 5,
    date: "Oct 12, 2023",
    content: "The quality is exceptional. Best millet flour I have ordered this quarter.",
    status: "Approved",
  },
  {
    id: "review-2",
    productName: "Dosa Mix",
    productImageSrc: "/home/featured-categories/dosa-mix.png",
    customerName: "Julian Rossi",
    customerEmail: "j.rossi@gmail.com",
    rating: 4,
    date: "Oct 14, 2023",
    content: "Needs a bit more salt, but the fermentation profile is excellent. Makes very crispy dosas.",
    status: "Pending",
  },
  {
    id: "review-3",
    productName: "Millet Flour",
    productImageSrc: "/home/featured-categories/millet-flours.png",
    customerName: "CryptoBot 4000",
    customerEmail: "bot@spam.io",
    rating: 4,
    date: "Oct 15, 2023",
    content: "GET FREE MILLET AT BITCOINLINK.SPAM. CLICK NOW FOR DISCOUNT!!!",
    status: "Spam",
  },
];

