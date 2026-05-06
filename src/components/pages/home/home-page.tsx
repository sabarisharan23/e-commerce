import {
  BeyondProductSection,
  BrandStripSection,
  CustomerFeedbackSection,
  DealOfDaySection,
  FarmBundleSection,
  FeaturedCategoriesSection,
  HeroCarousel,
  JourneySection,
  NewArrivalsSection,
  NewsletterSection,
  ShopByConcernSection,
  TopPicksSection,
} from "./components";

export function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroCarousel />
      <FeaturedCategoriesSection />
      <DealOfDaySection />
      <FarmBundleSection />
      <TopPicksSection />
      <NewArrivalsSection />
      <ShopByConcernSection />
      <NewsletterSection />
      <JourneySection />
      <CustomerFeedbackSection />
      <BrandStripSection />
      <BeyondProductSection />
    </div>
  );
}
