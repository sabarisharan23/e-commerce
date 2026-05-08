import { OffersPage } from "@/components/pages/dashboard/offers/offers-page";
import { listOffers } from "@/server";

export const dynamic = "force-dynamic";

export default async function DashboardOffersRoute() {
  const offers = await listOffers();

  return <OffersPage initialOffers={offers} />;
}
