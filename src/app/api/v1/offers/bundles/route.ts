import { apiSuccess, parseJsonBody, withApiHandler } from "@/server";
import {
  createBundleOffer,
  listBundleOffers,
  type BundleOfferPayload,
} from "@/server/offers/offer-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  const bundles = await listBundleOffers();

  return apiSuccess(bundles);
});

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody<BundleOfferPayload>(request);
  const bundle = await createBundleOffer(body);

  return apiSuccess(bundle, { status: 201 });
});
