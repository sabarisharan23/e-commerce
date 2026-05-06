export type ProductDetails = {
  id: string;
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  price: number;
  originalPrice?: number;
  rating: number;
  saleLabel?: string;
  category: string;
  shortDescription: string;
  description: string;
  sku: string;
  weight: string;
  stockStatus: string;
  highlights: string[];
};

export type ProductShowcaseSectionConfig = {
  title: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  countdownLabel?: string;
  countdownTarget?: string;
  layout?: "grid" | "carousel";
  backgroundClassName?: string;
  showHeader?: boolean;
  cardsPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
};
