import { OffersPage } from "@/components/pages/dashboard/offers/offers-page";
import { listBundleOffers, listOffers, listSeasonalCampaigns } from "@/server";

export const dynamic = "force-dynamic";

export default async function DashboardOffersRoute() {
  const [offers, bundles, campaigns] = await Promise.all([
    listOffers(),
    listBundleOffers(),
    listSeasonalCampaigns(),
  ]);

  return (
    <OffersPage
      initialBundles={bundles}
      initialCampaigns={campaigns}
      initialOffers={offers}
    />
  );
}
